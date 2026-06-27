import { FaHome, FaPlus, FaSave } from 'react-icons/fa';
import { APP_NAME } from '@/data/constants';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from './ThemeToggle';
import { ExportDropdown } from './ExportDropdown';
import { useFormStore } from '@/store/useFormStore';
import { notify } from '@/utils/toast';

export interface HeaderV2Props {
  previewRef: React.RefObject<HTMLDivElement | null>;
  onBeforeExport?: () => boolean;
  onOpenSettings?: () => void;
}

export function HeaderV2({ previewRef, onBeforeExport, onOpenSettings }: HeaderV2Props) {
  const reset = useFormStore((s) => s.reset);

  function handleNew() {
    if (window.confirm('¿Crear un documento nuevo? Se perderán los cambios no guardados.')) {
      reset();
      notify.success('Documento nuevo creado.');
    }
  }

  function handleSave() {
    notify.success('Documento guardado.');
  }

  return (
    <header className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-2">
      <div className="flex min-w-0 items-center gap-3">
        <a
          href="#"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
          title="Inicio"
        >
          <img src="/logo.png" alt="" className="h-8 w-auto object-contain" />
          <span className="hidden font-bold text-[var(--color-text-primary)] sm:inline">{APP_NAME}</span>
        </a>
        <a
          href="#"
          className="hidden items-center gap-1 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] md:flex"
        >
          <FaHome size={10} /> Inicio
        </a>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <Button size="sm" variant="ghost" onClick={handleNew} leftIcon={<FaPlus size={12} />} aria-label="Nuevo documento">
          <span className="hidden sm:inline">Nuevo</span>
        </Button>
        <Button size="sm" variant="ghost" onClick={handleSave} leftIcon={<FaSave size={12} />} aria-label="Guardar">
          <span className="hidden sm:inline">Guardar</span>
        </Button>
        <ExportDropdown previewRef={previewRef} onBeforeExport={onBeforeExport} />
        <Button size="sm" variant="ghost" onClick={onOpenSettings} aria-label="Configuración">
          ⚙
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}
