import type { LucideIcon } from 'lucide-react';

interface AppSectionHeaderProps {
  title: string;
  icon: LucideIcon;
}

export function AppSectionHeader({ title, icon: Icon }: AppSectionHeaderProps) {
  return (
    <div className="app-section-header">
      <span className="app-section-header__icon" aria-hidden="true">
        <Icon size={18} />
      </span>
      <h2 className="app-section-header__title">{title}</h2>
    </div>
  );
}
