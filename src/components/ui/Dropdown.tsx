import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface DropdownProps {
  trigger: (props: { id: string; expanded: boolean; onToggle: () => void }) => ReactNode;
  children: ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

export function Dropdown({ trigger, children, align = 'right', className }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const menuId = `${id}-menu`;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {trigger({
        id,
        expanded: open,
        onToggle: () => setOpen((v) => !v),
      })}
      {open && (
        <div
          id={menuId}
          role="menu"
          aria-labelledby={id}
          className={cn(
            'absolute top-full z-50 mt-1 min-w-44 rounded-[var(--radius-md)] border border-[var(--color-border)]',
            'bg-[var(--color-surface-elevated)] py-1 shadow-[var(--shadow-lg)]',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export interface DropdownItemProps {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  icon?: ReactNode;
}

export function DropdownItem({ children, onClick, disabled, icon }: DropdownItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      className="flex w-full min-h-[44px] items-center gap-2 px-3 py-2 text-left text-body-sm hover:bg-[var(--color-muted)] disabled:opacity-50"
      onClick={onClick}
    >
      {icon}
      {children}
    </button>
  );
}