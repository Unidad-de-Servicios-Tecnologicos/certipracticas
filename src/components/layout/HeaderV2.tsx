import { useState } from 'react';
import { FaHome, FaPlus, FaSave } from 'react-icons/fa';
import { APP_NAME } from '@/data/constants';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ThemeToggle } from './ThemeToggle';
import { ExportMenu } from './ExportMenu';
import { useFormStore } from '@/store/useFormStore';
import { notify } from '@/utils/toast';

export interface HeaderV2Props {
  previewRef: React.RefObject<HTMLDivElement | null>;
  onBeforeExport?: () => boolean;
  onOpenSettings?: () => void;
}

export function HeaderV2({ previewRef, onBeforeExport, onOpenSettings }: HeaderV2Props) {
  const reset = useFormStore((s) => s.reset);
  const [confirmNew, setConfirmNew] = useState(false);

  function handleSave() {
    notify.success('Documento guardado.');
  }

  return (
    <header className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-sidebar)] px-4 py-2">
      <div className="flex min-w-0 items-center gap-3">
        <a
          href="#"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
          title="Inicio"
        >
          <img src="/logo.png" alt="" className="h-8 w-auto object-contain" />
          <span className="hidden font-bold text-[var(--color-foreground)] sm:inline">{APP_NAME}</span>
        </a>
        <a
          href="#"
          className="hidden min-h-[44px] items-center gap-1 text-caption text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] md:flex"
        >
          <FaHome size={10} aria-hidden /> Inicio
        </a>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <Button
          size="sm"
          variant="ghost"
          iconOnly
          onClick={() => setConfirmNew(true)}
          leftIcon={<FaPlus size={12} />}
          aria-label="Nuevo documento"
        >
          <span className="hidden sm:inline">Nuevo</span>
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleSave}
          leftIcon={<FaSave size={12} />}
          aria-label="Guardar"
        >
          <span className="hidden sm:inline">Guardar</span>
        </Button>
        <ExportMenu previewRef={previewRef} onBeforeExport={onBeforeExport} />
        <Button size="sm" variant="ghost" iconOnly onClick={onOpenSettings} aria-label="Configuración">
          ⚙
        </Button>
        <ThemeToggle />
      </div>

      <ConfirmDialog
        open={confirmNew}
        title="Nuevo documento"
        description="¿Crear un documento nuevo? Se perderán los cambios no guardados."
        confirmLabel="Crear nuevo"
        variant="danger"
        onConfirm={() => {
          reset();
          notify.success('Documento nuevo creado.');
          setConfirmNew(false);
        }}
        onCancel={() => setConfirmNew(false)}
      />
    </header>
  );
}
