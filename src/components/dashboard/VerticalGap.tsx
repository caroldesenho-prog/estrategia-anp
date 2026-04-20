import { GapVerticalRow } from "@/types/dashboard";
import { formatBRL, formatNumber } from "@/lib/format";

interface Props { data: GapVerticalRow[]; }

export const VerticalGap = ({ data }: Props) => {
  const rows = [...data].sort((a, b) => b.valor_gap - a.valor_gap);
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-2.5">Operadora</th>
            <th className="px-4 py-2.5 text-right">Projetos sem ICT</th>
            <th className="px-4 py-2.5 text-right">Valor do gap</th>
            <th className="px-4 py-2.5 text-right">% gap</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((r) => (
            <tr key={r.operadora} className="hover:bg-muted/30">
              <td className="px-4 py-2.5 font-semibold text-foreground">{r.operadora}</td>
              <td className="px-4 py-2.5 text-right tabular-nums">{formatNumber(r.proj_gap)}</td>
              <td className="px-4 py-2.5 text-right font-semibold tabular-nums text-foreground">{formatBRL(r.valor_gap)}</td>
              <td className="px-4 py-2.5 text-right">
                <span className="inline-flex rounded-full bg-warning-soft px-2 py-0.5 text-xs font-semibold text-warning">
                  {r.pct_gap.toFixed(1).replace(".", ",")}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
