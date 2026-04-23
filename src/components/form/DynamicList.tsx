import { FaPlus, FaTrash } from 'react-icons/fa';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export interface DynamicListProps {
  items: string[];
  onAdd: () => void;
  onUpdate: (index: number, value: string) => void;
  onRemove: (index: number) => void;
  placeholder?: string;
  addLabel?: string;
  error?: string;
}

export function DynamicList({
  items,
  onAdd,
  onUpdate,
  onRemove,
  placeholder,
  addLabel = 'Añadir',
  error,
}: DynamicListProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAdd();
    }
  };

  const handleChange = (index: number, value: string) => {
    // Check if the user pasted multiple lines or separated by hyphen " - "
    // We split by newline, and optionally if they type multiple items separated by ' - '
    if (value.includes('\n') || value.includes(' - ')) {
      const parts = value.split(/[\n\r]+| - /).map(s => s.replace(/^-?\s*/, '').trim()).filter(Boolean);
      if (parts.length > 0) {
        // Unfortunately we only have onUpdate and onAdd, 
        // to do it right we should update the first one, then call onAdd for the rest.
        // Wait, since we are doing this, let's just emit the joined value for now or 
        // rely on the store to handle the split if we modify the store. 
        // But doing it via onUpdate and expecting the store to split is better!
      }
    }
    onUpdate(index, value);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2 w-full">
          <div className="flex-1 w-full">
            <Input
              value={item}
              placeholder={placeholder}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full"
            />
          </div>
          <button
            type="button"
            onClick={() => onRemove(i)}
            aria-label="Eliminar"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:text-[var(--color-danger)]"
          >
            <FaTrash />
          </button>
        </div>
      ))}
      {error && <span className="text-xs text-[var(--color-danger)]">{error}</span>}
      <Button
        variant="ghost"
        size="sm"
        leftIcon={<FaPlus />}
        onClick={onAdd}
        className="self-start"
        type="button"
      >
        {addLabel}
      </Button>
    </div>
  );
}
