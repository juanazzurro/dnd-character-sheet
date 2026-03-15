import { X, Map, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { GameMap } from '../../types/gameMap';
import { useMapStore } from '../../store/mapStore';

interface MapCardProps {
  map: GameMap;
}

export function MapCard({ map }: MapCardProps) {
  const navigate = useNavigate();
  const deleteMap = useMapStore((s) => s.deleteMap);

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (window.confirm(`¿Eliminar "${map.name || 'Mapa sin nombre'}"? Esta accion no se puede deshacer.`)) {
      deleteMap(map.id);
    }
  }

  const preview = map.description.length > 80 ? map.description.slice(0, 80) + '...' : map.description;

  return (
    <div
      onClick={() => navigate(`/mapa/${map.id}`)}
      className="parchment-card p-0 cursor-pointer hover:border-dnd-gold transition-colors relative group overflow-hidden"
    >
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 z-10 p-1 text-ink-muted hover:text-dnd-red transition-colors"
        title="Eliminar mapa"
        type="button"
      >
        <X size={14} />
      </button>

      {/* Thumbnail */}
      <div className="w-full aspect-video bg-parchment-200 flex items-center justify-center overflow-hidden">
        {map.image ? (
          <img src={map.image} alt={map.name} className="w-full h-full object-cover" />
        ) : (
          <Map size={36} className="text-parchment-400" />
        )}
      </div>

      <div className="p-3">
        <div className="flex items-center gap-2">
          <h3 className="font-serif font-bold text-ink text-sm truncate flex-1">
            {map.name || 'Mapa sin nombre'}
          </h3>
          {map.pins.length > 0 && (
            <span className="flex items-center gap-1 text-xs text-ink-muted flex-shrink-0">
              <MapPin size={12} />
              {map.pins.length}
            </span>
          )}
        </div>

        {preview && (
          <p className="text-xs text-ink-muted mt-1 line-clamp-2">{preview}</p>
        )}
      </div>
    </div>
  );
}
