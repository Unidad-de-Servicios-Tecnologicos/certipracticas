import { forwardRef } from 'react';
import { useFormStore } from '@/store/useFormStore';
import { useAppStore } from '@/store/useAppStore';
import { SenaTemplate } from './templates/SenaTemplate';

export const LetterPreview = forwardRef<HTMLDivElement>((_props, ref) => {
  const letter = useFormStore((s) => s.letter);
  const zoom = useAppStore((s) => s.zoom);

  return (
    <div
      ref={ref}
      className="origin-top"
      style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
    >
      <SenaTemplate letter={letter} />
    </div>
  );
});

LetterPreview.displayName = 'LetterPreview';
