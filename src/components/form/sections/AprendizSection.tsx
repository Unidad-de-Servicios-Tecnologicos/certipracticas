import { useMemo } from 'react';
import { TextField } from '../TextField';
import { SelectField } from '../SelectField';
import { FormSectionShell } from './FormSectionShell';
import { useFormStore } from '@/store/useFormStore';
import { DOCUMENT_TYPES, GENDER_OPTIONS } from '@/data/constants';
import { validateLetter } from '@/services/validators';
import type { DocumentType, Gender } from '@/types/intern';

export function AprendizSection() {
  const letter = useFormStore((s) => s.letter);
  const setIntern = useFormStore((s) => s.setIntern);
  const errors = useMemo(() => validateLetter(letter), [letter]);

  return (
    <FormSectionShell sectionId="aprendiz">
      <TextField
        label="Nombre completo"
        value={letter.intern.fullName}
        onChange={(v) => setIntern({ fullName: v })}
        required
        voice
        error={errors['intern.fullName']}
      />
      <SelectField
        label="Género"
        value={letter.intern.gender}
        onChange={(v) => setIntern({ gender: v as Gender })}
        options={GENDER_OPTIONS}
      />
      <SelectField
        label="Tipo de documento"
        value={letter.intern.documentType}
        onChange={(v) => setIntern({ documentType: v as DocumentType })}
        options={DOCUMENT_TYPES}
      />
      <TextField
        label="Número de documento"
        value={letter.intern.documentNumber}
        onChange={(v) => setIntern({ documentNumber: v })}
        required
        voice
        error={errors['intern.documentNumber']}
      />
      <TextField
        label="Ciudad de expedición"
        value={letter.intern.documentCity}
        onChange={(v) => setIntern({ documentCity: v })}
        required
        voice
        error={errors['intern.documentCity']}
      />
      <TextField
        label="Programa de formación"
        value={letter.intern.program}
        onChange={(v) => setIntern({ program: v })}
        required
        voice
        hint="Nombre completo del programa SENA"
        error={errors['intern.program']}
      />
    </FormSectionShell>
  );
}
