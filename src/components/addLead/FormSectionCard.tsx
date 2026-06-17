import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface FormSectionCardProps {
  title: string;
  icon: LucideIcon;
  optional?: boolean;
  children: ReactNode;
}

export function FormSectionCard({
  title,
  icon: Icon,
  optional = false,
  children,
}: FormSectionCardProps) {
  return (
    <section className="app-glass-card app-glass-card--solid p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-2.5">
        <span className="app-section-header__icon">
          <Icon size={18} />
        </span>
        <h2 className="app-section-header__title">
          {title}
          {optional ? (
            <span className="ml-1.5 text-sm font-normal text-slate-400">(Optional)</span>
          ) : null}
        </h2>
      </div>
      {children}
    </section>
  );
}
