import { useRef, useEffect } from 'react';
import { FaCrosshairs } from 'react-icons/fa';
import { LetterPreview } from '@/components/preview/LetterPreview';
import { ZoomControl } from '@/components/preview/ZoomControl';
import { PageNavigator } from '@/components/preview/PageNavigator';
import { CanvasEditorToolbar } from '@/components/editor/CanvasEditorToolbar';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';
import { useFormStore } from '@/store/useFormStore';

export interface PreviewPanelProps {
  previewRef: React.RefObject<HTMLDivElement | null>;
}

export function PreviewPanel({ previewRef }: PreviewPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const previewPage = useAppStore((s) => s.previewPage);
  const setPreviewPage = useAppStore((s) => s.setPreviewPage);
  const previewHasChanges = useAppStore((s) => s.previewHasChanges);
  const setPreviewHasChanges = useAppStore((s) => s.setPreviewHasChanges);
  const letter = useFormStore((s) => s.letter);

  const totalPages = 1;

  useEffect(() => {
    setPreviewHasChanges(true);
    const t = window.setTimeout(() => setPreviewHasChanges(false), 600);
    return () => window.clearTimeout(t);
  }, [letter, setPreviewHasChanges]);

  function handleCenter() {
    const container = scrollRef.current;
    const preview = previewRef.current;
    if (!container || !preview) return;
    container.scrollTo({
      left: (preview.offsetWidth - container.clientWidth) / 2,
      top: (preview.offsetHeight - container.clientHeight) / 2,
      behavior: 'smooth',
    });
  }

  return (
    <div className="flex h-full flex-col bg-[var(--color-bg-tertiary)]">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-2">
        <PageNavigator
          currentPage={previewPage}
          totalPages={totalPages}
          onPageChange={setPreviewPage}
        />
        <ZoomControl />
        <div className="flex items-center gap-2">
          {previewHasChanges && (
            <span className="text-xs text-[var(--color-accent)]">● Cambios</span>
          )}
          <Button size="sm" variant="ghost" onClick={handleCenter} aria-label="Centrar documento">
            <FaCrosshairs size={12} />
          </Button>
        </div>
      </div>
      <CanvasEditorToolbar />
      <div ref={scrollRef} className="flex-1 overflow-auto p-4">
        <div className="flex justify-center">
          <LetterPreview ref={previewRef} />
        </div>
      </div>
    </div>
  );
}
