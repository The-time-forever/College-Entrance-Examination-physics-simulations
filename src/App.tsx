import { SimCanvas } from "@/components/SimCanvas";
import { ControlPanel } from "@/components/ControlPanel";
import { ResultPanel } from "@/components/ResultPanel";

const App = () => {
  return (
    <main className="mx-auto flex min-h-screen max-w-[1400px] flex-col gap-4 p-4 lg:p-6">
      <header>
        <h1 className="text-2xl font-bold">Ion Deposition Simulator / 离子喷镀装置仿真</h1>
        <p className="text-sm text-slate-600">高考物理电磁偏转题交互式仿真骨架（Canvas + Zustand + shadcn/ui）</p>
      </header>

      <section className="grid flex-1 gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="min-h-[420px]">
          <SimCanvas />
        </div>
        <div className="min-h-[420px]">
          <ControlPanel />
        </div>
      </section>

      <section>
        <ResultPanel />
      </section>
    </main>
  );
};

export default App;
