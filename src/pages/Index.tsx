import { useMemo, useState } from "react";
import dashboardJson from "@/data/dashboard_data_v3.json";
import { DashboardData, Period, Vertical, View } from "@/types/dashboard";
import { Header } from "@/components/dashboard/Header";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { OperadorasChart } from "@/components/dashboard/OperadorasChart";
import { ParceirosTable } from "@/components/dashboard/ParceirosTable";
import { ConcorrentesIcts } from "@/components/dashboard/ConcorrentesIcts";
import { TaxaIctChart } from "@/components/dashboard/TaxaIctChart";
import { IctsPreferidasTable } from "@/components/dashboard/IctsPreferidasTable";
import { ObrigacaoExecucaoChart } from "@/components/dashboard/ObrigacaoExecucaoChart";
import { TempoExecucaoChart } from "@/components/dashboard/TempoExecucaoChart";
import { VerticalSelector } from "@/components/dashboard/VerticalSelector";
import { VerticalSubtemas } from "@/components/dashboard/VerticalSubtemas";
import { VerticalGap } from "@/components/dashboard/VerticalGap";


import { VerticalCrescimento } from "@/components/dashboard/VerticalCrescimento";
import { VerticalTemas } from "@/components/dashboard/VerticalTemas";
import { Top5OperadorasFit } from "@/components/dashboard/Top5OperadorasFit";
import { formatBRL, formatNumber, formatPct } from "@/lib/format";
import { Briefcase, Wallet, CheckCircle2, AlertCircle, Target, TrendingUp, AlertTriangle, Coins } from "lucide-react";

const data = dashboardJson as unknown as DashboardData;

