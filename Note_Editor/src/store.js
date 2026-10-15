import { create } from 'zustand';

// Zustand store for music time in milliseconds=======================================
export const musicTimeZ = create((set) => ({
  musicTime: 0,
  musicSeek: () => {},
  setMusicTime: (time) => set({ musicTime: time }),
  setMusicSeek: (seek) => set({ musicSeek: seek }),
}));

