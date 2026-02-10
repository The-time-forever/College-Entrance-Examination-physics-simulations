import { create } from "zustand";

export type ParticleType = "a" | "b";

export type SimParams = {
  L: number;
  B: number;
  k: number;
  UNM: number;
  H: number;
  m: number;
  q: number;
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
  x0?: number;
  impact: ImpactResult;
};

type U0Inputs = Pick<SimParams, "q" | "B" | "L" | "m">;
type UInputs = U0Inputs & Pick<SimParams, "k">;

export const calcU0 = ({ q, B, L, m }: U0Inputs) => {
  const safeM = Math.max(Math.abs(m), 1e-9);
  return (q * B * B * L * L) / (8 * safeM);
};

export const calcU = ({ q, B, L, m, k }: UInputs) => k * calcU0({ q, B, L, m });

export const calcQm = (params: Pick<SimParams, "q" | "m">, particle: ParticleType) => {
  const ratio = particle === "a" ? 1 : 0.25;
  const safeM = Math.max(Math.abs(params.m), 1e-9);
  return (params.q / safeM) * ratio;
};

const calcLockedUNM = (params: UInputs) => Number((0.75 * calcU(params)).toFixed(2));

const defaultBaseParams = {
  L: 1,
  B: 0.8,
  k: 1,
  H: 0.6,
  m: 1,
  q: 1,
  particleType: "a" as ParticleType,
  lockUNM: true
};

const defaultParams: SimParams = {
  ...defaultBaseParams,
  UNM: calcLockedUNM(defaultBaseParams)
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

const updatesU = new Set<keyof SimParams>(["k", "B", "L", "m", "q"]);

export const useSimStore = create<SimState>((set) => ({
  params: defaultParams,
  isPlaying: false,
  t: 0,
  speed: 1,
  results: { a: emptyResult, b: emptyResult },
  setParam: (key, value) =>
    set((state) => {
      const nextParams = { ...state.params, [key]: value };

      if (nextParams.lockUNM && (updatesU.has(key) || (key === "lockUNM" && value === true))) {
        nextParams.UNM = calcLockedUNM(nextParams);
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
