import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useSpeechToText } from './useSpeechToText';

describe('useSpeechToText', () => {
  it('reports supported when SpeechRecognition exists', () => {
    const { result } = renderHook(() => useSpeechToText());
    expect(result.current.isSupported).toBe(true);
  });

  it('start sets isListening, stop clears it', () => {
    const { result } = renderHook(() => useSpeechToText());
    act(() => result.current.start());
    expect(result.current.isListening).toBe(true);
    act(() => result.current.stop());
    expect(result.current.isListening).toBe(false);
  });

  it('toggle alternates between start and stop', () => {
    const { result } = renderHook(() => useSpeechToText());
    act(() => result.current.toggle());
    expect(result.current.isListening).toBe(true);
    act(() => result.current.toggle());
    expect(result.current.isListening).toBe(false);
  });

  it('reset clears transcript', () => {
    const { result } = renderHook(() => useSpeechToText());
    act(() => result.current.reset());
    expect(result.current.transcript).toBe('');
  });
});
