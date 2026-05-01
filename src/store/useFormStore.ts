import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Letter } from '@/types/letter';
import type { Intern } from '@/types/intern';
import type { TrainingCenter } from '@/types/center';
import type { Period } from '@/types/period';
import type { Instructor } from '@/types/instructor';
import type { Signer } from '@/types/signer';
import type { Drafter } from '@/types/drafter';
import type { LetterMetadata } from '@/types/metadata';
import type { Project } from '@/types/activities';
import type { SignatureData, SignatureLayout } from '@/types/signature';
import type { DocumentSchema, LogoNode } from '@/types/editorSchema';
import { emptyLetter } from '@/data/defaultLetter';
import { STORAGE_KEYS } from '@/data/constants';
import { parseDurationToMonths, calculateStartDateISO } from '@/utils/formatDate';
import { parseProjectFromString } from '@/utils/parseProject';
import { createDefaultDocumentSchema, createLogoNode, sanitizeDocumentSchema } from '@/services/editorSchemaService';

const emptyProject: Project = { code: '', name: '', description: '' };
const MAX_HISTORY = 50;
const defaultSignatureLayout: SignatureLayout = {
  xPct: 22,
  yPct: 84,
  scale: 1,
  rotationDeg: 0,
  align: 'left',
};

interface SchemaHistory {
  past: DocumentSchema[];
  future: DocumentSchema[];
}

interface FormStore {
  letter: Letter;
  signature: SignatureData | null;
  signatureLayout: SignatureLayout;
  documentSchema: DocumentSchema;
  selectedElementId: string | null;
  schemaHistory: SchemaHistory;
  textOverrides: Record<string, string>;
  canvasHtml: string | null;
  setIntern: (patch: Partial<Intern>) => void;
  setCenter: (patch: Partial<TrainingCenter>) => void;
  setPeriod: (patch: Partial<Period>) => void;
  setInstructor: (patch: Partial<Instructor>) => void;
  setSigner: (patch: Partial<Signer>) => void;
  setDrafter: (patch: Partial<Drafter>) => void;
  setMetadata: (patch: Partial<LetterMetadata>) => void;
  setPerformanceReview: (value: string) => void;
  setTasks: (tasks: Project[]) => void;
  addTask: () => void;
  updateTask: (index: number, patch: Partial<Project>) => void;
  removeTask: (index: number) => void;
  setStrengths: (strengths: string[]) => void;
  addStrength: () => void;
  updateStrength: (index: number, value: string) => void;
  removeStrength: (index: number) => void;
  setSignature: (data: SignatureData | null) => void;
  setSignatureLayout: (patch: Partial<SignatureLayout>) => void;
  setDocumentSchema: (schema: DocumentSchema) => void;
  setSelectedElementId: (id: string | null) => void;
  addLogoNode: (partial?: Partial<LogoNode>) => void;
  updateLogoNode: (id: string, patch: Partial<LogoNode>) => void;
  removeElementNode: (id: string) => void;
  duplicateLogoNode: (id: string) => void;
  reorderElementNode: (id: string, direction: 'forward' | 'backward') => void;
  toggleElementLock: (id: string) => void;
  alignLogos: (mode: 'left' | 'center' | 'right' | 'justify', scope?: 'selected' | 'all') => void;
  undoCanvas: () => void;
  redoCanvas: () => void;
  setTextOverride: (key: string, value: string) => void;
  resetTextOverrides: () => void;
  setCanvasHtml: (html: string | null) => void;
  reset: () => void;
  loadSample: (sample: Letter) => void;
}

