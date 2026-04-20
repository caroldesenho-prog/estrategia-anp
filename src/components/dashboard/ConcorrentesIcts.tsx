import { ConcorrenteRow, HeatmapData } from "@/types/dashboard";
import { formatBRL, formatNumber } from "@/lib/format";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface Props { concorrentes: ConcorrenteRow[]; heatmap: HeatmapData; }

const TooltipBar = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as ConcorrenteRow;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-foreground">{d.ict}</p>
      <p className="text-muted-foreground">Projetos: <span className="font-medium text-foreground">{formatNumber(d.projetos)}</span></p>
      <p className="text-muted-foreground">Valor: <span className="font-medium text-foreground">{formatBRL(d.valor)}</span></p>
      <p className="text-muted-foreground">Operadoras: <span className="font-medium text-foreground">{d.num_operadoras}</span></p>
    </div>
  );
};

export const ConcorrentesIcts = ({ concorrentes, heatmap }: Props) => {
  const sorted = [...concorrentes].slice(0, 12).sort((a, b) => b.projetos - a.projetos);

  // heatmap: find max for normalization
  const max = Math.max(
    ...heatmap.dados.flatMap((row) =>
      heatmap.operadoras.map((op) => Number(row[op] || 0)),
    ),
    1,
  );

  const cellColor = (v: number) => {
    if (!v) return "hsl(var(--muted))";
    const intensity = Math.max(0.15, v / max);
    return `hsl(210 59% ${Math.round(85 - intensity * 55)}%)`;
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Ranking de ICTs (projetos)</h3>
        <div style={{ width: "100%", height: Math.max(320, sorted.length * 26) }}>
          <ResponsiveContainer>
            <BarChart data={sorted} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 4 }}>
              <CartesianGrid horizontal={false} stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis type="category" dataKey="ict" stroke="hsl(var(--muted-foreground))" fontSize={11} width={100} />
              <Tooltip content={<TooltipBar />} cursor={{ fill: "hsl(var(--primary-soft))" }} />
              <Bar dataKey="projetos" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Heatmap ICT × Operadora (projetos)</h3>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted/50">
                <th className="sticky left-0 z-10 bg-muted/50 px-3 py-2 text-left font-semibold text-muted-foreground">ICT</th>
                {heatmap.operadoras.map((op) => (
                  <th key={op} className="px-2 py-2 text-center font-semibold text-muted-foreground">
                    {op}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatmap.dados.map((row) => (
                <tr key={row.ict as string} className="border-t border-border">
                  <td className="sticky left-0 z-10 bg-card px-3 py-1.5 font-medium text-foreground">
                    {row.ict}
                  </td>
                  {heatmap.operadoras.map((op) => {
                    const v = Number(row[op] || 0);
                    const bg = cellColor(v);
                    const fg = v / max > 0.5 ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))";
                    return (
                      <td key={op} className="p-1 text-center">
                        <div
                          title={`${row.ict} × ${op}: ${v} projetos`}
                          className="mx-auto flex h-9 w-full min-w-[44px] items-center justify-center rounded font-semibold tabular-nums transition-transform hover:scale-105"
                          style={{ backgroundColor: bg, color: fg }}
                        >
                          {v || "—"}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
