import { beforeEach, describe, expect, it } from 'vitest';
import { safeRead, safeRemove, safeWrite } from './storageService';

describe('storageService', () => {
  beforeEach(() => localStorage.clear());

  it('safeWrite then safeRead returns value', () => {
    safeWrite('k', { a: 1 });
    expect(safeRead('k', null)).toEqual({ a: 1 });
  });

  it('safeRead returns fallback when key missing', () => {
    expect(safeRead('missing', 'fb')).toBe('fb');
  });

  it('safeRemove deletes the key', () => {
    safeWrite('k', 1);
    safeRemove('k');
    expect(localStorage.getItem('k')).toBeNull();
  });

  it('safeRead returns fallback on malformed JSON', () => {
    localStorage.setItem('k', 'not-json');
    expect(safeRead('k', 'fb')).toBe('fb');
  });
});
