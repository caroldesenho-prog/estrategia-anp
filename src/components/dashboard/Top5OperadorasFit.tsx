import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { OperadoraFit, FitVerticalBlock } from "@/types/dashboard";
import { formatBRL, formatNumber } from "@/lib/format";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface Props {
  data: OperadoraFit[];
}

export const Top5OperadorasFit = ({ data }: Props) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      {/* Header */}
      <div className="grid grid-cols-[24px_1.6fr_1fr_1fr_1fr_1fr] items-center gap-3 border-b border-border bg-muted/40 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        <span />
        <span>Operadora</span>
        <span className="text-right">Volume total</span>
        <span className="text-right">Projetos</span>
        <span className="text-right">Fit Manufatura</span>
        <span className="text-right">Fit Digital</span>
      </div>

      {data.map((op, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div key={op.operadora} className="border-b border-border last:border-b-0">
            <button
              onClick={() => setOpenIdx(isOpen ? null : idx)}
              className="grid w-full grid-cols-[24px_1.6fr_1fr_1fr_1fr_1fr] items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-muted/30"
            >
              {isOpen ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="font-semibold text-foreground">{op.operadora}</span>
              <span className="text-right tabular-nums text-foreground">{formatBRL(op.volume_total)}</span>
              <span className="text-right tabular-nums text-foreground">{formatNumber(op.projetos_total)}</span>
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
                    <div className="grid gap-4 lg:grid-cols-2">
                      <CompetenciaBlock title="Manufatura Avançada" block={op.fit_manufatura} accent="hsl(var(--primary))" />
                      <CompetenciaBlock title="Tecnologias Digitais" block={op.fit_digital} accent="hsl(var(--accent))" />
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
  );
};

const CompetenciaBlock = ({
  title,
  block,
  accent,
}: {
  title: string;
  block: FitVerticalBlock;
  accent: string;
}) => (
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
        {block.labs.map((lab) => (
          <li key={lab.lab} className="rounded-md border border-border/70 bg-background/50 p-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-sm font-semibold text-foreground">{lab.lab}</span>
              <span className="text-xs tabular-nums text-muted-foreground">
                {formatBRL(lab.valor)} · {formatNumber(lab.projetos)} projetos
              </span>
            </div>
            {lab.subtemas_match.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {lab.subtemas_match.map((s) => (
                  <span
                    key={s}
                    className="rounded-sm bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    )}
  </div>
);
