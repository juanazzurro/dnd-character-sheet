import { StatBlock } from '../common/StatBlock';
import { useCharacterStore } from '../../store/characterStore';
import { ABILITY_LABELS, ABILITY_SHORT_LABELS } from '../../utils/calculations';

const ABILITIES = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'] as const;

export function AbilityScores() {
  const activeCharacter = useCharacterStore((s) => s.activeCharacter);
  const updateCharacter = useCharacterStore((s) => s.updateCharacter);

  if (!activeCharacter) return null;

  return (
    <div className="parchment-card p-3">
      <div className="section-header">Puntuaciones de característica</div>
      <div className="grid grid-cols-2 gap-2">
        {ABILITIES.map((ability) => (
          <StatBlock
            key={ability}
            label={ABILITY_LABELS[ability]}
            shortLabel={ABILITY_SHORT_LABELS[ability]}
            score={activeCharacter[ability] as number}
            onScoreChange={(value) =>
              updateCharacter(activeCharacter.id, { [ability]: value })
            }
            tooltip={`Puntuación de ${ABILITY_LABELS[ability]}`}
          />
        ))}
      </div>
    </div>
  );
}
