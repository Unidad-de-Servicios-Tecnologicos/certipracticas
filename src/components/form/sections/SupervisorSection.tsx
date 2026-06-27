import { useMemo } from 'react';
import { TextField } from '../TextField';
import { FormSectionShell } from './FormSectionShell';
import { useFormStore } from '@/store/useFormStore';
import { validateLetter } from '@/services/validators';

export function SupervisorSection() {
  const letter = useFormStore((s) => s.letter);
  const setInstructor = useFormStore((s) => s.setInstructor);
  const setSigner = useFormStore((s) => s.setSigner);
  const setDrafter = useFormStore((s) => s.setDrafter);
  const errors = useMemo(() => validateLetter(letter), [letter]);

  return (
    <FormSectionShell sectionId="supervisor">
      <div>
        <h3 className="mb-3 text-label text-[var(--color-foreground)]">Experto de contacto</h3>
        <div className="flex flex-col gap-4">
          <TextField
            label="Nombre completo"
            value={letter.instructor.fullName}
            onChange={(v) => setInstructor({ fullName: v })}
            required
            voice
            error={errors['instructor.fullName']}
          />
          <TextField label="Teléfono" value={letter.instructor.phone} onChange={(v) => setInstructor({ phone: v })} />
          <TextField
            label="Correo"
            value={letter.instructor.email}
            onChange={(v) => setInstructor({ email: v })}
            error={errors['instructor.email']}
          />
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-label text-[var(--color-foreground)]">Firmante</h3>
        <div className="flex flex-col gap-4">
          <TextField
            label="Nombre completo"
            value={letter.signer.fullName}
            onChange={(v) => setSigner({ fullName: v })}
            required
            voice
            error={errors['signer.fullName']}
          />
          <TextField
            label="Cargo"
            value={letter.signer.position}
            onChange={(v) => setSigner({ position: v })}
            required
            voice
            error={errors['signer.position']}
          />
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-label text-[var(--color-foreground)]">Proyectó</h3>
        <div className="flex flex-col gap-4">
          <TextField label="Nombre completo" value={letter.drafter.fullName} onChange={(v) => setDrafter({ fullName: v })} voice />
          <TextField label="Rol / cargo" value={letter.drafter.role} onChange={(v) => setDrafter({ role: v })} voice />
        </div>
      </div>
    </FormSectionShell>
  );
}
