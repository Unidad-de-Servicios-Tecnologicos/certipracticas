import { FormSectionHeader } from './FormSectionHeader';
import { SectionNavButtons } from './SectionNavButtons';
import { SectionFields } from './sections';
import { useAppStore } from '@/store/useAppStore';

export function LetterFormV2() {
  const activeSection = useAppStore((s) => s.activeSection);

  return (
    <div className="flex h-full flex-col">
      <FormSectionHeader sectionId={activeSection} />
      <div key={activeSection} className="flex-1 motion-safe:animate-[sectionIn_0.25s_ease]">
        <SectionFields sectionId={activeSection} />
      </div>
      <SectionNavButtons sectionId={activeSection} />
    </div>
  );
}
