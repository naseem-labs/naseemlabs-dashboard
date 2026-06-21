import { memo } from 'react';
import type { LucideIcon } from 'lucide-react';
import type { WorkspaceAccent } from '../../types/workspace.types';
import './RoleOptionCard.css';

interface RoleOptionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  accent: WorkspaceAccent;
  isSelected: boolean;
  onSelect: () => void;
}

export const RoleOptionCard = memo(function RoleOptionCard({
  title,
  description,
  icon: Icon,
  accent,
  isSelected,
  onSelect,
}: RoleOptionCardProps) {
  return (
    <button
      type="button"
      className={`role-option role-option--${accent} ${
        isSelected ? 'role-option--selected' : ''
      }`}
      onClick={onSelect}
      aria-pressed={isSelected}
    >
      <span className="role-option__top">
        <span
          className={`role-option__radio ${isSelected ? 'role-option__radio--selected' : ''}`}
          aria-hidden="true"
        />
        <span className="role-option__icon" aria-hidden="true">
          <Icon size={20} strokeWidth={2} />
        </span>
        <span className="role-option__title">{title}</span>
      </span>
      <span className="role-option__description">{description}</span>
    </button>
  );
});
