import { FaMinus, FaPlus, FaSearch } from 'react-icons/fa';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';

export function ZoomControl() {
  const zoom = useAppStore((s) => s.zoom);
  const setZoom = useAppStore((s) => s.setZoom);

  return (
    <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
      <FaSearch />
      <Button variant="ghost" size="sm" onClick={() => setZoom(zoom - 0.1)} aria-label="Alejar">
        <FaMinus />
      </Button>
      <span className="min-w-12 text-center font-mono">{Math.round(zoom * 100)}%</span>
      <Button variant="ghost" size="sm" onClick={() => setZoom(zoom + 0.1)} aria-label="Acercar">
        <FaPlus />
      </Button>
    </div>
  );
}
