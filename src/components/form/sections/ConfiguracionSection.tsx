import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { FormSectionShell } from './FormSectionShell';
import { useFormStore } from '@/store/useFormStore';
import { useAppStore } from '@/store/useAppStore';
import { sampleLetter } from '@/data/defaultLetter';

export function ConfiguracionSection() {
  const reset = useFormStore((s) => s.reset);
  const loadSample = useFormStore((s) => s.loadSample);
  const editorMode = useAppStore((s) => s.editorMode);
  const setEditorMode = useAppStore((s) => s.setEditorMode);
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <FormSectionShell sectionId="configuracion">
      <div className="flex flex-col gap-2">
        <p className="text-label">Modo de edición</p>
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
      <Button size="sm" variant="ghost" onClick={() => setConfirmReset(true)}>
        Limpiar formulario
      </Button>
      <ConfirmDialog
        open={confirmReset}
        title="Limpiar formulario"
        description="¿Limpiar todos los datos del formulario? Esta acción no se puede deshacer."
        confirmLabel="Limpiar"
        variant="danger"
        onConfirm={() => {
          reset();
          setConfirmReset(false);
        }}
        onCancel={() => setConfirmReset(false)}
      />
    </FormSectionShell>
  );
}
