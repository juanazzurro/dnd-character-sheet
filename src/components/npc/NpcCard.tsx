import { X, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Npc } from '../../types/npc';
import { useNpcStore } from '../../store/npcStore';

const CATEGORY_COLORS: Record<string, string> = {
  Aliado: 'bg-green-800 text-green-200',
  Enemigo: 'bg-red-800 text-red-200',
  Neutral: 'bg-gray-600 text-gray-200',
  Mercader: 'bg-amber-800 text-amber-200',
  Tabernero: 'bg-orange-800 text-orange-200',
  Noble: 'bg-purple-800 text-purple-200',
  Guardia: 'bg-blue-800 text-blue-200',
  Villano: 'bg-red-900 text-red-200',
  Deidad: 'bg-yellow-700 text-yellow-200',
  Otro: 'bg-parchment-400 text-ink',
};

const ATTITUDE_COLORS: Record<string, string> = {
  Amistoso: 'bg-green-500',
  Neutral: 'bg-yellow-500',
  Hostil: 'bg-red-500',
};

interface NpcCardProps {
  npc: Npc;
}

export function NpcCard({ npc }: NpcCardProps) {
  const navigate = useNavigate();
  const deleteNpc = useNpcStore((s) => s.deleteNpc);

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (window.confirm(`¿Eliminar a "${npc.name || 'NPC sin nombre'}"? Esta accion no se puede deshacer.`)) {
      deleteNpc(npc.id);
    }
  }

  const description = npc.personalityTraits || npc.backstory || '';
  const preview = description.length > 80 ? description.slice(0, 80) + '...' : description;
  const attitudeColor = ATTITUDE_COLORS[npc.attitude] || 'bg-gray-500';
  const categoryColor = CATEGORY_COLORS[npc.category] || '';

  return (
    <div
      onClick={() => navigate(`/npcs/${npc.id}`)}
      className="parchment-card p-3 cursor-pointer hover:border-dnd-gold transition-colors relative group"
    >
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 p-1 text-ink-muted hover:text-dnd-red transition-colors opacity-0 group-hover:opacity-100"
        title="Eliminar NPC"
        type="button"
      >
        <X size={14} />
      </button>

      <div className="flex gap-3">
        {/* Thumbnail */}
        <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-parchment-200 border border-parchment-300 flex items-center justify-center">
          {npc.portrait ? (
            <img src={npc.portrait} alt={npc.name} className="w-full h-full object-cover" />
          ) : (
            <User size={24} className="text-parchment-400" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-serif font-bold text-ink text-sm truncate">
              {npc.name || 'NPC sin nombre'}
            </h3>
            {npc.attitude && (
              <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${attitudeColor}`} title={npc.attitude} />
            )}
          </div>

          {(npc.race || npc.classOrOccupation) && (
            <p className="text-xs text-ink-muted truncate">
              {[npc.race, npc.classOrOccupation].filter(Boolean).join(' - ')}
            </p>
          )}

          {npc.category && categoryColor && (
            <span className={`inline-block text-xs px-1.5 py-0.5 rounded-full mt-1 font-semibold ${categoryColor}`}>
              {npc.category}
            </span>
          )}
        </div>
      </div>

      {preview && (
        <p className="text-xs text-ink-muted mt-2 line-clamp-2">{preview}</p>
      )}
    </div>
  );
}
