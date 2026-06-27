import { FaClipboardList } from 'react-icons/fa';
import { DynamicList } from '../DynamicList';
import { EmptyState } from '@/components/ui/EmptyState';
import { FormSectionShell } from './FormSectionShell';
import { useFormStore } from '@/store/useFormStore';

export function FortalezasSection() {
  const letter = useFormStore((s) => s.letter);
  const addStrength = useFormStore((s) => s.addStrength);
  const updateStrength = useFormStore((s) => s.updateStrength);
  const removeStrength = useFormStore((s) => s.removeStrength);
  const strengths = letter.activities.technicalStrengths;
  const hasStrengths = strengths.some((s) => s.trim());

  return (
    <FormSectionShell sectionId="fortalezas">
      {!hasStrengths && (
        <EmptyState
          variant="list"
          icon={<FaClipboardList />}
          title="Sin fortalezas registradas"
          description="Agrega las competencias técnicas demostradas durante la etapa productiva."
          action={{ label: '+ Agregar fortaleza', onClick: addStrength }}
        />
      )}
      <DynamicList
        items={strengths}
        onAdd={addStrength}
        onUpdate={updateStrength}
        onRemove={removeStrength}
        placeholder="Ej: Trabajo en equipo, React, bases de datos…"
        addLabel="Añadir fortaleza"
      />
    </FormSectionShell>
  );
}
