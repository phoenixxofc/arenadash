"use client";

import React, { useEffect, useRef } from "react";

export const PhaserGame: React.FC = () => {
	const gameContainerRef = useRef<HTMLDivElement>(null);
	const gameRef = useRef<any>(null);

	useEffect(() => {
		let game: any;

		const initGame = async () => {
			// ✅ dynamically import Phaser (prevents SSR crash)
			const Phaser = await import("phaser");

			// ✅ dynamically import your scene
			const { GameScene } = await import("./GameScene");

			if (gameContainerRef.current && !gameRef.current) {
				const config: any = {
					type: Phaser.AUTO,
					width: 800,
					height: 600,
					parent: gameContainerRef.current,
					scene: [GameScene],
					physics: {
						default: "arcade",
						arcade: { debug: false },
					},
					backgroundColor: "#050506",
				};

				game = new Phaser.Game(config);
				gameRef.current = game;
			}
		};

		initGame();

		return () => {
			if (gameRef.current) {
				gameRef.current.destroy(true);
				gameRef.current = null;
			}
		};
	}, []);

	return (
		<div
			ref={gameContainerRef}
			className="rounded-lg overflow-hidden border-2 border-[#1A1A1B] shadow-[0_0_20px_rgba(0,242,255,0.2)]"
		/>
	);
};
