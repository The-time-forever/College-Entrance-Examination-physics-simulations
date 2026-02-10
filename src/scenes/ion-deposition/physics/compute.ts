import { calcQm, calcU } from "@/store/useSimStore";
import type { ImpactResult, ParticleType, SimParams } from "@/store/useSimStore";

export type TrajectoryPoint = { x: number; y: number };

export type SimOutput = {
  points: TrajectoryPoint[];
  x0?: number;
  impact: ImpactResult;
};

type State = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

type Derivative = {
  dx: number;
  dy: number;
  dvx: number;
  dvy: number;
};

const DT = 0.002;
const MAX_STEPS = 20000;

const hasCrossedY = (y0: number, y1: number, target: number) =>
  (y0 - target) * (y1 - target) <= 0 && (y0 !== target || y1 !== target);

const interpolateXAtY = (prev: State, next: State, yTarget: number) => {
  const dy = next.y - prev.y;
  if (Math.abs(dy) < 1e-12) return next.x;
  const t = (yTarget - prev.y) / dy;
  return prev.x + (next.x - prev.x) * t;
};

const inRange = (v: number, min: number, max: number) => v >= min && v <= max;

const getBz = (y: number, B: number, H: number) => (y > 0 || y < -H ? B : 0);

const getEy = (x: number, y: number, params: SimParams, H: number) => {
  const inGateX = inRange(x, 2.5 * params.L, 3.5 * params.L);
  const inGateY = inRange(y, -H, 0);
  return inGateX && inGateY ? params.UNM / H : 0;
};

const derivative = (state: State, params: SimParams, qm: number, H: number): Derivative => {
  const Bz = getBz(state.y, params.B, H);
  const Ey = getEy(state.x, state.y, params, H);

  const ax = qm * (state.vy * Bz);
  const ay = qm * (Ey - state.vx * Bz);

  return { dx: state.vx, dy: state.vy, dvx: ax, dvy: ay };
};

const add = (state: State, d: Derivative, dt: number): State => ({
  x: state.x + d.dx * dt,
  y: state.y + d.dy * dt,
  vx: state.vx + d.dvx * dt,
  vy: state.vy + d.dvy * dt
});

const rk4Step = (state: State, params: SimParams, qm: number, H: number, dt: number): State => {
  const k1 = derivative(state, params, qm, H);
  const k2 = derivative(add(state, k1, dt / 2), params, qm, H);
  const k3 = derivative(add(state, k2, dt / 2), params, qm, H);
  const k4 = derivative(add(state, k3, dt), params, qm, H);

  return {
    x: state.x + (dt / 6) * (k1.dx + 2 * k2.dx + 2 * k3.dx + k4.dx),
    y: state.y + (dt / 6) * (k1.dy + 2 * k2.dy + 2 * k3.dy + k4.dy),
    vx: state.vx + (dt / 6) * (k1.dvx + 2 * k2.dvx + 2 * k3.dvx + k4.dvx),
    vy: state.vy + (dt / 6) * (k1.dvy + 2 * k2.dvy + 2 * k3.dvy + k4.dvy)
  };
};

export const computeIonTrajectory = (params: SimParams, particle: ParticleType): SimOutput => {
  const H = Math.max(Math.abs(params.H), 1e-6);
  const qm = calcQm(params, particle);
  const U = Math.max(calcU(params), 0);
  const v0 = Math.sqrt(Math.max(0, 2 * qm * U));

  const eps = 1e-6 * params.L;
  let state: State = { x: 0, y: eps, vx: 0, vy: v0 };

  const points: TrajectoryPoint[] = [{ x: state.x, y: state.y }];
  let x0: number | undefined;
  let impact: ImpactResult = { x: state.x, y: state.y, surface: "none", onPlate: false };

  const plateMinX = params.L;
  const plateMaxX = 2 * params.L;

  // 手动校验提示：UNM=0 时应表现为“磁场圆弧 + 无磁区直线”。
  // 手动校验提示：B=0 时应表现为“仅电场区抛物线段”。
  // 手动校验提示：b 粒子 q/m 为 1/4，偏转应更弱（半径更大、回旋更慢）。
  for (let step = 0; step < MAX_STEPS; step += 1) {
    const next = rk4Step(state, params, qm, H, DT);
    points.push({ x: next.x, y: next.y });

    if (x0 === undefined && state.y > 0 && next.y <= 0) {
      x0 = interpolateXAtY(state, next, 0);
    }

    if (hasCrossedY(state.y, next.y, 0)) {
      const xTop = interpolateXAtY(state, next, 0);
      if (inRange(xTop, plateMinX, plateMaxX)) {
        impact = { x: xTop, y: 0, surface: "top", onPlate: true };
        points.push({ x: impact.x, y: impact.y });
        break;
      }
    }

    if (hasCrossedY(state.y, next.y, -H)) {
      const xBottom = interpolateXAtY(state, next, -H);
      if (inRange(xBottom, plateMinX, plateMaxX)) {
        impact = { x: xBottom, y: -H, surface: "bottom", onPlate: true };
        points.push({ x: impact.x, y: impact.y });
        break;
      }
    }

    if (next.x < -0.5 * params.L || next.x > 4.2 * params.L || Math.abs(next.y) > 3 * params.L) {
      impact = { x: next.x, y: next.y, surface: "none", onPlate: false };
      break;
    }

    state = next;
    impact = { x: state.x, y: state.y, surface: "none", onPlate: false };
  }

  return { points, x0, impact };
};
