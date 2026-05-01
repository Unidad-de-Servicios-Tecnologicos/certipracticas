import { FaBold, FaItalic, FaUnderline, FaStrikethrough,
         FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify,
         FaEraser, FaEye } from 'react-icons/fa';
import { useAppStore } from '@/store/useAppStore';
import { useFormStore } from '@/store/useFormStore';
import { cn } from '@/utils/cn';

const SENA_GREEN = '#5a9e1a';
const COLORS = [
  { label: 'Negro', value: '#000000' },
  { label: 'Verde SENA', value: SENA_GREEN },
  { label: 'Azul', value: '#1155CC' },
  { label: 'Rojo', value: '#CC0000' },
  { label: 'Gris', value: '#666666' },
];

const FONT_SIZES = [
  { label: 'Pequeño', value: '10px' },
  { label: 'Normal', value: '14px' },
  { label: 'Grande', value: '16px' },
  { label: 'Título', value: '18px' },
  { label: 'Encabezado', value: '24px' },
];

function applyFontSize(px: string) {
  // Use execCommand placeholder then replace font tags with styled spans
  document.execCommand('fontSize', false, '7');
  const container = document.querySelector('[data-canvas-editable]');
  const fonts = container?.querySelectorAll('font[size="7"]');
  fonts?.forEach((el) => {
    const span = document.createElement('span');
    span.style.fontSize = px;
    while (el.firstChild) span.appendChild(el.firstChild);
    el.replaceWith(span);
  });
}

function cmd(command: string, value?: string) {
  document.execCommand('styleWithCSS', false, 'true');
  document.execCommand(command, false, value);
}

interface ToolbarButtonProps {
  title: string;
  active?: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  children: React.ReactNode;
}

function ToolbarButton({ title, active, onMouseDown, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={onMouseDown}
      className={cn(
        'flex h-7 w-7 items-center justify-center rounded text-sm transition-colors',
        active
          ? 'bg-[var(--color-accent)] text-white'
          : 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]'
      )}
    >
      {children}
    </button>
  );
}

function Separator() {
  return <div className="mx-1 h-5 w-px bg-[var(--color-border)]" />;
}

export function CanvasEditorToolbar() {
  const editorMode = useAppStore((s) => s.editorMode);
  const setEditorMode = useAppStore((s) => s.setEditorMode);
  const canvasHtml = useFormStore((s) => s.canvasHtml);
  const setCanvasHtml = useFormStore((s) => s.setCanvasHtml);

  if (editorMode !== 'edit') return null;

  function prevent(e: React.MouseEvent, fn: () => void) {
    e.preventDefault(); // Keeps focus in contenteditable
    fn();
  }

  function handleRestore(e: React.MouseEvent) {
    e.preventDefault();
    if (confirm('¿Restaurar el documento desde el formulario? Se perderán los cambios visuales directos.')) {
      setCanvasHtml(null);
      setEditorMode('preview');
    }
  }

  return (
    <div className="sticky top-0 z-20 flex flex-wrap items-center gap-1 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-2 shadow-sm">
      {/* Text format */}
      <ToolbarButton title="Negrita (Ctrl+B)" onMouseDown={(e) => prevent(e, () => cmd('bold'))}>
        <FaBold />
      </ToolbarButton>
      <ToolbarButton title="Cursiva (Ctrl+I)" onMouseDown={(e) => prevent(e, () => cmd('italic'))}>
        <FaItalic />
      </ToolbarButton>
      <ToolbarButton title="Subrayado (Ctrl+U)" onMouseDown={(e) => prevent(e, () => cmd('underline'))}>
        <FaUnderline />
      </ToolbarButton>
      <ToolbarButton title="Tachado" onMouseDown={(e) => prevent(e, () => cmd('strikeThrough'))}>
        <FaStrikethrough />
      </ToolbarButton>

      <Separator />

      {/* Alignment */}
      <ToolbarButton title="Alinear izquierda" onMouseDown={(e) => prevent(e, () => cmd('justifyLeft'))}>
        <FaAlignLeft />
      </ToolbarButton>
      <ToolbarButton title="Centrar" onMouseDown={(e) => prevent(e, () => cmd('justifyCenter'))}>
        <FaAlignCenter />
      </ToolbarButton>
      <ToolbarButton title="Alinear derecha" onMouseDown={(e) => prevent(e, () => cmd('justifyRight'))}>
        <FaAlignRight />
      </ToolbarButton>
      <ToolbarButton title="Justificar" onMouseDown={(e) => prevent(e, () => cmd('justifyFull'))}>
        <FaAlignJustify />
      </ToolbarButton>

      <Separator />

      {/* Font size */}
      <select
        title="Tamaño de fuente"
        className="h-7 rounded border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-1 text-xs text-[var(--color-text-primary)] focus:outline-none"
        defaultValue=""
        onMouseDown={(e) => e.stopPropagation()}
        onChange={(e) => {
          if (e.target.value) applyFontSize(e.target.value);
          e.target.value = '';
        }}
      >
        <option value="" disabled>Tamaño</option>
        {FONT_SIZES.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>

      <Separator />

      {/* Text color */}
      <div className="flex items-center gap-0.5">
        {COLORS.map((c) => (
          <button
            key={c.value}
            type="button"
            title={`Color: ${c.label}`}
            onMouseDown={(e) => prevent(e, () => cmd('foreColor', c.value))}
            className="h-5 w-5 rounded-sm border border-[var(--color-border)] transition-transform hover:scale-110"
            style={{ backgroundColor: c.value }}
          />
        ))}
      </div>

      {/* Highlight */}
      <button
        type="button"
        title="Resaltar en amarillo"
        onMouseDown={(e) => prevent(e, () => cmd('backColor', '#FFFF00'))}
        className="h-5 w-8 rounded-sm border border-[var(--color-border)] text-[10px] font-bold text-black hover:scale-110 transition-transform"
        style={{ backgroundColor: '#FFFF00' }}
      >
        A
      </button>

      <Separator />

      {/* Clear format */}
      <ToolbarButton title="Limpiar formato" onMouseDown={(e) => prevent(e, () => cmd('removeFormat'))}>
        <FaEraser />
      </ToolbarButton>

      <div className="flex-1" />

      {/* Actions */}
      {canvasHtml !== null && (
        <button
          type="button"
          title="Restaurar desde formulario"
          onMouseDown={handleRestore}
          className="flex h-7 items-center gap-1 rounded px-2 text-xs text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10"
        >
          Restaurar formulario
        </button>
      )}
      <button
        type="button"
        onMouseDown={(e) => { e.preventDefault(); setEditorMode('preview'); }}
        className="flex h-7 items-center gap-1 rounded bg-[var(--color-accent)] px-3 text-xs font-medium text-white hover:bg-[var(--color-accent-hover)]"
      >
        <FaEye size={11} />
        Vista previa
      </button>
    </div>
  );
}
