import { beforeEach, describe, expect, it } from 'vitest';
import { useFormStore } from './useFormStore';
import { emptyLetter, sampleLetter } from '@/data/defaultLetter';

describe('useFormStore', () => {
  beforeEach(() => {
    useFormStore.setState({ letter: structuredClone(emptyLetter) });
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
    updateTask(0, 'Primera tarea');
    updateTask(1, 'Segunda tarea');
    expect(useFormStore.getState().letter.activities.tasks).toEqual([
      'Primera tarea',
      'Segunda tarea',
    ]);
    removeTask(0);
    expect(useFormStore.getState().letter.activities.tasks).toEqual(['Segunda tarea']);
  });

  it('keeps at least one placeholder task when removing last item', () => {
    useFormStore.getState().updateTask(0, 'única');
    useFormStore.getState().removeTask(0);
    expect(useFormStore.getState().letter.activities.tasks).toEqual(['']);
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
});
