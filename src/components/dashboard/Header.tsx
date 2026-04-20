import { Period, View } from "@/types/dashboard";
import { Radar } from "lucide-react";

interface Props {
  period: Period;
  view: View;
  onPeriodChange: (p: Period) => void;
  onViewChange: (v: View) => void;
}

export const Header = ({ period, view, onPeriodChange, onViewChange }: Props) => {
  const tabs: { value: View; label: string }[] = [
    { value: "geral", label: "Visão Geral" },
    { value: "vertical", label: "Análise por Vertical" },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/70">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-6 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Radar className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">Radar PD&I ANP</h1>
            <p className="text-xs text-muted-foreground">Inteligência estratégica · projetos PD&I</p>
          </div>
        </div>

        <nav className="flex items-center gap-1 rounded-lg border border-border bg-background p-1">
          {tabs.map((t) => (
            <button
              key={t.value}
              onClick={() => onViewChange(t.value)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                view === t.value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="ml-auto">
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Período
          </label>
          <div className="inline-flex rounded-md border border-border bg-background p-0.5">
            {(["3anos", "5anos", "8anos"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => onPeriodChange(p)}
                className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                  period === p
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {p === "3anos" ? "3 anos" : p === "5anos" ? "5 anos" : "8 anos"}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
