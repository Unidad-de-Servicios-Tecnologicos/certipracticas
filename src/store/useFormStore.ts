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
import { emptyLetter } from '@/data/defaultLetter';
import { STORAGE_KEYS } from '@/data/constants';
import { parseDurationToMonths, calculateStartDateISO } from '@/utils/formatDate';

interface FormStore {
  letter: Letter;
  setIntern: (patch: Partial<Intern>) => void;
  setCenter: (patch: Partial<TrainingCenter>) => void;
  setPeriod: (patch: Partial<Period>) => void;
  setInstructor: (patch: Partial<Instructor>) => void;
  setSigner: (patch: Partial<Signer>) => void;
  setDrafter: (patch: Partial<Drafter>) => void;
  setMetadata: (patch: Partial<LetterMetadata>) => void;
  setPerformanceReview: (value: string) => void;
  setTasks: (tasks: string[]) => void;
  addTask: () => void;
  updateTask: (index: number, value: string) => void;
  removeTask: (index: number) => void;
  setStrengths: (strengths: string[]) => void;
  addStrength: () => void;
  updateStrength: (index: number, value: string) => void;
  removeStrength: (index: number) => void;
  reset: () => void;
  loadSample: (sample: Letter) => void;
}

export const useFormStore = create<FormStore>()(
  persist(
    (set) => ({
      letter: emptyLetter,
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
            activities: { ...s.letter.activities, tasks: tasks.length ? tasks : [''] },
          },
        })),
      addTask: () =>
        set((s) => ({
          letter: {
            ...s.letter,
            activities: { ...s.letter.activities, tasks: [...s.letter.activities.tasks, ''] },
          },
        })),
      updateTask: (index, value) =>
        set((s) => {
          const tasks = [...s.letter.activities.tasks];
          const parts = value.split(/[\n\r]+|(?<=\w)\s*-\s+(?=\w)|^-?\s*/m).map(s => s.replace(/^-?\s*/, '').trim()).filter(Boolean);
          if (value.includes('\n') || value.includes(' - ')) {
            if (parts.length > 0) {
              tasks.splice(index, 1, ...parts);
            } else {
              tasks[index] = value;
            }
          } else {
            tasks[index] = value;
          }
          return { letter: { ...s.letter, activities: { ...s.letter.activities, tasks } } };
        }),
      removeTask: (index) =>
        set((s) => {
          const tasks = s.letter.activities.tasks.filter((_, i) => i !== index);
          return {
            letter: {
              ...s.letter,
              activities: { ...s.letter.activities, tasks: tasks.length ? tasks : [''] },
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
          const parts = value.split(/[\n\r]+|(?<=\w)\s*-\s+(?=\w)|^-?\s*/m).map(s => s.replace(/^-?\s*/, '').trim()).filter(Boolean);
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
      reset: () => set({ letter: emptyLetter }),
      loadSample: (sample) => set({ letter: sample }),
    }),
    {
      name: STORAGE_KEYS.form,
      storage: createJSONStorage(() => localStorage),
      merge: (persistedState: any, currentState: FormStore) => {
        const state = { ...currentState, ...persistedState };
        if (state.letter && state.letter.metadata) {
          if (!state.letter.metadata.documentNumber) {
            state.letter.metadata.documentNumber = emptyLetter.metadata.documentNumber;
          }
          if (!state.letter.metadata.issueDate) {
            state.letter.metadata.issueDate = emptyLetter.metadata.issueDate;
          }
        }
        if (state.letter && state.letter.period) {
          if (!state.letter.period.startDate) {
            state.letter.period.startDate = emptyLetter.period.startDate;
          }
          if (!state.letter.period.endDate) {
            state.letter.period.endDate = emptyLetter.period.endDate;
          }
        }
        if (state.letter && state.letter.intern && !state.letter.intern.gender) {
          state.letter.intern.gender = emptyLetter.intern.gender;
        }
        return state;
      },
    }
  )
);
