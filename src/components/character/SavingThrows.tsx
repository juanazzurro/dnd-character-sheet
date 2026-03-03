import { ProficiencyToggle } from '../common/ProficiencyToggle';
import { useCharacterStore } from '../../store/characterStore';
import {
  getSavingThrow,
  formatModifier,
  ABILITY_LABELS,
} from '../../utils/calculations';
import type { Character } from '../../types/character';

const ABILITIES = [
  'strength',
  'dexterity',
  'constitution',
  'intelligence',
  'wisdom',
  'charisma',
] as const;

export function SavingThrows() {
  const activeCharacter = useCharacterStore((s) => s.activeCharacter);
  const updateCharacter = useCharacterStore((s) => s.updateCharacter);

  if (!activeCharacter) return null;

  function toggleProficiency(ability: (typeof ABILITIES)[number]) {
    if (!activeCharacter) return;
    const current = activeCharacter.savingThrows[ability]?.proficient ?? false;
    updateCharacter(activeCharacter.id, {
      savingThrows: {
        ...activeCharacter.savingThrows,
        [ability]: { proficient: !current },
      },
    });
  }

  return (
    <div className="parchment-card p-3">
      <div className="section-header">Tiradas de salvación</div>
      <div className="space-y-1">
        {ABILITIES.map((ability) => {
          const mod = getSavingThrow(ability, activeCharacter as Character);
          const proficient = activeCharacter.savingThrows[ability]?.proficient ?? false;
          return (
            <div key={ability} className="flex items-center gap-2">
              <ProficiencyToggle
                proficient={proficient}
                onToggle={() => toggleProficiency(ability)}
                ariaLabel={`Competencia en tirada de salvación de ${ABILITY_LABELS[ability]}`}
              />
              <span
                className="w-8 text-right text-sm font-bold"
                style={{ color: '#b07820' }}
              >
                {formatModifier(mod)}
              </span>
              <span className="text-xs text-ink flex-1">{ABILITY_LABELS[ability]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
