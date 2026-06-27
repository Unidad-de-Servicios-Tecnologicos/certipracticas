import type { ReactNode } from 'react';
import { Tooltip } from './Tooltip';

export interface FieldTooltipProps {
  label: string;
  hint?: string;
  children: ReactNode;
}

export function FieldTooltip({ label, hint, children }: FieldTooltipProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        {children}
        <Tooltip label={label}>
          <span
            className="inline-flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-[var(--color-bg-tertiary)] text-[10px] text-[var(--color-text-secondary)]"
            aria-label={label}
          >
            ?
          </span>
        </Tooltip>
      </div>
      {hint && <p className="text-xs text-[var(--color-text-secondary)]">{hint}</p>}
    </div>
  );
}