const Index = () => {
  const [period, setPeriod] = useState<Period>("3anos");
  const [view, setView] = useState<View>("geral");
  const [vertical, setVertical] = useState<Vertical>("Manufatura Avançada");

  const periodData = useMemo(() => data[period], [period]);
  const verticalData = periodData.por_vertical[vertical];
  const cor = data.verticais_meta[vertical]?.cor ?? "#1F4E79";

  return (
    <div className="min-h-screen bg-background">
      <Header period={period} view={view} onPeriodChange={setPeriod} onViewChange={setView} />

      <main className="mx-auto max-w-[1440px] space-y-6 px-6 py-6">
        <p className="text-sm text-muted-foreground">
          Período de análise: <span className="font-semibold text-foreground">{periodData.periodo}</span>
          {view === "vertical" && (
            <>
              {" · "}Vertical: <span className="font-semibold" style={{ color: cor }}>{vertical}</span>
            </>
          )}
        </p>

        {view === "geral" ? (
          <>
            <KpiCards
              items={[
                { label: "Total de projetos", value: formatNumber(periodData.resumo_geral.total_projetos), icon: Briefcase },
                { label: "Volume total", value: formatBRL(periodData.resumo_geral.total_valor), icon: Wallet },
                {
                  label: "% com ICT",
                  value: formatPct(periodData.resumo_geral.pct_com_ict),
                  icon: CheckCircle2,
                  tone: "bg-success-soft text-success",
                },
                {
                  label: "% sem ICT",
                  value: formatPct(periodData.resumo_geral.pct_sem_ict),
                  icon: AlertCircle,
                  tone: "bg-warning-soft text-warning",
                },
              ]}
            />

            <SectionCard title="1 · Onde o dinheiro está" subtitle="Top 15 operadoras por volume investido em PD&I">
              <OperadorasChart data={periodData.top15_operadoras} />
            </SectionCard>

            <SectionCard
              title="2 · Taxa de uso de ICT por operadora"
              subtitle="Composição dos projetos: com ICT, com empresa BR sem ICT, sem nenhum"
            >
              <TaxaIctChart data={periodData.taxa_ict_operadora} />
            </SectionCard>

            <SectionCard title="3 · ICTs preferidas por operadora" subtitle="Top 3 ICTs mais contratadas por operadora">
              <IctsPreferidasTable data={periodData.ict_por_operadora} />
            </SectionCard>

            <SectionCard title="4 · Parceiros potenciais" subtitle="Empresas brasileiras executoras com maior recorrência">
              <ParceirosTable data={periodData.parceiros_geral} />
            </SectionCard>

            <SectionCard title="5 · Concorrentes ICTs" subtitle="Posicionamento de ICTs e concentração por operadora">
              <ConcorrentesIcts concorrentes={periodData.concorrentes} heatmap={periodData.heatmap_ict_op} />
            </SectionCard>

            <SectionCard title="6 · Obrigação vs Execução" subtitle="Comparativo entre obrigação total e valor executado por operadora">
              <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
                Obrigação = valor gerado pela cláusula PD&amp;I no período selecionado. Execução = valor dos projetos iniciados no mesmo período. Execução pode superar a obrigação porque projetos aprovados em anos anteriores continuam sendo desembolsados — os valores refletem o momento de início do projeto, não o desembolso anual.
              </p>
              <div className="mb-4 inline-flex rounded-md border border-border bg-background p-0.5">
                {(["3anos", "5anos", "8anos"] as Period[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                      period === p
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {p === "3anos" ? "3 anos" : p === "5anos" ? "5 anos" : "8 anos"}
                  </button>
                ))}
              </div>
              <ObrigacaoExecucaoChart data={periodData.obrigacao_vs_execucao} />
              <div className="mt-6">
                <TempoExecucaoChart data={periodData.tempo_execucao_operadoras} />
              </div>
            </SectionCard>
          </>
        ) : (
          <>
            <SectionCard title="Selecione a vertical">
              <VerticalSelector meta={data.verticais_meta} selected={vertical} onChange={setVertical} />
            </SectionCard>

            <KpiCards
              items={[
                {
                  label: "Projetos com fit",
                  value: formatNumber(verticalData.resumo.projetos_fit),
                  sub: formatPct(verticalData.resumo.pct_fit) + " do total",
                  icon: Target,
                  tone: "bg-success-soft text-success",
                },
                {
                  label: "Volume endereçável",
                  value: formatBRL(verticalData.resumo.valor_fit),
                  icon: TrendingUp,
                  tone: "bg-primary-soft text-primary",
                },
                {
                  label: "Gap sem ICT (projetos)",
                  value: formatNumber(verticalData.resumo.gap_projetos),
                  icon: AlertTriangle,
                  tone: "bg-warning-soft text-warning",
                },
                {
                  label: "Gap sem ICT (valor)",
                  value: formatBRL(verticalData.resumo.gap_valor),
                  icon: Coins,
                  tone: "bg-warning-soft text-warning",
                },
              ]}
            />

            <SectionCard title="Gap por operadora" subtitle="Projetos sem ICT alocada — ordenado por valor do gap">
              <VerticalGap data={verticalData.gap_por_operadora} />
            </SectionCard>

            <SectionCard
              title="Top 5 operadoras — oportunidade por vertical"
              subtitle="Expanda uma linha para ver temas investigados, competências aplicáveis e parceiros potenciais"
            >
              <Top5OperadorasFit data={periodData.top5_operadoras_fit} vertical={vertical} />
            </SectionCard>

            <SectionCard title="1 · Top 10 subtemas ANP com fit" subtitle="Ordenado por volume com indicador de % sem ICT">
              <VerticalSubtemas data={verticalData.top10_subtemas} cor={cor} />
            </SectionCard>

            <SectionCard title="2 · Subtemas em crescimento" subtitle="Top 10 subtemas com fit comparados ao período anterior">
              <VerticalCrescimento data={verticalData.crescimento_subtemas} />
            </SectionCard>

            <SectionCard title="3 · Temas ANP com fit" subtitle="Clique para expandir e ver os subtemas — ✓ indica fit com a vertical">
              <VerticalTemas
                data={verticalData.temas_com_fit}
                cor={cor}
                fitSubtemas={new Set(verticalData.top10_subtemas.map((s) => s.subtema))}
              />
            </SectionCard>
          </>
        )}

        <footer className="py-6 text-center text-xs text-muted-foreground">
          Radar PD&I ANP · dados processados a partir do repositório de projetos PD&I
        </footer>
      </main>
    </div>
  );
};

export default Index;
