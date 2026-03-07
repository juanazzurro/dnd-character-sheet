import { Trash2, Plus } from 'lucide-react';
import type { QuestObjective } from '../../types/quest';

interface QuestObjectiveListProps {
  objectives: QuestObjective[];
  onChange: (objectives: QuestObjective[]) => void;
}

export function QuestObjectiveList({ objectives, onChange }: QuestObjectiveListProps) {
  function handleAdd() {
    onChange([...objectives, { id: crypto.randomUUID(), description: '', completed: false, notes: '' }]);
  }

  function handleRemove(id: string) {
    onChange(objectives.filter((o) => o.id !== id));
  }

  function handleUpdate(id: string, updates: Partial<QuestObjective>) {
    onChange(objectives.map((o) => (o.id === id ? { ...o, ...updates } : o)));
  }

  return (
    <div>
      <div className="space-y-2">
        {objectives.map((obj) => (
          <div key={obj.id} className="flex gap-2 items-start">
            <input
              type="checkbox"
              checked={obj.completed}
              onChange={(e) => handleUpdate(obj.id, { completed: e.target.checked })}
              className="mt-2 accent-dnd-gold w-4 h-4 flex-shrink-0"
            />
            <div className="flex-1 space-y-1">
              <input
                type="text"
                defaultValue={obj.description}
                onChange={(e) => handleUpdate(obj.id, { description: e.target.value })}
                placeholder="Descripcion del objetivo"
                className={`parchment-input text-sm font-semibold ${obj.completed ? 'line-through text-ink-muted' : ''}`}
              />
              <textarea
                defaultValue={obj.notes}
                onChange={(e) => handleUpdate(obj.id, { notes: e.target.value })}
                placeholder="Notas..."
                rows={1}
                className="parchment-input resize-none text-sm leading-relaxed"
                style={{ borderBottomWidth: '1px' }}
              />
            </div>
            <button
              onClick={() => handleRemove(obj.id)}
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
        Agregar objetivo
      </button>
    </div>
  );
}
