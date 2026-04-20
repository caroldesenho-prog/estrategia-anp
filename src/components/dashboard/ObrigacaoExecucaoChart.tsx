import { ObrigacaoExecucao } from "@/types/dashboard";
import { formatBRL } from "@/lib/format";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface Props { data: ObrigacaoExecucao[]; }

const Tip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-semibold text-foreground">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="text-muted-foreground">
          <span className="inline-block h-2 w-2 rounded-sm mr-1.5" style={{ backgroundColor: p.color }} />
          {p.name}: <span className="font-medium text-foreground">{formatBRL(p.value)}</span>
        </p>
      ))}
    </div>
  );
};

export const ObrigacaoExecucaoChart = ({ data }: Props) => {
  const sorted = [...data].sort((a, b) => b.obrigacao - a.obrigacao);
  return (
    <div style={{ width: "100%", height: Math.max(360, sorted.length * 36) }}>
      <ResponsiveContainer>
        <BarChart data={sorted} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
          <CartesianGrid horizontal={false} stroke="hsl(var(--border))" />
          <XAxis type="number" tickFormatter={(v) => `${(v / 1e9).toFixed(1)} bi`} stroke="hsl(var(--muted-foreground))" fontSize={11} />
          <YAxis type="category" dataKey="operadora" stroke="hsl(var(--muted-foreground))" fontSize={11} width={130} />
          <Tooltip content={<Tip />} cursor={{ fill: "hsl(var(--muted))" }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="obrigacao" name="Obrigação" fill="#1F4E79" radius={[0, 3, 3, 0]} />
          <Bar dataKey="executado" name="Executado" fill="#1D9E75" radius={[0, 3, 3, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
