import type { ReactNode } from 'react';

interface LeadDetailCardProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function LeadDetailCard({
  title,
  action,
  children,
  className = '',
}: LeadDetailCardProps) {
  return (
    <section
      className={`app-glass-card app-glass-card--solid p-5 ${className}`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-navy">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
