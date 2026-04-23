import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightSlot?: ReactNode;
}

export function Input({ label, error, rightSlot, className, id, required, maxLength = 200, ...rest }: InputProps) {
  const inputId = id ?? rest.name;
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[var(--color-text-secondary)]">
          {label}
          {required && <span className="text-[var(--color-danger)]"> *</span>}
        </label>
      )}
      <div className="flex items-center gap-2">
        <input
          id={inputId}
          required={required}
          maxLength={maxLength}
          aria-invalid={!!error}
          className={cn(
            'flex-1 h-10 rounded-[var(--radius-md)] border px-3 text-sm',
            'bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]',
            'border-[var(--color-border)] placeholder:text-[var(--color-text-secondary)]/60',
            'focus:border-[var(--color-accent)] focus:outline-none',
            error && 'border-[var(--color-danger)]',
            className
          )}
          {...rest}
        />
        {rightSlot}
      </div>
      {error && <span className="text-xs text-[var(--color-danger)]">{error}</span>}
    </div>
  );
}
