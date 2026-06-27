import { Button } from '@/components/ui/Button';
import { getNextSection, getPrevSection } from '@/data/formSections';
import { useAppStore } from '@/store/useAppStore';
import type { FormSectionId } from '@/types/formSection';

export interface SectionNavButtonsProps {
  sectionId: FormSectionId;
}

export function SectionNavButtons({ sectionId }: SectionNavButtonsProps) {
  const setActiveSection = useAppStore((s) => s.setActiveSection);
  const prev = getPrevSection(sectionId);
  const next = getNextSection(sectionId);

  return (
    <div className="mt-8 flex items-center justify-between gap-3 border-t border-[var(--color-border)] pt-4">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={!prev}
        onClick={() => prev && setActiveSection(prev)}
      >
        ← Anterior
      </Button>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={!next}
        onClick={() => next && setActiveSection(next)}
      >
        Siguiente →
      </Button>
    </div>
  );
}
