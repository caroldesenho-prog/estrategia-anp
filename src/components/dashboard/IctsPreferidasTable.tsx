import { IctPorOperadora } from "@/types/dashboard";
import { formatBRL } from "@/lib/format";

interface Props { data: IctPorOperadora[]; }

export const IctsPreferidasTable = ({ data }: Props) => {
  const rows = [...data].sort((a, b) => b.volume - a.volume);
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-2.5">Operadora</th>
            <th className="px-4 py-2.5 text-right">Volume</th>
            <th className="px-4 py-2.5">ICT #1</th>
            <th className="px-4 py-2.5">ICT #2</th>
            <th className="px-4 py-2.5">ICT #3</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((r) => (
            <tr key={r.operadora} className="hover:bg-muted/30">
              <td className="px-4 py-2.5 font-semibold text-foreground">{r.operadora}</td>
              <td className="px-4 py-2.5 text-right font-medium tabular-nums">{formatBRL(r.volume)}</td>
              <td className="px-4 py-2.5 text-foreground">{r.ict1 || "—"}</td>
              <td className="px-4 py-2.5 text-muted-foreground">{r.ict2 || "—"}</td>
              <td className="px-4 py-2.5 text-muted-foreground">{r.ict3 || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
