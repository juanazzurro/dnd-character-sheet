import { Plus, Trash2 } from 'lucide-react';
import { useCharacterStore } from '../../store/characterStore';
import { SpellLevelSectionComponent } from '../character/SpellLevelSection';
import { PageContainer } from '../layout/PageContainer';
import {
  getSpellSaveDC,
  getSpellAttackBonus,
  formatModifier,
  ABILITY_LABELS,
} from '../../utils/calculations';
import type { Character, SpellEntry } from '../../types/character';

const SPELLCASTING_ABILITIES = [
  'intelligence',
  'wisdom',
  'charisma',
  'strength',
  'dexterity',
  'constitution',
] as const;

function newCantrip(): SpellEntry {
  return { id: crypto.randomUUID(), name: '', prepared: false };
}

export function SpellcastingPage() {
  const activeCharacter = useCharacterStore((s) => s.activeCharacter);
  const updateCharacter = useCharacterStore((s) => s.updateCharacter);

  if (!activeCharacter) return <PageContainer><p className="text-ink-muted">No hay personaje activo</p></PageContainer>;

  const char = activeCharacter as Character;
  const dc = getSpellSaveDC(char);
  const atk = getSpellAttackBonus(char);

  function update(field: string, value: unknown) {
    updateCharacter(activeCharacter!.id, { [field]: value } as never);
  }

  function addCantrip() {
    update('cantrips', [...(activeCharacter?.cantrips ?? []), newCantrip()]);
  }

  function removeCantrip(id: string) {
    update('cantrips', (activeCharacter?.cantrips ?? []).filter((c) => c.id !== id));
  }

  function updateCantrip(id: string, changes: Partial<SpellEntry>) {
    update(
      'cantrips',
      (activeCharacter?.cantrips ?? []).map((c) => (c.id === id ? { ...c, ...changes } : c))
    );
  }

  return (
    <PageContainer>
      <h2 className="font-serif text-xl font-bold text-ink mb-4">Conjuros</h2>

      {/* Header row */}
      <div className="parchment-card p-3 mb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <div className="section-header">Clase de conjuro</div>
            <input
              type="text"
              defaultValue={activeCharacter.spellcastingClass}
              onChange={(e) => update('spellcastingClass', e.target.value)}
              placeholder="Ej: Mago"
              className="parchment-input"
            />
          </div>
          <div>
            <div className="section-header">Característica</div>
            <select
              value={activeCharacter.spellcastingAbility}
              onChange={(e) => update('spellcastingAbility', e.target.value)}
              className="parchment-input"
            >
              {SPELLCASTING_ABILITIES.map((ab) => (
                <option key={ab} value={ab}>{ABILITY_LABELS[ab]}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col items-center parchment-card p-2 text-center">
            <span className="text-2xl font-bold text-ink mb-1" style={{ color: '#b07820' }}>{dc}</span>
            <span className="text-[10px] font-bold uppercase tracking-wide text-ink-muted">CD Conjuro</span>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[9px] text-ink-muted">Override:</span>
              <input
                type="number"
                value={activeCharacter.spellSaveDCOverride ?? ''}
                onChange={(e) => update('spellSaveDCOverride', e.target.value === '' ? null : Number(e.target.value))}
                placeholder="—"
                className="w-8 text-center parchment-input text-xs"
              />
            </div>
          </div>
          <div className="flex flex-col items-center parchment-card p-2 text-center">
            <span className="text-2xl font-bold mb-1" style={{ color: '#b07820' }}>{formatModifier(atk)}</span>
            <span className="text-[10px] font-bold uppercase tracking-wide text-ink-muted">Bonif. de ataque</span>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[9px] text-ink-muted">Override:</span>
              <input
                type="number"
                value={activeCharacter.spellAttackBonusOverride ?? ''}
                onChange={(e) => update('spellAttackBonusOverride', e.target.value === '' ? null : Number(e.target.value))}
                placeholder="—"
                className="w-8 text-center parchment-input text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Cantrips */}
      <div className="parchment-card p-3 mb-3">
        <div className="section-header">Trucos (cantrips)</div>
        <div className="space-y-1">
          {activeCharacter.cantrips.map((cantrip) => (
            <div key={cantrip.id} className="flex items-center gap-2">
              <input
                type="text"
                value={cantrip.name}
                onChange={(e) => updateCantrip(cantrip.id, { name: e.target.value })}
                placeholder="Nombre del truco"
                className="parchment-input text-xs flex-1"
              />
              <button
                onClick={() => removeCantrip(cantrip.id)}
                className="text-ink-muted hover:text-dnd-red transition-colors flex-shrink-0"
              >
                <Trash2 size={10} />
              </button>
            </div>
          ))}
          <button
            onClick={addCantrip}
            className="flex items-center gap-1 text-xs text-ink-muted hover:text-ink transition-colors"
          >
            <Plus size={10} /> Añadir truco
          </button>
        </div>
      </div>

      {/* Spell levels 1-9 */}
      <div className="space-y-2">
        {([1, 2, 3, 4, 5, 6, 7, 8, 9] as const).map((level) => (
          <SpellLevelSectionComponent
            key={level}
            level={level}
            spellLevel={activeCharacter.spellsByLevel[level] ?? { total: 0, expended: 0, spells: [] }}
          />
        ))}
      </div>
    </PageContainer>
  );
}
