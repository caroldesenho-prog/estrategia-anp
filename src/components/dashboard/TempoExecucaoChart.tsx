import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TempoExecucaoOperadora } from "@/types/dashboard";
import { formatNumber } from "@/lib/format";

interface Props {
  data: TempoExecucaoOperadora[];
}

const COLOR_PRAZO = "#1F4E79";
const COLOR_ANDAMENTO = "#EF9F27";
const COLOR_CONCLUIDO = "#1D9E75";

export const TempoExecucaoChart = ({ data }: Props) => {
  const sortedPrazo = [...data].sort((a, b) => b.prazo_medio_geral - a.prazo_medio_geral);
  const statusData = [...data]
    .sort((a, b) => b.total_projetos - a.total_projetos)
    .map((d) => ({
      operadora: d.operadora,
      em_andamento: d.projetos_em_andamento,
      concluidos: d.projetos_concluidos,
      total: d.projetos_em_andamento + d.projetos_concluidos,
    }));

  const height = Math.max(260, data.length * 28);

  return (
    <div className="space-y-4">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Prazo médio */}
        <div className="rounded-md border border-border bg-card p-4">
          <h4 className="mb-3 text-sm font-semibold text-foreground">
            Prazo médio dos projetos (meses)
          </h4>
          <ResponsiveContainer width="100%" height={height}>
            <BarChart
              data={sortedPrazo}
              layout="vertical"
              margin={{ top: 4, right: 36, left: 8, bottom: 4 }}
            >
              <CartesianGrid horizontal={false} stroke="hsl(var(--border))" />
              <XAxis
                type="number"
                domain={[0, 50]}
                tickCount={6}
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
              />
              <YAxis
                type="category"
                dataKey="operadora"
                width={110}
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 6,
                  fontSize: 12,
                }}
                formatter={(v: number) => [`${v.toFixed(1)} meses`, "Prazo médio"]}
              />
              <Bar dataKey="prazo_medio_geral" fill={COLOR_PRAZO} radius={[0, 3, 3, 0]}>
                <LabelList
                  dataKey="prazo_medio_geral"
                  position="right"
                  formatter={(v: number) => `${v.toFixed(1)}m`}
                  style={{ fill: "hsl(var(--foreground))", fontSize: 11, fontWeight: 600 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status */}
        <div className="rounded-md border border-border bg-card p-4">
          <h4 className="mb-3 text-sm font-semibold text-foreground">Status dos projetos</h4>
          <ResponsiveContainer width="100%" height={height}>
            <BarChart
              data={statusData}
              layout="vertical"
              margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
              stackOffset="expand"
            >
              <CartesianGrid horizontal={false} stroke="hsl(var(--border))" />
              <XAxis
                type="number"
                tickFormatter={(v: number) => `${Math.round(v * 100)}%`}
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
              />
              <YAxis
                type="category"
                dataKey="operadora"
                width={110}
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 6,
                  fontSize: 12,
                }}
                formatter={(v: number, name: string, item) => {
                  const row = item.payload as { total: number };
                  const pct = row.total ? (v / row.total) * 100 : 0;
                  const label = name === "em_andamento" ? "Em andamento" : "Concluídos";
                  return [`${formatNumber(v)} (${pct.toFixed(1)}%)`, label];
                }}
              />
              <Bar dataKey="em_andamento" stackId="s" fill={COLOR_ANDAMENTO} />
              <Bar dataKey="concluidos" stackId="s" fill={COLOR_CONCLUIDO} radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 flex items-center justify-end gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: COLOR_ANDAMENTO }} />
              Em andamento
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: COLOR_CONCLUIDO }} />
              Concluídos
            </span>
          </div>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Projetos "em andamento" são aqueles cujo prazo estimado de conclusão (data início + prazo em meses) ainda não foi atingido em 2025.
      </p>
    </div>
  );
};
