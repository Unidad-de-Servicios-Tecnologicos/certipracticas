import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { usePanelResize } from '@/hooks/usePanelResize';

export interface ResizablePanelsProps {
  left: ReactNode;
  right: ReactNode;
  className?: string;
}

export function ResizablePanels({ left, right, className }: ResizablePanelsProps) {
  const { containerRef, leftPercent, startDragging } = usePanelResize();

  return (
    <div
      ref={containerRef}
      className={cn('flex h-full min-h-0 w-full', className)}
      style={{ '--left-width': `${leftPercent}%` } as React.CSSProperties}
    >
      <div
        className="h-full min-w-0 overflow-hidden"
        style={{ width: 'var(--left-width)', minWidth: 280 }}
      >
        {left}
      </div>

      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Redimensionar formulario y vista previa"
        className="z-10 flex w-1 shrink-0 cursor-col-resize flex-col items-center justify-center bg-[var(--color-border)] transition-all hover:w-2 hover:bg-[var(--color-text-secondary)] active:bg-[var(--color-text-primary)]"
        onMouseDown={startDragging}
        onTouchStart={startDragging}
      >
        <div className="h-4 w-0.5 rounded-full bg-[var(--color-bg-primary)] opacity-50" />
      </div>

      <div className="h-full min-w-0 flex-1 overflow-hidden" style={{ minWidth: 320 }}>
        {right}
      </div>
    </div>
  );
}
