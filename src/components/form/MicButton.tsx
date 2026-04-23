import { useEffect, useId } from 'react';
import { FaMicrophone } from 'react-icons/fa';
import { useSpeechToText } from '@/hooks/useSpeechToText';
import { useAppStore } from '@/store/useAppStore';
import { Tooltip } from '@/components/ui/Tooltip';
import { cn } from '@/utils/cn';
import { notify } from '@/utils/toast';

export interface MicButtonProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function MicButton({ value, onChange, disabled, className }: MicButtonProps) {
  const fieldId = useId();
  const activeId = useAppStore((s) => s.activeMicFieldId);
  const setActiveMicFieldId = useAppStore((s) => s.setActiveMicFieldId);

  const { isSupported, isListening, transcript, start, stop, error } = useSpeechToText({
    onTranscript: (text, isFinal) => {
      if (!isFinal) return;
      const base = value.trim();
      onChange(base ? `${base} ${text}` : text);
    },
  });

  useEffect(() => {
    if (isListening) setActiveMicFieldId(fieldId);
  }, [isListening, fieldId, setActiveMicFieldId]);

  useEffect(() => {
    if (activeId && activeId !== fieldId && isListening) {
      stop();
    }
  }, [activeId, fieldId, isListening, stop]);

  useEffect(() => {
    if (error) notify.error(`Error de dictado: ${error}`);
  }, [error]);

  const handleClick = () => {
    if (!isSupported) {
      notify.info('El dictado por voz requiere Chrome o Edge.');
      return;
    }
    if (isListening) {
      stop();
      setActiveMicFieldId(null);
    } else {
      start();
    }
  };

  const tooltipLabel = !isSupported
    ? 'Dictado no soportado'
    : isListening
    ? 'Detener dictado'
    : 'Dictar por voz';

  return (
    <Tooltip label={tooltipLabel}>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || !isSupported}
        aria-pressed={isListening}
        aria-label={tooltipLabel}
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] border text-sm transition-colors',
          isListening
            ? 'bg-[var(--color-mic-active)] text-white border-transparent animate-mic-pulse'
            : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)]',
          !isSupported && 'opacity-40 cursor-not-allowed',
          className
        )}
        title={transcript || undefined}
      >
        <FaMicrophone />
      </button>
    </Tooltip>
  );
}
