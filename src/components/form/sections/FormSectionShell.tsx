import type { ReactNode } from 'react';
import { getSectionConfig } from '@/data/formSections';
import type { FormSectionId } from '@/types/formSection';

export function FormSectionShell({
  sectionId,
  children,
}: {
  sectionId: FormSectionId;
  children: ReactNode;
}) {
  const config = getSectionConfig(sectionId);
  return (
    <fieldset className="m-0 flex min-w-0 flex-col gap-4 border-0 p-0">
      <legend className="sr-only">
        {config.label}: {config.description}
      </legend>
      {children}
    </fieldset>
  );
}
