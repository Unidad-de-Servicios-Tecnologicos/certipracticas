import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => localStorage.clear());

  it('returns initial value when key is missing', () => {
    const { result } = renderHook(() => useLocalStorage('missing', 42));
    expect(result.current[0]).toBe(42);
  });

  it('persists writes and rehydrates', () => {
    const { result } = renderHook(() => useLocalStorage('k', 'initial'));
    act(() => result.current[1]('updated'));
    expect(JSON.parse(localStorage.getItem('k') ?? 'null')).toBe('updated');
    const second = renderHook(() => useLocalStorage('k', 'initial'));
    expect(second.result.current[0]).toBe('updated');
  });

  it('reset restores initial', () => {
    const { result } = renderHook(() => useLocalStorage('k', 'initial'));
    act(() => result.current[1]('changed'));
    act(() => result.current[2]());
    expect(result.current[0]).toBe('initial');
  });
});
