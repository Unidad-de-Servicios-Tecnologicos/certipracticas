export interface PageNavigatorProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PageNavigator({ currentPage, totalPages, onPageChange }: PageNavigatorProps) {
  if (totalPages <= 1) {
    return (
      <span className="text-xs text-[var(--color-text-secondary)]">
        Pág. {currentPage}/{totalPages}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="rounded px-1 hover:bg-[var(--color-bg-tertiary)] disabled:opacity-40"
        aria-label="Página anterior"
      >
        ◀
      </button>
      <span>
        Pág. {currentPage}/{totalPages}
      </span>
      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded px-1 hover:bg-[var(--color-bg-tertiary)] disabled:opacity-40"
        aria-label="Página siguiente"
      >
        ▶
      </button>
    </div>
  );
}
