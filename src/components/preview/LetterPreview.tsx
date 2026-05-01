import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useFormStore } from '@/store/useFormStore';
import { useAppStore } from '@/store/useAppStore';
import { SenaTemplate } from './templates/SenaTemplate';
import type { EditorMode } from '@/store/useAppStore';
import type { LogoNode } from '@/types/editorSchema';

export const LetterPreview = forwardRef<HTMLDivElement>((_props, forwardedRef) => {
  const letter = useFormStore((s) => s.letter);
  const signature = useFormStore((s) => s.signature);
  const signatureLayout = useFormStore((s) => s.signatureLayout);
  const hasCanvasLogos = useFormStore((s) =>
    s.documentSchema.pages[0].elements.some(
      (node): node is LogoNode => node.type === 'logo' && node.src.trim().length > 0
    )
  );
  const canvasHtml = useFormStore((s) => s.canvasHtml);
  const setCanvasHtml = useFormStore((s) => s.setCanvasHtml);
  const zoom = useAppStore((s) => s.zoom);
  const editorMode = useAppStore((s) => s.editorMode);

  // React-managed content area (unmounted in canvas edit mode)
  const [showReact, setShowReact] = useState(true);

  // DOM refs
  const outerRef = useRef<HTMLDivElement>(null);
  const reactRef = useRef<HTMLDivElement>(null);
  const editableRef = useRef<HTMLDivElement>(null);
  const prevMode = useRef<EditorMode>('preview');

  // Expose the outer container to the parent (for PDF export)
  useImperativeHandle(forwardedRef, () => outerRef.current!);

  useEffect(() => {
    const entering = editorMode === 'edit' && prevMode.current === 'preview';
    const leaving = editorMode === 'preview' && prevMode.current === 'edit';

    if (entering && editableRef.current && reactRef.current) {
      // 1. Capture HTML from React content (synchronous, before React unmounts it)
      const html = canvasHtml ?? reactRef.current.innerHTML;
      // 2. Populate the editable div (DOM imperative, no React)
      editableRef.current.innerHTML = html;
      editableRef.current.setAttribute('contenteditable', 'true');
      editableRef.current.style.display = 'block';
      editableRef.current.focus();
      // 3. Unmount React content so React doesn't reconcile over the editable
      setShowReact(false);
    }

    if (leaving && editableRef.current) {
      // 1. Save edited HTML to store
      setCanvasHtml(editableRef.current.innerHTML);
      // 2. Clear and hide editable div
      editableRef.current.innerHTML = '';
      editableRef.current.removeAttribute('contenteditable');
      editableRef.current.style.display = 'none';
      // 3. Re-mount React content
      setShowReact(true);
    }

    prevMode.current = editorMode;
  }, [editorMode]); // eslint-disable-line react-hooks/exhaustive-deps

  // When canvasHtml is cleared externally (e.g. "Restaurar"), repopulate from fresh React render
  useEffect(() => {
    if (canvasHtml === null && editorMode === 'edit' && editableRef.current && reactRef.current) {
      // Temporarily show React to get fresh HTML, then copy back
      setShowReact(true);
      // We need to wait for React to render before capturing
      requestAnimationFrame(() => {
        if (reactRef.current && editableRef.current) {
          editableRef.current.innerHTML = reactRef.current.innerHTML;
          setShowReact(false);
        }
      });
    }
  }, [canvasHtml]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={outerRef}
      className="origin-top"
      style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
    >
      {/* React-rendered template — hidden during canvas edit */}
      <div ref={reactRef} style={{ display: showReact ? 'block' : 'none' }}>
        {showReact && (
          canvasHtml && editorMode === 'preview' && !hasCanvasLogos ? (
            <div dangerouslySetInnerHTML={{ __html: canvasHtml }} />
          ) : (
            <SenaTemplate letter={letter} signature={signature} signatureLayout={signatureLayout} />
          )
        )}
      </div>

      {/* DOM contenteditable canvas — shown during canvas edit */}
      <div
        ref={editableRef}
        data-canvas-editable
        suppressContentEditableWarning
        spellCheck={false}
        style={{ display: 'none', outline: 'none' }}
        onKeyDown={(e) => {
          if (e.key === 'Tab') e.preventDefault();
        }}
      />
    </div>
  );
});

LetterPreview.displayName = 'LetterPreview';
