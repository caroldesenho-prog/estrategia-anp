export type Vertical = "Manufatura Avançada" | "Tecnologias Digitais";
export type Period = "3anos" | "5anos";

export interface Resumo {
  total_projetos: number;
  total_valor: number;
  projetos_fit_ma: number;
  valor_fit_ma: number;
  gap_sem_ict: number;
  valor_gap: number;
}

export interface OperadoraRow { operadora: string; total: number; projetos: number; }
export interface ParceiroRow { empresa: string; projetos: number; valor: number; operadoras: string[]; }
export interface ConcorrenteRow { ict: string; projetos: number; valor: number; num_operadoras: number; }
export interface HeatmapData { icts: string[]; operadoras: string[]; dados: Array<Record<string, string | number>>; }
export interface LabRow { lab: string; vertical: string; projetos: number; valor: number; subtemas_cobertos: number; subtemas?: string[]; }
export interface SubtemaFitRow { subtema: string; projetos: number; valor: number; sem_ict: number; }
export interface SubtemaTree { subtema: string; projetos: number; valor: number; fit: boolean; sem_ict: number; }
export interface TemaTree { tema: string; projetos: number; valor: number; subtemas: SubtemaTree[]; fit_valor: number; fit_count: number; }
export interface GapOperadora { operadora: string; proj_gap: number; valor_gap: number; proj_total: number; pct_gap: number; }
export interface ObrigacaoExecucao { operadora: string; obrigacao: number; executado: number; gap: number; }

export interface PeriodData {
  periodo: string;
  resumo: Resumo;
  top15_operadoras: OperadoraRow[];
  parceiros: ParceiroRow[];
  concorrentes: ConcorrenteRow[];
  heatmap_ict_op: HeatmapData;
  fit_por_lab: LabRow[];
  top10_subtemas_fit: SubtemaFitRow[];
  temas_tree: TemaTree[];
  crescimento_subtemas: Array<{ subtema: string; valor_atual: number; valor_anterior: number; projetos: number; crescimento: number }>;
  gap_por_operadora: GapOperadora[];
  obrigacao_vs_execucao: ObrigacaoExecucao[];
}

export interface DashboardData {
  "3anos": PeriodData;
  "5anos": PeriodData;
  competencias: {
    verticais: Record<string, string[]>;
    lab_map: Record<string, string[]>;
    fit_subtemas: string[];
  };
}
