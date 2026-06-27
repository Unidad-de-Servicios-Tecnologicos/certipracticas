import { getSectionConfig } from '@/data/formSections';
import type { FormSectionId } from '@/types/formSection';

export interface FormSectionHeaderProps {
  sectionId: FormSectionId;
}

export function FormSectionHeader({ sectionId }: FormSectionHeaderProps) {
  const config = getSectionConfig(sectionId);
  const Icon = config.icon;

  return (
    <header className="mb-6 border-b border-[var(--color-border)] pb-4">
      <div className="flex items-center gap-2">
        <Icon className="text-[var(--color-accent)]" aria-hidden />
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">{config.label}</h2>
      </div>
      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{config.description}</p>
    </header>
  );
}
