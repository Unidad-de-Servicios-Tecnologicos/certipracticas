import { useRef } from 'react';
import { FaCrosshairs } from 'react-icons/fa';
import { LetterPreview } from '@/components/preview/LetterPreview';
import { ZoomControl } from '@/components/preview/ZoomControl';
import { PageNavigator } from '@/components/preview/PageNavigator';
import { CanvasEditorToolbar } from '@/components/editor/CanvasEditorToolbar';
import { ExportMenu } from '@/components/layout/ExportMenu';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';

export interface PreviewPanelProps {
  previewRef: React.RefObject<HTMLDivElement | null>;
  onBeforeExport?: () => boolean;
}

export function PreviewPanel({ previewRef, onBeforeExport }: PreviewPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const previewPage = useAppStore((s) => s.previewPage);
  const setPreviewPage = useAppStore((s) => s.setPreviewPage);
  const editorMode = useAppStore((s) => s.editorMode);

  const totalPages = 1;

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
    <div className="flex h-full flex-col bg-[var(--color-preview-canvas)]">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[var(--color-border)] bg-[var(--color-sidebar)] px-3 py-2">
        <PageNavigator
          currentPage={previewPage}
          totalPages={totalPages}
          onPageChange={setPreviewPage}
        />
        <ZoomControl />
        <div className="flex items-center gap-1">
          <ExportMenu previewRef={previewRef} onBeforeExport={onBeforeExport} />
          <Button size="sm" variant="ghost" iconOnly onClick={handleCenter} aria-label="Centrar documento">
            <FaCrosshairs size={12} />
          </Button>
        </div>
      </div>
      {editorMode === 'edit' && (
        <p className="shrink-0 border-b border-[var(--color-border)] bg-[var(--color-warning)]/10 px-3 py-1.5 text-caption text-[var(--color-muted-foreground)]">
          Modo edición activo: vuelve a vista previa para ver los cambios del formulario en tiempo real.
        </p>
      )}
      <CanvasEditorToolbar />
      <div ref={scrollRef} className="flex-1 overflow-auto p-4">
        <div className="flex justify-center">
          <LetterPreview ref={previewRef} />
        </div>
      </div>
    </div>
  );
}
