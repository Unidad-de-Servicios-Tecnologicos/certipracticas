import { useCallback, useEffect, useRef, useState } from 'react';

type SpeechRecognitionResultEvent = {
  resultIndex: number;
  results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }>;
};

interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: SpeechRecognitionResultEvent) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionInstance;

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export interface UseSpeechToTextOptions {
  lang?: string;
  onTranscript?: (text: string, isFinal: boolean) => void;
}

export interface UseSpeechToTextResult {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  start: () => void;
  stop: () => void;
  toggle: () => void;
  reset: () => void;
  error: string | null;
}

export function useSpeechToText(options: UseSpeechToTextOptions = {}): UseSpeechToTextResult {
  const { lang = 'es-ES', onTranscript } = options;
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onTranscriptRef = useRef(onTranscript);
  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  });

  const Ctor = getSpeechRecognitionCtor();
  const isSupported = !!Ctor;

  useEffect(() => {
    if (!Ctor) return;
    const instance = new Ctor();
    instance.lang = lang;
    instance.continuous = true;
    instance.interimResults = true;

    instance.onresult = (event) => {
      let finalText = '';
      let interimText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript;
        if (result.isFinal) finalText += text;
        else interimText += text;
      }
      const combined = (finalText + interimText).trim();
      setTranscript(combined);
      onTranscriptRef.current?.(combined, !!finalText && !interimText);
    };

    instance.onerror = (e) => {
      setError(e.error ?? 'unknown');
      setIsListening(false);
    };

    instance.onend = () => setIsListening(false);
    instance.onstart = () => setIsListening(true);

    recognitionRef.current = instance;

    return () => {
      instance.abort();
      recognitionRef.current = null;
    };
  }, [Ctor, lang]);

  const start = useCallback(() => {
    setError(null);
    setTranscript('');
    recognitionRef.current?.start();
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const toggle = useCallback(() => {
    if (isListening) stop();
    else start();
  }, [isListening, start, stop]);

  const reset = useCallback(() => setTranscript(''), []);

  return { isSupported, isListening, transcript, start, stop, toggle, reset, error };
}
