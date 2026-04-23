import { useState } from 'react';
import { FaRobot, FaLightbulb, FaSpinner } from 'react-icons/fa';
import { Button } from '@/components/ui/Button';

interface AiGenerateButtonProps {
  onGenerate: () => Promise<void>;
  description: string;
  disabled?: boolean;
}

export function AiGenerateButton({ onGenerate, description, disabled }: AiGenerateButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await onGenerate();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        type="button"
        variant="outline"
        size="sm"
        leftIcon={loading ? <FaSpinner className="animate-spin" /> : <FaRobot />}
        onClick={handleClick}
        disabled={disabled || loading}
        className="font-semibold"
      >
        Generar desde Programa
      </Button>
      <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
        <FaLightbulb className="text-[var(--color-text-tertiary)]" />
        <span>{description}</span>
      </div>
    </div>
  );
}
