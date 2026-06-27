import { describe, expect, it, beforeEach } from 'vitest';
import { PANEL_RATIO_STORAGE_KEY, usePanelResize } from './usePanelResize';
import { renderHook } from '@testing-library/react';

describe('usePanelResize', () => {
  beforeEach(() => {
    localStorage.removeItem(PANEL_RATIO_STORAGE_KEY);
  });

  it('starts with default ratio when storage is empty', () => {
    const { result } = renderHook(() => usePanelResize({ defaultRatio: 42 }));
    expect(result.current.leftPercent).toBe(42);
  });

  it('loads ratio from localStorage', () => {
    localStorage.setItem(PANEL_RATIO_STORAGE_KEY, '55');
    const { result } = renderHook(() => usePanelResize());
    expect(result.current.leftPercent).toBe(55);
  });
});
