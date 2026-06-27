import { FaMagic } from 'react-icons/fa';
import { EmptyState } from '@/components/ui/EmptyState';
import { FormSectionShell } from './FormSectionShell';
import { useAiProjects } from './useAiProjects';

export function IaSection() {
  const { handleGenerateProjects } = useAiProjects();

  return (
    <FormSectionShell sectionId="ia">
      <EmptyState
        variant="section"
        icon={<FaMagic />}
        title="Generación asistida"
        description="Usa IA para generar proyectos según el programa del aprendiz. Requiere programa configurado."
        action={{ label: '✨ Generar proyectos', onClick: handleGenerateProjects }}
      />
      <p className="text-caption text-[var(--color-muted-foreground)]">
        Más opciones de IA estarán disponibles próximamente.
      </p>
    </FormSectionShell>
  );
}
