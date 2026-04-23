import type { SelectHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: readonly SelectOption[];
  error?: string;
}

export function Select({
  label,
  options,
  error,
  className,
  id,
  required,
  ...rest
}: SelectProps) {
  const selectId = id ?? rest.name;
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-[var(--color-text-secondary)]">
          {label}
          {required && <span className="text-[var(--color-danger)]"> *</span>}
        </label>
      )}
      <select
        id={selectId}
        required={required}
        aria-invalid={!!error}
        className={cn(
          'h-10 rounded-[var(--radius-md)] border px-3 text-sm',
          'bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]',
          'border-[var(--color-border)] focus:border-[var(--color-accent)] focus:outline-none',
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
      {error && <span className="text-xs text-[var(--color-danger)]">{error}</span>}
    </div>
  );
}
