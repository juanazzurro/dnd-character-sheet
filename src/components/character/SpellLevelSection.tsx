import { Plus, Trash2 } from 'lucide-react';
import { CollapsibleSection } from '../common/CollapsibleSection';
import { useCharacterStore } from '../../store/characterStore';
import type { SpellEntry, SpellLevel } from '../../types/character';

interface SpellLevelSectionProps {
  level: number;
  spellLevel: SpellLevel;
}

function newSpell(): SpellEntry {
  return { id: crypto.randomUUID(), name: '', prepared: false };
}

export function SpellLevelSectionComponent({ level, spellLevel }: SpellLevelSectionProps) {
  const activeCharacter = useCharacterStore((s) => s.activeCharacter);
  const updateCharacter = useCharacterStore((s) => s.updateCharacter);

  if (!activeCharacter) return null;

  function updateLevel(changes: Partial<SpellLevel>) {
    updateCharacter(activeCharacter!.id, {
      spellsByLevel: {
        ...activeCharacter!.spellsByLevel,
        [level]: { ...spellLevel, ...changes },
      },
    });
  }

  function addSpell() {
    updateLevel({ spells: [...spellLevel.spells, newSpell()] });
  }

  function removeSpell(id: string) {
    updateLevel({ spells: spellLevel.spells.filter((s) => s.id !== id) });
  }

  function updateSpell(id: string, changes: Partial<SpellEntry>) {
    updateLevel({
      spells: spellLevel.spells.map((s) => (s.id === id ? { ...s, ...changes } : s)),
    });
  }

  const hasContent = spellLevel.spells.length > 0 || spellLevel.total > 0;

  const headerExtra = (
    <div className="flex items-center gap-2 mr-2" onClick={(e) => e.stopPropagation()}>
      <span className="text-[10px] text-ink-muted">Espacios:</span>
      <input
        type="number"
        value={spellLevel.total}
        onChange={(e) => {
          const n = Math.max(0, Number(e.target.value));
          updateLevel({ total: n, expended: Math.min(spellLevel.expended, n) });
        }}
        className="w-8 text-center parchment-input text-xs"
        min={0}
        max={9}
        title="Total de espacios de conjuro"
      />
      <span className="text-[10px] text-ink-muted">Gastados:</span>
      <button
        onClick={() => updateLevel({ expended: Math.max(0, spellLevel.expended - 1) })}
        className="w-4 h-4 rounded bg-parchment-400 text-xs font-bold leading-none"
      >−</button>
      <span className="text-xs font-bold text-ink w-4 text-center">{spellLevel.expended}</span>
      <button
        onClick={() => updateLevel({ expended: Math.min(spellLevel.total, spellLevel.expended + 1) })}
        className="w-4 h-4 rounded bg-parchment-400 text-xs font-bold leading-none"
      >+</button>
    </div>
  );

  return (
    <CollapsibleSection
      title={`Nivel ${level}`}
      defaultOpen={hasContent}
      badge={spellLevel.spells.length || undefined}
      headerExtra={headerExtra}
    >
      <div className="space-y-1">
        {spellLevel.spells.map((spell) => (
          <div key={spell.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={spell.prepared}
              onChange={(e) => updateSpell(spell.id, { prepared: e.target.checked })}
              title="Preparado"
              className="accent-dnd-gold"
            />
            <input
              type="text"
              value={spell.name}
              onChange={(e) => updateSpell(spell.id, { name: e.target.value })}
              placeholder="Nombre del conjuro"
              className="parchment-input text-xs flex-1"
            />
            <button
              onClick={() => removeSpell(spell.id)}
              className="text-ink-muted hover:text-dnd-red transition-colors flex-shrink-0"
              title="Eliminar conjuro"
            >
              <Trash2 size={10} />
            </button>
          </div>
        ))}
        <button
          onClick={addSpell}
          className="flex items-center gap-1 text-xs text-ink-muted hover:text-ink transition-colors mt-1"
        >
          <Plus size={10} /> Añadir conjuro
        </button>
      </div>
    </CollapsibleSection>
  );
}
