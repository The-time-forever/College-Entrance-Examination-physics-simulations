import { calcU, calcU0, useSimStore } from "@/store/useSimStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ResultLine = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-slate-500">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

const surfaceText: Record<"top" | "bottom" | "none", string> = {
  top: "上表面",
  bottom: "下表面",
  none: "未命中"
};

export const ResultPanel = () => {
  const results = useSimStore((s) => s.results);
  const params = useSimStore((s) => s.params);

  const U0 = calcU0(params);
  const U = calcU(params);

  return (
    <Card>
      <CardHeader>
        <CardTitle>结果 / Impact Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2 rounded-md border bg-slate-50 p-3 text-sm md:grid-cols-4">
          <ResultLine label="U0" value={U0.toFixed(3)} />
          <ResultLine label="U" value={U.toFixed(3)} />
          <ResultLine label="UNM" value={params.UNM.toFixed(3)} />
          <ResultLine label="UNM锁定" value={params.lockUNM ? "已锁定" : "未锁定"} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {(["a", "b"] as const).map((p) => {
            const result = results[p];
            return (
              <div key={p} className="space-y-2 rounded-md border p-3">
                <h4 className="font-semibold">Particle {p}</h4>
                <ResultLine label="x0" value={typeof result.x0 === "number" ? result.x0.toFixed(3) : "-"} />
                <ResultLine label="impact.x" value={result.impact.x.toFixed(3)} />
                <ResultLine label="impact.y" value={result.impact.y.toFixed(3)} />
                <ResultLine label="surface" value={surfaceText[result.impact.surface]} />
                <ResultLine label="on plate" value={result.impact.onPlate ? "Yes" : "No"} />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
