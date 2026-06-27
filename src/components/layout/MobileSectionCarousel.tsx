import { FORM_SECTIONS, getNextSection, getPrevSection } from '@/data/formSections';
import { useAppStore } from '@/store/useAppStore';

export function MobileSectionCarousel() {
  const activeSection = useAppStore((s) => s.activeSection);
  const setActiveSection = useAppStore((s) => s.setActiveSection);
  const config = FORM_SECTIONS.find((s) => s.id === activeSection)!;
  const idx = FORM_SECTIONS.findIndex((s) => s.id === activeSection);
  const prev = getPrevSection(activeSection);
  const next = getNextSection(activeSection);

  return (
    <div className="flex shrink-0 items-center justify-between gap-2 border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-2 lg:hidden">
      <button
        type="button"
        disabled={!prev}
        onClick={() => prev && setActiveSection(prev)}
        className="rounded px-2 py-1 text-sm disabled:opacity-40"
      >
        ◀
      </button>
      <span className="truncate text-sm font-medium">
        {config.label} {idx + 1}/{FORM_SECTIONS.length}
      </span>
      <button
        type="button"
        disabled={!next}
        onClick={() => next && setActiveSection(next)}
        className="rounded px-2 py-1 text-sm disabled:opacity-40"
      >
        ▶
      </button>
    </div>
  );
}
