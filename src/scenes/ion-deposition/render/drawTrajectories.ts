import type { ParticleResult } from "@/store/useSimStore";

export const drawTrajectory = (
  ctx: CanvasRenderingContext2D,
  height: number,
  scale: number,
  result: ParticleResult,
  color: string,
  label: string
) => {
  if (!result.points.length) return;

  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.beginPath();

  result.points.forEach((point, index) => {
    const x = 60 + point.x * scale;
    const y = height / 2 - point.y * scale;
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();

  const end = result.points[result.points.length - 1];
  const endX = 60 + end.x * scale;
  const endY = height / 2 - end.y * scale;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(endX, endY, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillText(label, endX + 6, endY - 6);
};
