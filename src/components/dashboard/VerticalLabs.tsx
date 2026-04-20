import { LabRow } from "@/types/dashboard";
import { formatBRL, formatNumber } from "@/lib/format";
import { FlaskConical } from "lucide-react";

interface Props { data: LabRow[]; cor: string; }

export const VerticalLabs = ({ data, cor }: Props) => {
  const sorted = [...data].sort((a, b) => b.valor - a.valor);
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {sorted.map((lab) => (
        <div key={lab.lab} className="card-shadow rounded-xl border border-border bg-card p-4">
          <div className="mb-3 flex items-start gap-3">
            <div className="rounded-md p-2" style={{ backgroundColor: `${cor}15`, color: cor }}>
              <FlaskConical className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-semibold text-foreground">{lab.lab}</h4>
              <p className="mt-0.5 text-lg font-bold tabular-nums" style={{ color: cor }}>
                {formatBRL(lab.valor)}
              </p>
              <p className="text-xs text-muted-foreground">{formatNumber(lab.projetos)} projetos endereçáveis</p>
            </div>
          </div>
          <div className="border-t border-border pt-3">
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Subtemas ANP mapeados
            </p>
            <ul className="space-y-1">
              {lab.subtemas.map((s) => (
                <li key={s} className="flex items-start gap-1.5 text-xs text-foreground">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full" style={{ backgroundColor: cor }} />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};
