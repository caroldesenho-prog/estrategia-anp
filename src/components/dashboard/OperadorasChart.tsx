import { OperadoraRow } from "@/types/dashboard";
import { formatBRL, formatNumber } from "@/lib/format";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface Props { data: OperadoraRow[]; }

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as OperadoraRow;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-foreground">{d.operadora}</p>
      <p className="text-muted-foreground">Volume: <span className="font-medium text-foreground">{formatBRL(d.total)}</span></p>
      <p className="text-muted-foreground">Projetos: <span className="font-medium text-foreground">{formatNumber(d.projetos)}</span></p>
    </div>
  );
};

export const OperadorasChart = ({ data }: Props) => {
  const sorted = [...data].sort((a, b) => b.total - a.total);
  return (
    <div style={{ width: "100%", height: Math.max(360, sorted.length * 28) }}>
      <ResponsiveContainer>
        <BarChart data={sorted} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
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
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--primary-soft))" }} />
          <Bar dataKey="total" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
