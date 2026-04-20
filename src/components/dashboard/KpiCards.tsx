import { Resumo } from "@/types/dashboard";
import { formatBRL, formatNumber } from "@/lib/format";
import { Briefcase, Wallet, Target, AlertTriangle } from "lucide-react";

interface Props { resumo: Resumo; }

export const KpiCards = ({ resumo }: Props) => {
  const items = [
    {
      label: "Total de projetos",
      value: formatNumber(resumo.total_projetos),
      icon: Briefcase,
      tone: "bg-primary-soft text-primary",
    },
    {
      label: "Volume total",
      value: formatBRL(resumo.total_valor),
      icon: Wallet,
      tone: "bg-primary-soft text-primary",
    },
    {
      label: "Projetos com fit",
      value: formatNumber(resumo.projetos_fit_ma),
      sub: formatBRL(resumo.valor_fit_ma),
      icon: Target,
      tone: "bg-success-soft text-success",
    },
    {
      label: "Gap sem ICT",
      value: formatBRL(resumo.valor_gap),
      sub: `${formatNumber(resumo.gap_sem_ict)} projetos`,
      icon: AlertTriangle,
      tone: "bg-warning-soft text-warning",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((it) => {
        const Icon = it.icon;
        return (
          <div key={it.label} className="card-shadow rounded-xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {it.label}
                </p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">{it.value}</p>
                {it.sub && <p className="mt-1 text-xs text-muted-foreground">{it.sub}</p>}
              </div>
              <div className={`rounded-lg p-2 ${it.tone}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
