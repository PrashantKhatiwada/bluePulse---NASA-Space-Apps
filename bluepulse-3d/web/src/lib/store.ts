import { create } from "zustand";

type CamState = {
  target: [number, number, number]; // world space
  setTarget: (t: [number, number, number]) => void;
};

export const useCamStore = create<CamState>((set) => ({
  target: [0, 0, 3.1],
  setTarget: (t) => set({ target: t }),
}));
