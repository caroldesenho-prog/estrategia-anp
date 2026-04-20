import { useMemo, useState } from "react";
import dashboardJson from "@/data/dashboard_data.json";
import { DashboardData, Period, Vertical } from "@/types/dashboard";
import { Header } from "@/components/dashboard/Header";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { OperadorasChart } from "@/components/dashboard/OperadorasChart";
import { ParceirosTable } from "@/components/dashboard/ParceirosTable";
import { ConcorrentesIcts } from "@/components/dashboard/ConcorrentesIcts";
import { FitVertical } from "@/components/dashboard/FitVertical";
import { TemasTree } from "@/components/dashboard/TemasTree";
import { GapOperadoraSection } from "@/components/dashboard/GapOperadora";

const data = dashboardJson as unknown as DashboardData;

const Index = () => {
  const [period, setPeriod] = useState<Period>("3anos");
  const [vertical, setVertical] = useState<Vertical>("Manufatura Avançada");

  const periodData = useMemo(() => data[period], [period]);
  const labMap = data.competencias.lab_map;

  return (
    <div className="min-h-screen bg-background">
      <Header
        period={period}
        vertical={vertical}
        onPeriodChange={setPeriod}
        onVerticalChange={setVertical}
      />

      <main className="mx-auto max-w-[1440px] space-y-6 px-6 py-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Período de análise: <span className="font-semibold text-foreground">{periodData.periodo}</span>
            {" · "}Vertical: <span className="font-semibold text-foreground">{vertical}</span>
          </p>
        </div>

        <KpiCards resumo={periodData.resumo} />

        <SectionCard title="1 · Onde o dinheiro está" subtitle="Top 15 operadoras por volume investido em PD&I">
          <OperadorasChart data={periodData.top15_operadoras} />
        </SectionCard>

        <SectionCard title="2 · Parceiros potenciais" subtitle="Empresas brasileiras executoras com maior recorrência">
          <ParceirosTable data={periodData.parceiros} />
        </SectionCard>

        <SectionCard title="3 · Concorrentes ICTs" subtitle="Posicionamento de ICTs e concentração por operadora">
          <ConcorrentesIcts concorrentes={periodData.concorrentes} heatmap={periodData.heatmap_ict_op} />
        </SectionCard>

        <SectionCard
          title={`4 · Fit com ${vertical}`}
          subtitle="Subtemas ANP endereçáveis e laboratórios do instituto"
        >
          <FitVertical
            subtemas={periodData.top10_subtemas_fit}
            labs={periodData.fit_por_lab}
            vertical={vertical}
            labMap={labMap}
          />
        </SectionCard>

        <SectionCard title="5 · 23 Temas e subtemas ANP" subtitle="Clique em um tema para ver os subtemas. Linhas em verde indicam fit com a vertical.">
          <TemasTree data={periodData.temas_tree} />
        </SectionCard>

        <SectionCard title="6 · Gap por operadora" subtitle="Obrigação vs executado e oportunidades sem ICT alocada">
          <GapOperadoraSection
            obrigVsExec={periodData.obrigacao_vs_execucao}
            gaps={periodData.gap_por_operadora}
          />
        </SectionCard>

        <footer className="py-6 text-center text-xs text-muted-foreground">
          Radar PD&I ANP · dados processados a partir do repositório de projetos PD&I
        </footer>
      </main>
    </div>
  );
};

export default Index;