export const useFormStore = create<FormStore>()(
  persist(
    (set) => ({
      letter: emptyLetter,
      signature: null,
      signatureLayout: defaultSignatureLayout,
      documentSchema: createDefaultDocumentSchema(),
      selectedElementId: null,
      schemaHistory: { past: [], future: [] },
      textOverrides: {},
      canvasHtml: null,
      setIntern: (patch) =>
        set((s) => ({ letter: { ...s.letter, intern: { ...s.letter.intern, ...patch } } })),
      setCenter: (patch) =>
        set((s) => ({ letter: { ...s.letter, center: { ...s.letter.center, ...patch } } })),
      setPeriod: (patch) =>
        set((s) => {
          const newPeriod = { ...s.letter.period, ...patch };
          if (patch.duration !== undefined || patch.endDate !== undefined) {
            if (newPeriod.endDate && newPeriod.duration) {
              const months = parseDurationToMonths(newPeriod.duration);
              newPeriod.startDate = calculateStartDateISO(newPeriod.endDate, months);
            }
          }
          return { letter: { ...s.letter, period: newPeriod } };
        }),
      setInstructor: (patch) =>
        set((s) => ({ letter: { ...s.letter, instructor: { ...s.letter.instructor, ...patch } } })),
      setSigner: (patch) =>
        set((s) => ({ letter: { ...s.letter, signer: { ...s.letter.signer, ...patch } } })),
      setDrafter: (patch) =>
        set((s) => ({ letter: { ...s.letter, drafter: { ...s.letter.drafter, ...patch } } })),
      setMetadata: (patch) =>
        set((s) => ({ letter: { ...s.letter, metadata: { ...s.letter.metadata, ...patch } } })),
      setPerformanceReview: (value) =>
        set((s) => ({
          letter: { ...s.letter, activities: { ...s.letter.activities, performanceReview: value } },
        })),
      setTasks: (tasks) =>
        set((s) => ({
          letter: {
            ...s.letter,
            activities: { ...s.letter.activities, tasks: tasks.length ? tasks : [emptyProject] },
          },
        })),
      addTask: () =>
        set((s) => ({
          letter: {
            ...s.letter,
            activities: {
              ...s.letter.activities,
              tasks: [...s.letter.activities.tasks, { ...emptyProject }],
            },
          },
        })),
      updateTask: (index, patch) =>
        set((s) => {
          const tasks = s.letter.activities.tasks.map((t, i) =>
            i === index ? { ...t, ...patch } : t
          );
          return { letter: { ...s.letter, activities: { ...s.letter.activities, tasks } } };
        }),
      removeTask: (index) =>
        set((s) => {
          const tasks = s.letter.activities.tasks.filter((_, i) => i !== index);
          return {
            letter: {
              ...s.letter,
              activities: {
                ...s.letter.activities,
                tasks: tasks.length ? tasks : [{ ...emptyProject }],
              },
            },
          };
        }),
      setStrengths: (technicalStrengths) =>
        set((s) => ({
          letter: {
            ...s.letter,
            activities: {
              ...s.letter.activities,
              technicalStrengths: technicalStrengths.length ? technicalStrengths : [''],
            },
          },
        })),
      addStrength: () =>
        set((s) => ({
          letter: {
            ...s.letter,
            activities: {
              ...s.letter.activities,
              technicalStrengths: [...s.letter.activities.technicalStrengths, ''],
            },
          },
        })),
      updateStrength: (index, value) =>
        set((s) => {
          const technicalStrengths = [...s.letter.activities.technicalStrengths];
          const parts = value
            .split(/[\n\r]+|(?<=\w)\s*-\s+(?=\w)|^-?\s*/m)
            .map((x) => x.replace(/^-?\s*/, '').trim())
            .filter(Boolean);
          if (value.includes('\n') || value.includes(' - ')) {
            if (parts.length > 0) {
              technicalStrengths.splice(index, 1, ...parts);
            } else {
              technicalStrengths[index] = value;
            }
          } else {
            technicalStrengths[index] = value;
          }
          return {
            letter: { ...s.letter, activities: { ...s.letter.activities, technicalStrengths } },
          };
        }),
      removeStrength: (index) =>
        set((s) => {
          const technicalStrengths = s.letter.activities.technicalStrengths.filter(
            (_, i) => i !== index
          );
          return {
            letter: {
              ...s.letter,
              activities: {
                ...s.letter.activities,
                technicalStrengths: technicalStrengths.length ? technicalStrengths : [''],
              },
            },
          };
        }),
      setSignature: (data) => set({ signature: data }),
      setSignatureLayout: (patch) =>
        set((s) => ({ signatureLayout: { ...s.signatureLayout, ...patch } })),
      setDocumentSchema: (schema) =>
        set((s) => ({
          documentSchema: sanitizeDocumentSchema(schema),
          canvasHtml: null,
          schemaHistory: {
            past: [...s.schemaHistory.past.slice(-(MAX_HISTORY - 1)), s.documentSchema],
            future: [],
          },
        })),
      setSelectedElementId: (id) => set({ selectedElementId: id }),
      addLogoNode: (partial) =>
        set((s) => {
          const logo = createLogoNode(partial);
          return {
            documentSchema: {
              ...s.documentSchema,
              pages: [
                {
                  ...s.documentSchema.pages[0],
                  elements: [...s.documentSchema.pages[0].elements, logo],
                },
              ],
            },
            selectedElementId: logo.id,
            canvasHtml: null,
            schemaHistory: {
              past: [...s.schemaHistory.past.slice(-(MAX_HISTORY - 1)), s.documentSchema],
              future: [],
            },
          };
        }),
      updateLogoNode: (id, patch) =>
        set((s) => {
          const next = {
            ...s.documentSchema,
            pages: [
              {
                ...s.documentSchema.pages[0],
                elements: s.documentSchema.pages[0].elements.map((node) =>
                  node.type === 'logo' && node.id === id ? createLogoNode({ ...node, ...patch, id }) : node
                ),
              },
            ],
          };
          return {
            documentSchema: next,
            canvasHtml: null,
            schemaHistory: {
              past: [...s.schemaHistory.past.slice(-(MAX_HISTORY - 1)), s.documentSchema],
              future: [],
            },
          };
        }),
      removeElementNode: (id) =>
        set((s) => ({
          documentSchema: {
            ...s.documentSchema,
            pages: [
              {
                ...s.documentSchema.pages[0],
                elements: s.documentSchema.pages[0].elements.filter((node) => node.id !== id),
              },
            ],
          },
          selectedElementId: s.selectedElementId === id ? null : s.selectedElementId,
          canvasHtml: null,
          schemaHistory: {
            past: [...s.schemaHistory.past.slice(-(MAX_HISTORY - 1)), s.documentSchema],
            future: [],
          },
        })),
      duplicateLogoNode: (id) =>
        set((s) => {
          const source = s.documentSchema.pages[0].elements.find(
            (node): node is LogoNode => node.type === 'logo' && node.id === id
          );
          if (!source) return s;
          const duplicate = createLogoNode({
            ...source,
            id: crypto.randomUUID(),
            name: `${source.name} copia`,
            xPct: Math.min(96, source.xPct + 2),
            yPct: Math.min(96, source.yPct + 2),
            zIndex: source.zIndex + 1,
          });
          return {
            documentSchema: {
              ...s.documentSchema,
              pages: [
                {
                  ...s.documentSchema.pages[0],
                  elements: [...s.documentSchema.pages[0].elements, duplicate],
                },
              ],
            },
            selectedElementId: duplicate.id,
            canvasHtml: null,
            schemaHistory: {
              past: [...s.schemaHistory.past.slice(-(MAX_HISTORY - 1)), s.documentSchema],
              future: [],
            },
          };
        }),
      reorderElementNode: (id, direction) =>
        set((s) => {
          const nodes = [...s.documentSchema.pages[0].elements];
          const index = nodes.findIndex((node) => node.id === id);
          if (index < 0) return s;
          const swapIndex = direction === 'forward' ? index + 1 : index - 1;
          if (swapIndex < 0 || swapIndex >= nodes.length) return s;
          [nodes[index], nodes[swapIndex]] = [nodes[swapIndex], nodes[index]];
          const normalized = nodes.map((node, i) =>
            node.type === 'logo' ? createLogoNode({ ...node, zIndex: i + 1 }) : node
          );
          return {
            documentSchema: {
              ...s.documentSchema,
              pages: [{ ...s.documentSchema.pages[0], elements: normalized }],
            },
            canvasHtml: null,
            schemaHistory: {
              past: [...s.schemaHistory.past.slice(-(MAX_HISTORY - 1)), s.documentSchema],
              future: [],
            },
          };
        }),
      toggleElementLock: (id) =>
        set((s) => ({
          documentSchema: {
            ...s.documentSchema,
            pages: [
              {
                ...s.documentSchema.pages[0],
                elements: s.documentSchema.pages[0].elements.map((node) =>
                  node.type === 'logo' && node.id === id ? createLogoNode({ ...node, locked: !node.locked }) : node
                ),
              },
            ],
          },
          canvasHtml: null,
          schemaHistory: {
            past: [...s.schemaHistory.past.slice(-(MAX_HISTORY - 1)), s.documentSchema],
            future: [],
          },
        })),
      alignLogos: (mode, scope = 'selected') =>
        set((s) => {
          const selectedId = s.selectedElementId;
          const shouldApply = (node: LogoNode) =>
            scope === 'all' ? true : selectedId !== null && node.id === selectedId;

          const aligned = s.documentSchema.pages[0].elements.map((node) => {
            if (node.type !== 'logo' || !shouldApply(node)) return node;
            if (mode === 'left') return createLogoNode({ ...node, align: 'left', xPct: 12 });
            if (mode === 'center') return createLogoNode({ ...node, align: 'center', xPct: 50 });
            if (mode === 'right') return createLogoNode({ ...node, align: 'right', xPct: 88 });
            return createLogoNode({ ...node, align: 'center', xPct: 50, widthPx: 600 });
          });

          return {
            documentSchema: {
              ...s.documentSchema,
              pages: [{ ...s.documentSchema.pages[0], elements: aligned }],
            },
            schemaHistory: {
              past: [...s.schemaHistory.past.slice(-(MAX_HISTORY - 1)), s.documentSchema],
              future: [],
            },
          };
        }),
      undoCanvas: () =>
        set((s) => {
          const previous = s.schemaHistory.past.at(-1);
          if (!previous) return s;
          return {
            documentSchema: previous,
            schemaHistory: {
              past: s.schemaHistory.past.slice(0, -1),
              future: [s.documentSchema, ...s.schemaHistory.future],
            },
          };
        }),
      redoCanvas: () =>
        set((s) => {
          const next = s.schemaHistory.future[0];
          if (!next) return s;
          return {
            documentSchema: next,
            schemaHistory: {
              past: [...s.schemaHistory.past.slice(-(MAX_HISTORY - 1)), s.documentSchema],
              future: s.schemaHistory.future.slice(1),
            },
          };
        }),
      setTextOverride: (key, value) =>
        set((s) => ({ textOverrides: { ...s.textOverrides, [key]: value } })),
      resetTextOverrides: () => set({ textOverrides: {} }),
      setCanvasHtml: (html) => set({ canvasHtml: html }),
      reset: () =>
        set({
          letter: emptyLetter,
          signature: null,
          signatureLayout: defaultSignatureLayout,
          documentSchema: createDefaultDocumentSchema(),
          selectedElementId: null,
          schemaHistory: { past: [], future: [] },
          textOverrides: {},
          canvasHtml: null,
        }),
      loadSample: (sample) => set({ letter: sample, canvasHtml: null }),
    }),
    {
      name: STORAGE_KEYS.form,
      storage: createJSONStorage(() => localStorage),
      merge: (persistedState: any, currentState: FormStore) => {
        const state = { ...currentState, ...persistedState };

        if (state.letter?.activities?.tasks?.length > 0) {
          if (typeof state.letter.activities.tasks[0] === 'string') {
            state.letter.activities.tasks = (state.letter.activities.tasks as string[]).map(
              parseProjectFromString
            );
          }
        }

        if (state.letter?.instructor && state.letter.instructor.extension === undefined) {
          state.letter.instructor.extension = '';
        }

        if (!state.textOverrides) state.textOverrides = {};
        if (state.signature === undefined) state.signature = null;
        if (state.signatureLayout === undefined) state.signatureLayout = defaultSignatureLayout;
        if (state.documentSchema === undefined) state.documentSchema = createDefaultDocumentSchema();
        if (state.selectedElementId === undefined) state.selectedElementId = null;
        if (state.schemaHistory === undefined) state.schemaHistory = { past: [], future: [] };
        state.documentSchema = sanitizeDocumentSchema(state.documentSchema);
        if (state.canvasHtml === undefined) state.canvasHtml = null;

        if (state.letter?.metadata) {
          if (!state.letter.metadata.documentNumber) {
            state.letter.metadata.documentNumber = emptyLetter.metadata.documentNumber;
          }
          if (!state.letter.metadata.issueDate) {
            state.letter.metadata.issueDate = emptyLetter.metadata.issueDate;
          }
        }
        if (state.letter?.period) {
          if (!state.letter.period.startDate) {
            state.letter.period.startDate = emptyLetter.period.startDate;
          }
          if (!state.letter.period.endDate) {
            state.letter.period.endDate = emptyLetter.period.endDate;
          }
        }
        if (state.letter?.intern && !state.letter.intern.gender) {
          state.letter.intern.gender = emptyLetter.intern.gender;
        }

        return state;
      },
    }
  )
);
