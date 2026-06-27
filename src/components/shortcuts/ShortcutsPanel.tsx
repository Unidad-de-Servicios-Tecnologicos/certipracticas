import { Modal } from '@/components/ui/Modal';

const SHORTCUTS = [
  { keys: 'Ctrl + S', action: 'Guardar documento' },
  { keys: 'Ctrl + Z', action: 'Deshacer (canvas)' },
  { keys: 'Ctrl + Shift + Z', action: 'Rehacer (canvas)' },
  { keys: 'Ctrl + P', action: 'Exportar PDF' },
  { keys: 'Ctrl + K', action: 'Paleta de comandos' },
  { keys: '/', action: 'Enfocar búsqueda (paleta)' },
  { keys: '?', action: 'Ver atajos de teclado' },
  { keys: 'Esc', action: 'Cerrar modal activo' },
];

export interface ShortcutsPanelProps {
  open: boolean;
  onClose: () => void;
}

export function ShortcutsPanel({ open, onClose }: ShortcutsPanelProps) {
  return (
    <Modal open={open} onClose={onClose} title="Atajos de teclado">
      <table className="w-full text-sm">
        <tbody>
          {SHORTCUTS.map((s) => (
            <tr key={s.keys} className="border-b border-[var(--color-border)] last:border-0">
              <td className="py-2 pr-4 font-mono text-xs text-[var(--color-accent)]">{s.keys}</td>
              <td className="py-2 text-[var(--color-text-secondary)]">{s.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Modal>
  );
}
