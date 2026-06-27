import { useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  rightSlot?: ReactNode;
}

export function Input({
  label,
  error,
  hint,
  rightSlot,
  className,
  id,
  required,
  maxLength = 200,
  ...rest
}: InputProps) {
  const autoId = useId();
  const inputId = id ?? rest.name ?? autoId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  return (
    <div className="flex w-full flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-label text-[var(--color-muted-foreground)]">
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
          aria-describedby={
            [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined
          }
          className={cn(
            'h-10 min-h-[44px] flex-1 rounded-[var(--radius-md)] border px-3 text-body-sm',
            'bg-[var(--color-surface)] text-[var(--color-foreground)]',
            'border-[var(--color-border)] placeholder:text-[var(--color-muted-foreground)]/60',
            'focus:border-[var(--color-primary)] focus:outline-none',
            error && 'border-[var(--color-danger)]',
            className
          )}
          {...rest}
        />
        {rightSlot}
      </div>
      {hint && !error && (
        <p id={hintId} className="text-caption text-[var(--color-muted-foreground)]">
          {hint}
        </p>
      )}
      {error && (
        <span id={errorId} role="alert" className="text-caption text-[var(--color-danger)]">
          {error}
        </span>
      )}
    </div>
  );
}
