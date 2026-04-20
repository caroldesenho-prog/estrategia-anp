import { TaxaIctRow } from "@/types/dashboard";
import { formatNumber } from "@/lib/format";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface Props { data: TaxaIctRow[]; }

const COLORS = {
  com_ict: "#1D9E75",
  com_eb: "#EF9F27",
  sem_nenhum: "#E24B4A",
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s: number, p: any) => s + p.value, 0);
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-semibold text-foreground">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="text-muted-foreground">
          <span className="inline-block h-2 w-2 rounded-sm mr-1.5" style={{ backgroundColor: p.color }} />
          {p.name}: <span className="font-medium text-foreground">{formatNumber(p.value)}</span>
          <span className="ml-1 text-muted-foreground">({((p.value / total) * 100).toFixed(0)}%)</span>
        </p>
      ))}
    </div>
  );
};

export const TaxaIctChart = ({ data }: Props) => {
  const sorted = [...data].sort((a, b) => b.total - a.total);
  return (
    <div style={{ width: "100%", height: Math.max(360, sorted.length * 32) }}>
      <ResponsiveContainer>
        <BarChart data={sorted} layout="vertical" stackOffset="expand" margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
          <CartesianGrid horizontal={false} stroke="hsl(var(--border))" />
          <XAxis type="number" tickFormatter={(v) => `${Math.round(v * 100)}%`} stroke="hsl(var(--muted-foreground))" fontSize={11} />
          <YAxis type="category" dataKey="operadora" stroke="hsl(var(--muted-foreground))" fontSize={11} width={130} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))" }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="com_ict" stackId="a" name="Com ICT" fill={COLORS.com_ict} />
          <Bar dataKey="com_eb" stackId="a" name="Com empresa BR sem ICT" fill={COLORS.com_eb} />
          <Bar dataKey="sem_nenhum" stackId="a" name="Sem nenhum" fill={COLORS.sem_nenhum} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
