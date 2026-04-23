import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { STORAGE_KEYS } from '@/data/constants';

export function useTheme() {
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.theme);
      if (stored === 'light' || stored === 'dark') {
        setTheme(stored);
        return;
      }
      if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
      }
    } catch {
      // localStorage blocked — continue with default
    }
  }, [setTheme]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem(STORAGE_KEYS.theme, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  return { theme, setTheme, toggleTheme };
}
