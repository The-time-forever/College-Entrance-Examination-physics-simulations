import type { SimParams } from "@/store/useSimStore";

export type DrawContext = {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  scale: number;
};

const toCanvasY = (height: number, y: number) => height / 2 - y;

export const drawDevice = ({ ctx, width, height, scale }: DrawContext, params: SimParams) => {
  const L = params.L * scale;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(20, height / 2);
  ctx.lineTo(width - 20, height / 2);
  ctx.moveTo(40, 20);
  ctx.lineTo(40, height - 20);
  ctx.stroke();

  ctx.fillStyle = "#0f172a";
  ctx.font = "12px sans-serif";
  ctx.fillText("O", 28, height / 2 - 6);

  const noFieldStart = 60;
  const noFieldEnd = noFieldStart + 2.5 * L;
  const magneticEnd = noFieldEnd + 3 * L;

  ctx.fillStyle = "rgba(148,163,184,0.15)";
  ctx.fillRect(noFieldStart, 30, noFieldEnd - noFieldStart, height - 60);
  ctx.fillStyle = "rgba(59,130,246,0.12)";
  ctx.fillRect(noFieldEnd, 30, magneticEnd - noFieldEnd, height - 60);

  ctx.fillStyle = "#334155";
  ctx.fillText("无场区", noFieldStart + 8, 44);
  ctx.fillText("磁场区", noFieldEnd + 8, 44);

  const plateX = magneticEnd + 1.2 * L;
  const plateHalfHeight = 0.35 * L;
  ctx.strokeStyle = "#1d4ed8";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(plateX, toCanvasY(height, plateHalfHeight));
  ctx.lineTo(plateX, toCanvasY(height, -plateHalfHeight));
  ctx.stroke();
  ctx.fillText("P", plateX + 8, toCanvasY(height, plateHalfHeight) - 4);

  const gateTop = 0.75 * L;
  const gateBottom = -0.75 * L;
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(noFieldStart + 0.6 * L, toCanvasY(height, gateTop));
  ctx.lineTo(noFieldStart + 1.9 * L, toCanvasY(height, gateTop));
  ctx.moveTo(noFieldStart + 0.6 * L, toCanvasY(height, gateBottom));
  ctx.lineTo(noFieldStart + 1.9 * L, toCanvasY(height, gateBottom));
  ctx.stroke();

  ctx.fillText("M", noFieldStart + 0.55 * L, toCanvasY(height, gateTop) - 8);
  ctx.fillText("N", noFieldStart + 0.55 * L, toCanvasY(height, gateBottom) + 16);
  ctx.fillText("Q", noFieldEnd - 10, height / 2 - 8);
  ctx.fillText("S", magneticEnd - 10, height / 2 - 8);
};
