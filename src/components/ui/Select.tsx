import { useId, type SelectHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: readonly SelectOption[];
  error?: string;
  hint?: string;
}

export function Select({
  label,
  options,
  error,
  hint,
  className,
  id,
  required,
  ...rest
}: SelectProps) {
  const autoId = useId();
  const selectId = id ?? rest.name ?? autoId;
  const errorId = `${selectId}-error`;
  const hintId = `${selectId}-hint`;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={selectId} className="text-label text-[var(--color-muted-foreground)]">
          {label}
          {required && <span className="text-[var(--color-danger)]"> *</span>}
        </label>
      )}
      <select
        id={selectId}
        required={required}
        aria-invalid={!!error}
        aria-describedby={
          [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined
        }
        className={cn(
          'h-10 min-h-[44px] rounded-[var(--radius-md)] border px-3 text-body-sm',
          'bg-[var(--color-surface)] text-[var(--color-foreground)]',
          'border-[var(--color-border)] focus:border-[var(--color-primary)] focus:outline-none',
          error && 'border-[var(--color-danger)]',
          className
        )}
        {...rest}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
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
