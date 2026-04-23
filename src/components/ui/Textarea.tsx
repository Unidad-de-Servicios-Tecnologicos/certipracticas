import type { ReactNode, TextareaHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  rightSlot?: ReactNode;
}

export function Textarea({
  label,
  error,
  rightSlot,
  className,
  id,
  required,
  rows = 4,
  maxLength = 5000,
  ...rest
}: TextareaProps) {
  const inputId = id ?? rest.name;
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[var(--color-text-secondary)]">
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
          className={cn(
            'flex-1 rounded-[var(--radius-md)] border px-3 py-2 text-sm resize-y',
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
