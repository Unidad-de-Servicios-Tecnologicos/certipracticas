import { useCallback, useRef, type KeyboardEvent } from 'react';
import { cn } from '@/utils/cn';
import { useAppStore } from '@/store/useAppStore';
import type { MobileTab } from '@/store/useAppStore';

export interface MobileTabLayoutProps {
  formContent: React.ReactNode;
  previewContent: React.ReactNode;
}

const TABS: { id: MobileTab; label: string }[] = [
  { id: 'form', label: 'Formulario' },
  { id: 'preview', label: 'Preview' },
];

export function MobileTabLayout({ formContent, previewContent }: MobileTabLayoutProps) {
  const mobileTab = useAppStore((s) => s.mobileTab);
  const setMobileTab = useAppStore((s) => s.setMobileTab);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    const idx = TABS.findIndex((t) => t.id === mobileTab);
    if (e.key === 'ArrowRight') {
      const next = TABS[(idx + 1) % TABS.length];
      setMobileTab(next.id);
      tabRefs.current[(idx + 1) % TABS.length]?.focus();
    } else if (e.key === 'ArrowLeft') {
      const prev = TABS[(idx - 1 + TABS.length) % TABS.length];
      setMobileTab(prev.id);
      tabRefs.current[(idx - 1 + TABS.length) % TABS.length]?.focus();
    }
  }, [mobileTab, setMobileTab]);

  return (
    <div className="flex h-full flex-col lg:hidden">
      <div
        role="tablist"
        aria-label="Vista del generador"
        className="flex shrink-0 border-b border-[var(--color-border)] bg-[var(--color-sidebar)]"
        onKeyDown={handleKeyDown}
      >
        {TABS.map((tab, i) => (
          <button
            key={tab.id}
            ref={(el) => { tabRefs.current[i] = el; }}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={mobileTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            tabIndex={mobileTab === tab.id ? 0 : -1}
            onClick={() => setMobileTab(tab.id)}
            className={cn(
              'min-h-[44px] flex-1 py-2.5 text-body-sm font-medium transition-colors',
              mobileTab === tab.id
                ? 'border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'text-[var(--color-muted-foreground)]'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        id={`panel-${mobileTab}`}
        role="tabpanel"
        aria-labelledby={`tab-${mobileTab}`}
        tabIndex={0}
        className="flex-1 overflow-hidden"
      >
        {mobileTab === 'form' ? formContent : previewContent}
      </div>
    </div>
  );
}
