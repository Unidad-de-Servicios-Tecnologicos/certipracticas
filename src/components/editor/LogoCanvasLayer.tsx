import type { PointerEvent as ReactPointerEvent } from 'react';
import { useEffect, useMemo, useRef } from 'react';
import { useFormStore } from '@/store/useFormStore';
import { useAppStore } from '@/store/useAppStore';
import type { LogoNode } from '@/types/editorSchema';

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function LogoCanvasLayer() {
  const inputRef = useRef<HTMLInputElement>(null);
  const editorMode = useAppStore((s) => s.editorMode);
  const elements = useFormStore((s) => s.documentSchema.pages[0].elements);
  const logos = useMemo(
    () =>
      elements
        .filter((node): node is LogoNode => node.type === 'logo')
        .sort((a, b) => a.zIndex - b.zIndex),
    [elements]
  );
  const selectedElementId = useFormStore((s) => s.selectedElementId);
  const setSelectedElementId = useFormStore((s) => s.setSelectedElementId);
  const updateLogoNode = useFormStore((s) => s.updateLogoNode);
  const removeElementNode = useFormStore((s) => s.removeElementNode);

  const isInteractive = editorMode === 'preview';

  const selectedLogo = useMemo(
    () => logos.find((logo) => logo.id === selectedElementId) ?? null,
    [logos, selectedElementId]
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedElementId(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setSelectedElementId]);

  function pointerToPercent(target: HTMLElement, event: PointerEvent): { xPct: number; yPct: number } {
    const rect = target.getBoundingClientRect();
    return {
      xPct: clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100),
      yPct: clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100),
    };
  }

  function beginDrag(event: ReactPointerEvent<HTMLDivElement>, logo: LogoNode) {
    if (!isInteractive || logo.locked) return;
    const page = event.currentTarget.closest('[data-letter-page]') as HTMLElement | null;
    if (!page) return;
    event.stopPropagation();
    const move = (e: PointerEvent) => {
      const next = pointerToPercent(page, e);
      updateLogoNode(logo.id, { xPct: next.xPct, yPct: next.yPct });
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  function beginResize(event: ReactPointerEvent<HTMLButtonElement>, logo: LogoNode) {
    if (!isInteractive || logo.locked) return;
    event.stopPropagation();
    const startX = event.clientX;
    const startWidth = logo.widthPx;
    const startHeight = logo.heightPx;
    const move = (e: PointerEvent) => {
      const delta = e.clientX - startX;
      updateLogoNode(logo.id, {
        widthPx: clamp(startWidth + delta, 24, 500),
        heightPx: clamp(startHeight + delta * 0.5, 24, 260),
      });
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  function beginRotate(event: ReactPointerEvent<HTMLButtonElement>, logo: LogoNode) {
    if (!isInteractive || logo.locked) return;
    event.stopPropagation();
    const startX = event.clientX;
    const startRotation = logo.rotationDeg;
    const move = (e: PointerEvent) => {
      updateLogoNode(logo.id, { rotationDeg: clamp(startRotation + (e.clientX - startX) * 0.7, -180, 180) });
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  async function replaceSelectedLogo(file?: File) {
    if (!selectedLogo || !file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateLogoNode(selectedLogo.id, {
        src: String(reader.result ?? ''),
        name: file.name.replace(/\.[^.]+$/, '') || selectedLogo.name,
      });
    };
    reader.readAsDataURL(file);
  }

  return (
    <>
      {logos.map((logo) => {
        const isSelected = selectedElementId === logo.id;
        return (
          <div
            key={logo.id}
            className="absolute"
            style={{
              left: `${logo.xPct}%`,
              top: `${logo.yPct}%`,
              transform: `translate(-50%, -50%) rotate(${logo.rotationDeg}deg)`,
              zIndex: logo.zIndex,
              opacity: logo.opacity,
            }}
          >
            <div
              onPointerDown={(e) => beginDrag(e, logo)}
              onClick={() => setSelectedElementId(logo.id)}
              className={isSelected ? 'relative cursor-move border-2 border-[var(--color-accent)] p-1' : 'relative cursor-move p-1'}
            >
              <img
                src={logo.src}
                alt={logo.name}
                style={{ width: `${logo.widthPx}px`, height: `${logo.heightPx}px` }}
                className={logo.locked ? 'pointer-events-none object-contain opacity-80' : 'pointer-events-none object-contain'}
              />
              {isInteractive && isSelected && !logo.locked && (
                <>
                  <button
                    type="button"
                    aria-label="Resize logo"
                    onPointerDown={(e) => beginResize(e, logo)}
                    className="absolute -bottom-2 -right-2 h-4 w-4 rounded-full bg-[var(--color-accent)]"
                  />
                  <button
                    type="button"
                    aria-label="Rotate logo"
                    onPointerDown={(e) => beginRotate(e, logo)}
                    className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-[var(--color-danger)]"
                  />
                </>
              )}
            </div>
          </div>
        );
      })}

      {isInteractive && selectedLogo && (
        <div className="absolute right-4 top-4 z-50 w-[250px] rounded-md border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-3 shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold">Logo seleccionado</p>
            <button
              type="button"
              className="rounded border border-[var(--color-border)] px-2 py-1 text-[11px]"
              onClick={() => setSelectedElementId(null)}
            >
              Cerrar
            </button>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => void replaceSelectedLogo(e.target.files?.[0])}
          />
          <label className="mb-2 block text-xs">
            Opacidad ({Math.round(selectedLogo.opacity * 100)}%)
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.05}
              value={selectedLogo.opacity}
              onChange={(e) => updateLogoNode(selectedLogo.id, { opacity: Number(e.target.value) })}
              className="w-full"
            />
          </label>
          <label className="mb-2 block text-xs">
            Sección
            <select
              className="mt-1 h-8 w-full rounded border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-2 text-xs"
              value={selectedLogo.section}
              onChange={(e) => {
                const section = e.target.value as 'header' | 'body' | 'footer';
                updateLogoNode(selectedLogo.id, {
                  section,
                  yPct: section === 'footer' ? 94 : section === 'header' ? 8 : selectedLogo.yPct,
                });
              }}
            >
              <option value="header">Header</option>
              <option value="body">Body</option>
              <option value="footer">Footer</option>
            </select>
          </label>
          <div className="flex gap-1">
            <button
              type="button"
              className="rounded border border-[var(--color-border)] px-2 py-1 text-xs"
              onClick={() => updateLogoNode(selectedLogo.id, { align: 'left', xPct: 12 })}
            >
              Izq
            </button>
            <button
              type="button"
              className="rounded border border-[var(--color-border)] px-2 py-1 text-xs"
              onClick={() => updateLogoNode(selectedLogo.id, { align: 'center', xPct: 50 })}
            >
              Centro
            </button>
            <button
              type="button"
              className="rounded border border-[var(--color-border)] px-2 py-1 text-xs"
              onClick={() => updateLogoNode(selectedLogo.id, { align: 'right', xPct: 88 })}
            >
              Der
            </button>
          </div>
          <div className="mt-2 flex gap-1">
            <button
              type="button"
              className="rounded border border-[var(--color-border)] px-2 py-1 text-xs"
              onClick={() => inputRef.current?.click()}
            >
              Cambiar logo
            </button>
            <button
              type="button"
              className="rounded border border-[var(--color-danger)] px-2 py-1 text-xs text-[var(--color-danger)]"
              onClick={() => {
                removeElementNode(selectedLogo.id);
                setSelectedElementId(null);
              }}
            >
              Eliminar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
