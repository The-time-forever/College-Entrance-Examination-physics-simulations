import type { ParticleResult } from "@/store/useSimStore";
import type { WorldMapper } from "@/scenes/ion-deposition/render/drawDevice";

export const drawTrajectory = (
  ctx: CanvasRenderingContext2D,
  result: ParticleResult,
  color: string,
  label: string,
  mapper: WorldMapper
) => {
  if (!result.points.length) return;

  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.beginPath();

  result.points.forEach((point, index) => {
    const x = mapper.toCanvasX(point.x);
    const y = mapper.toCanvasY(point.y);
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();

  const end = result.points[result.points.length - 1];
  const endX = mapper.toCanvasX(end.x);
  const endY = mapper.toCanvasY(end.y);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(endX, endY, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillText(`${label} impact`, endX + 6, endY - 6);

  if (typeof result.x0 === "number") {
    const x0X = mapper.toCanvasX(result.x0);
    const x0Y = mapper.toCanvasY(0);
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.arc(x0X, x0Y, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText(`x0=${result.x0.toFixed(3)}`, x0X + 6, x0Y - 8);
  }

  if (result.impact.surface === "bottom") {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(endX - 5, endY - 5);
    ctx.lineTo(endX + 5, endY + 5);
    ctx.moveTo(endX + 5, endY - 5);
    ctx.lineTo(endX - 5, endY + 5);
    ctx.stroke();
  } else if (result.impact.surface === "none") {
    ctx.fillStyle = "#475569";
    ctx.beginPath();
    ctx.rect(endX - 3, endY - 3, 6, 6);
    ctx.fill();
  }
};
