import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { FORM_SECTIONS } from '@/data/formSections';
import { useAppStore } from '@/store/useAppStore';
import type { ValidationErrors } from '@/services/validators';

const FIELD_LABELS: Record<string, string> = {
  'intern.fullName': 'Nombre del aprendiz',
  'intern.documentNumber': 'Documento del aprendiz',
  'intern.documentCity': 'Ciudad de expedición',
  'intern.program': 'Programa de formación',
  'center.name': 'Nombre del centro',
  'center.regional': 'Regional',
  'period.startDate': 'Fecha de inicio',
  'period.endDate': 'Fecha de fin',
  'activities.tasks': 'Actividades / proyectos',
  'instructor.fullName': 'Experto de contacto',
  'instructor.email': 'Correo del experto',
  'signer.fullName': 'Nombre del firmante',
  'signer.position': 'Cargo del firmante',
  'metadata.documentNumber': 'Número de documento',
  'metadata.issueDate': 'Fecha de emisión',
};

function findSectionForError(key: string): string | null {
  for (const section of FORM_SECTIONS) {
    if (section.errorKeys.some((ek) => key.startsWith(ek.split('.')[0]) || section.errorKeys.includes(key))) {
      return section.id;
    }
  }
  for (const section of FORM_SECTIONS) {
    if (section.errorKeys.includes(key)) return section.id;
  }
  return null;
}

export interface ValidationSummaryProps {
  open: boolean;
  errors: ValidationErrors;
  onClose: () => void;
  onForceExport: () => void;
}

export function ValidationSummary({ open, errors, onClose, onForceExport }: ValidationSummaryProps) {
  const setActiveSection = useAppStore((s) => s.setActiveSection);
  const entries = Object.entries(errors);

  function goToField(key: string) {
    const sectionId = findSectionForError(key);
    if (sectionId) setActiveSection(sectionId as Parameters<typeof setActiveSection>[0]);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Campos pendientes">
      <p className="mb-4 text-sm text-[var(--color-text-secondary)]">
        Hay {entries.length} {entries.length === 1 ? 'campo' : 'campos'} por completar antes de exportar.
      </p>
      <ul className="mb-4 flex flex-col gap-2">
        {entries.map(([key, msg]) => (
          <li key={key}>
            <button
              type="button"
              onClick={() => goToField(key)}
              className="text-left text-sm text-[var(--color-accent)] hover:underline"
            >
              {FIELD_LABELS[key] ?? key}: {msg}
            </button>
          </li>
        ))}
      </ul>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Corregir
        </Button>
        <Button variant="secondary" onClick={onForceExport}>
          Exportar de todos modos
        </Button>
      </div>
    </Modal>
  );
}
