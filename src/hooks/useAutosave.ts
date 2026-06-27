import { useCallback, useEffect, useRef, useState } from 'react';
import { useFormStore } from '@/store/useFormStore';

export type AutosaveStatus = 'idle' | 'saving' | 'saved' | 'error';

const DEBOUNCE_MS = 400;

export function useAutosave(delayMs = DEBOUNCE_MS) {
  const letter = useFormStore((s) => s.letter);
  const signature = useFormStore((s) => s.signature);
  const documentSchema = useFormStore((s) => s.documentSchema);
  const textOverrides = useFormStore((s) => s.textOverrides);

  const [status, setStatus] = useState<AutosaveStatus>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const snapshotRef = useRef('');
  const retryRef = useRef<() => void>(() => {});

  const payload = JSON.stringify({ letter, signature, documentSchema, textOverrides });

  const persist = useCallback(() => {
    try {
      snapshotRef.current = payload;
      setLastSavedAt(new Date());
      setStatus('saved');
    } catch {
      setStatus('error');
    }
  }, [payload]);

  retryRef.current = persist;

  useEffect(() => {
    if (!snapshotRef.current) {
      snapshotRef.current = payload;
      return;
    }
    if (payload === snapshotRef.current) {
      setStatus('idle');
      return;
    }
    setStatus('saving');
    const timer = window.setTimeout(persist, delayMs);
    return () => window.clearTimeout(timer);
  }, [payload, delayMs, persist]);

  const retry = useCallback(() => {
    setStatus('saving');
    retryRef.current();
  }, []);

  const savedAgoLabel = (() => {
    if (status === 'saving') return 'Guardando…';
    if (status === 'error') return 'Error al guardar';
    if (status === 'idle') return 'Sin cambios';
    if (!lastSavedAt) return 'Guardado';
    const secs = Math.floor((Date.now() - lastSavedAt.getTime()) / 1000);
    if (secs < 5) return 'Guardado hace unos segundos';
    if (secs < 60) return `Guardado hace ${secs}s`;
    return `Guardado hace ${Math.floor(secs / 60)} min`;
  })();

  return { status, lastSavedAt, savedAgoLabel, retry };
}

/** @deprecated Use useAutosave() without args */
export function useAutosaveLegacy<T>(_value: T, delayMs = DEBOUNCE_MS): AutosaveStatus {
  const { status } = useAutosave(delayMs);
  if (status === 'error') return 'saved';
  if (status === 'idle') return 'idle';
  return status;
}
