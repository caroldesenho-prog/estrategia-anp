import { Period, View } from "@/types/dashboard";

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
    { value: "prospeccao", label: "Prospecção" },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-beige-medium bg-white">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-6 px-6 py-4">
        <div className="flex items-center gap-4">
          <img src="/logo-dt.png" alt="SENAI-SP Distrito Tecnológico" height={40} className="h-10 w-auto" />
          <div className="h-10 w-px bg-beige-medium" />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-graphite-dark">ANP — Farol de Oportunidades</h1>
            <p className="text-xs text-graphite-medium">
              Inteligência estratégica de projetos · SENAI-SP Distrito Tecnológico
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-1 rounded-lg bg-beige-light p-1">
          {tabs.map((t) => (
            <button
              key={t.value}
              onClick={() => onViewChange(t.value)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all ${
                view === t.value
                  ? "bg-white text-graphite-dark shadow-sm"
                  : "text-graphite-medium hover:text-graphite-dark"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="ml-auto">
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-graphite-medium">
            Período
          </label>
          <div className="inline-flex rounded-md border border-beige-medium bg-white p-0.5">
            {(["3anos", "5anos", "8anos"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => onPeriodChange(p)}
                className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                  period === p
                    ? "bg-graphite-dark text-white"
                    : "text-graphite-medium hover:text-graphite-dark"
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
