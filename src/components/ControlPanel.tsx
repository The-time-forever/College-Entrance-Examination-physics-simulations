import { useMemo } from "react";
import { Download } from "lucide-react";
import { useSimStore } from "@/store/useSimStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const paramConfig = [
  { key: "L", label: "L", min: 0.5, max: 3, step: 0.05 },
  { key: "B", label: "B", min: 0.1, max: 2, step: 0.05 },
  { key: "U", label: "U", min: 20, max: 300, step: 1 },
  { key: "UNM", label: "UNM", min: 10, max: 300, step: 1 }
] as const;

export const ControlPanel = () => {
  const { params, setParam, reset, isPlaying, togglePlay } = useSimStore();

  const exportText = useMemo(() => JSON.stringify(params, null, 2), [params]);

  const handleExport = async () => {
    try {
      await navigator.clipboard.writeText(exportText);
    } catch {
      const blob = new Blob([exportText], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "sim-params.json";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>参数面板 / Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={params.particleType} onValueChange={(v) => setParam("particleType", v as "a" | "b") }>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="a">Particle a</TabsTrigger>
            <TabsTrigger value="b">Particle b</TabsTrigger>
          </TabsList>
          <TabsContent value="a" className="text-xs text-slate-500">查看 a 粒子默认配置。</TabsContent>
          <TabsContent value="b" className="text-xs text-slate-500">查看 b 粒子默认配置。</TabsContent>
        </Tabs>

        <div className="flex items-center justify-between rounded-md bg-slate-50 p-3">
          <Label htmlFor="lock-unm">锁定 UNM = 3/4 U</Label>
          <Switch id="lock-unm" checked={params.lockUNM} onCheckedChange={(checked) => setParam("lockUNM", checked)} />
        </div>

        {paramConfig.map((config) => (
          <div key={config.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={config.key}>{config.label}</Label>
              <Input
                id={config.key}
                type="number"
                className="h-8 w-24"
                step={config.step}
                min={config.min}
                max={config.max}
                disabled={config.key === "UNM" && params.lockUNM}
                value={params[config.key]}
                onChange={(e) => setParam(config.key, Number(e.target.value))}
              />
            </div>
            <Slider
              min={config.min}
              max={config.max}
              step={config.step}
              disabled={config.key === "UNM" && params.lockUNM}
              value={[params[config.key]]}
              onValueChange={(v) => setParam(config.key, v[0])}
            />
          </div>
        ))}

        <div className="grid grid-cols-3 gap-2 pt-2">
          <Button variant="outline" onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</Button>
          <Button variant="secondary" onClick={reset}>Reset</Button>
          <Button onClick={handleExport}><Download className="mr-1 h-4 w-4" />Export</Button>
        </div>
      </CardContent>
    </Card>
  );
};
