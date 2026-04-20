export type Period = "3anos" | "5anos";
export type Vertical =
  | "Manufatura Avançada"
  | "Tecnologias Digitais Avançadas"
  | "Energias Renováveis"
  | "Materiais Avançados"
  | "Biotecnologia";
export type View = "geral" | "vertical";

export interface ResumoGeral {
  total_projetos: number;
  total_valor: number;
  pct_com_ict: number;
  pct_sem_ict: number;
}

export interface OperadoraRow { operadora: string; total: number; projetos: number; }
export interface TaxaIctRow {
  operadora: string;
  total: number;
  com_ict: number;
  com_eb: number;
  sem_nenhum: number;
  pct_ict: number;
}
export interface IctPorOperadora {
  operadora: string;
  volume: number;
  ict1: string;
  ict2: string;
  ict3: string;
}
export interface ParceiroRow { empresa: string; projetos: number; valor: number; operadoras: string[]; }
export interface ConcorrenteRow { ict: string; projetos: number; valor: number; num_operadoras: number; }
export interface HeatmapData { icts: string[]; operadoras: string[]; dados: Array<Record<string, string | number>>; }
export interface ObrigacaoExecucao { operadora: string; obrigacao: number; executado: number; gap: number; }

export interface SubtemaTree { subtema: string; projetos: number; valor: number; sem_ict: number; }
export interface TemaTree {
  tema: string;
  projetos: number;
  valor: number;
  subtemas: SubtemaTree[];
  fit_count?: number;
  fit_valor?: number;
}

export interface ResumoVertical {
  projetos_fit: number;
  valor_fit: number;
  gap_projetos: number;
  gap_valor: number;
  pct_fit: number;
}
export interface SubtemaFit { subtema: string; projetos: number; valor: number; sem_ict: number; }
export interface LabRow { lab: string; projetos: number; valor: number; subtemas: string[]; sem_ict?: number; }
export interface GapVerticalRow {
  operadora: string;
  proj_gap: number;
  valor_gap: number;
  proj_total: number;
  pct_gap: number;
}
export interface CrescimentoSubtema {
  subtema: string;
  valor_atual: number;
  valor_anterior: number;
  projetos: number;
  crescimento: number;
}
export interface TemaComFit {
  tema: string;
  projetos: number;
  valor: number;
  subtemas: SubtemaTree[];
  fit_count: number;
  fit_valor: number;
}

export interface VerticalData {
  cor: string;
  resumo: ResumoVertical;
  top10_subtemas: SubtemaFit[];
  fit_por_lab: LabRow[];
  gap_por_operadora: GapVerticalRow[];
  crescimento_subtemas: CrescimentoSubtema[];
  temas_com_fit: TemaComFit[];
}

export interface TemaInvestigado { tema: string; valor: number; projetos: number; }
export interface SubtemaInvestigado { subtema: string; valor: number; projetos: number; }
export interface FitLab {
  lab: string;
  projetos: number;
  valor: number;
  sem_ict: number;
  subtemas_match: string[];
}
export interface FitVerticalBlock {
  subtemas: SubtemaFit[];
  labs: FitLab[];
  valor_total: number;
  gap_sem_ict: number;
}
export interface ParceiroPotencial {
  empresa: string;
  projetos: number;
  valor: number;
  ja_tem_ict: boolean;
  tipo: string;
  subtemas: string[];
}
export interface ProjetoAnp {
  id: string;
  titulo: string;
  objetivo: string;
  valor: number;
  prazo_meses: number;
  qualificacao: string;
  instituicao: string;
  empresa_br: string;
  tem_ict: boolean;
  ano: number;
}
export interface OperadoraFit {
  operadora: string;
  volume_total: number;
  projetos_total: number;
  temas_investigados: TemaInvestigado[];
  subtemas_investigados: SubtemaInvestigado[];
  fit_manufatura: FitVerticalBlock;
  fit_digital: FitVerticalBlock;
  parceiros_potenciais: ParceiroPotencial[];
  projetos_por_subtema?: Record<string, ProjetoAnp[]>;
}

export interface PeriodData {
  periodo: string;
  resumo_geral: ResumoGeral;
  top15_operadoras: OperadoraRow[];
  taxa_ict_operadora: TaxaIctRow[];
  ict_por_operadora: IctPorOperadora[];
  parceiros_geral: ParceiroRow[];
  concorrentes: ConcorrenteRow[];
  heatmap_ict_op: HeatmapData;
  obrigacao_vs_execucao: ObrigacaoExecucao[];
  temas_tree: TemaTree[];
  top5_operadoras_fit: OperadoraFit[];
  por_vertical: Record<Vertical, VerticalData>;
}

export interface VerticalMeta { cor: string; labs: string[]; }

export interface DashboardData {
  "3anos": PeriodData;
  "5anos": PeriodData;
  verticais_meta: Record<Vertical, VerticalMeta>;
}
