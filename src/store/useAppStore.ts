import { create } from 'zustand';

export type Theme = 'light' | 'dark';
export type EditorMode = 'preview' | 'edit';

interface AppStore {
  theme: Theme;
  zoom: number;
  activeMicFieldId: string | null;
  isExporting: boolean;
  editorMode: EditorMode;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setZoom: (zoom: number) => void;
  setActiveMicFieldId: (id: string | null) => void;
  setExporting: (value: boolean) => void;
  setEditorMode: (mode: EditorMode) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  theme: 'light',
  zoom: 1,
  activeMicFieldId: null,
  isExporting: false,
  editorMode: 'preview',
  setTheme: (theme) => set({ theme }),
  toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
  setZoom: (zoom) => set({ zoom: Math.max(0.5, Math.min(2, zoom)) }),
  setActiveMicFieldId: (id) => set({ activeMicFieldId: id }),
  setExporting: (value) => set({ isExporting: value }),
  setEditorMode: (mode) => set({ editorMode: mode }),
}));
