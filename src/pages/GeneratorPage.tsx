import { useRef } from 'react';
import { SplitView } from '@/components/layout/SplitView';
import { LetterForm } from '@/components/form/LetterForm';
import { LetterPreview } from '@/components/preview/LetterPreview';
import { ExportBar } from '@/components/preview/ExportBar';
import { CanvasEditorToolbar } from '@/components/editor/CanvasEditorToolbar';

export function GeneratorPage() {
  const previewRef = useRef<HTMLDivElement>(null);

  return (
    <SplitView
      left={<LetterForm />}
      right={
        <div className="flex h-full flex-col">
          <CanvasEditorToolbar />
          <div className="flex-1 overflow-auto p-6">
            <LetterPreview ref={previewRef} />
          </div>
          <ExportBar previewRef={previewRef} />
        </div>
      }
    />
  );
}
