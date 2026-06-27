import { useMemo } from 'react';
import { TextField } from '../TextField';
import { FormSectionShell } from './FormSectionShell';
import { useFormStore } from '@/store/useFormStore';
import { validateLetter } from '@/services/validators';

export function EmpresaSection() {
  const letter = useFormStore((s) => s.letter);
  const setCenter = useFormStore((s) => s.setCenter);
  const errors = useMemo(() => validateLetter(letter), [letter]);

  return (
    <FormSectionShell sectionId="empresa">
      <TextField
        label="Nombre del centro"
        value={letter.center.name}
        onChange={(v) => setCenter({ name: v })}
        required
        voice
        error={errors['center.name']}
      />
      <TextField
        label="Regional"
        value={letter.center.regional}
        onChange={(v) => setCenter({ regional: v })}
        required
        voice
        error={errors['center.regional']}
      />
      <TextField label="Dirección" value={letter.center.address} onChange={(v) => setCenter({ address: v })} voice />
      <TextField label="PBX / Teléfono" value={letter.center.phone} onChange={(v) => setCenter({ phone: v })} />
      <TextField
        label="Código de documento"
        value={letter.center.documentCode}
        onChange={(v) => setCenter({ documentCode: v })}
      />
      <TextField
        label="Versión"
        value={letter.center.documentVersion}
        onChange={(v) => setCenter({ documentVersion: v })}
      />
    </FormSectionShell>
  );
}
