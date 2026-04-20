import { useState, useEffect, useMemo } from "react";
import { ObrigacaoExecucao } from "@/types/dashboard";
import { formatBRL } from "@/lib/format";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  data: ObrigacaoExecucao[];
}

const COLOR_OBR = "#1F4E79";
const COLOR_EXEC = "#1D9E75";
const COLOR_OVER = "#E67E22";
const COLOR_UNDER = "#A32D2D";

const Tip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload as ObrigacaoExecucao;
  const pct = row.saldo_pct;
  let pctColor = "hsl(var(--foreground))";
  let nota: string | null = null;
  if (pct > 100) {
    pctColor = COLOR_OVER;
    nota = "inclui obrigações de anos anteriores";
  } else if (pct < 50) {
    pctColor = COLOR_UNDER;
    nota = "obrigação subutilizada";
  }
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-semibold text-foreground">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="text-muted-foreground">
          <span
            className="mr-1.5 inline-block h-2 w-2 rounded-sm"
            style={{ backgroundColor: p.color }}
          />
          {p.name}: <span className="font-medium text-foreground">{formatBRL(p.value)}</span>
        </p>
      ))}
      <p className="mt-1.5 border-t border-border pt-1.5">
        <span className="text-muted-foreground">% execução: </span>
        <span className="font-semibold tabular-nums" style={{ color: pctColor }}>
          {pct.toFixed(1)}%
        </span>
      </p>
      {nota && (
        <p className="mt-0.5 text-[11px] italic" style={{ color: pctColor }}>
          {nota}
        </p>
      )}
    </div>
  );
};

export const ObrigacaoExecucaoChart = ({ data }: Props) => {
  const sorted = useMemo(
    () => [...data].sort((a, b) => b.obrigacao_total - a.obrigacao_total),
    [data],
  );

  const defaultOp =
    sorted.find((d) => d.operadora.toUpperCase().startsWith("PETROBRAS"))?.operadora ??
    sorted[0]?.operadora ??
    "";

  const [selected, setSelected] = useState<string>(defaultOp);

  // Reset selection when data set changes (period toggle)
  useEffect(() => {
    setSelected(defaultOp);
  }, [defaultOp]);

  const selectedRow = sorted.find((d) => d.operadora === selected) ?? sorted[0];

  const evolucao = useMemo(() => {
    if (!selectedRow) return [];
    const map = new Map<number, { ano: number; obrigacao: number; execucao: number }>();
    selectedRow.obrigacao_por_ano.forEach((p) => {
      map.set(p.ano, { ano: p.ano, obrigacao: p.valor, execucao: 0 });
    });
    selectedRow.execucao_por_ano.forEach((p) => {
      const prev = map.get(p.ano) ?? { ano: p.ano, obrigacao: 0, execucao: 0 };
      prev.execucao = p.valor;
      map.set(p.ano, prev);
    });
    return [...map.values()].sort((a, b) => a.ano - b.ano);
  }, [selectedRow]);

  return (
    <div className="space-y-6">
      {/* Main bar chart */}
      <div style={{ width: "100%", height: Math.max(360, sorted.length * 36) }}>
        <ResponsiveContainer>
          <BarChart
            data={sorted}
            layout="vertical"
            margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
            onClick={(e: any) => {
              const op = e?.activePayload?.[0]?.payload?.operadora;
              if (op) setSelected(op);
            }}
          >
            <CartesianGrid horizontal={false} stroke="hsl(var(--border))" />
            <XAxis
              type="number"
              tickFormatter={(v) => `${(v / 1e9).toFixed(1)} bi`}
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
            />
            <YAxis
              type="category"
              dataKey="operadora"
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              width={130}
            />
            <Tooltip content={<Tip />} cursor={{ fill: "hsl(var(--muted))" }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar
              dataKey="obrigacao_total"
              name="Obrigação"
              fill={COLOR_OBR}
              radius={[0, 3, 3, 0]}
              cursor="pointer"
            />
            <Bar
              dataKey="executado_total"
              name="Executado"
              fill={COLOR_EXEC}
              radius={[0, 3, 3, 0]}
              cursor="pointer"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Secondary line chart */}
      <div className="rounded-md border border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground">
            Evolução anual — {selectedRow?.operadora ?? "—"}
          </h4>
          <span className="text-[11px] text-muted-foreground">
            Clique em uma barra acima para trocar a operadora
          </span>
        </div>
        <div style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer>
            <LineChart data={evolucao} margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
              <XAxis
                dataKey="ano"
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
              />
              <YAxis
                tickFormatter={(v) => `${(v / 1e9).toFixed(1)} bi`}
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 6,
                  fontSize: 12,
                }}
                formatter={(v: number, name: string) => [formatBRL(v), name]}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="obrigacao"
                name="Obrigação"
                stroke={COLOR_OBR}
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="execucao"
                name="Execução"
                stroke={COLOR_EXEC}
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
