import type { ReactNode } from 'react';

export interface MainContentProps {
  children: ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[var(--color-bg-primary)] p-4 md:p-6">
      <div className="mx-auto w-full max-w-xl">{children}</div>
    </div>
  );
}
