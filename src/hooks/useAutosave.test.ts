import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, beforeEach } from 'vitest';
import { useFormStore } from '@/store/useFormStore';
import { emptyLetter } from '@/data/defaultLetter';
import { useAutosave } from './useAutosave';

describe('useAutosave', () => {
  beforeEach(() => {
    useFormStore.setState({
      letter: emptyLetter,
      signature: null,
      documentSchema: useFormStore.getState().documentSchema,
      textOverrides: {},
    });
  });

  it('starts idle then saves after change', async () => {
    const { result } = renderHook(() => useAutosave(50));

    expect(result.current.status).toBe('idle');

    act(() => {
      useFormStore.getState().setIntern({ fullName: 'Test User' });
    });

    await waitFor(() => expect(result.current.status).toBe('saved'));
    expect(result.current.savedAgoLabel).toMatch(/Guardado/);
  });
});
