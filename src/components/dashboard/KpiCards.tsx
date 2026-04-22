import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

export interface KpiItem {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  tone?: string;
}

interface Props { items: KpiItem[]; }

// Top border colors per index: vermelho, bordeaux, grafite médio, grafite escuro
const TOP_BORDER = ["#D72042", "#8E1A3A", "#5E6267", "#303A42"];

export const KpiCards = ({ items }: Props) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((it, idx) => {
        const Icon = it.icon;
        return (
          <div
            key={it.label}
            className="card-shadow overflow-hidden rounded-lg border border-beige-medium bg-white"
            style={{ borderTop: `3px solid ${TOP_BORDER[idx % TOP_BORDER.length]}` }}
          >
            <div className="flex items-start justify-between p-5">
              <div>
                <p className="text-xs font-medium uppercase text-graphite-medium" style={{ letterSpacing: "0.4px" }}>
                  {it.label}
                </p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-graphite-dark">{it.value}</p>
                {it.sub && <p className="mt-1 text-xs text-graphite-medium">{it.sub}</p>}
              </div>
              <div className={`rounded-lg p-2 ${it.tone ?? "bg-primary-soft text-primary"}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const KpiHeader = ({ children }: { children: ReactNode }) => <>{children}</>;
