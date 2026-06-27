import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  className?: string;
}

const variants: Record<AlertVariant, string> = {
  info: 'border-[var(--color-info)]/30 bg-[var(--color-info)]/10 text-[var(--color-foreground)]',
  success: 'border-[var(--color-success)]/30 bg-[var(--color-success)]/10 text-[var(--color-foreground)]',
  warning: 'border-[var(--color-warning)]/30 bg-[var(--color-warning)]/10 text-[var(--color-foreground)]',
  danger: 'border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10 text-[var(--color-foreground)]',
};

export function Alert({ variant = 'info', title, children, className }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        'rounded-[var(--radius-md)] border px-[var(--space-3)] py-[var(--space-2)] text-[var(--text-body-sm)]',
        variants[variant],
        className
      )}
    >
      {title && <p className="mb-1 font-medium">{title}</p>}
      {children}
    </div>
  );
}
