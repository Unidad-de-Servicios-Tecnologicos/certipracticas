import { useId, type ReactNode, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  rightSlot?: ReactNode;
}

export function Textarea({
  label,
  error,
  hint,
  rightSlot,
  className,
  id,
  required,
  rows = 4,
  maxLength = 5000,
  ...rest
}: TextareaProps) {
  const autoId = useId();
  const inputId = id ?? rest.name ?? autoId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-label text-[var(--color-muted-foreground)]">
          {label}
          {required && <span className="text-[var(--color-danger)]"> *</span>}
        </label>
      )}
      <div className="flex items-start gap-2">
        <textarea
          id={inputId}
          required={required}
          rows={rows}
          maxLength={maxLength}
          aria-invalid={!!error}
          aria-describedby={
            [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined
          }
          className={cn(
            'flex-1 resize-y rounded-[var(--radius-md)] border px-3 py-2 text-body-sm',
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
