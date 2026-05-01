import type { ReactNode } from 'react';
import { Header } from './Header';
import { ToastHost } from '@/components/ui/Toast';

export interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-full min-h-screen flex-col bg-[var(--color-bg-primary)]">
      <Header />
      <main className="flex-1 overflow-auto lg:overflow-hidden">{children}</main>
      <ToastHost />
    </div>
  );
}
