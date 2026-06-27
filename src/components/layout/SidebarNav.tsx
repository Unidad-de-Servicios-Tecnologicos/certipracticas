import { cn } from '@/utils/cn';
import { FORM_SECTIONS } from '@/data/formSections';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useAppStore } from '@/store/useAppStore';
import { useFormProgress } from '@/hooks/useFormProgress';
import type { FormSectionId } from '@/types/formSection';

export interface SidebarNavProps {
  collapsed?: boolean;
}

export function SidebarNav({ collapsed }: SidebarNavProps) {
  const activeSection = useAppStore((s) => s.activeSection);
  const setActiveSection = useAppStore((s) => s.setActiveSection);
  const { sections, percentage, pendingCount, errorCount, firstErrorSection } = useFormProgress();

  const completedCount = sections.filter((s) => s.complete).length;

  function handleErrorClick() {
    if (firstErrorSection) setActiveSection(firstErrorSection);
  }

  return (
    <nav
      className={cn(
        'flex h-full flex-col border-r border-[var(--color-border)] bg-[var(--color-bg-secondary)]',
        collapsed ? 'w-14' : 'w-60'
      )}
      aria-label="Secciones del formulario"
    >
      <ul className="flex-1 overflow-y-auto p-2">
        {FORM_SECTIONS.map((section) => {
          const progress = sections.find((s) => s.id === section.id)!;
          const Icon = section.icon;
          const isActive = activeSection === section.id;

          return (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => setActiveSection(section.id as FormSectionId)}
                title={collapsed ? section.label : undefined}
                className={cn(
                  'mb-0.5 flex w-full items-center gap-2 rounded-[var(--radius-md)] px-2 py-2 text-left text-sm transition-colors',
                  isActive
                    ? 'bg-[var(--color-accent)]/10 font-medium text-[var(--color-accent)]'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)]'
                )}
              >
                <Icon className="shrink-0" size={14} aria-hidden />
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate">{section.label}</span>
                    {progress.hasErrors && (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-danger)] text-[10px] text-white">
                        !
                      </span>
                    )}
                    {progress.complete && !progress.hasErrors && (
                      <span className="text-[var(--color-accent)]" aria-label="Completa">
                        ✓
                      </span>
                    )}
                  </>
                )}
              </button>
            </li>
          );
        })}
      </ul>
      {!collapsed && (
        <div className="border-t border-[var(--color-border)] p-3">
          <ProgressBar
            percentage={percentage}
            pendingCount={pendingCount}
            completedCount={completedCount}
            errorCount={errorCount}
            onErrorClick={handleErrorClick}
            compact
          />
        </div>
      )}
    </nav>
  );
}
