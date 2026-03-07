import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Quest } from '../../types/quest';

const STATUS_COLORS: Record<string, string> = {
  Activa: 'bg-amber-800 text-amber-200',
  Completada: 'bg-green-800 text-green-200',
  Fallida: 'bg-red-800 text-red-200',
  Abandonada: 'bg-gray-600 text-gray-200',
  Pendiente: 'bg-blue-800 text-blue-200',
};

const PRIORITY_COLORS: Record<string, string> = {
  Critica: 'bg-red-900 text-red-200',
  Alta: 'bg-orange-800 text-orange-200',
  Media: 'bg-yellow-800 text-yellow-200',
  Baja: 'bg-parchment-400 text-ink',
};

interface QuestCardProps {
  quest: Quest;
  basePath: string;
  onDelete: (id: string) => void;
}

export function QuestCard({ quest, basePath, onDelete }: QuestCardProps) {
  const navigate = useNavigate();

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (window.confirm(`¿Eliminar "${quest.title || 'Mision sin titulo'}"? Esta accion no se puede deshacer.`)) {
      onDelete(quest.id);
    }
  }

  const preview = quest.description.length > 80 ? quest.description.slice(0, 80) + '...' : quest.description;
  const completedObjectives = quest.objectives.filter((o) => o.completed).length;
  const totalObjectives = quest.objectives.length;
  const statusColor = STATUS_COLORS[quest.status] || 'bg-gray-600 text-gray-200';
  const priorityColor = PRIORITY_COLORS[quest.priority] || '';

  return (
    <div
      onClick={() => navigate(`${basePath}/${quest.id}`)}
      className="parchment-card p-3 cursor-pointer hover:border-dnd-gold transition-colors relative group"
    >
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 p-1 text-ink-muted hover:text-dnd-red transition-colors opacity-0 group-hover:opacity-100"
        title="Eliminar mision"
        type="button"
      >
        <X size={14} />
      </button>

      <div className="space-y-2">
        <h3 className="font-serif font-bold text-ink text-sm truncate pr-6">
          {quest.title || 'Mision sin titulo'}
        </h3>

        <div className="flex flex-wrap gap-1.5">
          <span className={`inline-block text-xs px-1.5 py-0.5 rounded-full font-semibold ${statusColor}`}>
            {quest.status}
          </span>
          {quest.priority && priorityColor && (
            <span className={`inline-block text-xs px-1.5 py-0.5 rounded-full font-semibold ${priorityColor}`}>
              {quest.priority}
            </span>
          )}
        </div>

        {(quest.questGiver || quest.location) && (
          <p className="text-xs text-ink-muted truncate">
            {[quest.questGiver && `De: ${quest.questGiver}`, quest.location && `En: ${quest.location}`].filter(Boolean).join(' | ')}
          </p>
        )}

        {totalObjectives > 0 && (
          <p className="text-xs text-ink-muted">
            Objetivos: {completedObjectives}/{totalObjectives}
          </p>
        )}

        {preview && (
          <p className="text-xs text-ink-muted line-clamp-2">{preview}</p>
        )}
      </div>
    </div>
  );
}
