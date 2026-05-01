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
        <div className="flex min-h-[60vh] flex-col lg:h-full">
          <CanvasEditorToolbar />
          <div className="flex-1 overflow-auto p-2 sm:p-4 lg:p-6">
            <div className="flex justify-center overflow-x-auto">
              <LetterPreview ref={previewRef} />
            </div>
          </div>
          <ExportBar previewRef={previewRef} />
        </div>
      }
    />
  );
}
