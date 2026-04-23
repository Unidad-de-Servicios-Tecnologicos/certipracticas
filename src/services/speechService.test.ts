import { describe, expect, it } from 'vitest';
import { UNSUPPORTED_MESSAGE, isSpeechRecognitionSupported } from './speechService';

describe('speechService', () => {
  it('detects SpeechRecognition on window', () => {
    expect(isSpeechRecognitionSupported()).toBe(true);
  });

  it('has a Spanish unsupported message', () => {
    expect(UNSUPPORTED_MESSAGE).toMatch(/Chrome o Edge/);
  });
});
