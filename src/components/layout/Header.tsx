import { APP_NAME, APP_TAGLINE } from '@/data/constants';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-3">
      <a href="#" className="flex items-center gap-3 transition-opacity hover:opacity-80">
        <img src="/logo.png" alt="SENA Logo" className="h-10 w-auto object-contain" />
        <div>
          <h1 className="text-base font-bold text-[var(--color-text-primary)]">{APP_NAME}</h1>
          <p className="hidden text-xs text-[var(--color-text-secondary)] sm:block">{APP_TAGLINE}</p>
        </div>
      </a>
      <ThemeToggle />
    </header>
  );
}
