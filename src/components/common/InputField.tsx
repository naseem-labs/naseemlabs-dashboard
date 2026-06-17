import { forwardRef } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import './InputField.css';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  endAdornment?: ReactNode;
  error?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  function InputField(
    { label, icon, endAdornment, error, className = '', id, ...props },
    ref,
  ) {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={`input-field ${error ? 'input-field--error' : ''} ${className}`.trim()}>
        <label className="input-field__label" htmlFor={inputId}>
          {label}
        </label>
        <div className="input-field__control">
          {icon ? <span className="input-field__icon">{icon}</span> : null}
          <input
            ref={ref}
            id={inputId}
            className="input-field__input"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
          {endAdornment ? (
            <span className="input-field__end">{endAdornment}</span>
          ) : null}
        </div>
        {error ? (
          <p className="input-field__error" id={`${inputId}-error`} role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);
