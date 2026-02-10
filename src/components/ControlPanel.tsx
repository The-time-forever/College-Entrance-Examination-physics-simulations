import { useMemo } from "react";
import { Download } from "lucide-react";
import { calcU, calcU0, useSimStore } from "@/store/useSimStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type NumericParamKey = "L" | "B" | "k" | "UNM" | "H" | "m" | "q";

type ParamConfig = {
  key: NumericParamKey;
  label: string;
  min: number;
  max: number;
  step: number;
};

const basicConfig: ParamConfig[] = [
  { key: "L", label: "L", min: 0.5, max: 2.5, step: 0.05 },
  { key: "B", label: "B", min: 0, max: 2, step: 0.05 },
  { key: "k", label: "k", min: 0, max: 4, step: 0.05 },
  { key: "UNM", label: "UNM", min: 0, max: 4, step: 0.05 },
  { key: "H", label: "H", min: 0.3, max: 1.2, step: 0.01 }
];

const advancedConfig: ParamConfig[] = [
  { key: "m", label: "m", min: 0.1, max: 5, step: 0.05 },
  { key: "q", label: "q", min: 0.1, max: 5, step: 0.05 }
];

export const ControlPanel = () => {
  const { params, setParam, reset, isPlaying, togglePlay } = useSimStore();
  const U0 = calcU0(params);
  const U = calcU(params);

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

  const updateNumericParam = (key: NumericParamKey, value: number) => {
    if (!Number.isFinite(value)) return;
    setParam(key, value);
  };

  const renderControl = (config: ParamConfig) => {
    const disabled = config.key === "UNM" && params.lockUNM;
    return (
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
            disabled={disabled}
            value={params[config.key]}
            onChange={(e) => updateNumericParam(config.key, Number(e.target.value))}
          />
        </div>
        <Slider
          min={config.min}
          max={config.max}
          step={config.step}
          disabled={disabled}
          value={[params[config.key]]}
          onValueChange={(v) => updateNumericParam(config.key, v[0])}
        />
      </div>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>参数面板 / Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={params.particleType} onValueChange={(v) => setParam("particleType", v as "a" | "b")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="a">Particle a</TabsTrigger>
            <TabsTrigger value="b">Particle b</TabsTrigger>
          </TabsList>
          <TabsContent value="a" className="text-xs text-slate-500">a 粒子：q/m</TabsContent>
          <TabsContent value="b" className="text-xs text-slate-500">b 粒子：q/m = a 的 1/4</TabsContent>
        </Tabs>

        <div className="grid grid-cols-2 gap-2 rounded-md bg-slate-50 p-3 text-xs text-slate-600">
          <span>U0 = {U0.toFixed(3)}</span>
          <span>U = {U.toFixed(3)}</span>
        </div>

        <div className="flex items-center justify-between rounded-md bg-slate-50 p-3">
          <Label htmlFor="lock-unm">锁定 UNM = 3/4 U</Label>
          <Switch id="lock-unm" checked={params.lockUNM} onCheckedChange={(checked) => setParam("lockUNM", checked)} />
        </div>

        <Tabs defaultValue="basic">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          <TabsContent value="basic" className="space-y-3">
            {basicConfig.map(renderControl)}
          </TabsContent>
          <TabsContent value="advanced" className="space-y-3">
            {advancedConfig.map(renderControl)}
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-3 gap-2 pt-2">
          <Button variant="outline" onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</Button>
          <Button variant="secondary" onClick={reset}>Reset</Button>
          <Button onClick={handleExport}><Download className="mr-1 h-4 w-4" />Export</Button>
        </div>
      </CardContent>
    </Card>
  );
};
