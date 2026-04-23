import { useEffect, useState } from 'react';

export type AutosaveStatus = 'idle' | 'saving' | 'saved';

export function useAutosave<T>(value: T, delayMs = 400): AutosaveStatus {
  const [status, setStatus] = useState<AutosaveStatus>('idle');

  useEffect(() => {
    setStatus('saving');
    const t = window.setTimeout(() => setStatus('saved'), delayMs);
    return () => window.clearTimeout(t);
  }, [value, delayMs]);

  return status;
}
