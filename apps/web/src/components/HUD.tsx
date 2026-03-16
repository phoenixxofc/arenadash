'use client';
import React from 'react';
import { useGameStore } from '../store/useGameStore';
export const HUD: React.FC = () => {
  const { score, health, omega, isGameOver } = useGameStore();
  const healthColor = health > 30 ? '#32D74B' : '#FF3B30';
  return (
    <div className="absolute inset-0 pointer-events-none p-6 font-mono">
      <div className="absolute top-6 left-6">
        <div className="text-[#8E8E93] text-xs uppercase tracking-widest mb-1">Score</div>
        <div className="text-3xl font-bold text-[#00F2FF]">{score.toLocaleString()}</div>
      </div>
      <div className="absolute top-6 right-6 text-right">
        <div className="text-[#8E8E93] text-xs uppercase tracking-widest mb-1">Entropy Factor</div>
        <div className="text-xl font-bold text-[#FFB800]">Ω {omega.toFixed(2)}</div>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-64 text-center">
        <div className="w-full h-2 bg-[#1A1A1B] rounded-full overflow-hidden border border-[#ffffff10]">
          <div className="h-full transition-all duration-300" style={{ width: `${health}%`, backgroundColor: healthColor }} />
        </div>
        <div className="text-[10px] mt-1 text-[#8E8E93]">{health}%</div>
      </div>
      {isGameOver && (
        <div className="absolute inset-0 bg-[#050506f0] pointer-events-auto flex flex-col items-center justify-center backdrop-blur-sm">
          <h2 className="text-5xl font-black text-[#FF0043] mb-2">NEURAL LINK SEVERED</h2>
          <div className="text-4xl text-white mb-12">{score.toLocaleString()} PTS</div>
          <button onClick={() => window.location.reload()} className="border-2 border-[#00F2FF] text-[#00F2FF] px-10 py-3 font-bold uppercase">Reconnect</button>
        </div>
      )}
    </div>
  );
};
