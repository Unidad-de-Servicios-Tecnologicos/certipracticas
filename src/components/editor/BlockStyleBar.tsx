import { FaPencilAlt, FaEye, FaUndo, FaSync } from 'react-icons/fa';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';
import { useFormStore } from '@/store/useFormStore';

export function BlockStyleBar() {
  const editorMode = useAppStore((s) => s.editorMode);
  const setEditorMode = useAppStore((s) => s.setEditorMode);
  const textOverrides = useFormStore((s) => s.textOverrides);
  const resetTextOverrides = useFormStore((s) => s.resetTextOverrides);
  const canvasHtml = useFormStore((s) => s.canvasHtml);
  const setCanvasHtml = useFormStore((s) => s.setCanvasHtml);

  const hasOverrides = Object.keys(textOverrides).length > 0;
  const hasCanvas = canvasHtml !== null;

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        leftIcon={editorMode === 'edit' ? <FaEye /> : <FaPencilAlt />}
        onClick={() => setEditorMode(editorMode === 'edit' ? 'preview' : 'edit')}
      >
        {editorMode === 'edit' ? 'Vista previa' : 'Editar en canvas'}
      </Button>
      {hasOverrides && editorMode === 'preview' && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          leftIcon={<FaUndo />}
          onClick={resetTextOverrides}
          title="Restaurar textos estáticos"
        >
          Restaurar textos
        </Button>
      )}
      {hasCanvas && editorMode === 'preview' && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          leftIcon={<FaSync />}
          onClick={() => setCanvasHtml(null)}
          title="Volver al documento generado desde el formulario"
          className="text-[var(--color-danger)]"
        >
          Desde formulario
        </Button>
      )}
    </div>
  );
}
