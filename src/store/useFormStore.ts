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
import type { SignatureData } from '@/types/signature';
import { emptyLetter } from '@/data/defaultLetter';
import { STORAGE_KEYS } from '@/data/constants';
import { parseDurationToMonths, calculateStartDateISO } from '@/utils/formatDate';
import { parseProjectFromString } from '@/utils/parseProject';

const emptyProject: Project = { code: '', name: '', description: '' };

export interface SignaturePosition {
  x: number;
  y: number;
}

interface FormStore {
  letter: Letter;
  signature: SignatureData | null;
  signaturePosition: SignaturePosition | null;
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
  setSignaturePosition: (pos: SignaturePosition | null) => void;
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
      signaturePosition: null,
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
      setSignaturePosition: (pos) => set({ signaturePosition: pos }),
      setTextOverride: (key, value) =>
        set((s) => ({ textOverrides: { ...s.textOverrides, [key]: value } })),
      resetTextOverrides: () => set({ textOverrides: {} }),
      setCanvasHtml: (html) => set({ canvasHtml: html }),
      reset: () => set({ letter: emptyLetter, signature: null, signaturePosition: null, textOverrides: {}, canvasHtml: null }),
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
        if (state.signaturePosition === undefined) state.signaturePosition = null;
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
