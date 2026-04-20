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

export const KpiCards = ({ items }: Props) => {
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
