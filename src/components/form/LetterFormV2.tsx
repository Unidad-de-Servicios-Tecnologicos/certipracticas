import { useMemo } from 'react';
import { FaClipboardList, FaMagic } from 'react-icons/fa';
import { FormSectionHeader } from './FormSectionHeader';
import { SectionNavButtons } from './SectionNavButtons';
import { TextField } from './TextField';
import { DateField } from './DateField';
import { SelectField } from './SelectField';
import { ProjectList } from './ProjectList';
import { DynamicList } from './DynamicList';
import { AiGenerateButton } from './AiGenerateButton';
import { SignaturePanel } from '@/components/signature/SignaturePanel';
import { LogoManagerPanel } from '@/components/editor/LogoManagerPanel';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Textarea } from '@/components/ui/Textarea';
import { useFormStore } from '@/store/useFormStore';
import { useAppStore } from '@/store/useAppStore';
import { DOCUMENT_TYPES, GENDER_OPTIONS } from '@/data/constants';
import { sampleLetter } from '@/data/defaultLetter';
import { validateLetter } from '@/services/validators';
import { generateContent } from '@/services/aiService';
import { parseProjectFromString } from '@/utils/parseProject';
import { notify } from '@/utils/toast';
import type { DocumentType, Gender } from '@/types/intern';
import type { FormSectionId } from '@/types/formSection';

