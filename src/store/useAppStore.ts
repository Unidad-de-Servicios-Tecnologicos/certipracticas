import { create } from 'zustand';
import type { FormSectionId } from '@/types/formSection';

export type Theme = 'light' | 'dark';
export type EditorMode = 'preview' | 'edit';
export type MobileTab = 'form' | 'preview';

interface AppStore {
  theme: Theme;
  zoom: number;
  activeMicFieldId: string | null;
  isExporting: boolean;
  editorMode: EditorMode;
  activeSection: FormSectionId;
  previewPage: number;
  mobileTab: MobileTab;
  commandPaletteOpen: boolean;
  shortcutsPanelOpen: boolean;
  sidebarCollapsed: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setZoom: (zoom: number) => void;
  setActiveMicFieldId: (id: string | null) => void;
  setExporting: (value: boolean) => void;
  setEditorMode: (mode: EditorMode) => void;
  setActiveSection: (section: FormSectionId) => void;
  setPreviewPage: (page: number) => void;
  setMobileTab: (tab: MobileTab) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setShortcutsPanelOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  theme: 'light',
  zoom: 1,
  activeMicFieldId: null,
  isExporting: false,
  editorMode: 'preview',
  activeSection: 'general',
  previewPage: 1,
  mobileTab: 'form',
  commandPaletteOpen: false,
  shortcutsPanelOpen: false,
  sidebarCollapsed: false,
  setTheme: (theme) => set({ theme }),
  toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
  setZoom: (zoom) => set({ zoom: Math.max(0.5, Math.min(2, zoom)) }),
  setActiveMicFieldId: (id) => set({ activeMicFieldId: id }),
  setExporting: (value) => set({ isExporting: value }),
  setEditorMode: (mode) => set({ editorMode: mode }),
  setActiveSection: (section) => set({ activeSection: section }),
  setPreviewPage: (page) => set({ previewPage: page }),
  setMobileTab: (tab) => set({ mobileTab: tab }),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  setShortcutsPanelOpen: (open) => set({ shortcutsPanelOpen: open }),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
}));
