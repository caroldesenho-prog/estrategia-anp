import { TemaComFit } from "@/types/dashboard";
import { formatBRL, formatNumber } from "@/lib/format";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check } from "lucide-react";

interface Props { data: TemaComFit[]; cor: string; fitSubtemas: Set<string>; }

export const VerticalTemas = ({ data, cor, fitSubtemas }: Props) => {
  const sorted = [...data].sort((a, b) => b.fit_valor - a.fit_valor);
  return (
    <Accordion type="multiple" className="space-y-2">
      {sorted.map((tema, idx) => (
        <AccordionItem key={tema.tema} value={`t-${idx}`} className="rounded-lg border border-border bg-background">
          <AccordionTrigger className="px-4 py-3 text-left hover:no-underline">
            <div className="flex flex-1 items-center justify-between gap-3 pr-3">
              <span className="text-sm font-semibold text-foreground">{tema.tema}</span>
              <div className="flex items-center gap-3 text-xs">
                <span className="rounded px-2 py-0.5 font-semibold text-white" style={{ backgroundColor: cor }}>
                  {tema.fit_count} c/ fit
                </span>
                <span className="font-semibold tabular-nums text-foreground">{formatBRL(tema.fit_valor)}</span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="border-t border-border px-4 py-3">
            <ul className="space-y-1.5">
              {tema.subtemas.map((s) => {
                const hasFit = fitSubtemas.has(s.subtema);
                return (
                  <li key={s.subtema} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex min-w-0 items-center gap-2">
                      {hasFit ? (
                        <Check className="h-3.5 w-3.5 shrink-0" style={{ color: cor }} />
                      ) : (
                        <span className="h-3.5 w-3.5 shrink-0" />
                      )}
                      <span className={hasFit ? "font-medium text-foreground" : "text-muted-foreground"}>
                        {s.subtema}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-3 text-muted-foreground">
                      <span className="tabular-nums">{formatNumber(s.projetos)}</span>
                      <span className="tabular-nums font-medium text-foreground">{formatBRL(s.valor)}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
