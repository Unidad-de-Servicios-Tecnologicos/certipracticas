import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { Button } from './Button';

type EmptyStateVariant = 'list' | 'section' | 'search';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
  variant?: EmptyStateVariant;
  className?: string;
}

const variantClasses: Record<EmptyStateVariant, string> = {
  list: 'p-6',
  section: 'p-8',
  search: 'p-4',
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  variant = 'section',
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] text-center',
        variantClasses[variant],
        className
      )}
    >
      {icon && <div className="text-3xl text-[var(--color-muted-foreground)]">{icon}</div>}
      <h3 className="text-h3 text-[var(--color-foreground)]">{title}</h3>
      <p className="max-w-sm text-body-sm text-[var(--color-muted-foreground)]">{description}</p>
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
