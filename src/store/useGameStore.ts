import { create } from 'zustand';

export type Screen = 'menu' | 'game' | 'codex' | 'leaderboard' | 'journal' | 'escaped';

interface GameState {
  currentScreen: Screen;
  level: number;
  score: number;
  unlockedPatterns: string[];
  maxTension: number;
  isAudioEnabled: boolean;
  
  // Actions
  setScreen: (screen: Screen) => void;
  advanceLevel: () => void;
  addScore: (points: number) => void;
  unlockPattern: (pattern: string) => void;
  toggleAudio: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentScreen: 'menu',
  level: 1,
  score: 0,
  unlockedPatterns: [],
  maxTension: 100,
  isAudioEnabled: true,
  
  setScreen: (screen) => set({ currentScreen: screen }),
  advanceLevel: () => set((state) => ({ level: state.level + 1 })),
  addScore: (points) => set((state) => ({ score: state.score + points })),
  unlockPattern: (pattern) => set((state) => ({ 
    unlockedPatterns: state.unlockedPatterns.includes(pattern) 
      ? state.unlockedPatterns 
      : [...state.unlockedPatterns, pattern] 
  })),
  toggleAudio: () => set((state) => ({ isAudioEnabled: !state.isAudioEnabled })),
}));
