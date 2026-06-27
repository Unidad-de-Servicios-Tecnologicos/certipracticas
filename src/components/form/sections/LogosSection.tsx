import { LogoManagerPanel } from '@/components/editor/LogoManagerPanel';
import { EmptyState } from '@/components/ui/EmptyState';
import { FormSectionShell } from './FormSectionShell';
import { useFormStore } from '@/store/useFormStore';

export function LogosSection() {
  const documentSchema = useFormStore((s) => s.documentSchema);
  const logos = documentSchema.pages.flatMap((p) => p.elements).filter((el) => el.type === 'logo');

  return (
    <FormSectionShell sectionId="logos">
      {logos.length === 0 ? (
        <>
          <EmptyState
            variant="section"
            title="Sin logos"
            description="Agrega logos institucionales al encabezado o pie del documento."
          />
          <LogoManagerPanel />
        </>
      ) : (
        <LogoManagerPanel />
      )}
    </FormSectionShell>
  );
}
