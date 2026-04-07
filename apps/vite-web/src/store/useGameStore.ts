import { create } from 'zustand';
interface GameState {
  score: number;
  health: number;
  omega: number;
  isGameOver: boolean;
  setGameState: (state: Partial<GameState>) => void;
  resetGame: () => void;
}
export const useGameStore = create<GameState>((set) => ({
  score: 0,
  health: 100,
  omega: 1,
  isGameOver: false,
  setGameState: (state) => set((prev) => ({ ...prev, ...state })),
  resetGame: () => set({ score: 0, health: 100, omega: 1, isGameOver: false }),
}));
