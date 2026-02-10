import type { ImpactResult, ParticleType, SimParams } from "@/store/useSimStore";

export type TrajectoryPoint = { x: number; y: number };

export type ComputeOutput = {
  points: TrajectoryPoint[];
  impact: ImpactResult;
};

const buildPlaceholderPath = (params: SimParams, particle: ParticleType): TrajectoryPoint[] => {
  const sign = particle === "a" ? 1 : -1;
  const length = params.L * 8;
  const step = length / 120;
  const curvature = (params.B * params.q) / Math.max(params.m, 0.1);
  const electricTerm = (params.U + params.UNM) / 300;

  return Array.from({ length: 121 }, (_, idx) => {
    const x = idx * step;
    const s = x / length;
    const y =
      sign *
      params.L *
      (0.35 * Math.sin(Math.PI * s) * (0.4 + curvature * 0.2) +
        0.15 * Math.pow(s, 2) +
        electricTerm * 0.08);
    return { x, y };
  });
};

const estimateImpact = (points: TrajectoryPoint[], params: SimParams): ImpactResult => {
  const end = points[points.length - 1] ?? { x: 0, y: 0 };
  const plateHalfHeight = 0.35 * params.L;
  const onPlate = Math.abs(end.y) <= plateHalfHeight;

  return {
    x: end.x,
    y: end.y,
    surface: onPlate ? (end.y >= 0 ? "top" : "bottom") : "none",
    onPlate
  };
};

export const computeIonTrajectory = (params: SimParams, particle: ParticleType): ComputeOutput => {
  const points = buildPlaceholderPath(params, particle);
  return {
    points,
    impact: estimateImpact(points, params)
  };
};
