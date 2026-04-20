import { CrescimentoSubtema } from "@/types/dashboard";
import { formatBRL, formatNumber } from "@/lib/format";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Props { data: CrescimentoSubtema[]; }

export const VerticalCrescimento = ({ data }: Props) => {
  const rows = [...data].sort((a, b) => b.valor_atual - a.valor_atual).slice(0, 10);
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-2.5">Subtema ANP</th>
            <th className="px-4 py-2.5 text-right">Projetos</th>
            <th className="px-4 py-2.5 text-right">Valor atual</th>
            <th className="px-4 py-2.5 text-right">Valor anterior</th>
            <th className="px-4 py-2.5 text-right">Crescimento</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((r) => {
            const up = r.crescimento > 5;
            const down = r.crescimento < -5;
            const Icon = up ? TrendingUp : down ? TrendingDown : Minus;
            const tone = up ? "text-success bg-success-soft" : down ? "text-destructive bg-destructive/10" : "text-muted-foreground bg-muted";
            const display = Math.abs(r.crescimento) > 999 ? `${(r.crescimento / 100).toFixed(0)}×` : `${r.crescimento.toFixed(0)}%`;
            return (
              <tr key={r.subtema} className="hover:bg-muted/30">
                <td className="px-4 py-2.5 font-medium text-foreground">{r.subtema}</td>
                <td className="px-4 py-2.5 text-right tabular-nums">{formatNumber(r.projetos)}</td>
                <td className="px-4 py-2.5 text-right font-semibold tabular-nums text-foreground">{formatBRL(r.valor_atual)}</td>
                <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">{formatBRL(r.valor_anterior)}</td>
                <td className="px-4 py-2.5 text-right">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${tone}`}>
                    <Icon className="h-3 w-3" />
                    {display}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
