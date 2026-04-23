import { useMemo, useState } from "react";
import { ProspeccaoItem } from "@/types/dashboard";
import { KpiCards } from "./KpiCards";
import { Briefcase, Wallet, Target, Handshake } from "lucide-react";
import { formatBRL, formatNumber } from "@/lib/format";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const PAGE_SIZE = 20;

const truncate = (s: string, n = 60) => (s && s.length > n ? s.slice(0, n).trimEnd() + "…" : s || "");

const TituloCell = ({ titulo }: { titulo: string }) => (
  <TooltipProvider delayDuration={150}>
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="block max-w-[280px] cursor-help truncate text-[11px] text-graphite-dark">
          {truncate(titulo, 60)}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-md text-xs">
        {titulo}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const normalizeTipo = (tipo: string): string => {
  if (!tipo) return tipo;
  const t = tipo.toUpperCase();
  if (t.includes("METROLOGIA")) return "Metrologia";
  const hasPdi = t.includes("PDI");
  const hasServ = t.includes("SERVI");
  if (hasPdi && hasServ) return "PDI e Serviços";
  if (hasPdi) return "PDI";
  if (hasServ) return "Serviços";
  return tipo;
};

const TIPO_ORDER = ["PDI", "Serviços", "PDI e Serviços", "Metrologia"];

const tipoBadge = (tipo: string) => {
  const t = normalizeTipo(tipo).toUpperCase();
  if (t.includes("METROLOGIA"))
    return "border-transparent bg-bordeaux-soft text-bordeaux";
  if (t.includes("PDI"))
    return "border-transparent bg-primary-soft text-primary";
  return "border-transparent bg-beige-light text-graphite-dark";
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
  const [tipoFiltro, setTipoFiltro] = useState<string[]>([]);

  const tiposDisponiveis = useMemo(() => {
    const set = new Set(data.map((x) => normalizeTipo(x.tipo_produto)).filter(Boolean));
    return TIPO_ORDER.filter((t) => set.has(t));
  }, [data]);

  const filtered = useMemo(() => {
    if (tipoFiltro.length === 0) return data;
    return data.filter((x) => tipoFiltro.includes(normalizeTipo(x.tipo_produto)));
  }, [data, tipoFiltro]);

  const toggleTipo = (t: string) => {
    setPage1(0);
    setPage2(0);
    setTipoFiltro((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const stats = useMemo(() => {
    const data = filtered;
    const total = data.length;
    const valor = data.reduce((s, x) => s + (x.valor || 0), 0);
    const e1 = data.filter((x) => x.estrategia === 1);
    const e2 = data.filter((x) => x.estrategia === 2);
    const leonardo = data.filter((x) => x.lider === "Leonardo Andrade");
    const alex = data.filter((x) => x.lider === "Alex Charles");
    const sumVal = (arr: ProspeccaoItem[]) => arr.reduce((s, x) => s + (x.valor || 0), 0);
    const areas = (arr: ProspeccaoItem[]) => Array.from(new Set(arr.map((x) => x.area_da_vertical))).filter(Boolean);
    const countE = (arr: ProspeccaoItem[], e: 1 | 2) => arr.filter((x) => x.estrategia === e).length;
    return {
      total,
      valor,
      e1Count: e1.length,
      e1Valor: sumVal(e1),
      e2Count: e2.length,
      e2Valor: sumVal(e2),
      leonardo: {
        opp: leonardo.length,
        valor: sumVal(leonardo),
        areas: areas(leonardo),
        e1: countE(leonardo, 1),
        e2: countE(leonardo, 2),
      },
      alex: {
        opp: alex.length,
        valor: sumVal(alex),
        areas: areas(alex),
        e1: countE(alex, 1),
        e2: countE(alex, 2),
      },
      e1List: [...e1].sort((a, b) => b.valor - a.valor),
      e2List: [...e2].sort((a, b) => b.valor - a.valor),
    };
  }, [filtered]);

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

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tipo de produto:</span>
        <button
          type="button"
          onClick={() => {
            setTipoFiltro([]);
            setPage1(0);
            setPage2(0);
          }}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
            tipoFiltro.length === 0
              ? "border-primary bg-primary text-primary-foreground"
              : "border-beige-medium bg-white text-graphite-medium hover:bg-beige-light"
          }`}
        >
          Todos
        </button>
        {tiposDisponiveis.map((t) => {
          const active = tipoFiltro.includes(t);
          return (
            <button
              key={t}
              type="button"
              onClick={() => toggleTipo(t)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-beige-medium bg-white text-graphite-medium hover:bg-beige-light"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>

      <KpiCards
        items={[
          { label: "Total de oportunidades", value: formatNumber(stats.total), icon: Briefcase },
          { label: "Valor endereçável", value: formatBRL(stats.valor), icon: Wallet, tone: "bg-primary-soft text-primary" },
          {
            label: "Estratégia 1 (ICT principal)",
            value: formatNumber(stats.e1Count),
            sub: formatBRL(stats.e1Valor),
            icon: Target,
            tone: "bg-primary-soft text-primary",
          },
          {
            label: "Estratégia 2 (Coexecução)",
            value: formatNumber(stats.e2Count),
            sub: formatBRL(stats.e2Valor),
            icon: Handshake,
            tone: "bg-bordeaux-soft text-bordeaux",
          },
        ]}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {[
          {
            grupo: "Manufatura Avançada",
            lider: "Leonardo Andrade",
            data: stats.leonardo,
          },
          {
            grupo: "Metalmecânica & Metrologia",
            lider: "Alex Charles",
            data: stats.alex,
          },
        ].map((card) => (
          <div key={card.lider} className="card-shadow rounded-lg border border-beige-medium bg-beige-light p-5">
            {/* Equipe responsável */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white"
                >
                  KT
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-graphite-medium">
                    Especialista Setorial
                  </p>
                  <p className="truncate text-sm font-semibold text-graphite-dark">Kawan Trindade Lessa Paulo</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bordeaux text-sm font-bold text-white"
                >
                  MC
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-graphite-medium">
                    Arquiteto de Soluções
                  </p>
                  <p className="truncate text-sm font-semibold text-graphite-dark">Matheus Coppa</p>
                </div>
              </div>
            </div>

            <div className="my-4 h-px bg-beige-medium" />

            {/* Grupo + Líder */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-graphite-medium">Grupo</p>
                <p className="mt-0.5 font-semibold text-graphite-dark">{card.grupo}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-graphite-medium">Líder da área</p>
                <p className="mt-0.5 font-semibold text-primary">{card.lider}</p>
              </div>
            </div>

            {/* Áreas cobertas */}
            {card.data.areas.length > 0 && (
              <div className="mt-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-graphite-medium">
                  Áreas cobertas ({card.data.areas.length})
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {card.data.areas.map((a) => (
                    <span
                      key={a}
                      className="rounded-md bg-white px-2 py-0.5 text-xs font-medium text-graphite-medium border border-beige-medium"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="mt-4 grid grid-cols-4 gap-2 border-t border-beige-medium pt-3 text-center">
              <div>
                <p className="text-[10px] uppercase tracking-wide text-graphite-medium">Opp.</p>
                <p className="text-base font-bold text-graphite-dark">{formatNumber(card.data.opp)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-graphite-medium">Valor end.</p>
                <p className="text-sm font-bold text-graphite-dark">{formatBRL(card.data.valor)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-graphite-medium">E1</p>
                <p className="text-base font-bold text-primary">{formatNumber(card.data.e1)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-graphite-medium">E2</p>
                <p className="text-base font-bold text-bordeaux">{formatNumber(card.data.e2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Estratégia 1 */}
      <div className="rounded-lg border border-beige-medium bg-white">
        <div className="flex items-center gap-3 border-b border-beige-medium px-5 py-3">
          <Badge className="bg-primary text-white hover:bg-primary">Estratégia 1 — Virar ICT principal</Badge>
          <span className="text-sm text-graphite-medium">{stats.e1List.length} oportunidades</span>
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
                  <TableCell className="font-medium text-graphite-dark">{it.operadora}</TableCell>
                  <TableCell className="text-graphite-dark">{it.area_da_vertical}</TableCell>
                  <TableCell className="text-primary font-medium">{it.lider}</TableCell>
                  <TableCell className="max-w-[280px] text-xs text-graphite-medium">
                    {it.competencias_vertical.slice(0, 2).join(" · ")}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={tipoBadge(it.tipo_produto)}>
                      {normalizeTipo(it.tipo_produto)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-graphite-medium">{it.qualificacao}</TableCell>
                  <TableCell className="text-right font-semibold tabular-nums text-graphite-dark">{formatBRL(it.valor)}</TableCell>
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
      <div className="rounded-lg border border-beige-medium bg-white">
        <div className="flex items-center gap-3 border-b border-beige-medium px-5 py-3">
          <Badge className="bg-bordeaux text-white hover:bg-bordeaux">
            Estratégia 2 — Coexecução com empresa BR
          </Badge>
          <span className="text-sm text-graphite-medium">{stats.e2List.length} oportunidades</span>
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
                  <TableCell className="font-medium text-graphite-dark">{it.operadora}</TableCell>
                  <TableCell className="text-graphite-dark">{it.area_da_vertical}</TableCell>
                  <TableCell className="text-primary font-medium">{it.lider}</TableCell>
                  <TableCell className="font-medium text-primary">{it.empresa_parceira}</TableCell>
                  <TableCell className="max-w-[260px] text-xs text-graphite-medium">
                    {it.competencias_vertical.slice(0, 2).join(" · ")}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={tipoBadge(it.tipo_produto)}>
                      {normalizeTipo(it.tipo_produto)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold tabular-nums text-graphite-dark">{formatBRL(it.valor)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="px-5 pb-3">
          <Pager page={page2} total={e2Pages} onChange={setPage2} />
        </div>
      </div>

      <p className="rounded-lg border border-beige-medium bg-beige-light p-4 text-xs leading-relaxed text-graphite-medium">
        <strong className="text-graphite-dark">Estratégia 1</strong> → agente aciona o líder da área e juntos abordam a
        operadora diretamente. <strong className="text-graphite-dark">Estratégia 2</strong> → agente contata primeiro a
        empresa parceira — ela já tem o relacionamento com a operadora e o instituto entra como ICT na coexecução.
      </p>
    </div>
  );
};
