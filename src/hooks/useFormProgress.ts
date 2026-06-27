import { useMemo } from 'react';
import { FORM_SECTIONS } from '@/data/formSections';
import type { FormSectionId } from '@/types/formSection';
import { validateLetter, type ValidationErrors } from '@/services/validators';
import { useFormStore } from '@/store/useFormStore';

export interface SectionProgress {
  id: FormSectionId;
  complete: boolean;
  hasErrors: boolean;
  errorCount: number;
}

export function useFormProgress() {
  const letter = useFormStore((s) => s.letter);
  const errors: ValidationErrors = useMemo(() => validateLetter(letter), [letter]);

  const sections = useMemo((): SectionProgress[] => {
    return FORM_SECTIONS.map((section) => {
      const sectionErrors = section.errorKeys.filter((key) => errors[key]);
      const hasErrors = sectionErrors.length > 0;
      const complete = section.errorKeys.length === 0 ? true : !hasErrors;
      return {
        id: section.id,
        complete,
        hasErrors,
        errorCount: sectionErrors.length,
      };
    });
  }, [errors]);

  const totalRequired = FORM_SECTIONS.filter((s) => s.errorKeys.length > 0).length;
  const completedRequired = sections.filter(
    (s) => s.complete && FORM_SECTIONS.find((c) => c.id === s.id)!.errorKeys.length > 0
  ).length;

  const percentage = totalRequired > 0 ? Math.round((completedRequired / totalRequired) * 100) : 100;
  const pendingCount = sections.filter((s) => !s.complete).length;
  const errorCount = Object.keys(errors).length;
  const firstErrorSection = sections.find((s) => s.hasErrors)?.id ?? null;

  return {
    sections,
    percentage,
    pendingCount,
    errorCount,
    firstErrorSection,
    errors,
  };
}
