import { useEffect, useMemo, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { FORM_SECTIONS } from '@/data/formSections';
import { useAppStore } from '@/store/useAppStore';
import { useFormStore } from '@/store/useFormStore';
import { notify } from '@/utils/toast';

export interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onExportPDF: () => void;
  onExportDOCX: () => void;
}

export function CommandPalette({ open, onClose, onExportPDF, onExportDOCX }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
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
        id: 'new',
        label: 'Nuevo documento',
        run: () => {
          if (window.confirm('¿Crear documento nuevo?')) {
            reset();
            notify.success('Documento nuevo.');
          }
        },
      },
    ],
    [setActiveSection, onExportPDF, onExportDOCX, toggleTheme, setShortcutsPanelOpen, reset]
  );

  const filtered = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  function runAction(run: () => void) {
    run();
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Acciones rápidas" className="max-w-md">
      <input
        autoFocus
        type="search"
        placeholder="Buscar acción…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-3 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-2 text-sm"
      />
      <ul className="max-h-64 overflow-y-auto">
        {filtered.map((action) => (
          <li key={action.id}>
            <button
              type="button"
              className="w-full rounded px-2 py-2 text-left text-sm hover:bg-[var(--color-bg-tertiary)]"
              onClick={() => runAction(action.run)}
            >
              {action.label}
            </button>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="px-2 py-4 text-center text-sm text-[var(--color-text-secondary)]">
            Sin resultados
          </li>
        )}
      </ul>
    </Modal>
  );
}
