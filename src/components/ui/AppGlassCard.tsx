import type { ReactNode } from 'react';

interface AppGlassCardProps {
  children: ReactNode;
  className?: string;
  solid?: boolean;
}

export function AppGlassCard({ children, className = '', solid = false }: AppGlassCardProps) {
  return (
    <section
      className={`app-glass-card p-5 sm:p-6 ${solid ? 'app-glass-card--solid' : ''} ${className}`.trim()}
    >
      {children}
    </section>
  );
}
