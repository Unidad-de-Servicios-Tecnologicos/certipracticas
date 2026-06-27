import { SignaturePanel } from '@/components/signature/SignaturePanel';
import { FormSectionShell } from './FormSectionShell';

export function FirmaSection() {
  return (
    <FormSectionShell sectionId="firma">
      <SignaturePanel />
    </FormSectionShell>
  );
}
