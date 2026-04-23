import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface BadgeProps {
  children: ReactNode;
  kind?: 'accent' | 'neutral' | 'danger' | 'warning';
  className?: string;
}

const kinds = {
  accent: 'bg-[var(--color-accent)]/15 text-[var(--color-accent)]',
  neutral: 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]',
  danger: 'bg-[var(--color-danger)]/15 text-[var(--color-danger)]',
  warning: 'bg-[var(--color-warning)]/15 text-[var(--color-warning)]',
} as const;

export function Badge({ children, kind = 'neutral', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        kinds[kind],
        className
      )}
    >
      {children}
    </span>
  );
}
