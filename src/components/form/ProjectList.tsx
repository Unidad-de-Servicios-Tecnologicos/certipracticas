import { FaPlus, FaTrash } from 'react-icons/fa';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import type { Project } from '@/types/activities';

export interface ProjectListProps {
  items: Project[];
  onAdd: () => void;
  onUpdate: (index: number, patch: Partial<Project>) => void;
  onRemove: (index: number) => void;
  error?: string;
}

export function ProjectList({ items, onAdd, onUpdate, onRemove, error }: ProjectListProps) {
  return (
    <div className="flex flex-col gap-4">
      {items.map((project, i) => (
        <div
          key={i}
          className="relative flex flex-col gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] p-3"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
              Proyecto {i + 1}
            </span>
            <button
              type="button"
              aria-label="Eliminar proyecto"
              onClick={() => onRemove(i)}
              className="text-[var(--color-danger)] hover:opacity-70 transition-opacity"
            >
              <FaTrash size={13} />
            </button>
          </div>
          <Input
            label="Código"
            value={project.code}
            onChange={(e) => onUpdate(i, { code: e.target.value })}
            placeholder="P2023-XXXXXX-XXXXX"
            className="font-mono text-xs"
            maxLength={30}
          />
          <Input
            label="Nombre"
            value={project.name}
            onChange={(e) => onUpdate(i, { name: e.target.value })}
            placeholder="Nombre del proyecto"
            maxLength={200}
          />
          <Textarea
            label="Descripción"
            value={project.description}
            onChange={(e) => onUpdate(i, { description: e.target.value })}
            placeholder="Descripción del proyecto…"
            rows={3}
            maxLength={2000}
          />
        </div>
      ))}
      {error && <span className="text-xs text-[var(--color-danger)]">{error}</span>}
      <Button type="button" variant="ghost" size="sm" leftIcon={<FaPlus />} onClick={onAdd}>
        Añadir proyecto
      </Button>
    </div>
  );
}
