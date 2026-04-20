import { GapOperadora as GapRow, ObrigacaoExecucao } from "@/types/dashboard";
import { formatBRL, formatNumber, formatPct } from "@/lib/format";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface Props { obrigVsExec: ObrigacaoExecucao[]; gaps: GapRow[]; }

const TooltipStack = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-semibold text-foreground">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="text-muted-foreground">
          <span style={{ color: p.color }}>■</span> {p.dataKey}:{" "}
          <span className="font-medium text-foreground">{formatBRL(p.value)}</span>
        </p>
      ))}
    </div>
  );
};

export const GapOperadoraSection = ({ obrigVsExec, gaps }: Props) => {
  const top12 = [...obrigVsExec].sort((a, b) => b.executado - a.executado).slice(0, 12).reverse();
  // reverse so the largest renders at the top of a vertical bar chart
  const top12Display = [...top12].reverse();
  const sortedGaps = [...gaps].sort((a, b) => b.valor_gap - a.valor_gap);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Obrigação vs executado (top 12)</h3>
        <div style={{ width: "100%", height: Math.max(360, top12.length * 30) }}>
          <ResponsiveContainer>
            <BarChart data={top12} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 4 }}>
              <CartesianGrid horizontal={false} stroke="hsl(var(--border))" />
              <XAxis
                type="number"
                tickFormatter={(v) => `${(v / 1e9).toFixed(1)} bi`}
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
              />
              <YAxis type="category" dataKey="operadora" stroke="hsl(var(--muted-foreground))" fontSize={11} width={110} />
              <Tooltip content={<TooltipStack />} cursor={{ fill: "hsl(var(--primary-soft))" }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="obrigacao" fill="hsl(var(--neutral))" radius={[0, 0, 0, 0]} />
              <Bar dataKey="executado" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Gap quente · oportunidades sem ICT</h3>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-2.5">Operadora</th>
                <th className="px-3 py-2.5 text-right">Proj. gap</th>
                <th className="px-3 py-2.5 text-right">Valor oportunidade</th>
                <th className="px-3 py-2.5 text-right">% gap</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sortedGaps.map((g) => (
                <tr key={g.operadora} className="hover:bg-muted/30">
                  <td className="px-3 py-2.5 font-medium text-foreground">{g.operadora}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">
                    {formatNumber(g.proj_gap)} <span className="text-muted-foreground">/ {formatNumber(g.proj_total)}</span>
                  </td>
                  <td className="px-3 py-2.5 text-right font-bold tabular-nums text-warning">
                    {formatBRL(g.valor_gap)}
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <span className="inline-flex items-center rounded-full bg-warning-soft px-2 py-0.5 text-xs font-semibold text-warning tabular-nums">
                      {formatPct(g.pct_gap)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
