import { useState, type ReactNode } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { cn } from '@/utils/cn';

export interface FormSectionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  rightAction?: ReactNode;
}

export function FormSection({
  title,
  icon,
  children,
  defaultOpen = true,
  rightAction,
}: FormSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
      <header className="flex items-center justify-between gap-2 px-4 py-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex flex-1 items-center gap-2 text-left text-sm font-semibold text-[var(--color-text-primary)]"
        >
          <FaChevronDown
            className={cn(
              'h-3 w-3 text-[var(--color-text-secondary)] transition-transform',
              !open && '-rotate-90'
            )}
          />
          {icon}
          <span>{title}</span>
        </button>
        {rightAction}
      </header>
      {open && <div className="flex flex-col gap-3 border-t border-[var(--color-border)] p-4">{children}</div>}
    </section>
  );
}