function SectionFields({ sectionId }: { sectionId: FormSectionId }) {
  const letter = useFormStore((s) => s.letter);
  const setIntern = useFormStore((s) => s.setIntern);
  const setCenter = useFormStore((s) => s.setCenter);
  const setPeriod = useFormStore((s) => s.setPeriod);
  const setInstructor = useFormStore((s) => s.setInstructor);
  const setSigner = useFormStore((s) => s.setSigner);
  const setDrafter = useFormStore((s) => s.setDrafter);
  const setMetadata = useFormStore((s) => s.setMetadata);
  const setPerformanceReview = useFormStore((s) => s.setPerformanceReview);
  const setTasks = useFormStore((s) => s.setTasks);
  const addTask = useFormStore((s) => s.addTask);
  const updateTask = useFormStore((s) => s.updateTask);
  const removeTask = useFormStore((s) => s.removeTask);
  const addStrength = useFormStore((s) => s.addStrength);
  const updateStrength = useFormStore((s) => s.updateStrength);
  const removeStrength = useFormStore((s) => s.removeStrength);
  const reset = useFormStore((s) => s.reset);
  const loadSample = useFormStore((s) => s.loadSample);
  const setEditorMode = useAppStore((s) => s.setEditorMode);
  const editorMode = useAppStore((s) => s.editorMode);
  const documentSchema = useFormStore((s) => s.documentSchema);

  const errors = useMemo(() => validateLetter(letter), [letter]);
  const strengths = letter.activities.technicalStrengths;
  const logos = documentSchema.pages.flatMap((p) => p.elements).filter((el) => el.type === 'logo');

  const handleGenerateProjects = async () => {
    if (!letter.intern.program) {
      notify.info('Ingresa el programa de formación del aprendiz primero.');
      return;
    }
    const loadingId = notify.loading('Generando proyectos con IA…');
    try {
      const text = await generateContent({ programName: letter.intern.program, type: 'projects' });
      const projects = text
        .split(/\n+/)
        .map((item) => item.trim())
        .filter(Boolean)
        .map(parseProjectFromString);
      if (projects.length > 0) setTasks(projects);
      notify.dismiss(loadingId);
      notify.success(`${projects.length} proyectos generados correctamente.`);
    } catch (error: unknown) {
      notify.dismiss(loadingId);
      const msg = error instanceof Error ? error.message : 'Error al generar proyectos.';
      notify.error(msg);
    }
  };

  switch (sectionId) {
    case 'general':
      return (
        <div className="flex flex-col gap-4">
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
          />
          <TextField
            label="Nodo Tecnoparque"
            value={letter.period.area}
            onChange={(v) => setPeriod({ area: v })}
            required
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
          />
          <DateField
            label="Fecha de emisión"
            value={letter.metadata.issueDate}
            onChange={(v) => setMetadata({ issueDate: v })}
            required
            error={errors['metadata.issueDate']}
          />
        </div>
      );

    case 'empresa':
      return (
        <div className="flex flex-col gap-4">
          <TextField
            label="Nombre del centro"
            value={letter.center.name}
            onChange={(v) => setCenter({ name: v })}
            required
            error={errors['center.name']}
          />
          <TextField
            label="Regional"
            value={letter.center.regional}
            onChange={(v) => setCenter({ regional: v })}
            required
            error={errors['center.regional']}
          />
          <TextField label="Dirección" value={letter.center.address} onChange={(v) => setCenter({ address: v })} />
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
        </div>
      );

    case 'aprendiz':
      return (
        <div className="flex flex-col gap-4">
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
        </div>
      );

    case 'supervisor':
      return (
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="mb-3 text-sm font-medium text-[var(--color-text-primary)]">Experto de contacto</h3>
            <div className="flex flex-col gap-4">
              <TextField
                label="Nombre completo"
                value={letter.instructor.fullName}
                onChange={(v) => setInstructor({ fullName: v })}
                required
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
            <h3 className="mb-3 text-sm font-medium text-[var(--color-text-primary)]">Firmante</h3>
            <div className="flex flex-col gap-4">
              <TextField
                label="Nombre completo"
                value={letter.signer.fullName}
                onChange={(v) => setSigner({ fullName: v })}
                required
                error={errors['signer.fullName']}
              />
              <TextField
                label="Cargo"
                value={letter.signer.position}
                onChange={(v) => setSigner({ position: v })}
                required
                error={errors['signer.position']}
              />
            </div>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-medium text-[var(--color-text-primary)]">Proyectó</h3>
            <div className="flex flex-col gap-4">
              <TextField label="Nombre completo" value={letter.drafter.fullName} onChange={(v) => setDrafter({ fullName: v })} />
              <TextField label="Rol / cargo" value={letter.drafter.role} onChange={(v) => setDrafter({ role: v })} />
            </div>
          </div>
        </div>
      );

    case 'actividades':
      if (letter.activities.tasks.every((t) => !t.code && !t.name && !t.description)) {
        return (
          <EmptyState
            icon={<FaClipboardList />}
            title="Sin actividades aún"
            description="Agrega proyectos manualmente o genera sugerencias con IA según el programa."
            action={{ label: '+ Agregar proyecto', onClick: addTask }}
            secondaryAction={{ label: '✨ Generar con IA', onClick: handleGenerateProjects }}
          />
        );
      }
      return (
        <div className="flex flex-col gap-4">
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
        </div>
      );

    case 'fortalezas':
      if (strengths.length === 0 || strengths.every((s) => !s.trim())) {
        return (
          <EmptyState
            icon={<FaClipboardList />}
            title="Sin fortalezas registradas"
            description="Agrega las competencias técnicas demostradas durante la etapa productiva."
            action={{ label: '+ Agregar fortaleza', onClick: addStrength }}
          />
        );
      }
      return (
        <DynamicList
          items={strengths}
          onAdd={addStrength}
          onUpdate={updateStrength}
          onRemove={removeStrength}
          placeholder="Ej: Trabajo en equipo, React, bases de datos…"
          addLabel="Añadir fortaleza"
        />
      );

    case 'evaluacion':
      return (
        <Textarea
          label="Evaluación de desempeño"
          value={letter.activities.performanceReview}
          onChange={(e) => setPerformanceReview(e.target.value)}
          rows={8}
          placeholder="Describe el desempeño del aprendiz durante la etapa productiva…"
        />
      );

    case 'firma':
      return <SignaturePanel />;

    case 'logos':
      if (logos.length === 0) {
        return (
          <div className="flex flex-col gap-4">
            <EmptyState
              title="Sin logos"
              description="Agrega logos institucionales al encabezado o pie del documento."
            />
            <LogoManagerPanel />
          </div>
        );
      }
      return <LogoManagerPanel />;

    case 'ia':
      return (
        <div className="flex flex-col gap-4">
          <EmptyState
            icon={<FaMagic />}
            title="Generación asistida"
            description="Usa IA para generar proyectos según el programa del aprendiz. Requiere programa configurado."
            action={{ label: '✨ Generar proyectos', onClick: handleGenerateProjects }}
          />
          <p className="text-xs text-[var(--color-text-secondary)]">
            Más opciones de IA estarán disponibles próximamente.
          </p>
        </div>
      );

    case 'configuracion':
      return (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Modo de edición</p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={editorMode === 'preview' ? 'primary' : 'ghost'}
                onClick={() => setEditorMode('preview')}
              >
                Vista previa
              </Button>
              <Button
                size="sm"
                variant={editorMode === 'edit' ? 'primary' : 'ghost'}
                onClick={() => setEditorMode('edit')}
              >
                Editar documento
              </Button>
            </div>
          </div>
          <Button size="sm" variant="ghost" onClick={() => loadSample(sampleLetter)}>
            Cargar ejemplo
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              if (window.confirm('¿Limpiar todos los datos del formulario?')) reset();
            }}
          >
            Limpiar formulario
          </Button>
        </div>
      );

    default:
      return null;
  }
}

export function LetterFormV2() {
  const activeSection = useAppStore((s) => s.activeSection);

  return (
    <div className="flex h-full flex-col">
      <FormSectionHeader sectionId={activeSection} />
      <div key={activeSection} className="flex-1 motion-safe:animate-[sectionIn_0.25s_ease]">
        <SectionFields sectionId={activeSection} />
      </div>
      <SectionNavButtons sectionId={activeSection} />
    </div>
  );
}
