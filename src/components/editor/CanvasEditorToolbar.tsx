import { FaBold, FaItalic, FaUnderline, FaStrikethrough,
         FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify,
         FaEraser, FaEye, FaHistory, FaUndo, FaRedo, FaPlus } from 'react-icons/fa';
import { useRef } from 'react';
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
  const inputRef = useRef<HTMLInputElement>(null);
  const editorMode = useAppStore((s) => s.editorMode);
  const setEditorMode = useAppStore((s) => s.setEditorMode);
  const canvasHtml = useFormStore((s) => s.canvasHtml);
  const setCanvasHtml = useFormStore((s) => s.setCanvasHtml);
  const undoCanvas = useFormStore((s) => s.undoCanvas);
  const redoCanvas = useFormStore((s) => s.redoCanvas);
  const alignLogos = useFormStore((s) => s.alignLogos);
  const addLogoNode = useFormStore((s) => s.addLogoNode);
  const selectedElementId = useFormStore((s) => s.selectedElementId);
  const setSelectedElementId = useFormStore((s) => s.setSelectedElementId);
  const logoCount = useFormStore(
    (s) => s.documentSchema.pages[0].elements.filter((node) => node.type === 'logo').length
  );
  const pastCount = useFormStore((s) => s.schemaHistory.past.length);
  const futureCount = useFormStore((s) => s.schemaHistory.future.length);

  async function handleAddLogo(file?: File) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      addLogoNode({
        src: String(reader.result ?? ''),
        name: file.name.replace(/\.[^.]+$/, '') || 'Logo',
        section: 'header',
        yPct: 8,
      });
    };
    reader.readAsDataURL(file);
  }

  if (editorMode !== 'edit') {
    const scope = selectedElementId ? 'selected' : 'all';
    return (
      <div className="sticky top-0 z-20 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-2 shadow-sm">
        <div className="mb-2 flex items-center gap-2 flex-wrap">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => void handleAddLogo(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-7 items-center gap-1 rounded border border-[var(--color-border)] px-2 text-xs"
            title="Agregar logo en canvas"
          >
            <FaPlus size={10} />
            Logo
          </button>
          <button
            type="button"
            onClick={() => undoCanvas()}
            disabled={pastCount === 0}
            className="flex h-7 items-center gap-1 rounded border border-[var(--color-border)] px-2 text-xs disabled:opacity-50"
          >
            <FaUndo size={10} /> Undo
          </button>
          <button
            type="button"
            onClick={() => redoCanvas()}
            disabled={futureCount === 0}
            className="flex h-7 items-center gap-1 rounded border border-[var(--color-border)] px-2 text-xs disabled:opacity-50"
          >
            <FaRedo size={10} /> Redo
          </button>
          <span className="ml-2 flex items-center gap-1 text-xs text-[var(--color-text-secondary)]">
            <FaHistory size={10} />
            {pastCount}/{futureCount}
          </span>
          {logoCount > 0 && (
            <>
              <span className="mx-1 h-5 w-px bg-[var(--color-border)]" />
              <span className="text-xs text-[var(--color-text-secondary)]">
                Alinear {selectedElementId ? 'selección' : 'todos'}
              </span>
              <button
                type="button"
                onClick={() => alignLogos('left', scope)}
                className="flex h-7 items-center gap-1 rounded border border-[var(--color-border)] px-2 text-xs"
                title="Alinear a la izquierda"
              >
                <FaAlignLeft size={10} />
              </button>
              <button
                type="button"
                onClick={() => alignLogos('center', scope)}
                className="flex h-7 items-center gap-1 rounded border border-[var(--color-border)] px-2 text-xs"
                title="Centrar"
              >
                <FaAlignCenter size={10} />
              </button>
              <button
                type="button"
                onClick={() => alignLogos('right', scope)}
                className="flex h-7 items-center gap-1 rounded border border-[var(--color-border)] px-2 text-xs"
                title="Alinear a la derecha"
              >
                <FaAlignRight size={10} />
              </button>
              <button
                type="button"
                onClick={() => alignLogos('justify', scope)}
                className="flex h-7 items-center gap-1 rounded border border-[var(--color-border)] px-2 text-xs"
                title="Justificar (expandir ancho)"
              >
                <FaAlignJustify size={10} />
              </button>
              {selectedElementId && (
                <button
                  type="button"
                  onClick={() => setSelectedElementId(null)}
                  className="flex h-7 items-center gap-1 rounded border border-[var(--color-border)] px-2 text-xs"
                  title="Salir de edición de logo"
                >
                  Salir logo
                </button>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

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
