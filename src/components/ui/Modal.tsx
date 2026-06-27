import { useEffect, useId, useRef, type ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { useFocusTrap } from '@/hooks/useFocusTrap';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useFocusTrap(panelRef, open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={cn(
          'max-h-[90vh] w-full max-w-lg overflow-auto rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)]',
          'bg-[var(--color-surface)] text-[var(--color-foreground)] border border-[var(--color-border)]',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <header className="border-b border-[var(--color-border)] p-[var(--space-4)]">
            <h2 id={titleId} className="text-h3">
              {title}
            </h2>
          </header>
        )}
        <div className="p-[var(--space-4)]">{children}</div>
      </div>
    </div>
  );
}
