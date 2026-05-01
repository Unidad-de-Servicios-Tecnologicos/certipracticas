import { useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

export interface SignatureUploadProps {
  onSave: (dataUrl: string) => void;
  className?: string;
}

export function SignatureUpload({ onSave, className }: SignatureUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  function readFile(file: File) {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) readFile(file);
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) readFile(file);
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {preview ? (
        <div className="flex flex-col gap-3">
          <img
            src={preview}
            alt="Vista previa de firma"
            className="max-h-[120px] max-w-full rounded-[var(--radius-md)] border border-[var(--color-border)] object-contain"
          />
          <div className="flex gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setPreview(null)}>
              Cambiar
            </Button>
            <Button type="button" size="sm" onClick={() => onSave(preview)}>
              Usar imagen
            </Button>
          </div>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          aria-label="Zona para subir imagen de firma"
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          className={cn(
            'flex h-[120px] cursor-pointer flex-col items-center justify-center gap-2 rounded-[var(--radius-md)] border-2 border-dashed text-sm text-[var(--color-text-secondary)] transition-colors',
            isDragging
              ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/5'
              : 'border-[var(--color-border)] hover:border-[var(--color-accent)]/50'
          )}
        >
          <span>Arrastra una imagen aquí</span>
          <span className="text-xs">o haz clic para seleccionar</span>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />
    </div>
  );
}
