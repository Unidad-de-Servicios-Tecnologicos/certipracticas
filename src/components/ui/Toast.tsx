import { Toaster } from 'react-hot-toast';
import { useAppStore } from '@/store/useAppStore';

export function ToastHost() {
  const theme = useAppStore((s) => s.theme);
  const isDark = theme === 'dark';

  return (
    <Toaster
      position="bottom-right"
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background: isDark ? '#1f1f1f' : '#ffffff',
          color: isDark ? '#fafafa' : '#0f172a',
          border: `1px solid ${isDark ? '#2a2a2a' : '#e2e8f0'}`,
          borderRadius: '8px',
          fontSize: '0.875rem',
          padding: '10px 14px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#ffffff',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#ffffff',
          },
        },
      }}
    />
  );
}
