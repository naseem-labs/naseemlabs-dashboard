import { memo, type ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { WorkspaceAccent } from '../../types/workspace.types';
import './WorkspaceOptionCard.css';

interface WorkspaceOptionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  accent: WorkspaceAccent;
  isSelected: boolean;
  isExpanded: boolean;
  onSelect: () => void;
  children?: ReactNode;
}

export const WorkspaceOptionCard = memo(function WorkspaceOptionCard({
  title,
  description,
  icon: Icon,
  accent,
  isSelected,
  isExpanded,
  onSelect,
  children,
}: WorkspaceOptionCardProps) {
  return (
    <article
      className={`workspace-option workspace-option--${accent} ${
        isSelected ? 'workspace-option--selected' : ''
      } ${isExpanded ? 'workspace-option--expanded' : ''}`}
    >
      <button
        type="button"
        className="workspace-option__header"
        onClick={onSelect}
        aria-expanded={isExpanded}
      >
        <span className="workspace-option__icon" aria-hidden="true">
          <Icon size={22} strokeWidth={2} />
        </span>

        <span className="workspace-option__content">
          <span className="workspace-option__title">{title}</span>
          <span className="workspace-option__description">{description}</span>
        </span>

        <span
          className={`workspace-option__radio ${isSelected ? 'workspace-option__radio--selected' : ''}`}
          aria-hidden="true"
        />

        {isExpanded ? (
          <ChevronUp className="workspace-option__chevron" size={20} strokeWidth={2} aria-hidden="true" />
        ) : (
          <ChevronDown className="workspace-option__chevron" size={20} strokeWidth={2} aria-hidden="true" />
        )}
      </button>

      {isExpanded ? <div className="workspace-option__body">{children}</div> : null}
    </article>
  );
});
