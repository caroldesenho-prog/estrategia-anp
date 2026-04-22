import { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

export const SectionCard = ({ title, subtitle, children, action, className = "" }: Props) => (
  <section className={`card-shadow rounded-lg border border-beige-medium bg-white ${className}`}>
    <header className="flex items-start justify-between gap-4 border-b border-beige-medium px-6 py-4">
      <div className="flex items-start gap-3">
        <span className="mt-1 inline-block h-5 w-[3px] shrink-0 rounded-sm bg-primary" aria-hidden />
        <div>
          <h2 className="text-base font-semibold text-graphite-dark">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-graphite-medium">{subtitle}</p>}
        </div>
      </div>
      {action}
    </header>
    <div className="p-6">{children}</div>
  </section>
);
