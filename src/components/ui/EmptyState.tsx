import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] p-8 text-center',
        className
      )}
    >
      {icon && <div className="text-3xl text-[var(--color-text-secondary)]">{icon}</div>}
      <h3 className="text-base font-semibold text-[var(--color-text-primary)]">{title}</h3>
      <p className="max-w-sm text-sm text-[var(--color-text-secondary)]">{description}</p>
      <div className="flex flex-wrap justify-center gap-2 pt-2">
        {action && (
          <Button size="sm" onClick={action.onClick}>
            {action.label}
          </Button>
        )}
        {secondaryAction && (
          <Button size="sm" variant="ghost" onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </div>
  );
}
