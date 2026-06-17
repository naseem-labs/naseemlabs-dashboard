import type { ReactNode } from 'react';

interface AppFieldProps {
  label: string;
  htmlFor: string;
  icon?: ReactNode;
  error?: string;
  children: ReactNode;
}

export function AppField({ label, htmlFor, icon, error, children }: AppFieldProps) {
  return (
    <div className="app-field">
      <label className="app-field__label" htmlFor={htmlFor}>
        {label}
      </label>
      <div className={`app-input-wrap ${error ? 'border-red-300' : ''}`}>
        {icon ? <span className="app-input-wrap__icon">{icon}</span> : null}
        {children}
      </div>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
