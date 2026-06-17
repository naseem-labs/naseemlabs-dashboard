import type { ReactNode } from 'react';
import { BACKGROUND_IMAGE_URL } from '../../constants/assets';
import '../../styles/glass.css';
import './GlassPageShell.css';

interface GlassPageShellProps {
  children: ReactNode;
  className?: string;
}

export function GlassPageShell({ children, className = '' }: GlassPageShellProps) {
  return (
    <div className={`glass-page ${className}`.trim()}>
      <img
        className="glass-page__background"
        src={BACKGROUND_IMAGE_URL}
        alt=""
        aria-hidden="true"
        decoding="async"
        fetchPriority="high"
      />
      <div className="glass-page__overlay" aria-hidden="true" />
      <div className="glass-page__container">{children}</div>
    </div>
  );
}
