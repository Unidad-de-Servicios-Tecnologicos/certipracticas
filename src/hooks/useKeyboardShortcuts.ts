import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useFormStore } from '@/store/useFormStore';

function isInputFocused() {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  return tag === 'input' || tag === 'textarea' || tag === 'select' || (el as HTMLElement).isContentEditable;
}

export interface KeyboardShortcutHandlers {
  onSave?: () => void;
  onExportPDF?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
}

export function useKeyboardShortcuts(handlers: KeyboardShortcutHandlers) {
  const setCommandPaletteOpen = useAppStore((s) => s.setCommandPaletteOpen);
  const setShortcutsPanelOpen = useAppStore((s) => s.setShortcutsPanelOpen);
  const undoCanvas = useFormStore((s) => s.undoCanvas);
  const redoCanvas = useFormStore((s) => s.redoCanvas);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const mod = e.ctrlKey || e.metaKey;
      const inputFocused = isInputFocused();

      if (mod && e.key === 's') {
        e.preventDefault();
        handlers.onSave?.();
        return;
      }

      if (inputFocused && e.key !== 'Escape') return;

      if (mod && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
        return;
      }

      if (mod && e.shiftKey && e.key === 'Z') {
        e.preventDefault();
        handlers.onRedo?.() ?? redoCanvas();
        return;
      }

      if (mod && e.key === 'z') {
        e.preventDefault();
        handlers.onUndo?.() ?? undoCanvas();
        return;
      }

      if (mod && e.key === 'p') {
        e.preventDefault();
        handlers.onExportPDF?.();
        return;
      }

      if (e.key === '?' && !inputFocused) {
        e.preventDefault();
        setShortcutsPanelOpen(true);
        return;
      }

      if (e.key === '/' && !inputFocused) {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handlers, setCommandPaletteOpen, setShortcutsPanelOpen, undoCanvas, redoCanvas]);
}
