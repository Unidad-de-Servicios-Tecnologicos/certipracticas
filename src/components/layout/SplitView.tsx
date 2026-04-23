import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface SplitViewProps {
  left: ReactNode;
  right: ReactNode;
  className?: string;
}

export function SplitView({ left, right, className }: SplitViewProps) {
  const [leftWidth, setLeftWidth] = useState(40);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const startDragging = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const stopDragging = useCallback(() => {
    setIsDragging(false);
  }, []);

  const onDrag = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !containerRef.current) return;

      let clientX: number;
      if ('touches' in e) {
        clientX = e.touches[0].clientX;
      } else {
        clientX = e.clientX;
      }

      const { left, width } = containerRef.current.getBoundingClientRect();
      const newLeftWidth = ((clientX - left) / width) * 100;

      // Clamp between 20% and 80%
      if (newLeftWidth >= 20 && newLeftWidth <= 80) {
        setLeftWidth(newLeftWidth);
      }
    },
    [isDragging]
  );

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', onDrag);
      window.addEventListener('mouseup', stopDragging);
      window.addEventListener('touchmove', onDrag, { passive: false });
      window.addEventListener('touchend', stopDragging);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      window.removeEventListener('mousemove', onDrag);
      window.removeEventListener('mouseup', stopDragging);
      window.removeEventListener('touchmove', onDrag);
      window.removeEventListener('touchend', stopDragging);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
    return () => {
      window.removeEventListener('mousemove', onDrag);
      window.removeEventListener('mouseup', stopDragging);
      window.removeEventListener('touchmove', onDrag);
      window.removeEventListener('touchend', stopDragging);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, onDrag, stopDragging]);

  return (
    <div
      ref={containerRef}
      className={cn('flex h-full w-full flex-col lg:flex-row', className)}
      style={{ '--left-width': `${leftWidth}%` } as React.CSSProperties}
    >
      <div className="order-2 flex-1 overflow-auto border-t border-[var(--color-border)] bg-[var(--color-bg-primary)] lg:order-1 lg:w-[var(--left-width)] lg:flex-none lg:border-t-0">
        {left}
      </div>
      
      <div
        className="hidden lg:flex w-1 flex-col items-center justify-center bg-[var(--color-border)] hover:bg-[var(--color-text-secondary)] hover:w-2 transition-all cursor-col-resize active:bg-[var(--color-text-primary)] z-10 order-2"
        onMouseDown={startDragging}
        onTouchStart={startDragging}
      >
        {/* Puntos de agarre sutiles */}
        <div className="h-4 w-0.5 bg-[var(--color-bg-primary)] rounded-full opacity-50" />
      </div>

      <div className="order-1 flex-1 overflow-auto bg-[var(--color-bg-tertiary)] lg:order-3">
        {right}
      </div>
    </div>
  );
}
