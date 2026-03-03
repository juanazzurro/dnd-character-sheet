import { useCharacterStore } from '../../store/characterStore';
import {
  getInitiative,
  formatModifier,
  getProficiencyBonus,
} from '../../utils/calculations';
import type { Character } from '../../types/character';

interface StatCellProps {
  label: string;
  value: string | number;
  onChange?: (v: string | number) => void;
  tooltip?: string;
  type?: 'text' | 'number';
  min?: number;
  max?: number;
}

function StatCell({ label, value, onChange, tooltip, type = 'number', min = 0, max = 9999 }: StatCellProps) {
  return (
    <div
      className="flex flex-col items-center parchment-card p-2 text-center"
      title={tooltip}
    >
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(type === 'number' ? Number(e.target.value) : e.target.value)}
        className="w-full text-center text-lg font-bold bg-transparent border-b border-dashed border-parchment-400 focus:outline-none focus:border-solid focus:border-dnd-gold text-ink mb-1"
        style={{ WebkitAppearance: 'none' }}
        min={type === 'number' ? min : undefined}
        max={type === 'number' ? max : undefined}
      />
      <span className="text-[10px] font-bold uppercase tracking-wide text-ink-muted">{label}</span>
    </div>
  );
}

export function CombatBlock() {
  const activeCharacter = useCharacterStore((s) => s.activeCharacter);
  const updateCharacter = useCharacterStore((s) => s.updateCharacter);

  if (!activeCharacter) return null;

  const char = activeCharacter as Character;
  const initiative = getInitiative(char);
  const pb = char.proficiencyBonusOverride ?? getProficiencyBonus(char.level);

  function update(field: Partial<Character>) {
    updateCharacter(activeCharacter!.id, field);
  }

  return (
    <div className="space-y-3">
      {/* Row 1: AC / Initiative / Speed */}
      <div className="grid grid-cols-3 gap-2">
        <StatCell
          label="Clase de armadura"
          value={char.armorClass}
          onChange={(v) => update({ armorClass: Number(v) })}
          tooltip="Armor Class"
          min={0}
          max={30}
        />
        <div className="flex flex-col items-center parchment-card p-2 text-center" title="Initiative">
          <span className="text-lg font-bold text-ink mb-1">{formatModifier(initiative)}</span>
          <span className="text-[10px] font-bold uppercase tracking-wide text-ink-muted">Iniciativa</span>
        </div>
        <StatCell
          label="Velocidad"
          value={char.speed}
          onChange={(v) => update({ speed: String(v) })}
          tooltip="Speed"
          type="text"
        />
      </div>

      {/* Row 2: HP */}
      <div className="parchment-card p-3">
        <div className="section-header">Puntos de golpe</div>
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wide text-ink-muted">Máximo</span>
            <input
              type="number"
              value={char.hitPointMaximum}
              onChange={(e) => update({ hitPointMaximum: Number(e.target.value) })}
              className="w-full text-center text-lg font-bold parchment-input"
              min={0}
            />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wide text-ink-muted">Actuales</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => update({ currentHitPoints: Math.max(0, char.currentHitPoints - 1) })}
                className="w-5 h-5 rounded bg-parchment-300 hover:bg-parchment-400 text-ink font-bold text-xs border border-parchment-400"
              >−</button>
              <input
                type="number"
                value={char.currentHitPoints}
                onChange={(e) => update({ currentHitPoints: Number(e.target.value) })}
                className="w-12 text-center text-lg font-bold parchment-input"
                min={0}
                max={char.hitPointMaximum}
              />
              <button
                onClick={() => update({ currentHitPoints: Math.min(char.hitPointMaximum, char.currentHitPoints + 1) })}
                className="w-5 h-5 rounded bg-parchment-300 hover:bg-parchment-400 text-ink font-bold text-xs border border-parchment-400"
              >+</button>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wide text-ink-muted">Temporales</span>
            <input
              type="number"
              value={char.temporaryHitPoints}
              onChange={(e) => update({ temporaryHitPoints: Number(e.target.value) })}
              className="w-full text-center text-lg font-bold parchment-input"
              min={0}
            />
          </div>
        </div>
      </div>

      {/* Row 3: Hit Dice + PB */}
      <div className="grid grid-cols-2 gap-2">
        <div className="parchment-card p-2">
          <div className="section-header">Dados de golpe</div>
          <div className="flex gap-2">
            <input
              type="text"
              value={char.hitDiceTotal}
              onChange={(e) => update({ hitDiceTotal: e.target.value })}
              placeholder="Ej: 5d8"
              className="parchment-input text-sm"
            />
            <input
              type="text"
              value={char.hitDiceCurrent}
              onChange={(e) => update({ hitDiceCurrent: e.target.value })}
              placeholder="Actuales"
              className="parchment-input text-sm"
            />
          </div>
        </div>
        <div className="parchment-card p-2 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-ink" style={{ color: '#b07820' }}>+{pb}</span>
          <span className="text-[10px] font-bold uppercase tracking-wide text-ink-muted">Bonif. competencia</span>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[9px] text-ink-muted">Override:</span>
            <input
              type="number"
              value={char.proficiencyBonusOverride ?? ''}
              onChange={(e) => update({ proficiencyBonusOverride: e.target.value === '' ? null : Number(e.target.value) })}
              placeholder="—"
              className="w-8 text-center parchment-input text-xs"
              min={2}
              max={9}
            />
          </div>
        </div>
      </div>

      {/* Inspiration */}
      <div className="flex items-center gap-3 parchment-card p-2">
        <button
          onClick={() => update({ inspiration: !char.inspiration })}
          className="flex items-center gap-2"
          aria-pressed={char.inspiration}
        >
          <div
            className="w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-150"
            style={{
              borderColor: char.inspiration ? '#d4af37' : '#cc9230',
              background: char.inspiration ? '#d4af37' : 'transparent',
            }}
          >
            {char.inspiration && <span className="block w-3 h-3 rounded-sm bg-ink" />}
          </div>
          <span className="text-sm font-semibold text-ink">Inspiración</span>
        </button>
      </div>
    </div>
  );
}
