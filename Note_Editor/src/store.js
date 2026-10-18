import { create } from 'zustand';

// Zustand store for music time in milliseconds=======================================
export const musicTimeZ = create((set) => ({
  musicSeek: 0,
  setMusicSeek: (value) => set({ musicSeek: value }),
}));

