import { useMemo } from 'react';
import { DateField } from '../DateField';
import { TextField } from '../TextField';
import { FormSectionShell } from './FormSectionShell';
import { useFormStore } from '@/store/useFormStore';
import { validateLetter } from '@/services/validators';

export function GeneralSection() {
  const letter = useFormStore((s) => s.letter);
  const setPeriod = useFormStore((s) => s.setPeriod);
  const setMetadata = useFormStore((s) => s.setMetadata);
  const errors = useMemo(() => validateLetter(letter), [letter]);

  return (
    <FormSectionShell sectionId="general">
      <DateField
        label="Fecha de inicio"
        value={letter.period.startDate}
        onChange={(v) => setPeriod({ startDate: v })}
        required
        error={errors['period.startDate']}
      />
      <DateField
        label="Fecha de fin"
        value={letter.period.endDate}
        onChange={(v) => setPeriod({ endDate: v })}
        required
        error={errors['period.endDate']}
      />
      <TextField
        label="Modalidad"
        value={letter.period.modality}
        onChange={(v) => setPeriod({ modality: v })}
        voice
      />
      <TextField
        label="Nodo Tecnoparque"
        value={letter.period.area}
        onChange={(v) => setPeriod({ area: v })}
        required
        voice
      />
      <TextField
        label="Número de documento"
        value={letter.metadata.documentNumber}
        onChange={(v) => setMetadata({ documentNumber: v })}
        required
        error={errors['metadata.documentNumber']}
      />
      <TextField
        label="Ciudad de emisión"
        value={letter.metadata.city}
        onChange={(v) => setMetadata({ city: v })}
        required
        voice
        hint="Ciudad donde se expide el documento"
      />
      <DateField
        label="Fecha de emisión"
        value={letter.metadata.issueDate}
        onChange={(v) => setMetadata({ issueDate: v })}
        required
        error={errors['metadata.issueDate']}
      />
    </FormSectionShell>
  );
}
