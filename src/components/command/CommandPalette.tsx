import { useEffect, useMemo, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { FORM_SECTIONS } from '@/data/formSections';
import { useAppStore } from '@/store/useAppStore';
import { useFormStore } from '@/store/useFormStore';
import { notify } from '@/utils/toast';

export interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onExportPDF: () => void;
  onExportDOCX: () => void;
  onRelaunchTour?: () => void;
}

export function CommandPalette({
  open,
  onClose,
  onExportPDF,
  onExportDOCX,
  onRelaunchTour,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [confirmNew, setConfirmNew] = useState(false);
  const setActiveSection = useAppStore((s) => s.setActiveSection);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const setShortcutsPanelOpen = useAppStore((s) => s.setShortcutsPanelOpen);
  const reset = useFormStore((s) => s.reset);

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const actions = useMemo(
    () => [
      ...FORM_SECTIONS.map((s) => ({
        id: `nav-${s.id}`,
        label: `Ir a: ${s.label}`,
        run: () => setActiveSection(s.id),
      })),
      { id: 'export-pdf', label: 'Exportar PDF', run: onExportPDF },
      { id: 'export-docx', label: 'Exportar DOCX', run: onExportDOCX },
      { id: 'theme', label: 'Cambiar tema', run: toggleTheme },
      { id: 'shortcuts', label: 'Ver atajos de teclado', run: () => setShortcutsPanelOpen(true) },
      {
        id: 'tour',
        label: 'Ver tour de bienvenida',
        run: () => onRelaunchTour?.(),
      },
      {
        id: 'new',
        label: 'Nuevo documento',
        run: () => setConfirmNew(true),
      },
    ],
    [setActiveSection, onExportPDF, onExportDOCX, toggleTheme, setShortcutsPanelOpen, onRelaunchTour]
  );

  const filtered = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  function runAction(action: (typeof actions)[number]) {
    if (action.id === 'new') {
      setConfirmNew(true);
      onClose();
      return;
    }
    action.run();
    onClose();
  }

  return (
    <>
      <Modal open={open} onClose={onClose} title="Acciones rápidas" className="max-w-md">
        <input
          autoFocus
          type="search"
          placeholder="Buscar acción…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mb-3 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-body-sm"
        />
        <ul className="max-h-64 overflow-y-auto">
          {filtered.map((action) => (
            <li key={action.id}>
              <button
                type="button"
                className="min-h-[44px] w-full rounded px-2 py-2 text-left text-body-sm hover:bg-[var(--color-muted)]"
                onClick={() => runAction(action)}
              >
                {action.label}
              </button>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="px-2 py-4 text-center text-body-sm text-[var(--color-muted-foreground)]">
              Sin resultados
            </li>
          )}
        </ul>
      </Modal>
      <ConfirmDialog
        open={confirmNew}
        title="Nuevo documento"
        description="¿Crear documento nuevo? Se perderán los cambios actuales."
        confirmLabel="Crear nuevo"
        variant="danger"
        onConfirm={() => {
          reset();
          notify.success('Documento nuevo.');
          setConfirmNew(false);
        }}
        onCancel={() => setConfirmNew(false)}
      />
    </>
  );
}
