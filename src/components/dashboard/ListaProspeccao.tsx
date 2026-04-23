import { useMemo, useState } from "react";
import { ProspeccaoItem } from "@/types/dashboard";
import { KpiCards } from "./KpiCards";
import { Briefcase, Wallet, Target, Handshake, Search, X } from "lucide-react";
import { formatBRL, formatNumber } from "@/lib/format";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const FIELD_CLASS =
  "h-[34px] rounded-md border bg-white px-3 text-[12px] text-graphite-dark focus:outline-none focus:ring-1 focus:ring-primary/40";
const FIELD_STYLE: React.CSSProperties = { borderColor: "#E5D5CC", borderRadius: 6 };

const VISIBLE_ROWS = 15;
const ROW_HEIGHT_PX = 44; // approx row height including padding

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

// Fixed list of 5 buttons. tipo_produto is already normalized in the JSON.
const TIPO_BUTTONS = ["PDI", "PDI e Serviços", "Serviços", "Metrologia"] as const;

const tipoBadge = (tipo: string) => {
  const t = (tipo || "").toUpperCase();
  if (t.includes("METROLOGIA")) return "border-transparent bg-bordeaux-soft text-bordeaux";
  if (t.includes("PDI")) return "border-transparent bg-primary-soft text-primary";
  return "border-transparent bg-beige-light text-graphite-dark";
};

interface Props {
  data: ProspeccaoItem[];
}

const ScrollableTable = ({ children, totalRows }: { children: React.ReactNode; totalRows: number }) => {
  const needsScroll = totalRows > VISIBLE_ROWS;
  if (!needsScroll) {
    return <div className="overflow-x-auto p-2">{children}</div>;
  }
  return (
    <div className="overflow-x-auto p-2">
      <div style={{ maxHeight: 400, overflowY: "scroll" }}>{children}</div>
    </div>
  );
};

