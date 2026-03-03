import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useCharacterStore } from '../../store/characterStore';
import { PageContainer } from '../layout/PageContainer';
import type { SpellDescription } from '../../types/character';

const SCHOOLS = [
  'Abjuración', 'Conjuración', 'Adivinación', 'Encantamiento',
  'Evocación', 'Ilusión', 'Nigromancia', 'Transmutación',
];

function newSpellDesc(): SpellDescription {
  return {
    id: crypto.randomUUID(),
    name: '',
    level: 1,
    school: 'Evocación',
    castingTime: '1 acción',
    range: '30 ft.',
    components: 'V, S',
    duration: 'Instantáneo',
    description: '',
  };
}

function SpellDescCard({
  spell,
  onUpdate,
  onRemove,
}: {
  spell: SpellDescription;
  onUpdate: (changes: Partial<SpellDescription>) => void;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="parchment-card p-3">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <input
              type="text"
              value={spell.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              placeholder="Nombre del conjuro"
              className="parchment-input text-sm font-bold flex-1"
            />
            <select
              value={spell.level}
              onChange={(e) => onUpdate({ level: Number(e.target.value) })}
              className="parchment-input text-xs w-20"
            >
              <option value={0}>Truco</option>
              {[1,2,3,4,5,6,7,8,9].map((l) => (
                <option key={l} value={l}>Nivel {l}</option>
              ))}
            </select>
            <select
              value={spell.school}
              onChange={(e) => onUpdate({ school: e.target.value })}
              className="parchment-input text-xs w-28"
            >
              {SCHOOLS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {expanded && (
            <div className="grid grid-cols-2 gap-2 mt-2 mb-2">
              <div>
                <div className="section-header text-[10px]">Tiempo de lanzamiento</div>
                <input
                  type="text"
                  value={spell.castingTime}
                  onChange={(e) => onUpdate({ castingTime: e.target.value })}
                  className="parchment-input text-xs"
                />
              </div>
              <div>
                <div className="section-header text-[10px]">Alcance</div>
                <input
                  type="text"
                  value={spell.range}
                  onChange={(e) => onUpdate({ range: e.target.value })}
                  className="parchment-input text-xs"
                />
              </div>
              <div>
                <div className="section-header text-[10px]">Componentes</div>
                <input
                  type="text"
                  value={spell.components}
                  onChange={(e) => onUpdate({ components: e.target.value })}
                  className="parchment-input text-xs"
                />
              </div>
              <div>
                <div className="section-header text-[10px]">Duración</div>
                <input
                  type="text"
                  value={spell.duration}
                  onChange={(e) => onUpdate({ duration: e.target.value })}
                  className="parchment-input text-xs"
                />
              </div>
              <div className="col-span-2">
                <div className="section-header text-[10px]">Descripción</div>
                <textarea
                  value={spell.description}
                  onChange={(e) => onUpdate({ description: e.target.value })}
                  rows={4}
                  className="parchment-input resize-none leading-relaxed w-full text-xs"
                  placeholder="Descripción del conjuro, efectos, notas..."
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="p-1 text-ink-muted hover:text-ink"
            title={expanded ? 'Colapsar' : 'Expandir'}
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <button
            onClick={onRemove}
            className="p-1 text-ink-muted hover:text-dnd-red"
            title="Eliminar"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function SpellNotesPage() {
  const activeCharacter = useCharacterStore((s) => s.activeCharacter);
  const updateCharacter = useCharacterStore((s) => s.updateCharacter);

  if (!activeCharacter) return <PageContainer><p className="text-ink-muted">No hay personaje activo</p></PageContainer>;

  function updateDesc(id: string, changes: Partial<SpellDescription>) {
    updateCharacter(activeCharacter!.id, {
      spellDescriptions: activeCharacter!.spellDescriptions.map((s) =>
        s.id === id ? { ...s, ...changes } : s
      ),
    });
  }

  function removeDesc(id: string) {
    updateCharacter(activeCharacter!.id, {
      spellDescriptions: activeCharacter!.spellDescriptions.filter((s) => s.id !== id),
    });
  }

  function addDesc() {
    updateCharacter(activeCharacter!.id, {
      spellDescriptions: [...activeCharacter!.spellDescriptions, newSpellDesc()],
    });
  }

  return (
    <PageContainer>
      <h2 className="font-serif text-xl font-bold text-ink mb-4">Descripciones de conjuros y notas</h2>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="parchment-card p-3">
          <div className="section-header">Notas de campaña</div>
          <textarea
            defaultValue={activeCharacter.campaignNotes}
            onChange={(e) => updateCharacter(activeCharacter.id, { campaignNotes: e.target.value })}
            rows={8}
            placeholder="Notas de la campaña, PNJs importantes, rumores, misiones activas..."
            className="parchment-input resize-none leading-relaxed w-full"
          />
        </div>
        <div className="parchment-card p-3">
          <div className="section-header">Detalles del trasfondo</div>
          <textarea
            defaultValue={activeCharacter.backgroundDetails}
            onChange={(e) => updateCharacter(activeCharacter.id, { backgroundDetails: e.target.value })}
            rows={8}
            placeholder="Historia detallada del trasfondo, eventos pasados relevantes..."
            className="parchment-input resize-none leading-relaxed w-full"
          />
        </div>
      </div>

      {/* Spell descriptions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-serif font-bold text-ink">Descripciones de conjuros</h3>
          <button onClick={addDesc} className="btn-primary flex items-center gap-1 text-xs">
            <Plus size={12} /> Añadir conjuro
          </button>
        </div>
        <div className="space-y-3">
          {activeCharacter.spellDescriptions.map((spell) => (
            <SpellDescCard
              key={spell.id}
              spell={spell}
              onUpdate={(changes) => updateDesc(spell.id, changes)}
              onRemove={() => removeDesc(spell.id)}
            />
          ))}
          {activeCharacter.spellDescriptions.length === 0 && (
            <div className="parchment-card p-6 text-center text-ink-muted text-sm">
              No hay conjuros descritos todavía. Añade uno con el botón de arriba.
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
