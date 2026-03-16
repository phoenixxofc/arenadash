import Phaser from 'phaser';
import { GameEngine, PlayerInput } from '@arena-dash/engine';
import { useGameStore } from '../store/useGameStore';

export class GameScene extends Phaser.Scene {
  private engine!: GameEngine;
  private playerGraphics!: Phaser.GameObjects.Graphics;
  private enemyGraphics!: Map<number, Phaser.GameObjects.Graphics>;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private dashKey!: Phaser.Input.Keyboard.Key;

  constructor() { super('GameScene'); }

  create() {
    this.engine = new GameEngine({ seed: 'test-seed', isServer: false });
    this.playerGraphics = this.add.graphics();
    this.enemyGraphics = new Map();
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.dashKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.cameras.main.setBackgroundColor('#050506');
  }

  update() {
    const input: PlayerInput = {
      frame: this.engine.frame,
      up: this.cursors.up.isDown || this.input.keyboard!.addKey('W').isDown,
      down: this.cursors.down.isDown || this.input.keyboard!.addKey('S').isDown,
      left: this.cursors.left.isDown || this.input.keyboard!.addKey('A').isDown,
      right: this.cursors.right.isDown || this.input.keyboard!.addKey('D').isDown,
      dash: Phaser.Input.Keyboard.JustDown(this.dashKey) || this.input.activePointer.isDown,
      mousePos: { x: this.input.activePointer.x, y: this.input.activePointer.y }
    };
    this.engine.update(input);
    useGameStore.getState().setGameState({
        score: this.engine.getScore(),
        health: this.engine.health,
        omega: this.engine.omega,
        isGameOver: this.engine.isGameOver
    });
    this.renderEngine();
  }

  private renderEngine() {
    this.playerGraphics.clear();
    this.playerGraphics.fillStyle(0x00F2FF, 1);
    this.playerGraphics.fillCircle(this.engine.player.position.x, this.engine.player.position.y, 20);
    const currentEnemyIds = new Set(this.engine.enemies.map(e => (e as any).id));
    for (const [id, graphics] of this.enemyGraphics.entries()) {
      if (!currentEnemyIds.has(id)) { graphics.destroy(); this.enemyGraphics.delete(id); }
    }
    this.engine.enemies.forEach(enemy => {
      let graphics = this.enemyGraphics.get((enemy as any).id);
      if (!graphics) { graphics = this.add.graphics(); this.enemyGraphics.set((enemy as any).id, graphics); }
      graphics.clear();
      graphics.fillStyle(0xFF0043, 1);
      const vertices = enemy.vertices;
      graphics.beginPath();
      graphics.moveTo(vertices[0].x, vertices[0].y);
      for (let i = 1; i < vertices.length; i++) { graphics.lineTo(vertices[i].x, vertices[i].y); }
      graphics.closePath();
      graphics.fillPath();
    });
  }
}
