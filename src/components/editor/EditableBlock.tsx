import { useState, useEffect, useRef, type ElementType } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useFormStore } from '@/store/useFormStore';
import { cn } from '@/utils/cn';

export interface EditableBlockProps {
  overrideKey: string;
  defaultValue: string;
  className?: string;
  as?: ElementType;
}

export function EditableBlock({
  overrideKey,
  defaultValue,
  className,
  as: Tag = 'p',
}: EditableBlockProps) {
  const editorMode = useAppStore((s) => s.editorMode);
  const override = useFormStore((s) => s.textOverrides[overrideKey]);
  const setTextOverride = useFormStore((s) => s.setTextOverride);

  const currentValue = override !== undefined ? override : defaultValue;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(currentValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (override === undefined) setDraft(defaultValue);
  }, [defaultValue, override]);

  useEffect(() => {
    if (editing) textareaRef.current?.focus();
  }, [editing]);

  function commit() {
    setTextOverride(overrideKey, draft);
    setEditing(false);
  }

  function cancel() {
    setDraft(currentValue);
    setEditing(false);
  }

  if (editorMode === 'preview' || !editing) {
    return (
      <Tag
        className={cn(
          className,
          editorMode === 'edit' &&
            'cursor-pointer rounded outline-dashed outline-2 outline-transparent transition-all hover:outline-[var(--color-accent)]/50'
        )}
        onClick={editorMode === 'edit' ? () => { setDraft(currentValue); setEditing(true); } : undefined}
        title={editorMode === 'edit' ? 'Haz clic para editar' : undefined}
      >
        {currentValue}
      </Tag>
    );
  }

  return (
    <textarea
      ref={textareaRef}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Escape') { e.preventDefault(); cancel(); }
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commit(); }
      }}
      rows={3}
      className={cn(
        className,
        'w-full resize-none rounded border border-[var(--color-accent)] bg-[var(--color-bg-primary)] p-1 text-[var(--color-text-primary)] focus:outline-none'
      )}
    />
  );
}
