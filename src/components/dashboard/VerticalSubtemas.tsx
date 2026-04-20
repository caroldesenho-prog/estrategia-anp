import { SubtemaFit } from "@/types/dashboard";
import { formatBRL, formatNumber } from "@/lib/format";

interface Props { data: SubtemaFit[]; cor: string; }

export const VerticalSubtemas = ({ data, cor }: Props) => {
  const sorted = [...data].sort((a, b) => b.valor - a.valor).slice(0, 10);
  const max = Math.max(...sorted.map((s) => s.valor), 1);
  return (
    <div className="space-y-2">
      {sorted.map((s) => {
        const pctSemIct = s.projetos > 0 ? (s.sem_ict / s.projetos) * 100 : 0;
        const widthPct = (s.valor / max) * 100;
        return (
          <div key={s.subtema} className="rounded-lg border border-border bg-background p-3">
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <p className="text-sm font-medium text-foreground line-clamp-1" title={s.subtema}>{s.subtema}</p>
              <div className="flex shrink-0 items-center gap-3 text-xs">
                <span className="font-semibold tabular-nums text-foreground">{formatBRL(s.valor)}</span>
                <span className="text-muted-foreground">{formatNumber(s.projetos)} proj.</span>
                <span className="rounded px-1.5 py-0.5 font-semibold text-white" style={{ backgroundColor: "#E24B4A" }}>
                  {pctSemIct.toFixed(0)}% sem ICT
                </span>
              </div>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full" style={{ width: `${widthPct}%`, backgroundColor: cor }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
