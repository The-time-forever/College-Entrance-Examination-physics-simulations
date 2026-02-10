import { useEffect, useMemo, useRef } from "react";
import { useSimStore } from "@/store/useSimStore";
import { computeIonTrajectory } from "@/scenes/ion-deposition/physics/compute";
import { drawDevice } from "@/scenes/ion-deposition/render/drawDevice";
import { drawTrajectory } from "@/scenes/ion-deposition/render/drawTrajectories";

export const SimCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const params = useSimStore((s) => s.params);
  const setResult = useSimStore((s) => s.setResult);

  const computed = useMemo(() => {
    return {
      a: computeIonTrajectory(params, "a"),
      b: computeIonTrajectory(params, "b")
    };
  }, [params]);

  useEffect(() => {
    setResult("a", computed.a);
    setResult("b", computed.b);
  }, [computed, setResult]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeAndRender = () => {
      const ratio = window.devicePixelRatio || 1;
      const bounds = canvas.getBoundingClientRect();
      canvas.width = Math.floor(bounds.width * ratio);
      canvas.height = Math.floor(bounds.height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      const width = bounds.width;
      const height = bounds.height;
      const scale = Math.max(40, Math.min(width, height) / 12);

      const mapper = drawDevice({ ctx, width, height, scale }, params);
      drawTrajectory(ctx, computed.a, "#2563eb", "a", mapper);
      drawTrajectory(ctx, computed.b, "#ef4444", "b", mapper);
    };

    resizeAndRender();
    window.addEventListener("resize", resizeAndRender);
    return () => window.removeEventListener("resize", resizeAndRender);
  }, [params, computed]);

  return <canvas ref={canvasRef} className="h-full w-full rounded-lg border bg-white shadow-sm" />;
};
