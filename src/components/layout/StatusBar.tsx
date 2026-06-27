import { cn } from '@/utils/cn';
import { useAutosave } from '@/hooks/useAutosave';
import { Button } from '@/components/ui/Button';

export function StatusBar() {
  const { status, savedAgoLabel, retry } = useAutosave();

  return (
    <footer
      role="status"
      className="flex shrink-0 items-center justify-between gap-3 border-t border-[var(--color-border)] bg-[var(--color-sidebar)] px-4 py-1.5 text-caption text-[var(--color-muted-foreground)]"
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'inline-block h-1.5 w-1.5 rounded-full',
            status === 'saving' && 'animate-pulse bg-[var(--color-primary)]',
            status === 'saved' && 'bg-[var(--color-primary)]',
            status === 'idle' && 'bg-[var(--color-border)]',
            status === 'error' && 'bg-[var(--color-danger)]'
          )}
          aria-hidden
        />
        <span
          aria-live="polite"
          aria-atomic="true"
          className={cn(
            status === 'saved' && 'motion-safe:animate-[fadeIn_0.3s_ease]',
            status === 'error' && 'text-[var(--color-danger)]'
          )}
        >
          {savedAgoLabel}
        </span>
        {status === 'error' && (
          <Button size="sm" variant="ghost" onClick={retry} className="h-9 min-h-[44px] px-2 text-caption">
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
