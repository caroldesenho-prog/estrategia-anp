import { LabRow, SubtemaFitRow, Vertical } from "@/types/dashboard";
import { formatBRL, formatNumber, formatPct } from "@/lib/format";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";

interface Props {
  subtemas: SubtemaFitRow[];
  labs: LabRow[];
  vertical: Vertical;
  labMap: Record<string, string[]>;
}

const TooltipSub = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as SubtemaFitRow;
  const gap = d.projetos ? (d.sem_ict / d.projetos) * 100 : 0;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-foreground">{d.subtema}</p>
      <p className="text-muted-foreground">Valor: <span className="font-medium text-foreground">{formatBRL(d.valor)}</span></p>
      <p className="text-muted-foreground">Projetos: <span className="font-medium text-foreground">{formatNumber(d.projetos)}</span></p>
      <p className="text-warning">Sem ICT: {d.sem_ict} ({formatPct(gap)})</p>
    </div>
  );
};

export const FitVertical = ({ subtemas, labs, vertical, labMap }: Props) => {
  const filteredLabs = labs.filter((l) => l.vertical === vertical);
  const sorted = [...subtemas].sort((a, b) => a.valor - b.valor);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">
          Top 10 subtemas ANP com fit · {vertical}
        </h3>
        <div style={{ width: "100%", height: Math.max(360, sorted.length * 36) }}>
          <ResponsiveContainer>
            <BarChart data={sorted} layout="vertical" margin={{ top: 4, right: 24, left: 4, bottom: 4 }}>
              <CartesianGrid horizontal={false} stroke="hsl(var(--border))" />
              <XAxis
                type="number"
                tickFormatter={(v) => `${(v / 1e6).toFixed(0)} mi`}
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
              />
              <YAxis
                type="category"
                dataKey="subtema"
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                width={180}
                tickFormatter={(v: string) => (v.length > 28 ? v.slice(0, 26) + "…" : v)}
              />
              <Tooltip content={<TooltipSub />} cursor={{ fill: "hsl(var(--primary-soft))" }} />
              <Bar dataKey="valor" radius={[0, 4, 4, 0]}>
                {sorted.map((d, i) => {
                  const gap = d.projetos ? d.sem_ict / d.projetos : 0;
                  const fill = gap >= 0.5 ? "hsl(var(--warning))" : gap >= 0.25 ? "hsl(var(--primary))" : "hsl(var(--success))";
                  return <Cell key={i} fill={fill} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-sm bg-success" />Gap baixo (&lt;25%)</span>
          <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-sm bg-primary" />Gap médio</span>
          <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-sm bg-warning" />Gap alto (≥50%)</span>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Laboratórios do instituto · {vertical}</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {filteredLabs.map((lab) => (
            <div key={lab.lab} className="rounded-lg border border-border bg-background p-4">
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-semibold text-foreground">{lab.lab}</h4>
                <span className="rounded bg-success-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-success">
                  Fit
                </span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">Endereçável</p>
                  <p className="font-bold text-foreground">{formatBRL(lab.valor)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Projetos</p>
                  <p className="font-bold text-foreground">{formatNumber(lab.projetos)}</p>
                </div>
              </div>
              {labMap[lab.lab] && (
                <div className="mt-3">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Subtemas ANP mapeados
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {labMap[lab.lab].map((s) => (
                      <span key={s} className="rounded bg-primary-soft px-1.5 py-0.5 text-[10px] font-medium text-primary">
                        {s.length > 40 ? s.slice(0, 38) + "…" : s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          {filteredLabs.length === 0 && (
            <p className="col-span-2 text-sm text-muted-foreground">Nenhum laboratório mapeado para esta vertical.</p>
          )}
        </div>
      </div>
    </div>
  );
};
