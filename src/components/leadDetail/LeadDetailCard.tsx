import type { ReactNode } from 'react';

interface LeadDetailCardProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  titleClassName?: string;
}

export function LeadDetailCard({
  title,
  action,
  children,
  className = '',
  headerClassName = 'mb-4 flex items-center justify-between gap-3',
  titleClassName = 'text-sm font-semibold text-navy',
}: LeadDetailCardProps) {
  return (
    <section
      className={`app-glass-card app-glass-card--solid box-border w-full min-w-0 max-w-full overflow-hidden p-5 ${className}`}
    >
      <div className={headerClassName}>
        <h2 className={titleClassName}>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
