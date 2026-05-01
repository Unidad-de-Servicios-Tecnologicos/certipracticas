import { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { SignatureCanvas } from './SignatureCanvas';
import { SignatureUpload } from './SignatureUpload';
import { Button } from '@/components/ui/Button';
import { useFormStore } from '@/store/useFormStore';
import { cn } from '@/utils/cn';
import type { SignatureMethod } from '@/types/signature';

export function SignaturePanel() {
  const [activeTab, setActiveTab] = useState<SignatureMethod>('drawn');
  const signature = useFormStore((s) => s.signature);
  const setSignature = useFormStore((s) => s.setSignature);

  function handleSave(dataUrl: string) {
    setSignature({ method: activeTab, dataUrl, createdAt: new Date().toISOString() });
  }

  const tabs: { id: SignatureMethod; label: string }[] = [
    { id: 'drawn', label: 'Dibujar' },
    { id: 'uploaded', label: 'Subir imagen' },
  ];

  return (
    <div className="flex flex-col gap-4">
      {signature && (
        <div className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] p-3">
          <img
            src={signature.dataUrl}
            alt="Firma guardada"
            className="max-h-[60px] max-w-[160px] object-contain"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            leftIcon={<FaTrash size={12} />}
            onClick={() => setSignature(null)}
            className="text-[var(--color-danger)]"
          >
            Eliminar
          </Button>
        </div>
      )}

      <div className="flex border-b border-[var(--color-border)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors',
              activeTab === tab.id
                ? 'border-b-2 border-[var(--color-accent)] text-[var(--color-accent)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'drawn' ? (
        <SignatureCanvas onSave={handleSave} />
      ) : (
        <SignatureUpload onSave={handleSave} />
      )}
    </div>
  );
}
