import { cn } from '@/utils/cn';
import { useAutosave } from '@/hooks/useAutosave';
import { Button } from '@/components/ui/Button';

export function StatusBar() {
  const { status, savedAgoLabel, retry } = useAutosave();

  return (
    <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-1.5 text-xs text-[var(--color-text-secondary)]">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'inline-block h-1.5 w-1.5 rounded-full',
            status === 'saving' && 'animate-pulse bg-[var(--color-accent)]',
            status === 'saved' && 'bg-[var(--color-accent)]',
            status === 'idle' && 'bg-[var(--color-border)]',
            status === 'error' && 'bg-[var(--color-danger)]'
          )}
          aria-hidden
        />
        <span
          className={cn(
            status === 'saved' && 'motion-safe:animate-[fadeIn_0.3s_ease]',
            status === 'error' && 'text-[var(--color-danger)]'
          )}
        >
          {savedAgoLabel}
        </span>
        {status === 'error' && (
          <Button size="sm" variant="ghost" onClick={retry} className="h-6 px-2 text-xs">
            Reintentar
          </Button>
        )}
      </div>
      <span className="hidden sm:inline">
        <kbd className="rounded border border-[var(--color-border)] px-1">Ctrl</kbd>+
        <kbd className="rounded border border-[var(--color-border)] px-1">K</kbd> acciones
      </span>
    </footer>
  );
}
