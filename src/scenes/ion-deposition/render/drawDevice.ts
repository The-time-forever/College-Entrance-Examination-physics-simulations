import type { SimParams } from "@/store/useSimStore";

export type DrawContext = {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  scale: number;
};

export type WorldMapper = {
  originX: number;
  originY: number;
  toCanvasX: (x: number) => number;
  toCanvasY: (y: number) => number;
};

export const createWorldMapper = (height: number, scale: number): WorldMapper => {
  const originX = 60;
  const originY = height / 2;

  return {
    originX,
    originY,
    toCanvasX: (x) => originX + x * scale,
    toCanvasY: (y) => originY - y * scale
  };
};

export const drawDevice = ({ ctx, width, height, scale }: DrawContext, params: SimParams): WorldMapper => {
  const mapper = createWorldMapper(height, scale);
  const L = params.L;
  const H = Math.max(Math.abs(params.H), 1e-6);

  const xStart = mapper.toCanvasX(0);
  const xEnd = width - 20;
  const y0 = mapper.toCanvasY(0);
  const yH = mapper.toCanvasY(-H);

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "rgba(59,130,246,0.08)";
  ctx.fillRect(xStart, 20, xEnd - xStart, Math.max(0, y0 - 20));
  ctx.fillRect(xStart, yH, xEnd - xStart, Math.max(0, height - 20 - yH));

  ctx.fillStyle = "rgba(148,163,184,0.16)";
  ctx.fillRect(xStart, y0, xEnd - xStart, yH - y0);

  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(20, y0);
  ctx.lineTo(width - 20, y0);
  ctx.moveTo(mapper.originX, 20);
  ctx.lineTo(mapper.originX, height - 20);
  ctx.stroke();

  ctx.fillStyle = "#0f172a";
  ctx.font = "12px sans-serif";
  ctx.fillText("O", mapper.originX - 12, y0 - 6);

  ctx.fillStyle = "#334155";
  ctx.fillText("磁场区", mapper.toCanvasX(0.35 * L), 40);
  ctx.fillText("无磁区", mapper.toCanvasX(0.35 * L), y0 + 16);
  ctx.fillText("磁场区", mapper.toCanvasX(0.35 * L), Math.min(height - 30, yH + 22));

  const pX0 = mapper.toCanvasX(L);
  const pX1 = mapper.toCanvasX(2 * L);
  ctx.strokeStyle = "#1d4ed8";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(pX0, y0);
  ctx.lineTo(pX1, y0);
  ctx.moveTo(pX0, yH);
  ctx.lineTo(pX1, yH);
  ctx.stroke();
  ctx.fillText("P 上表面", pX0, y0 - 8);
  ctx.fillText("P 下表面", pX0, yH + 16);

  const gateX0 = mapper.toCanvasX(2.5 * L);
  const gateX1 = mapper.toCanvasX(3.5 * L);
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(gateX0, y0);
  ctx.lineTo(gateX1, y0);
  ctx.moveTo(gateX0, yH);
  ctx.lineTo(gateX1, yH);
  ctx.stroke();

  ctx.fillText("M", gateX0 - 14, y0 - 8);
  ctx.fillText("N", gateX0 - 14, yH + 16);
  ctx.fillText("S", mapper.toCanvasX(3 * L) - 3, y0 - 8);

  return mapper;
};
