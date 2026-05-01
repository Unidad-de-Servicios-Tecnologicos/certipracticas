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
  const signatureLayout = useFormStore((s) => s.signatureLayout);
  const setSignature = useFormStore((s) => s.setSignature);
  const setSignatureLayout = useFormStore((s) => s.setSignatureLayout);

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
            onClick={() => {
              setSignature(null);
              setSignatureLayout({ xPct: 22, yPct: 84, scale: 1, rotationDeg: 0, align: 'left' });
            }}
            className="text-[var(--color-danger)]"
          >
            Eliminar
          </Button>
        </div>
      )}

      {signature && (
        <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] p-3">
          <p className="mb-3 text-sm font-medium">Transformación en carta</p>
          <div className="grid gap-3">
            <label className="grid gap-1 text-xs text-[var(--color-text-secondary)]">
              Escala ({signatureLayout.scale.toFixed(2)}x)
              <input
                type="range"
                min="0.4"
                max="2"
                step="0.05"
                value={signatureLayout.scale}
                onChange={(e) => setSignatureLayout({ scale: Number(e.target.value) })}
              />
            </label>
            <label className="grid gap-1 text-xs text-[var(--color-text-secondary)]">
              Rotación ({signatureLayout.rotationDeg.toFixed(0)}°)
              <input
                type="range"
                min="-180"
                max="180"
                step="1"
                value={signatureLayout.rotationDeg}
                onChange={(e) => setSignatureLayout({ rotationDeg: Number(e.target.value) })}
              />
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--color-text-secondary)]">Alinear</span>
              <Button
                type="button"
                size="sm"
                variant={signatureLayout.align === 'left' ? 'primary' : 'ghost'}
                onClick={() => setSignatureLayout({ align: 'left', xPct: 15 })}
              >
                Izq
              </Button>
              <Button
                type="button"
                size="sm"
                variant={signatureLayout.align === 'center' ? 'primary' : 'ghost'}
                onClick={() => setSignatureLayout({ align: 'center', xPct: 50 })}
              >
                Centro
              </Button>
              <Button
                type="button"
                size="sm"
                variant={signatureLayout.align === 'right' ? 'primary' : 'ghost'}
                onClick={() => setSignatureLayout({ align: 'right', xPct: 85 })}
              >
                Der
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() =>
                  setSignatureLayout({ xPct: 22, yPct: 84, scale: 1, rotationDeg: 0, align: 'left' })
                }
              >
                Reset
              </Button>
            </div>
          </div>
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
