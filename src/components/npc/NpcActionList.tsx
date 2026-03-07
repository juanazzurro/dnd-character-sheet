import { Trash2, Plus } from 'lucide-react';
import type { NpcAction } from '../../types/npc';

interface NpcActionListProps {
  items: NpcAction[];
  onChange: (items: NpcAction[]) => void;
  label: string;
  addLabel: string;
}

export function NpcActionList({ items, onChange, label, addLabel }: NpcActionListProps) {
  function handleAdd() {
    onChange([...items, { id: crypto.randomUUID(), name: '', description: '' }]);
  }

  function handleRemove(id: string) {
    onChange(items.filter((item) => item.id !== id));
  }

  function handleUpdate(id: string, field: 'name' | 'description', value: string) {
    onChange(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  }

  return (
    <div>
      <div className="section-header">{label}</div>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex gap-2 items-start">
            <div className="flex-1 space-y-1">
              <input
                type="text"
                defaultValue={item.name}
                onChange={(e) => handleUpdate(item.id, 'name', e.target.value)}
                placeholder="Nombre"
                className="parchment-input text-sm font-semibold"
              />
              <textarea
                defaultValue={item.description}
                onChange={(e) => handleUpdate(item.id, 'description', e.target.value)}
                placeholder="Descripcion..."
                rows={2}
                className="parchment-input resize-none text-sm leading-relaxed"
                style={{ borderBottomWidth: '1px' }}
              />
            </div>
            <button
              onClick={() => handleRemove(item.id)}
              className="mt-1 p-1 text-ink-muted hover:text-dnd-red transition-colors"
              title="Eliminar"
              type="button"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={handleAdd}
        className="btn-secondary text-xs mt-2 flex items-center gap-1"
        type="button"
      >
        <Plus size={12} />
        {addLabel}
      </button>
    </div>
  );
}
