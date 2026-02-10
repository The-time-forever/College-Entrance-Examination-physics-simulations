import { create } from "zustand";

export type ParticleType = "a" | "b";

export type SimParams = {
  L: number;
  B: number;
  U: number;
  UNM: number;
  m: number;
  q: number;
  k: number;
  particleType: ParticleType;
  lockUNM: boolean;
};

export type ImpactResult = {
  x: number;
  y: number;
  surface: "top" | "bottom" | "none";
  onPlate: boolean;
};

export type ParticleResult = {
  points: Array<{ x: number; y: number }>;
  impact: ImpactResult;
};

const defaultParams: SimParams = {
  L: 1,
  B: 0.8,
  U: 120,
  UNM: 90,
  m: 1,
  q: 1,
  k: 1,
  particleType: "a",
  lockUNM: true
};

type SimState = {
  params: SimParams;
  isPlaying: boolean;
  t: number;
  speed: number;
  results: Record<ParticleType, ParticleResult>;
  setParam: <K extends keyof SimParams>(key: K, value: SimParams[K]) => void;
  setTime: (t: number) => void;
  togglePlay: () => void;
  reset: () => void;
  setResult: (particle: ParticleType, result: ParticleResult) => void;
};

const emptyResult: ParticleResult = {
  points: [],
  impact: { x: 0, y: 0, surface: "none", onPlate: false }
};

export const useSimStore = create<SimState>((set) => ({
  params: defaultParams,
  isPlaying: false,
  t: 0,
  speed: 1,
  results: { a: emptyResult, b: emptyResult },
  setParam: (key, value) =>
    set((state) => {
      const nextParams = { ...state.params, [key]: value };
      if (key === "U" && state.params.lockUNM) {
        nextParams.UNM = Number((nextParams.U * 0.75).toFixed(2));
      }
      if (key === "lockUNM" && value === true) {
        nextParams.UNM = Number((nextParams.U * 0.75).toFixed(2));
      }
      return { params: nextParams };
    }),
  setTime: (t) => set({ t }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  reset: () =>
    set({
      params: defaultParams,
      isPlaying: false,
      t: 0,
      speed: 1,
      results: { a: emptyResult, b: emptyResult }
    }),
  setResult: (particle, result) =>
    set((state) => ({
      results: {
        ...state.results,
        [particle]: result
      }
    }))
}));
