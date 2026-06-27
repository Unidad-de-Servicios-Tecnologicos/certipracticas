import { cn } from '@/utils/cn';
import { useAppStore } from '@/store/useAppStore';
import type { MobileTab } from '@/store/useAppStore';

export interface MobileTabLayoutProps {
  formContent: React.ReactNode;
  previewContent: React.ReactNode;
}

export function MobileTabLayout({ formContent, previewContent }: MobileTabLayoutProps) {
  const mobileTab = useAppStore((s) => s.mobileTab);
  const setMobileTab = useAppStore((s) => s.setMobileTab);
  const previewHasChanges = useAppStore((s) => s.previewHasChanges);

  const tabs: { id: MobileTab; label: string }[] = [
    { id: 'form', label: 'Formulario' },
    { id: 'preview', label: 'Preview' },
  ];

  return (
    <div className="flex h-full flex-col lg:hidden">
      <div className="flex shrink-0 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setMobileTab(tab.id)}
            className={cn(
              'flex-1 py-2.5 text-sm font-medium transition-colors',
              mobileTab === tab.id
                ? 'border-b-2 border-[var(--color-accent)] text-[var(--color-accent)]'
                : 'text-[var(--color-text-secondary)]'
            )}
          >
            {tab.label}
            {tab.id === 'preview' && previewHasChanges && (
              <span className="ml-1 text-[var(--color-accent)]">●</span>
            )}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-hidden">
        {mobileTab === 'form' ? formContent : previewContent}
      </div>
    </div>
  );
}
