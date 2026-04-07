import Matter from 'matter-js';

export interface GameConfig {
  seed: string;
  isServer: boolean;
  baseDifficulty?: number;
}

export interface PlayerInput {
  frame: number;
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  dash: boolean;
  mousePos: { x: number; y: number };
}

export enum EnemyType {
  SWARMER = 'SWARMER',
  SENTINEL = 'SENTINEL',
  SEEKER = 'SEEKER',
  SNIPER = 'SNIPER',
  PULSAR = 'PULSAR'
}

// Seeded PRNG
class PRNG {
  private seed: number;
  constructor(seed: string) {
    this.seed = this.hashString(seed);
  }
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }
  public next(): number {
    this.seed = (this.seed * 1664525 + 1013904223) | 0;
    return (this.seed >>> 0) / 4294967296;
  }
}

export class GameEngine {
  public world: Matter.World;
  public engine: Matter.Engine;
  public player: Matter.Body;
  public enemies: Matter.Body[] = [];
  public frame: number = 0;
  public score: number = 0;
  public isGameOver: boolean = false;
  public health: number = 100;
  public omega: number = 1;

  private _config: GameConfig;
  private prng: PRNG;
  private inputLog: PlayerInput[] = [];
  private lastDashFrame: number = -100;
  private dashCooldown: number = 60;
  private dashDuration: number = 24;
  private isDashing: boolean = false;

  constructor(config: GameConfig) {
    this._config = config;
    console.log('Engine initialized with config:', this._config);
    this.prng = new PRNG(config.seed);
    this.engine = Matter.Engine.create({
      enableSleeping: false,
      gravity: { x: 0, y: 0 }
    });
    this.world = this.engine.world;

    this.player = Matter.Bodies.circle(400, 300, 20, {
      label: 'player',
      frictionAir: 0.1,
      restitution: 0.2,
      inertia: Infinity
    });
    Matter.World.add(this.world, this.player);

    const thickness = 100;
    const width = 800;
    const height = 600;
    const walls = [
      Matter.Bodies.rectangle(width / 2, -thickness / 2, width + thickness * 2, thickness, { isStatic: true, label: 'wall' }),
      Matter.Bodies.rectangle(width / 2, height + thickness / 2, width + thickness * 2, thickness, { isStatic: true, label: 'wall' }),
      Matter.Bodies.rectangle(-thickness / 2, height / 2, thickness, height + thickness * 2, { isStatic: true, label: 'wall' }),
      Matter.Bodies.rectangle(width + thickness / 2, height / 2, thickness, height + thickness * 2, { isStatic: true, label: 'wall' })
    ];
    Matter.World.add(this.world, walls);

    Matter.Events.on(this.engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        this.handleCollision(pair.bodyA, pair.bodyB);
      });
    });
  }

  public update(input: PlayerInput) {
    if (this.isGameOver) return;

    this.frame++;
    this.inputLog.push({ ...input, frame: this.frame });

    this.handleMovement(input);
    this.handleDash(input);
    this.updateEnemies();
    this.spawnEnemies();

    Matter.Engine.update(this.engine, 1000 / 60);

    this.updateEntropy();

    if (this.health <= 0) {
      this.isGameOver = true;
    }
  }

  private handleMovement(input: PlayerInput) {
    if (this.isDashing) return;

    const forceMagnitude = 0.002;
    const force = { x: 0, y: 0 };
    if (input.up) force.y -= forceMagnitude;
    if (input.down) force.y += forceMagnitude;
    if (input.left) force.x -= forceMagnitude;
    if (input.right) force.x += forceMagnitude;

    Matter.Body.applyForce(this.player, this.player.position, force);
  }

  private handleDash(input: PlayerInput) {
    const canDash = this.frame - this.lastDashFrame > this.dashCooldown;

    if (input.dash && canDash && !this.isDashing) {
      this.isDashing = true;
      this.lastDashFrame = this.frame;

      const dashVector = Matter.Vector.sub(input.mousePos, this.player.position);
      const dashDirection = Matter.Vector.normalise(dashVector);
      const dashImpulse = Matter.Vector.mult(dashDirection, 0.05);

      this.player.frictionAir = 0;
      Matter.Body.applyForce(this.player, this.player.position, dashImpulse);
    }

    if (this.isDashing && this.frame - this.lastDashFrame > this.dashDuration) {
      this.isDashing = false;
      this.player.frictionAir = 0.1;
    }
  }

  private spawnEnemies() {
    const baseSpawnRate = 120;
    const k = 0.5;
    const t = this.frame / 60;
    const spawnInterval = Math.max(20, Math.floor(baseSpawnRate - k * t));

    if (this.frame % spawnInterval === 0) {
      const type = this.getRandomEnemyType();
      this.createEnemy(type);
    }
  }

  private getRandomEnemyType(): EnemyType {
    const types = [EnemyType.SWARMER, EnemyType.SENTINEL, EnemyType.SEEKER, EnemyType.SNIPER, EnemyType.PULSAR];
    return types[Math.floor(this.prng.next() * types.length)];
  }

  private createEnemy(type: EnemyType) {
    const width = 800;
    const height = 600;
    let x, y;

    if (this.prng.next() > 0.5) {
      x = this.prng.next() > 0.5 ? -20 : width + 20;
      y = this.prng.next() * height;
    } else {
      x = this.prng.next() * width;
      y = this.prng.next() > 0.5 ? -20 : height + 20;
    }

    let enemy;
    if (type === EnemyType.SWARMER) {
      enemy = Matter.Bodies.polygon(x, y, 3, 15, { label: 'enemy', frictionAir: 0.05 });
    } else if (type === EnemyType.SENTINEL) {
      enemy = Matter.Bodies.rectangle(x, y, 30, 30, { label: 'enemy', isStatic: true });
    } else {
      enemy = Matter.Bodies.circle(x, y, 15, { label: 'enemy', frictionAir: 0.03 });
    }

    (enemy as any).id = this.frame + this.prng.next();
    (enemy as any).enemyType = type;
    (enemy as any).health = 1;

    this.enemies.push(enemy);
    Matter.World.add(this.world, enemy);
  }

  private updateEnemies() {
    this.enemies.forEach(enemy => {
      const type = (enemy as any).enemyType;
      const target = this.player.position;

      if (type === EnemyType.SWARMER || type === EnemyType.SEEKER) {
        const forceMagnitude = type === EnemyType.SWARMER ? 0.0005 : 0.0003;
        const vector = Matter.Vector.sub(target, enemy.position);
        const direction = Matter.Vector.normalise(vector);
        const force = Matter.Vector.mult(direction, forceMagnitude * this.omega);
        Matter.Body.applyForce(enemy, enemy.position, force);
      }
    });
  }

  private handleCollision(bodyA: Matter.Body, bodyB: Matter.Body) {
    const labels = [bodyA.label, bodyB.label];

    if (labels.includes('player') && labels.includes('enemy')) {
      if (this.isDashing) {
        const enemy = bodyA.label === 'enemy' ? bodyA : bodyB;
        this.killEnemy(enemy);
      } else {
        this.health -= 10;
      }
    }
  }

  private killEnemy(enemy: Matter.Body) {
    Matter.World.remove(this.world, enemy);
    this.enemies = this.enemies.filter(e => e !== enemy);
    this.score += 25;
  }

  private updateEntropy() {
    const t = this.frame / 60;
    this.omega = 1 + 2 * Math.log(1 + 0.2 * t);
  }

  public getScore(): number {
    return Math.floor(this.score + (this.frame / 60) * 10);
  }

  public getInputLog(): PlayerInput[] {
    return this.inputLog;
  }
}
