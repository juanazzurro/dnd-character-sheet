import { X, Trash2 } from 'lucide-react';
import type { MapPin } from '../../types/gameMap';
import { PIN_TYPES, PIN_STATUSES } from '../../types/gameMap';
import type { PinType, PinStatus } from '../../types/gameMap';
import { EditableField } from '../common/EditableField';
import { AutocompleteField, type Suggestion } from '../common/AutocompleteField';
import { CrossReferenceChips } from '../common/CrossReferenceChips';

interface MapPinPanelProps {
  pin: MapPin;
  onUpdate: (updates: Partial<MapPin>) => void;
  onDelete: () => void;
  onClose: () => void;
  npcSuggestions: Suggestion[];
  questSuggestions: Suggestion[];
}

export function MapPinPanel({ pin, onUpdate, onDelete, onClose, npcSuggestions, questSuggestions }: MapPinPanelProps) {
  function handleDelete() {
    if (window.confirm(`¿Eliminar el pin "${pin.name || 'Sin nombre'}"?`)) {
      onDelete();
    }
  }

  return (
    <div
      className="w-80 flex-shrink-0 flex flex-col overflow-y-auto border-l"
      style={{ background: '#1a1a2e', borderColor: '#2a2a3e' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b" style={{ borderColor: '#2a2a3e' }}>
        <h3 className="font-serif font-bold text-ink text-sm">Editar Pin</h3>
        <button onClick={onClose} className="text-ink-muted hover:text-ink transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="p-3 space-y-3 flex-1">
        <EditableField
          value={pin.name}
          onChange={(v) => onUpdate({ name: String(v) })}
          placeholder="Nombre del lugar"
          label="Nombre"
        />

        <div>
          <div className="section-header">Tipo</div>
          <select
            value={pin.type}
            onChange={(e) => onUpdate({ type: e.target.value as PinType })}
            className="parchment-input w-full"
          >
            {PIN_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <div className="section-header">Estado</div>
          <select
            value={pin.status}
            onChange={(e) => onUpdate({ status: e.target.value as PinStatus })}
            className="parchment-input w-full"
          >
            {PIN_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <EditableField
          value={pin.description}
          onChange={(v) => onUpdate({ description: String(v) })}
          placeholder="Descripcion del lugar..."
          label="Descripcion"
          multiline
          rows={3}
        />

        <AutocompleteField
          value={pin.relatedNpcs}
          onChange={(v) => onUpdate({ relatedNpcs: v })}
          suggestions={npcSuggestions}
          placeholder="NPCs relacionados..."
          label="NPCs Relacionados"
          multiline
          rows={2}
        />
        <CrossReferenceChips
          value={pin.relatedNpcs}
          entities={npcSuggestions.map((s) => ({ name: s.name, route: s.route }))}
        />

        <AutocompleteField
          value={pin.relatedQuests}
          onChange={(v) => onUpdate({ relatedQuests: v })}
          suggestions={questSuggestions}
          placeholder="Misiones relacionadas..."
          label="Misiones Relacionadas"
          multiline
          rows={2}
        />
        <CrossReferenceChips
          value={pin.relatedQuests}
          entities={questSuggestions.map((s) => ({ name: s.name, route: s.route }))}
        />

        <EditableField
          value={pin.dmNotes}
          onChange={(v) => onUpdate({ dmNotes: String(v) })}
          placeholder="Notas del DM..."
          label="Notas del DM"
          multiline
          rows={3}
        />

        <div className="pt-2">
          <button
            onClick={handleDelete}
            className="w-full flex items-center justify-center gap-1 px-3 py-2 text-sm rounded border transition-colors"
            style={{ borderColor: '#8b0000', color: '#ef4444', background: 'transparent' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#8b000033'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <Trash2 size={14} />
            Eliminar Pin
          </button>
        </div>
      </div>
    </div>
  );
}
