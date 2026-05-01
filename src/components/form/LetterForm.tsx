import { useMemo } from 'react';
import {
  FaBuilding,
  FaCalendarAlt,
  FaFileAlt,
  FaListUl,
  FaPen,
  FaSignature,
  FaUser,
  FaUserTie,
} from 'react-icons/fa';
import { FormSection } from './FormSection';
import { TextField } from './TextField';
import { DateField } from './DateField';
import { SelectField } from './SelectField';
import { ProjectList } from './ProjectList';
import { Button } from '@/components/ui/Button';
import { AiGenerateButton } from './AiGenerateButton';
import { SignaturePanel } from '@/components/signature/SignaturePanel';
import { useFormStore } from '@/store/useFormStore';
import { useAutosave } from '@/hooks/useAutosave';
import { DOCUMENT_TYPES, GENDER_OPTIONS } from '@/data/constants';
import { sampleLetter } from '@/data/defaultLetter';
import { validateLetter } from '@/services/validators';
import { generateContent } from '@/services/aiService';
import { parseProjectFromString } from '@/utils/parseProject';
import { notify } from '@/utils/toast';
import type { DocumentType, Gender } from '@/types/intern';

export function LetterForm() {
  const letter = useFormStore((s) => s.letter);
  const setIntern = useFormStore((s) => s.setIntern);
  const setCenter = useFormStore((s) => s.setCenter);
  const setPeriod = useFormStore((s) => s.setPeriod);
  const setInstructor = useFormStore((s) => s.setInstructor);
  const setSigner = useFormStore((s) => s.setSigner);
  const setDrafter = useFormStore((s) => s.setDrafter);
  const setMetadata = useFormStore((s) => s.setMetadata);
  const setTasks = useFormStore((s) => s.setTasks);
  const addTask = useFormStore((s) => s.addTask);
  const updateTask = useFormStore((s) => s.updateTask);
  const removeTask = useFormStore((s) => s.removeTask);
  const reset = useFormStore((s) => s.reset);
  const loadSample = useFormStore((s) => s.loadSample);

  const saveStatus = useAutosave(letter);
  const errors = useMemo(() => validateLetter(letter), [letter]);

  const handleGenerateProjects = async () => {
    if (!letter.intern.program) {
      notify.info('Ingresa el programa de formación del practicante primero.');
      return;
    }
    const loadingId = notify.loading('Generando proyectos…');
    try {
      const text = await generateContent({ programName: letter.intern.program, type: 'projects' });
      const projects = text
        .split(/\n+/)
        .map((item) => item.trim())
        .filter(Boolean)
        .map(parseProjectFromString);
      if (projects.length > 0) setTasks(projects);
      notify.dismiss(loadingId);
      notify.success('Proyectos generados.');
    } catch (error: any) {
      notify.dismiss(loadingId);
      notify.error(error.message ?? 'Error al generar proyectos.');
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
          {saveStatus === 'saving' && <span>Guardando…</span>}
          {saveStatus === 'saved' && <span>Guardado ✓</span>}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => loadSample(sampleLetter)}>
            Cargar ejemplo
          </Button>
          <Button size="sm" variant="ghost" onClick={reset}>
            Limpiar
          </Button>
        </div>
      </div>

      <FormSection title="Practicante" icon={<FaUser className="text-[var(--color-accent)]" />}>
        <TextField
          label="Nombre completo"
          value={letter.intern.fullName}
          onChange={(v) => setIntern({ fullName: v })}
          required
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
          error={errors['intern.documentNumber']}
        />
        <TextField
          label="Ciudad de expedición"
          value={letter.intern.documentCity}
          onChange={(v) => setIntern({ documentCity: v })}
          required
          error={errors['intern.documentCity']}
        />
        <TextField
          label="Programa de formación"
          value={letter.intern.program}
          onChange={(v) => setIntern({ program: v })}
          required
          error={errors['intern.program']}
        />
      </FormSection>

      <FormSection title="Centro de formación" icon={<FaBuilding className="text-[var(--color-accent)]" />} defaultOpen={false}>
        <TextField label="Nombre del centro" value={letter.center.name} onChange={(v) => setCenter({ name: v })} required />
        <TextField label="Regional" value={letter.center.regional} onChange={(v) => setCenter({ regional: v })} required />
        <TextField label="Dirección" value={letter.center.address} onChange={(v) => setCenter({ address: v })} />
        <TextField label="PBX / Teléfono" value={letter.center.phone} onChange={(v) => setCenter({ phone: v })} />
        <TextField label="Código de documento" value={letter.center.documentCode} onChange={(v) => setCenter({ documentCode: v })} />
        <TextField label="Versión" value={letter.center.documentVersion} onChange={(v) => setCenter({ documentVersion: v })} />
      </FormSection>

      <FormSection title="Período" icon={<FaCalendarAlt className="text-[var(--color-accent)]" />}>
        <DateField label="Fecha de inicio" value={letter.period.startDate} onChange={(v) => setPeriod({ startDate: v })} required error={errors['period.startDate']} />
        <DateField label="Fecha de fin" value={letter.period.endDate} onChange={(v) => setPeriod({ endDate: v })} required error={errors['period.endDate']} />
        <TextField label="Modalidad" value={letter.period.modality} onChange={(v) => setPeriod({ modality: v })} />
        <TextField label="Nodo Tecnoparque" value={letter.period.area} onChange={(v) => setPeriod({ area: v })} required />
      </FormSection>

      <FormSection title="Proyectos" icon={<FaListUl className="text-[var(--color-accent)]" />}>
        <AiGenerateButton
          onGenerate={handleGenerateProjects}
          description="Genera proyectos sugeridos según el programa de formación"
          disabled={!letter.intern.program}
        />
        <ProjectList
          items={letter.activities.tasks}
          onAdd={addTask}
          onUpdate={updateTask}
          onRemove={removeTask}
          error={errors['activities.tasks']}
        />
      </FormSection>

      <FormSection title="Experto de contacto" icon={<FaUserTie className="text-[var(--color-accent)]" />} defaultOpen={false}>
        <TextField label="Nombre completo" value={letter.instructor.fullName} onChange={(v) => setInstructor({ fullName: v })} required />
        <TextField label="Teléfono" value={letter.instructor.phone} onChange={(v) => setInstructor({ phone: v })} />
        <TextField label="Correo" value={letter.instructor.email} onChange={(v) => setInstructor({ email: v })} error={errors['instructor.email']} />
      </FormSection>

      <FormSection title="Firmante" icon={<FaSignature className="text-[var(--color-accent)]" />}>
        <TextField label="Nombre completo" value={letter.signer.fullName} onChange={(v) => setSigner({ fullName: v })} required />
        <TextField label="Cargo" value={letter.signer.position} onChange={(v) => setSigner({ position: v })} required />
      </FormSection>

      <FormSection title="Proyectó" icon={<FaPen className="text-[var(--color-accent)]" />} defaultOpen={false}>
        <TextField label="Nombre completo" value={letter.drafter.fullName} onChange={(v) => setDrafter({ fullName: v })} />
        <TextField label="Rol / cargo" value={letter.drafter.role} onChange={(v) => setDrafter({ role: v })} />
      </FormSection>

      <FormSection title="Firma digital (Proyectó)" icon={<FaSignature className="text-[var(--color-accent)]" />} defaultOpen={false}>
        <SignaturePanel />
      </FormSection>

      <FormSection title="Metadata de la carta" icon={<FaFileAlt className="text-[var(--color-accent)]" />} defaultOpen={false}>
        <TextField label="Número de documento" value={letter.metadata.documentNumber} onChange={(v) => setMetadata({ documentNumber: v })} required />
        <TextField label="Ciudad" value={letter.metadata.city} onChange={(v) => setMetadata({ city: v })} required />
        <DateField label="Fecha de emisión" value={letter.metadata.issueDate} onChange={(v) => setMetadata({ issueDate: v })} required error={errors['metadata.issueDate']} />
      </FormSection>
    </div>
  );
}
