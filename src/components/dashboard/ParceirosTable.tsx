import { useMemo, useState } from "react";
import { ParceiroRow } from "@/types/dashboard";
import { formatBRL, formatNumber } from "@/lib/format";
import { Search } from "lucide-react";

interface Props { data: ParceiroRow[]; }

const recurrenceBadge = (n: number) => {
  if (n >= 5) return { label: "Alta", cls: "bg-success-soft text-success" };
  if (n >= 2) return { label: "Média", cls: "bg-warning-soft text-warning" };
  return { label: "Baixa", cls: "bg-neutral-soft text-neutral" };
};

export const ParceirosTable = ({ data }: Props) => {
  const [q, setQ] = useState("");
  const rows = useMemo(() => {
    const filtered = q
      ? data.filter((r) =>
          r.empresa.toLowerCase().includes(q.toLowerCase()) ||
          r.operadoras.some((o) => o.toLowerCase().includes(q.toLowerCase())),
        )
      : data;
    return [...filtered].sort((a, b) => b.valor - a.valor);
  }, [data, q]);

  return (
    <div>
      <div className="mb-3 relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filtrar por empresa ou operadora…"
          className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5">Empresa brasileira</th>
              <th className="px-4 py-2.5 text-right">Nº projetos</th>
              <th className="px-4 py-2.5 text-right">Valor total</th>
              <th className="px-4 py-2.5">Operadoras parceiras</th>
              <th className="px-4 py-2.5">Recorrência</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r) => {
              const b = recurrenceBadge(r.projetos);
              return (
                <tr key={r.empresa} className="hover:bg-muted/30">
                  <td className="px-4 py-2.5 font-medium text-foreground">{r.empresa}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{formatNumber(r.projetos)}</td>
                  <td className="px-4 py-2.5 text-right font-semibold tabular-nums text-foreground">
                    {formatBRL(r.valor)}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex flex-wrap gap-1">
                      {r.operadoras.map((o) => (
                        <span key={o} className="rounded bg-primary-soft px-1.5 py-0.5 text-[11px] font-medium text-primary">
                          {o}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${b.cls}`}>
                      {b.label}
                    </span>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  Nenhum parceiro encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
