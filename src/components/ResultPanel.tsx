import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSimStore } from "@/store/useSimStore";

const ResultLine = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-slate-500">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export const ResultPanel = () => {
  const results = useSimStore((s) => s.results);

  return (
    <Card>
      <CardHeader>
        <CardTitle>结果 / Impact Summary</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        {(["a", "b"] as const).map((p) => {
          const impact = results[p].impact;
          return (
            <div key={p} className="space-y-2 rounded-md border p-3">
              <h4 className="font-semibold">Particle {p}</h4>
              <ResultLine label="x" value={impact.x.toFixed(3)} />
              <ResultLine label="y" value={impact.y.toFixed(3)} />
              <ResultLine label="surface" value={impact.surface} />
              <ResultLine label="on plate" value={impact.onPlate ? "Yes" : "No"} />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
