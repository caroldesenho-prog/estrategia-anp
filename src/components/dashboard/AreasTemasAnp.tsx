import { formatNumber } from "@/lib/format";

type Tema = { nome: string; valorLabel: string; valor: number; projetos: number };
type Area = {
  nome: string;
  totalLabel: string;
  projetos: number;
  pontoColor: string;
  bgColor: string;
  span: "full" | "half";
  temas: Tema[];
};

const areas: Area[] = [
  {
    nome: "Exploração e Produção",
    totalLabel: "R$ 27,3 bi",
    projetos: 2973,
    pontoColor: "#D72042",
    bgColor: "#FDF0EE",
    span: "full",
    temas: [
      { nome: "Produção Pré-sal", valorLabel: "R$ 15,7 bi", valor: 15700, projetos: 1422 },
      { nome: "Exploração Pré-sal", valorLabel: "R$ 7,3 bi", valor: 7300, projetos: 1026 },
      { nome: "Engenharia de Poço", valorLabel: "R$ 2,7 bi", valor: 2700, projetos: 325 },
      { nome: "Recuperação Avançada", valorLabel: "R$ 1,6 bi", valor: 1600, projetos: 200 },
    ],
  },
  {
    nome: "Temas Transversais",
    totalLabel: "R$ 9,9 bi",
    projetos: 1441,
    pontoColor: "#303A42",
    bgColor: "#F0F0F0",
    span: "half",
    temas: [
      { nome: "Segurança e Meio Ambiente", valorLabel: "R$ 5,4 bi", valor: 5400, projetos: 597 },
      { nome: "Materiais", valorLabel: "R$ 1,7 bi", valor: 1700, projetos: 441 },
      { nome: "Conformidade e Controle", valorLabel: "R$ 1,5 bi", valor: 1500, projetos: 253 },
      { nome: "Distribuição e Logística", valorLabel: "R$ 1,4 bi", valor: 1400, projetos: 150 },
    ],
  },
  {
    nome: "Abastecimento",
    totalLabel: "R$ 2,0 bi",
    projetos: 532,
    pontoColor: "#8E1A3A",
    bgColor: "#FDF0EE",
    span: "half",
    temas: [
      { nome: "Refino", valorLabel: "R$ 1,6 bi", valor: 1600, projetos: 410 },
      { nome: "Combustíveis e Lubrificantes", valorLabel: "R$ 320 mi", valor: 320, projetos: 80 },
      { nome: "Petroquímica", valorLabel: "R$ 118 mi", valor: 118, projetos: 42 },
    ],
  },
  {
    nome: "Outras Fontes de Energia",
    totalLabel: "R$ 1,4 bi",
    projetos: 170,
    pontoColor: "#3B6D11",
    bgColor: "#EAF3DE",
    span: "half",
    temas: [
      { nome: "Outras Fontes Alternativas", valorLabel: "R$ 719 mi", valor: 719, projetos: 98 },
      { nome: "Hidrogênio", valorLabel: "R$ 475 mi", valor: 475, projetos: 43 },
      { nome: "Energia Solar", valorLabel: "R$ 181 mi", valor: 181, projetos: 29 },
    ],
  },
  {
    nome: "Biocombustíveis",
    totalLabel: "R$ 1,3 bi",
    projetos: 176,
    pontoColor: "#5A9E28",
    bgColor: "#EAF3DE",
    span: "half",
    temas: [
      { nome: "Bioquerosene de Aviação", valorLabel: "R$ 439 mi", valor: 439, projetos: 22 },
      { nome: "Biocombustíveis Avançados", valorLabel: "R$ 393 mi", valor: 393, projetos: 65 },
      { nome: "Biomassa", valorLabel: "R$ 162 mi", valor: 162, projetos: 30 },
      { nome: "Bioetanol", valorLabel: "R$ 159 mi", valor: 159, projetos: 21 },
      { nome: "Biodiesel", valorLabel: "R$ 158 mi", valor: 158, projetos: 38 },
    ],
  },
  {
    nome: "Gás Natural",
    totalLabel: "R$ 384 mi",
    projetos: 135,
    pontoColor: "#5E6267",
    bgColor: "#F0F0F0",
    span: "half",
    temas: [
      { nome: "Produção e Processamento", valorLabel: "R$ 229 mi", valor: 229, projetos: 81 },
      { nome: "Utilização", valorLabel: "R$ 104 mi", valor: 104, projetos: 30 },
      { nome: "Movimentação e Armazenamento", valorLabel: "R$ 51 mi", valor: 51, projetos: 24 },
    ],
  },
  {
    nome: "Regulação do Setor",
    totalLabel: "R$ 244 mi",
    projetos: 49,
    pontoColor: "#303A42",
    bgColor: "#F0F0F0",
    span: "half",
    temas: [
      { nome: "Aspectos Econômicos", valorLabel: "R$ 195 mi", valor: 195, projetos: 43 },
      { nome: "Aspectos Jurídicos", valorLabel: "R$ 50 mi", valor: 50, projetos: 6 },
    ],
  },
];

const Badge = ({ label, value }: { label: string; value: string }) => (
  <div className="inline-flex items-center gap-2 rounded-full border border-beige-medium bg-white px-3 py-1 text-xs">
    <span className="font-medium text-graphite-medium">{label}:</span>
    <span className="font-bold text-graphite-dark">{value}</span>
  </div>
);

const AreaCard = ({ area }: { area: Area }) => {
  const max = Math.max(...area.temas.map((t) => t.valor));
  return (
    <div
      className="rounded-lg border border-beige-medium p-5"
      style={{ backgroundColor: area.bgColor }}
    >
      <header className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: area.pontoColor }}
            aria-hidden
          />
          <h3 className="text-sm font-semibold text-graphite-dark">{area.nome}</h3>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-graphite-dark">{area.totalLabel}</div>
          <div className="text-xs text-graphite-medium">{formatNumber(area.projetos)} proj</div>
        </div>
      </header>
      <ul className="space-y-3">
        {area.temas.map((t) => {
          const pct = (t.valor / max) * 100;
          return (
            <li key={t.nome}>
              <div className="mb-1 flex items-baseline justify-between gap-2 text-xs">
                <span className="font-medium text-graphite-dark">{t.nome}</span>
                <span className="text-graphite-medium">
                  <span className="font-semibold text-graphite-dark">{t.valorLabel}</span> ·{" "}
                  {formatNumber(t.projetos)} proj
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/70">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, backgroundColor: area.pontoColor }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export const AreasTemasAnp = () => {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <Badge label="Áreas Temáticas" value="7" />
        <Badge label="Temas" value="23" />
        <Badge label="Subtemas" value="100+" />
      </div>

      <p className="flex items-center gap-2 text-graphite-medium" style={{ fontSize: "11px" }}>
        <span
          aria-hidden
          className="inline-block h-1.5 w-6 shrink-0 rounded-full bg-graphite-medium/60"
        />
        — A barra indica o volume relativo de cada tema dentro da sua área: quanto maior, maior o
        investimento comparado aos demais temas do mesmo grupo.
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {areas.map((a) => (
          <div key={a.nome} className={a.span === "full" ? "md:col-span-2" : ""}>
            <AreaCard area={a} />
          </div>
        ))}
      </div>
    </div>
  );
};
