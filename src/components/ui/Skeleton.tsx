import { cn } from '@/utils/cn';

export interface SkeletonProps {
  className?: string;
  lines?: number;
}

export function Skeleton({ className, lines = 1 }: SkeletonProps) {
  if (lines <= 1) {
    return (
      <div
        className={cn('animate-pulse rounded-[var(--radius-md)] bg-[var(--color-muted)]/40', className)}
        aria-hidden
      />
    );
  }

  return (
    <div className="flex flex-col gap-2" aria-hidden>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-4 animate-pulse rounded-[var(--radius-md)] bg-[var(--color-muted)]/40',
            i === lines - 1 && 'w-3/4',
            className
          )}
        />
      ))}
    </div>
  );
}
