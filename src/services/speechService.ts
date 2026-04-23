export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  const w = window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown };
  return !!(w.SpeechRecognition || w.webkitSpeechRecognition);
}

export const UNSUPPORTED_MESSAGE =
  'El dictado por voz requiere Chrome o Edge. Tu navegador no lo soporta.';
