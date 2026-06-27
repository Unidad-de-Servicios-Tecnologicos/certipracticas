import type { ReactNode } from 'react';
import { HeaderV2 } from './HeaderV2';
import { StatusBar } from './StatusBar';
import { ToastHost } from '@/components/ui/Toast';

export interface AppShellV2Props {
  children: ReactNode;
  previewRef: React.RefObject<HTMLDivElement | null>;
  onBeforeExport?: () => boolean;
  onOpenSettings?: () => void;
}

export function AppShellV2({ children, previewRef, onBeforeExport, onOpenSettings }: AppShellV2Props) {
  return (
    <div className="flex h-full min-h-screen flex-col bg-[var(--color-bg-primary)]">
      <HeaderV2 previewRef={previewRef} onBeforeExport={onBeforeExport} onOpenSettings={onOpenSettings} />
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</main>
      <StatusBar />
      <ToastHost />
    </div>
  );
}
