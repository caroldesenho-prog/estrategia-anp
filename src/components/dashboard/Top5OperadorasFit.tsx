import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { OperadoraFit, FitVerticalBlock, ProjetoAnp, Vertical } from "@/types/dashboard";
import { formatBRL, formatNumber } from "@/lib/format";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

interface Props {
  data: OperadoraFit[];
  vertical: Vertical;
}

interface DrawerState {
  operadora: string;
  subtema: string;
  projetos: ProjetoAnp[];
}

export const Top5OperadorasFit = ({ data, vertical }: Props) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [drawer, setDrawer] = useState<DrawerState | null>(null);
  const isDigital = vertical === "Tecnologias Digitais Avançadas";

  const openDrawer = (op: OperadoraFit, subtema: string) => {
    const projetos = op.projetos_por_subtema?.[subtema] ?? [];
    setDrawer({ operadora: op.operadora, subtema, projetos });
  };

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-border">
        {/* Header */}
        <div className="grid grid-cols-[24px_1.4fr_1fr_0.8fr_1.1fr_1fr_1fr] items-center gap-3 border-b border-border bg-muted/40 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          <span />
          <span>Operadora</span>
          <span className="text-right">Volume total</span>
          <span className="text-right">Projetos</span>
          <span className="text-right">Oportunidades s/ ICT</span>
          <span className="text-right">Fit Manufatura</span>
          <span className="text-right">Fit Digital</span>
        </div>

        {data.map((op, idx) => {
          const isOpen = openIdx === idx;
          const block = isDigital ? op.fit_digital : op.fit_manufatura;
          const oportunidades = block.gap_sem_ict;
          const oportunidadesValor = block.subtemas
            .filter((s) => s.sem_ict > 0)
            .reduce((acc, s) => acc + (s.valor || 0), 0);
          return (
            <div key={op.operadora} className="border-b border-border last:border-b-0">
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="grid w-full grid-cols-[24px_1.4fr_1fr_0.8fr_1.1fr_1fr_1fr] items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-muted/30"
              >
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="font-semibold text-foreground">{op.operadora}</span>
                <span className="text-right tabular-nums text-foreground">{formatBRL(op.volume_total)}</span>
                <span className="text-right tabular-nums text-foreground">{formatNumber(op.projetos_total)}</span>
                <span className="flex flex-col items-end leading-tight">
                  <span
                    className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold tabular-nums"
                    style={{ backgroundColor: "#FCEBEB", color: "#A32D2D" }}
                  >
                    {formatNumber(oportunidades)}
                  </span>
                  <span className="mt-0.5 text-[10px] tabular-nums text-muted-foreground">
                    {formatBRL(oportunidadesValor)}
                  </span>
                </span>
                <span className="text-right tabular-nums text-foreground">{formatBRL(op.fit_manufatura.valor_total)}</span>
                <span className="text-right tabular-nums text-foreground">{formatBRL(op.fit_digital.valor_total)}</span>
              </button>

              {isOpen && (
                <div className="border-t border-border bg-muted/20 px-4 py-4">
                  <Tabs defaultValue="temas">
                    <TabsList className="mb-4">
                      <TabsTrigger value="temas">Temas investigados</TabsTrigger>
                      <TabsTrigger value="competencias">Competências aplicáveis</TabsTrigger>
                      <TabsTrigger value="parceiros">Parceiros potenciais</TabsTrigger>
                    </TabsList>

                    {/* Tab 1 */}
                    <TabsContent value="temas" className="mt-0">
                      <div className="overflow-hidden rounded-md border border-border bg-card">
                        <table className="w-full text-sm">
                          <thead className="bg-muted/40 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            <tr>
                              <th className="px-3 py-2 text-left">Tema ANP</th>
                              <th className="px-3 py-2 text-right">Valor</th>
                              <th className="px-3 py-2 text-right">Projetos</th>
                            </tr>
                          </thead>
                          <tbody>
                            {op.temas_investigados.map((t) => (
                              <tr key={t.tema} className="border-t border-border">
                                <td className="px-3 py-2 text-foreground">{t.tema}</td>
                                <td className="px-3 py-2 text-right tabular-nums text-foreground">{formatBRL(t.valor)}</td>
                                <td className="px-3 py-2 text-right tabular-nums text-foreground">{formatNumber(t.projetos)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </TabsContent>

                    {/* Tab 2 */}
                    <TabsContent value="competencias" className="mt-0">
                      <div className="grid gap-4">
                        {isDigital ? (
                          <CompetenciaBlock
                            title="Tecnologias Digitais Avançadas"
                            block={op.fit_digital}
                            accent="hsl(var(--accent))"
                            projetosPorSubtema={op.projetos_por_subtema}
                            onSubtemaClick={(s) => openDrawer(op, s)}
                          />
                        ) : (
                          <CompetenciaBlock
                            title="Manufatura Avançada"
                            block={op.fit_manufatura}
                            accent="hsl(var(--primary))"
                            projetosPorSubtema={op.projetos_por_subtema}
                            onSubtemaClick={(s) => openDrawer(op, s)}
                          />
                        )}
                      </div>
                    </TabsContent>

                    {/* Tab 3 */}
                    <TabsContent value="parceiros" className="mt-0">
                      <div className="overflow-hidden rounded-md border border-border bg-card">
                        <table className="w-full text-sm">
                          <thead className="bg-muted/40 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            <tr>
                              <th className="px-3 py-2 text-left">Empresa</th>
                              <th className="px-3 py-2 text-right">Projetos</th>
                              <th className="px-3 py-2 text-right">Valor</th>
                              <th className="px-3 py-2 text-left">Tipo</th>
                            </tr>
                          </thead>
                          <tbody>
                            {op.parceiros_potenciais.map((p) => (
                              <tr key={p.empresa} className="border-t border-border">
                                <td className="px-3 py-2 font-medium text-foreground">{p.empresa}</td>
                                <td className="px-3 py-2 text-right tabular-nums text-foreground">{formatNumber(p.projetos)}</td>
                                <td className="px-3 py-2 text-right tabular-nums text-foreground">{formatBRL(p.valor)}</td>
                                <td className="px-3 py-2">
                                  {p.ja_tem_ict ? (
                                    <Badge variant="secondary" className="font-normal">coexecução</Badge>
                                  ) : (
                                    <Badge className="border-transparent bg-success-soft font-normal text-success hover:bg-success-soft">
                                      entrada direta
                                    </Badge>
                                  )}
                                </td>
                              </tr>
                            ))}
                            {op.parceiros_potenciais.length === 0 && (
                              <tr>
                                <td colSpan={4} className="px-3 py-6 text-center text-sm text-muted-foreground">
                                  Nenhum parceiro potencial identificado.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-end gap-2 rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm">
        <span className="font-semibold text-foreground">Total de oportunidades sem ICT:</span>
        <span
          className="inline-flex items-center rounded-md px-2.5 py-1 text-sm font-bold tabular-nums"
          style={{ backgroundColor: "#FCEBEB", color: "#A32D2D" }}
        >
          {formatNumber(
            data.reduce(
              (acc, op) => acc + (isDigital ? op.fit_digital.gap_sem_ict : op.fit_manufatura.gap_sem_ict),
              0,
            ),
          )}{" "}
          projetos
        </span>
      </div>

      <Sheet open={!!drawer} onOpenChange={(o) => !o && setDrawer(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-[480px]">
          {drawer && (
            <>
              <SheetHeader className="text-left">
                <SheetDescription className="text-xs uppercase tracking-wide">
                  {drawer.operadora}
                </SheetDescription>
                <SheetTitle className="text-base leading-snug">{drawer.subtema}</SheetTitle>
                <p className="text-xs text-muted-foreground">
                  {drawer.projetos.length} projeto{drawer.projetos.length === 1 ? "" : "s"} encontrado{drawer.projetos.length === 1 ? "" : "s"}
                </p>
              </SheetHeader>

              <div className="mt-6 space-y-4">
                {drawer.projetos.length === 0 && (
                  <p className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                    Nenhum projeto encontrado para este subtema.
                  </p>
                )}
                {drawer.projetos.map((p) => (
                  <ProjetoCard key={p.id} projeto={p} />
                ))}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

const RED_BG = "#FCEBEB";
const RED_FG = "#A32D2D";

const CompetenciaBlock = ({
  title,
  block,
  accent,
  projetosPorSubtema,
  onSubtemaClick,
}: {
  title: string;
  block: FitVerticalBlock;
  accent: string;
  projetosPorSubtema?: Record<string, ProjetoAnp[]>;
  onSubtemaClick: (subtema: string) => void;
}) => {
  const subtemaStats = (subtema: string) => {
    const projs = projetosPorSubtema?.[subtema] ?? [];
    const semIct = projs.filter((p) => !p.tem_ict);
    const valor = semIct.reduce((acc, p) => acc + (p.valor || 0), 0);
    return { count: semIct.length, valor };
  };

  return (
    <div className="rounded-md border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: accent }} />
          <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        </div>
        <span className="text-xs tabular-nums text-muted-foreground">
          {formatBRL(block.valor_total)} endereçável
        </span>
      </div>
      {block.labs.length === 0 ? (
        <p className="py-4 text-center text-xs text-muted-foreground">Sem laboratórios com fit.</p>
      ) : (
        <ul className="space-y-3">
          {block.labs.map((lab) => {
            const labGap = lab.subtemas_match.reduce((acc, s) => acc + subtemaStats(s).count, 0);
            return (
              <li key={lab.lab} className="rounded-md border border-border/70 bg-background/50 p-3">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{lab.lab}</span>
                    {labGap > 0 && (
                      <span
                        className="inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold tabular-nums"
                        style={{ backgroundColor: RED_BG, color: RED_FG }}
                      >
                        {formatNumber(labGap)} sem ICT
                      </span>
                    )}
                  </div>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {formatBRL(lab.valor)} · {formatNumber(lab.projetos)} projetos
                  </span>
                </div>
                {lab.subtemas_match.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {lab.subtemas_match.map((s) => {
                      const { count, valor } = subtemaStats(s);
                      const hasGap = count > 0;
                      const tooltip = hasGap
                        ? `${count} projeto${count === 1 ? "" : "s"} sem ICT — ${formatBRL(valor)} disponível`
                        : undefined;
                      return (
                        <button
                          key={s}
                          onClick={() => onSubtemaClick(s)}
                          title={tooltip}
                          className={
                            "inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-[10px] font-medium transition-colors " +
                            (hasGap
                              ? "border bg-muted text-foreground hover:bg-primary hover:text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground")
                          }
                          style={
                            hasGap
                              ? { borderColor: RED_FG + "55", backgroundColor: RED_BG, color: RED_FG }
                              : undefined
                          }
                        >
                          {hasGap && (
                            <span
                              className="h-1.5 w-1.5 rounded-full"
                              style={{ backgroundColor: RED_FG }}
                            />
                          )}
                          {s}
                        </button>
                      );
                    })}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

const ProjetoCard = ({ projeto }: { projeto: ProjetoAnp }) => (
  <div className="rounded-lg border border-border bg-card p-4">
    <h3 className="text-sm font-semibold leading-snug text-foreground">{projeto.titulo}</h3>

    <div className="mt-3 max-h-32 overflow-y-auto rounded-md bg-muted/30 p-2.5 text-xs leading-relaxed text-muted-foreground">
      {projeto.objetivo || "Sem objetivo informado."}
    </div>

    <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
      <div>
        <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Início</div>
        <div className="font-semibold tabular-nums text-foreground">{projeto.ano}</div>
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Valor</div>
        <div className="font-semibold tabular-nums text-foreground">{formatBRL(projeto.valor)}</div>
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Prazo</div>
        <div className="font-semibold tabular-nums text-foreground">{projeto.prazo_meses} meses</div>
      </div>
    </div>

    <div className="mt-3 flex flex-wrap items-center gap-1.5">
      {projeto.qualificacao && (
        <Badge variant="outline" className="font-normal">{projeto.qualificacao}</Badge>
      )}
      {projeto.instituicao ? (
        <Badge variant="secondary" className="font-normal">{projeto.instituicao}</Badge>
      ) : (
        <Badge className="border-transparent bg-destructive font-normal text-destructive-foreground hover:bg-destructive">
          Sem ICT — oportunidade
        </Badge>
      )}
    </div>
  </div>
);
