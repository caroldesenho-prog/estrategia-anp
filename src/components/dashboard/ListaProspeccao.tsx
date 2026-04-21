import { useMemo, useState } from "react";
import { ProspeccaoItem } from "@/types/dashboard";
import { KpiCards } from "./KpiCards";
import { Briefcase, Wallet, Target, Handshake } from "lucide-react";
import { formatBRL, formatNumber } from "@/lib/format";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 20;

const tipoBadge = (tipo: string) => {
  const t = tipo.toUpperCase();
  if (t.includes("METROLOGIA"))
    return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300";
  if (t.includes("PDI"))
    return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300";
  return "bg-muted text-muted-foreground border-border";
};

const Pager = ({ page, total, onChange }: { page: number; total: number; onChange: (p: number) => void }) => {
  if (total <= 1) return null;
  return (
    <div className="mt-3 flex items-center justify-end gap-2 text-sm">
      <span className="text-muted-foreground">
        Página {page + 1} de {total}
      </span>
      <Button variant="outline" size="sm" onClick={() => onChange(Math.max(0, page - 1))} disabled={page === 0}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onChange(Math.min(total - 1, page + 1))}
        disabled={page >= total - 1}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

interface Props {
  data: ProspeccaoItem[];
}

export const ListaProspeccao = ({ data }: Props) => {
  const [page1, setPage1] = useState(0);
  const [page2, setPage2] = useState(0);

  const stats = useMemo(() => {
    const total = data.length;
    const valor = data.reduce((s, x) => s + (x.valor || 0), 0);
    const e1 = data.filter((x) => x.estrategia === 1);
    const e2 = data.filter((x) => x.estrategia === 2);
    const leonardo = data.filter((x) => x.lider === "Leonardo Andrade");
    const alex = data.filter((x) => x.lider === "Alex Charles");
    const sumVal = (arr: ProspeccaoItem[]) => arr.reduce((s, x) => s + (x.valor || 0), 0);
    const areas = (arr: ProspeccaoItem[]) => new Set(arr.map((x) => x.area_da_vertical)).size;
    return {
      total,
      valor,
      e1Count: e1.length,
      e1Valor: sumVal(e1),
      e2Count: e2.length,
      e2Valor: sumVal(e2),
      leonardo: { opp: leonardo.length, valor: sumVal(leonardo), areas: areas(leonardo) },
      alex: { opp: alex.length, valor: sumVal(alex), areas: areas(alex) },
      e1List: [...e1].sort((a, b) => b.valor - a.valor),
      e2List: [...e2].sort((a, b) => b.valor - a.valor),
    };
  }, [data]);

  const e1Pages = Math.max(1, Math.ceil(stats.e1List.length / PAGE_SIZE));
  const e2Pages = Math.max(1, Math.ceil(stats.e2List.length / PAGE_SIZE));
  const e1Page = stats.e1List.slice(page1 * PAGE_SIZE, (page1 + 1) * PAGE_SIZE);
  const e2Page = stats.e2List.slice(page2 * PAGE_SIZE, (page2 + 1) * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Oportunidades concretas mapeadas para a vertical, segmentadas por estratégia de aproximação. Cada item indica
        operadora-alvo, líder responsável e tipo de produto a ofertar.
      </p>

      <KpiCards
        items={[
          { label: "Total de oportunidades", value: formatNumber(stats.total), icon: Briefcase },
          { label: "Valor endereçável", value: formatBRL(stats.valor), icon: Wallet, tone: "bg-primary-soft text-primary" },
          {
            label: "Estratégia 1 (ICT principal)",
            value: formatNumber(stats.e1Count),
            sub: formatBRL(stats.e1Valor),
            icon: Target,
            tone: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
          },
          {
            label: "Estratégia 2 (Coexecução)",
            value: formatNumber(stats.e2Count),
            sub: formatBRL(stats.e2Valor),
            icon: Handshake,
            tone: "bg-success-soft text-success",
          },
        ]}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="card-shadow rounded-xl border border-border bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Líder</p>
          <p className="mt-1 text-lg font-bold text-foreground">Leonardo Andrade</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Grupo: <span className="font-medium text-foreground">Manufatura Avançada</span> · {stats.leonardo.areas} áreas
          </p>
          <div className="mt-3 flex items-center gap-4 text-sm">
            <span className="font-semibold text-foreground">{formatNumber(stats.leonardo.opp)} opp</span>
            <span className="font-semibold text-primary">{formatBRL(stats.leonardo.valor)}</span>
          </div>
        </div>
        <div className="card-shadow rounded-xl border border-border bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Líder</p>
          <p className="mt-1 text-lg font-bold text-foreground">Alex Charles</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Grupo: <span className="font-medium text-foreground">Metalmecânica & Metrologia</span> · {stats.alex.areas} áreas
          </p>
          <div className="mt-3 flex items-center gap-4 text-sm">
            <span className="font-semibold text-foreground">{formatNumber(stats.alex.opp)} opp</span>
            <span className="font-semibold text-primary">{formatBRL(stats.alex.valor)}</span>
          </div>
        </div>
      </div>

      {/* Estratégia 1 */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center gap-3 border-b border-border px-5 py-3">
          <Badge className="bg-blue-600 text-white hover:bg-blue-600">Estratégia 1 — Virar ICT principal</Badge>
          <span className="text-sm text-muted-foreground">{stats.e1List.length} oportunidades</span>
        </div>
        <div className="overflow-x-auto p-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Operadora</TableHead>
                <TableHead>Área da vertical</TableHead>
                <TableHead>Líder da área</TableHead>
                <TableHead>Competência da vertical</TableHead>
                <TableHead>Tipo de produto</TableHead>
                <TableHead>Qualificação</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {e1Page.map((it, i) => (
                <TableRow key={`e1-${page1}-${i}`}>
                  <TableCell className="font-medium">{it.operadora}</TableCell>
                  <TableCell>{it.area_da_vertical}</TableCell>
                  <TableCell>{it.lider}</TableCell>
                  <TableCell className="max-w-[280px] text-xs text-muted-foreground">
                    {it.competencias_vertical.slice(0, 2).join(" · ")}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={tipoBadge(it.tipo_produto)}>
                      {it.tipo_produto}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">{it.qualificacao}</TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">{formatBRL(it.valor)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="px-5 pb-3">
          <Pager page={page1} total={e1Pages} onChange={setPage1} />
        </div>
      </div>

      {/* Estratégia 2 */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center gap-3 border-b border-border px-5 py-3">
          <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
            Estratégia 2 — Coexecução com empresa BR
          </Badge>
          <span className="text-sm text-muted-foreground">{stats.e2List.length} oportunidades</span>
        </div>
        <div className="overflow-x-auto p-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Operadora</TableHead>
                <TableHead>Área da vertical</TableHead>
                <TableHead>Líder da área</TableHead>
                <TableHead>Empresa parceira</TableHead>
                <TableHead>Competência da vertical</TableHead>
                <TableHead>Tipo de produto</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {e2Page.map((it, i) => (
                <TableRow key={`e2-${page2}-${i}`}>
                  <TableCell className="font-medium">{it.operadora}</TableCell>
                  <TableCell>{it.area_da_vertical}</TableCell>
                  <TableCell>{it.lider}</TableCell>
                  <TableCell className="font-medium text-blue-600 dark:text-blue-400">{it.empresa_parceira}</TableCell>
                  <TableCell className="max-w-[260px] text-xs text-muted-foreground">
                    {it.competencias_vertical.slice(0, 2).join(" · ")}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={tipoBadge(it.tipo_produto)}>
                      {it.tipo_produto}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">{formatBRL(it.valor)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="px-5 pb-3">
          <Pager page={page2} total={e2Pages} onChange={setPage2} />
        </div>
      </div>

      <p className="rounded-lg border border-border bg-muted/40 p-4 text-xs leading-relaxed text-muted-foreground">
        <strong className="text-foreground">Estratégia 1</strong> → agente aciona o líder da área e juntos abordam a
        operadora diretamente. <strong className="text-foreground">Estratégia 2</strong> → agente contata primeiro a
        empresa parceira — ela já tem o relacionamento com a operadora e o instituto entra como ICT na coexecução.
      </p>
    </div>
  );
};
