import { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

export const SectionCard = ({ title, subtitle, children, action, className = "" }: Props) => (
  <section className={`card-shadow rounded-xl border border-border bg-card ${className}`}>
    <header className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
      <div>
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </header>
    <div className="p-6">{children}</div>
  </section>
);
