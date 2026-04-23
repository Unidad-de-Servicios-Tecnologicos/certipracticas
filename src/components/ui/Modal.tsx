import { useEffect, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
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
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className={cn(
          'max-h-[90vh] w-full max-w-lg overflow-auto rounded-[var(--radius-lg)] shadow-lg',
          'bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] border border-[var(--color-border)]',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <header className="border-b border-[var(--color-border)] p-4">
            <h2 className="text-lg font-semibold">{title}</h2>
          </header>
        )}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
