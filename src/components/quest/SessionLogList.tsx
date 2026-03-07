import { Trash2, Plus } from 'lucide-react';
import type { SessionLogEntry } from '../../types/quest';

interface SessionLogListProps {
  entries: SessionLogEntry[];
  onChange: (entries: SessionLogEntry[]) => void;
}

function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export function SessionLogList({ entries, onChange }: SessionLogListProps) {
  function handleAdd() {
    const newEntry: SessionLogEntry = {
      id: crypto.randomUUID(),
      date: todayISO(),
      sessionNumber: 0,
      text: '',
    };
    onChange([newEntry, ...entries]);
  }

  function handleRemove(id: string) {
    onChange(entries.filter((e) => e.id !== id));
  }

  function handleUpdate(id: string, updates: Partial<SessionLogEntry>) {
    onChange(entries.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  }

  return (
    <div>
      <button
        onClick={handleAdd}
        className="btn-secondary text-xs mb-2 flex items-center gap-1"
        type="button"
      >
        <Plus size={12} />
        Agregar entrada
      </button>
      <div className="space-y-2">
        {entries.map((entry) => (
          <div key={entry.id} className="flex gap-2 items-start">
            <div className="flex-1 space-y-1">
              <div className="flex gap-2">
                <input
                  type="date"
                  defaultValue={entry.date}
                  onChange={(e) => handleUpdate(entry.id, { date: e.target.value })}
                  className="parchment-input text-sm w-36"
                />
                <input
                  type="number"
                  defaultValue={entry.sessionNumber || ''}
                  onChange={(e) => handleUpdate(entry.id, { sessionNumber: Number(e.target.value) || 0 })}
                  placeholder="Sesion #"
                  className="parchment-input text-sm w-24"
                  min={0}
                />
              </div>
              <textarea
                defaultValue={entry.text}
                onChange={(e) => handleUpdate(entry.id, { text: e.target.value })}
                placeholder="Notas de la sesion..."
                rows={2}
                className="parchment-input resize-none text-sm leading-relaxed"
                style={{ borderBottomWidth: '1px' }}
              />
            </div>
            <button
              onClick={() => handleRemove(entry.id)}
              className="mt-1 p-1 text-ink-muted hover:text-dnd-red transition-colors"
              title="Eliminar"
              type="button"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
