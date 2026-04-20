import { useState } from "react";
import { TemaTree } from "@/types/dashboard";
import { formatBRL, formatNumber } from "@/lib/format";
import { ChevronRight, Check, Minus } from "lucide-react";

interface Props { data: TemaTree[]; }

export const TemasTree = ({ data }: Props) => {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const sorted = [...data].sort((a, b) => b.valor - a.valor);

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="grid grid-cols-[1fr_90px_140px_100px_90px] bg-muted/50 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        <div>Tema / Subtema</div>
        <div className="text-right">Projetos</div>
        <div className="text-right">Valor</div>
        <div className="text-center">Fit</div>
        <div className="text-right">Sem ICT</div>
      </div>
      <div className="divide-y divide-border">
        {sorted.map((tema) => {
          const isOpen = !!open[tema.tema];
          const hasFit = tema.fit_count > 0;
          return (
            <div key={tema.tema}>
              <button
                onClick={() => setOpen((s) => ({ ...s, [tema.tema]: !s[tema.tema] }))}
                className={`grid w-full grid-cols-[1fr_90px_140px_100px_90px] items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors hover:bg-muted/30 ${
                  hasFit ? "border-l-4 border-l-success bg-success-soft/30" : "border-l-4 border-l-transparent"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <ChevronRight
                    className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-90" : ""}`}
                  />
                  <span className="truncate font-semibold text-foreground">{tema.tema}</span>
                </div>
                <div className="text-right tabular-nums text-foreground">{formatNumber(tema.projetos)}</div>
                <div className="text-right font-semibold tabular-nums text-foreground">{formatBRL(tema.valor)}</div>
                <div className="text-center">
                  {hasFit ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-[11px] font-semibold text-success">
                      {tema.fit_count} fit
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </div>
                <div className="text-right text-xs text-muted-foreground">—</div>
              </button>

              {isOpen && (
                <div className="bg-background">
                  {tema.subtemas.map((s) => (
                    <div
                      key={s.subtema}
                      className={`grid grid-cols-[1fr_90px_140px_100px_90px] items-center gap-2 px-4 py-2 pl-12 text-sm ${
                        s.fit ? "bg-success-soft/40" : ""
                      }`}
                    >
                      <div className="truncate text-foreground">{s.subtema}</div>
                      <div className="text-right tabular-nums">{formatNumber(s.projetos)}</div>
                      <div className="text-right tabular-nums">{formatBRL(s.valor)}</div>
                      <div className="text-center">
                        {s.fit ? (
                          <Check className="mx-auto h-4 w-4 text-success" />
                        ) : (
                          <Minus className="mx-auto h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className={`text-right tabular-nums ${s.sem_ict > 0 ? "text-warning font-semibold" : "text-muted-foreground"}`}>
                        {s.sem_ict || "—"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
