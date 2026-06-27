import { cn } from '@/utils/cn';

export interface ProgressBarProps {
  percentage: number;
  pendingCount: number;
  completedCount: number;
  errorCount: number;
  onErrorClick?: () => void;
  compact?: boolean;
  className?: string;
}

export function ProgressBar({
  percentage,
  pendingCount,
  completedCount,
  errorCount,
  onErrorClick,
  compact,
  className,
}: ProgressBarProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center justify-between gap-2 text-xs text-[var(--color-text-secondary)]">
        <span>{percentage}% completado</span>
        {!compact && (
          <span>
            {completedCount} listas · {pendingCount} pendientes
          </span>
        )}
      </div>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-bg-tertiary)]"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {errorCount > 0 && (
        <button
          type="button"
          onClick={onErrorClick}
          className="text-left text-xs text-[var(--color-danger)] hover:underline"
        >
          {errorCount} {errorCount === 1 ? 'error' : 'errores'} — revisar
        </button>
      )}
    </div>
  );
}
