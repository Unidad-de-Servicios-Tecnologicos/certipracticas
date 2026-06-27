import { useMemo } from 'react';
import { FaClipboardList } from 'react-icons/fa';
import { ProjectList } from '../ProjectList';
import { AiGenerateButton } from '../AiGenerateButton';
import { EmptyState } from '@/components/ui/EmptyState';
import { FormSectionShell } from './FormSectionShell';
import { useAiProjects } from './useAiProjects';
import { useFormStore } from '@/store/useFormStore';
import { validateLetter } from '@/services/validators';

export function ActividadesSection() {
  const letter = useFormStore((s) => s.letter);
  const addTask = useFormStore((s) => s.addTask);
  const updateTask = useFormStore((s) => s.updateTask);
  const removeTask = useFormStore((s) => s.removeTask);
  const errors = useMemo(() => validateLetter(letter), [letter]);
  const { handleGenerateProjects } = useAiProjects();
  const hasTasks = letter.activities.tasks.some(
    (t) => t.code.trim() || t.name.trim() || t.description.trim()
  );

  return (
    <FormSectionShell sectionId="actividades">
      {!hasTasks && (
        <EmptyState
          variant="list"
          icon={<FaClipboardList />}
          title="Sin actividades aún"
          description="Agrega proyectos manualmente o genera sugerencias con IA según el programa."
          action={{ label: '+ Agregar proyecto', onClick: addTask }}
          secondaryAction={{ label: '✨ Generar con IA', onClick: handleGenerateProjects }}
        />
      )}
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
    </FormSectionShell>
  );
}
