import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useAutosave } from './useAutosave';

describe('useAutosave', () => {
  it('flips from saving to saved after delay', async () => {
    const { result, rerender } = renderHook(({ v }) => useAutosave(v, 50), {
      initialProps: { v: 'a' },
    });

    expect(result.current).toBe('saving');
    await waitFor(() => expect(result.current).toBe('saved'));

    act(() => rerender({ v: 'b' }));
    expect(result.current).toBe('saving');
    await waitFor(() => expect(result.current).toBe('saved'));
  });
});
