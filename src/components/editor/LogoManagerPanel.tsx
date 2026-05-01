import { useMemo, useRef } from 'react';
import { FaClone, FaLock, FaLockOpen, FaPlus, FaTrash } from 'react-icons/fa';
import { Button } from '@/components/ui/Button';
import { useFormStore } from '@/store/useFormStore';
import type { LogoNode, SectionType } from '@/types/editorSchema';

function readImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

interface LogoItemProps {
  logo: LogoNode;
  onSectionChange: (section: SectionType) => void;
}

function LogoItem({ logo, onSectionChange }: LogoItemProps) {
  const selectedElementId = useFormStore((s) => s.selectedElementId);
  const setSelectedElementId = useFormStore((s) => s.setSelectedElementId);
  const removeElementNode = useFormStore((s) => s.removeElementNode);
  const duplicateLogoNode = useFormStore((s) => s.duplicateLogoNode);
  const toggleElementLock = useFormStore((s) => s.toggleElementLock);
  const updateLogoNode = useFormStore((s) => s.updateLogoNode);
  const isSelected = selectedElementId === logo.id;

  async function handleReplace(files: FileList | null) {
    const file = files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const src = await readImage(file);
    updateLogoNode(logo.id, {
      src,
      name: file.name.replace(/\.[^.]+$/, '') || logo.name,
    });
  }

  return (
    <div
      className={
        isSelected
          ? 'rounded-md border border-[var(--color-accent)] p-2'
          : 'rounded-md border border-[var(--color-border)] p-2'
      }
    >
      <button
        type="button"
        className="mb-2 flex w-full items-center gap-2 text-left"
        onClick={() => setSelectedElementId(logo.id)}
      >
        <img src={logo.src} alt={logo.name} className="h-10 w-14 rounded border object-contain" />
        <span className="text-sm font-medium">{logo.name}</span>
      </button>
      <div className="mb-2 flex items-center gap-2">
        <label className="text-xs text-[var(--color-text-secondary)]">Sección</label>
        <select
          className="h-8 rounded border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-2 text-xs"
          value={logo.section}
          onChange={(e) => onSectionChange(e.target.value as SectionType)}
        >
          <option value="header">Header</option>
          <option value="footer">Footer</option>
          <option value="body">Body</option>
        </select>
        <label className="inline-flex h-8 cursor-pointer items-center rounded border border-[var(--color-border)] px-2 text-xs">
          Cambiar
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => void handleReplace(e.target.files)}
          />
        </label>
      </div>
      <div className="mb-2 grid grid-cols-2 gap-2">
        <label className="text-xs text-[var(--color-text-secondary)]">
          X ({Math.round(logo.xPct)}%)
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={logo.xPct}
            onChange={(e) => updateLogoNode(logo.id, { xPct: Number(e.target.value) })}
            className="w-full"
          />
        </label>
        <label className="text-xs text-[var(--color-text-secondary)]">
          Y ({Math.round(logo.yPct)}%)
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={logo.yPct}
            onChange={(e) => updateLogoNode(logo.id, { yPct: Number(e.target.value) })}
            className="w-full"
          />
        </label>
      </div>
      <div className="flex items-center gap-1">
        <Button type="button" size="sm" variant="ghost" onClick={() => duplicateLogoNode(logo.id)} leftIcon={<FaClone size={12} />}>
          Duplicar
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => toggleElementLock(logo.id)}
          leftIcon={logo.locked ? <FaLock size={12} /> : <FaLockOpen size={12} />}
        >
          {logo.locked ? 'Bloqueado' : 'Bloquear'}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="text-[var(--color-danger)]"
          onClick={() => removeElementNode(logo.id)}
          leftIcon={<FaTrash size={12} />}
        >
          Quitar
        </Button>
      </div>
    </div>
  );
}

export function LogoManagerPanel() {
  const inputRef = useRef<HTMLInputElement>(null);
  const addLogoNode = useFormStore((s) => s.addLogoNode);
  const updateLogoNode = useFormStore((s) => s.updateLogoNode);
  const elements = useFormStore((s) => s.documentSchema.pages[0].elements);
  const logos = useMemo(
    () => elements.filter((n): n is LogoNode => n.type === 'logo'),
    [elements]
  );

  async function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const src = await readImage(file);
    addLogoNode({
      src,
      name: file.name.replace(/\.[^.]+$/, '') || 'Logo',
      section: 'header',
      yPct: 8,
      widthPx: 130,
      heightPx: 60,
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Logos del documento</p>
        <Button
          type="button"
          size="sm"
          onClick={() => inputRef.current?.click()}
          leftIcon={<FaPlus size={12} />}
        >
          Agregar logo
        </Button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {logos.length === 0 && (
        <p className="rounded-md border border-dashed border-[var(--color-border)] p-3 text-sm text-[var(--color-text-secondary)]">
          No hay logos todavía. Agrega uno para comenzar.
        </p>
      )}
      {logos.map((logo) => (
        <LogoItem
          key={logo.id}
          logo={logo}
          onSectionChange={(section) =>
            updateLogoNode(logo.id, { section, yPct: section === 'footer' ? 94 : section === 'header' ? 8 : 50 })
          }
        />
      ))}
    </div>
  );
}
