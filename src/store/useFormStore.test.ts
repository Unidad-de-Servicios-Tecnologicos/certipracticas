import { beforeEach, describe, expect, it } from 'vitest';
import { useFormStore } from './useFormStore';
import { emptyLetter, sampleLetter } from '@/data/defaultLetter';

const emptyProject = { code: '', name: '', description: '' };

describe('useFormStore', () => {
  beforeEach(() => {
    useFormStore.setState({
      letter: structuredClone(emptyLetter),
      signature: null,
      textOverrides: {},
    });
  });

  it('starts with empty letter', () => {
    expect(useFormStore.getState().letter).toEqual(emptyLetter);
  });

  it('setIntern merges intern fields', () => {
    useFormStore.getState().setIntern({ fullName: 'Ana', program: 'ADSO' });
    const intern = useFormStore.getState().letter.intern;
    expect(intern.fullName).toBe('Ana');
    expect(intern.program).toBe('ADSO');
    expect(intern.documentType).toBe('C.C.');
  });

  it('adds, updates and removes tasks', () => {
    const { addTask, updateTask, removeTask } = useFormStore.getState();
    addTask();
    updateTask(0, { name: 'Primera tarea' });
    updateTask(1, { name: 'Segunda tarea' });
    expect(useFormStore.getState().letter.activities.tasks).toEqual([
      { ...emptyProject, name: 'Primera tarea' },
      { ...emptyProject, name: 'Segunda tarea' },
    ]);
    removeTask(0);
    expect(useFormStore.getState().letter.activities.tasks).toEqual([
      { ...emptyProject, name: 'Segunda tarea' },
    ]);
  });

  it('keeps at least one placeholder task when removing last item', () => {
    useFormStore.getState().updateTask(0, { name: 'única' });
    useFormStore.getState().removeTask(0);
    expect(useFormStore.getState().letter.activities.tasks).toEqual([emptyProject]);
  });

  it('adds, updates and removes strengths', () => {
    const { addStrength, updateStrength, removeStrength } = useFormStore.getState();
    updateStrength(0, 'React');
    addStrength();
    updateStrength(1, 'Node.js');
    expect(useFormStore.getState().letter.activities.technicalStrengths).toEqual([
      'React',
      'Node.js',
    ]);
    removeStrength(1);
    expect(useFormStore.getState().letter.activities.technicalStrengths).toEqual(['React']);
  });

  it('loadSample replaces state and reset returns to empty', () => {
    useFormStore.getState().loadSample(sampleLetter);
    expect(useFormStore.getState().letter.intern.fullName).toBe(sampleLetter.intern.fullName);
    useFormStore.getState().reset();
    expect(useFormStore.getState().letter).toEqual(emptyLetter);
  });

  it('setMetadata updates classification', () => {
    useFormStore.getState().setMetadata({ classification: 'reserved' });
    expect(useFormStore.getState().letter.metadata.classification).toBe('reserved');
  });

  it('setSignature stores signature data', () => {
    const sig = { method: 'drawn' as const, dataUrl: 'data:image/png;base64,abc', createdAt: '2024-01-01T00:00:00.000Z' };
    useFormStore.getState().setSignature(sig);
    expect(useFormStore.getState().signature).toEqual(sig);
    useFormStore.getState().setSignature(null);
    expect(useFormStore.getState().signature).toBeNull();
  });

  it('textOverrides can be set and reset', () => {
    useFormStore.getState().setTextOverride('haceConstar', 'CERTIFICA QUE:');
    expect(useFormStore.getState().textOverrides['haceConstar']).toBe('CERTIFICA QUE:');
    useFormStore.getState().resetTextOverrides();
    expect(useFormStore.getState().textOverrides).toEqual({});
  });
});
