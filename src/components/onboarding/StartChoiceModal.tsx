import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useFormStore } from '@/store/useFormStore';
import { sampleLetter } from '@/data/defaultLetter';
import { importSchemaFromJson } from '@/services/editorSchemaIO';
import { notify } from '@/utils/toast';

const START_KEY = 'certipracticas-start-choice-v1';

export function useStartChoice() {
  const show = (() => {
    try {
      return localStorage.getItem(START_KEY) !== 'done';
    } catch {
      return false;
    }
  })();

  function dismiss() {
    try {
      localStorage.setItem(START_KEY, 'done');
    } catch {
      /* ignore */
    }
  }

  return { showStartChoice: show, dismissStartChoice: dismiss };
}

export interface StartChoiceModalProps {
  open: boolean;
  onClose: () => void;
}

export function StartChoiceModal({ open, onClose }: StartChoiceModalProps) {
  const reset = useFormStore((s) => s.reset);
  const loadSample = useFormStore((s) => s.loadSample);
  const setDocumentSchema = useFormStore((s) => s.setDocumentSchema);

  function choose(action: 'new' | 'sample' | 'import') {
    if (action === 'new') reset();
    if (action === 'sample') loadSample(sampleLetter);
    if (action === 'import') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;
        try {
          const schema = importSchemaFromJson(await file.text());
          setDocumentSchema(schema);
          notify.success('Plantilla importada.');
        } catch {
          notify.error('Error al importar.');
        }
      };
      input.click();
    }
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="¿Cómo quieres comenzar?">
      <div className="flex flex-col gap-2">
        <Button onClick={() => choose('new')}>Documento nuevo</Button>
        <Button variant="secondary" onClick={() => choose('sample')}>
          Cargar ejemplo
        </Button>
        <Button variant="ghost" onClick={() => choose('import')}>
          Importar JSON
        </Button>
      </div>
    </Modal>
  );
}
