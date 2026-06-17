import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  isLoading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

export function Button({
  variant = 'primary',
  isLoading = false,
  startIcon,
  endIcon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`btn btn--${variant} ${className}`.trim()}
      disabled={disabled || isLoading}
      {...props}
    >
      {!isLoading && startIcon ? (
        <span className="btn__icon btn__icon--start">{startIcon}</span>
      ) : null}
      <span className="btn__content">
        {isLoading ? 'Signing in...' : children}
      </span>
      {!isLoading && endIcon ? <span className="btn__icon">{endIcon}</span> : null}
    </button>
  );
}
