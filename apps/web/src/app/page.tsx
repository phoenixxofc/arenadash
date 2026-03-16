'use client';
import React, { useState } from 'react';
import { PhaserGame } from '../game/PhaserGame';
import { HUD } from '../components/HUD';
import { Forge } from '../components/Forge';
export default function Home() {
  const [showForge, setShowForge] = useState(false);
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#050506] text-[#00F2FF] font-mono p-4 overflow-hidden">
      <div className="z-10 w-full max-w-5xl items-center justify-between text-sm flex mb-8">
        <h1 className="text-4xl font-bold">ARENA DASH</h1>
        <div className="flex gap-4">
          <button onClick={() => setShowForge(true)} className="border border-[#00F2FF] px-4 py-2">THE FORGE</button>
          <button className="border border-[#FFB800] text-[#FFB800] px-4 py-2">CONNECT NERVE-LINK</button>
        </div>
      </div>
      <div className="relative"><PhaserGame /><HUD /></div>
      {showForge && <Forge onClose={() => setShowForge(false)} />}
    </main>
  );
}
