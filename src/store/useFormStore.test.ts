import { beforeEach, describe, expect, it } from 'vitest';
import { useFormStore } from './useFormStore';
import { emptyLetter, sampleLetter } from '@/data/defaultLetter';
import { createDefaultDocumentSchema } from '@/services/editorSchemaService';

const emptyProject = { code: '', name: '', description: '' };

describe('useFormStore', () => {
  beforeEach(() => {
    useFormStore.setState({
      letter: structuredClone(emptyLetter),
      signature: null,
      signatureLayout: { xPct: 50, yPct: 78, scale: 1, rotationDeg: 0, align: 'center' },
      documentSchema: createDefaultDocumentSchema(),
      selectedElementId: null,
      schemaHistory: { past: [], future: [] },
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

  it('handles logo nodes and undo/redo history', () => {
    const store = useFormStore.getState();
    store.addLogoNode({ src: 'data:image/png;base64,abc', name: 'Main logo', section: 'header' });
    const firstLogo = useFormStore
      .getState()
      .documentSchema.pages[0].elements.find((n) => n.type === 'logo');
    expect(firstLogo).toBeDefined();
    if (!firstLogo || firstLogo.type !== 'logo') return;

    store.updateLogoNode(firstLogo.id, { opacity: 0.5, xPct: 25 });
    const updated = useFormStore
      .getState()
      .documentSchema.pages[0].elements.find((n) => n.type === 'logo' && n.id === firstLogo.id);
    expect(updated?.type === 'logo' ? updated.opacity : 0).toBe(0.5);

    store.undoCanvas();
    const undone = useFormStore
      .getState()
      .documentSchema.pages[0].elements.find((n) => n.type === 'logo' && n.id === firstLogo.id);
    expect(undone?.type === 'logo' ? undone.opacity : 0).not.toBe(0.5);

    store.redoCanvas();
    const redone = useFormStore
      .getState()
      .documentSchema.pages[0].elements.find((n) => n.type === 'logo' && n.id === firstLogo.id);
    expect(redone?.type === 'logo' ? redone.opacity : 0).toBe(0.5);
  });
});
