import { useMemo } from 'react';
import { FaArrowDown, FaArrowUp, FaLayerGroup, FaLock, FaLockOpen } from 'react-icons/fa';
import { Button } from '@/components/ui/Button';
import { useFormStore } from '@/store/useFormStore';
import type { LogoNode } from '@/types/editorSchema';

export function LogoLayersPanel() {
  const selectedElementId = useFormStore((s) => s.selectedElementId);
  const setSelectedElementId = useFormStore((s) => s.setSelectedElementId);
  const reorderElementNode = useFormStore((s) => s.reorderElementNode);
  const toggleElementLock = useFormStore((s) => s.toggleElementLock);
  const elements = useFormStore((s) => s.documentSchema.pages[0].elements);
  const logos = useMemo(
    () =>
      elements
        .filter((n): n is LogoNode => n.type === 'logo')
        .sort((a, b) => b.zIndex - a.zIndex),
    [elements]
  );

  if (logos.length === 0) return null;

  return (
    <div className="rounded-md border border-[var(--color-border)] p-2">
      <div className="mb-2 flex items-center gap-2 text-sm font-medium">
        <FaLayerGroup size={12} />
        Capas de logos
      </div>
      <div className="flex flex-col gap-1">
        {logos.map((logo) => {
          const isSelected = selectedElementId === logo.id;
          return (
            <div
              key={logo.id}
              className={
                isSelected
                  ? 'flex items-center justify-between rounded border border-[var(--color-accent)] px-2 py-1'
                  : 'flex items-center justify-between rounded border border-[var(--color-border)] px-2 py-1'
              }
            >
              <button
                type="button"
                onClick={() => setSelectedElementId(logo.id)}
                className="text-xs font-medium"
              >
                {logo.name}
              </button>
              <div className="flex items-center gap-1">
                <Button type="button" size="sm" variant="ghost" onClick={() => reorderElementNode(logo.id, 'forward')} leftIcon={<FaArrowUp size={11} />} />
                <Button type="button" size="sm" variant="ghost" onClick={() => reorderElementNode(logo.id, 'backward')} leftIcon={<FaArrowDown size={11} />} />
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => toggleElementLock(logo.id)}
                  leftIcon={logo.locked ? <FaLock size={11} /> : <FaLockOpen size={11} />}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