export const ListaProspeccao = ({ data }: Props) => {
  const [tipoFiltro, setTipoFiltro] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [operadoraSel, setOperadoraSel] = useState("__all__");
  const [liderSel, setLiderSel] = useState("__all__");
  const [estrategiaSel, setEstrategiaSel] = useState<"all" | "1" | "2">("all");

  const operadorasUnicas = useMemo(
    () => Array.from(new Set(data.map((x) => x.operadora).filter(Boolean))).sort((a, b) => a.localeCompare(b, "pt-BR")),
    [data],
  );

  const anyFilterActive =
    tipoFiltro.length > 0 ||
    search.trim() !== "" ||
    operadoraSel !== "__all__" ||
    liderSel !== "__all__" ||
    estrategiaSel !== "all";

  const clearAll = () => {
    setTipoFiltro([]);
    setSearch("");
    setOperadoraSel("__all__");
    setLiderSel("__all__");
    setEstrategiaSel("all");
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return data.filter((x) => {
      if (tipoFiltro.length > 0 && !tipoFiltro.includes(x.tipo_produto)) return false;
      if (operadoraSel !== "__all__" && x.operadora !== operadoraSel) return false;
      if (liderSel !== "__all__" && x.lider !== liderSel) return false;
      if (estrategiaSel !== "all" && String(x.estrategia) !== estrategiaSel) return false;
      if (q) {
        const hay = `${x.titulo || ""}\n${x.operadora || ""}\n${x.subtema_anp || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [data, tipoFiltro, search, operadoraSel, liderSel, estrategiaSel]);

  const toggleTipo = (t: string) => {
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
    const sortByScore = (arr: ProspeccaoItem[]) =>
      [...arr].sort((a, b) => (b.score_total ?? 0) - (a.score_total ?? 0));
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
      e1List: sortByScore(e1),
      e2List: sortByScore(e2),
    };
  }, [filtered]);

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Oportunidades concretas mapeadas para a vertical, segmentadas por estratégia de aproximação. Cada item indica
        operadora-alvo, líder responsável e tipo de produto a ofertar.
      </p>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-beige-medium bg-beige-light/50 p-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-graphite-medium" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título, operadora ou subtema..."
            className={`${FIELD_CLASS} w-full pl-8`}
            style={FIELD_STYLE}
          />
        </div>
        <select
          value={operadoraSel}
          onChange={(e) => setOperadoraSel(e.target.value)}
          className={`${FIELD_CLASS} max-w-[220px]`}
          style={FIELD_STYLE}
        >
          <option value="__all__">Todas as operadoras</option>
          {operadorasUnicas.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <select
          value={liderSel}
          onChange={(e) => setLiderSel(e.target.value)}
          className={FIELD_CLASS}
          style={FIELD_STYLE}
        >
          <option value="__all__">Todos os líderes</option>
          <option value="Leonardo Andrade">Leonardo Andrade</option>
          <option value="Alex Charles">Alex Charles</option>
        </select>
        <select
          value={estrategiaSel}
          onChange={(e) => setEstrategiaSel(e.target.value as "all" | "1" | "2")}
          className={FIELD_CLASS}
          style={FIELD_STYLE}
        >
          <option value="all">Todas</option>
          <option value="1">Estratégia 1 — ICT principal</option>
          <option value="2">Estratégia 2 — Coexecução</option>
        </select>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-[12px] text-graphite-medium">
            Exibindo <strong className="text-graphite-dark">{formatNumber(stats.total)}</strong> oportunidades · <strong className="text-graphite-dark">{formatBRL(stats.valor)}</strong>
          </span>
          {anyFilterActive && (
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex h-[34px] items-center gap-1 border border-beige-medium bg-white px-3 text-[12px] font-medium text-graphite-dark hover:bg-beige-light"
              style={{ borderRadius: 6, borderColor: "#E5D5CC" }}
            >
              <X className="h-3.5 w-3.5" /> Limpar filtros
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tipo de produto:</span>
        <button
          type="button"
          onClick={() => setTipoFiltro([])}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
            tipoFiltro.length === 0
              ? "border-primary bg-primary text-primary-foreground"
              : "border-beige-medium bg-white text-graphite-medium hover:bg-beige-light"
          }`}
        >
          Todos
        </button>
        {TIPO_BUTTONS.map((t) => {
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
        <ScrollableTable totalRows={stats.e1List.length}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Operadora</TableHead>
                <TableHead>Título do projeto</TableHead>
                <TableHead>Área da vertical</TableHead>
                <TableHead>Líder da área</TableHead>
                <TableHead>Competência da vertical</TableHead>
                <TableHead>Tipo de produto</TableHead>
                <TableHead>Qualificação</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.e1List.map((it, i) => (
                <TableRow key={`e1-${i}`}>
                  <TableCell className="font-medium text-graphite-dark">{it.operadora}</TableCell>
                  <TableCell><TituloCell titulo={it.titulo} /></TableCell>
                  <TableCell className="text-graphite-dark">{it.area_da_vertical}</TableCell>
                  <TableCell className="text-primary font-medium">{it.lider}</TableCell>
                  <TableCell className="max-w-[280px] text-xs text-graphite-medium">
                    {it.competencias_vertical.slice(0, 2).join(" · ")}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={tipoBadge(it.tipo_produto)}>
                      {it.tipo_produto}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-graphite-medium">{it.qualificacao}</TableCell>
                  <TableCell className="text-right font-semibold tabular-nums text-graphite-dark">{formatBRL(it.valor)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollableTable>
      </div>

      {/* Estratégia 2 */}
      <div className="rounded-lg border border-beige-medium bg-white">
        <div className="flex items-center gap-3 border-b border-beige-medium px-5 py-3">
          <Badge className="bg-bordeaux text-white hover:bg-bordeaux">
            Estratégia 2 — Coexecução com empresa BR
          </Badge>
          <span className="text-sm text-graphite-medium">{stats.e2List.length} oportunidades</span>
        </div>
        <ScrollableTable totalRows={stats.e2List.length}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Operadora</TableHead>
                <TableHead>Título do projeto</TableHead>
                <TableHead>Área da vertical</TableHead>
                <TableHead>Líder da área</TableHead>
                <TableHead>Empresa parceira</TableHead>
                <TableHead>Competência da vertical</TableHead>
                <TableHead>Tipo de produto</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.e2List.map((it, i) => (
                <TableRow key={`e2-${i}`}>
                  <TableCell className="font-medium text-graphite-dark">{it.operadora}</TableCell>
                  <TableCell><TituloCell titulo={it.titulo} /></TableCell>
                  <TableCell className="text-graphite-dark">{it.area_da_vertical}</TableCell>
                  <TableCell className="text-primary font-medium">{it.lider}</TableCell>
                  <TableCell className="font-medium text-primary">{it.empresa_parceira}</TableCell>
                  <TableCell className="max-w-[260px] text-xs text-graphite-medium">
                    {it.competencias_vertical.slice(0, 2).join(" · ")}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={tipoBadge(it.tipo_produto)}>
                      {it.tipo_produto}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold tabular-nums text-graphite-dark">{formatBRL(it.valor)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollableTable>
      </div>

      <p className="rounded-lg border border-beige-medium bg-beige-light p-4 text-xs leading-relaxed text-graphite-medium">
        <strong className="text-graphite-dark">Estratégia 1</strong> → agente aciona o líder da área e juntos abordam a
        operadora diretamente. <strong className="text-graphite-dark">Estratégia 2</strong> → agente contata primeiro a
        empresa parceira — ela já tem o relacionamento com a operadora e o instituto entra como ICT na coexecução.
      </p>
    </div>
  );
};
