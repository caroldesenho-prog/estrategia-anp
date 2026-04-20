import { Period, Vertical } from "@/types/dashboard";
import { Radar } from "lucide-react";

interface Props {
  period: Period;
  vertical: Vertical;
  onPeriodChange: (p: Period) => void;
  onVerticalChange: (v: Vertical) => void;
}

const VERTICALS: { label: string; value: Vertical | string; disabled?: boolean }[] = [
  { label: "Manufatura Avançada", value: "Manufatura Avançada" },
  { label: "Tecnologias Digitais", value: "Tecnologias Digitais" },
  { label: "Energia (em breve)", value: "energia", disabled: true },
  { label: "Sustentabilidade (em breve)", value: "sust", disabled: true },
];

export const Header = ({ period, vertical, onPeriodChange, onVerticalChange }: Props) => {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/70">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-4 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Radar className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">Radar PD&I ANP</h1>
            <p className="text-xs text-muted-foreground">Inteligência estratégica · projetos PD&I</p>
          </div>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-3">
          <div>
            <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Período
            </label>
            <div className="inline-flex rounded-md border border-border bg-background p-0.5">
              {(["3anos", "5anos"] as Period[]).map((p) => (
                <button
                  key={p}
                  onClick={() => onPeriodChange(p)}
                  className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                    period === p
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {p === "3anos" ? "3 anos" : "5 anos"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Vertical
            </label>
            <select
              value={vertical}
              onChange={(e) => onVerticalChange(e.target.value as Vertical)}
              className="rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {VERTICALS.map((v) => (
                <option key={v.value} value={v.value} disabled={v.disabled}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
