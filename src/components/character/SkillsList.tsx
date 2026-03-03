import { ProficiencyToggle } from '../common/ProficiencyToggle';
import { useCharacterStore } from '../../store/characterStore';
import {
  getSkillModifier,
  formatModifier,
  SKILL_LABELS,
  SKILL_ABILITY_MAP,
  ABILITY_SHORT_LABELS,
  getPassivePerception,
} from '../../utils/calculations';
import type { Character } from '../../types/character';

const SKILLS = [
  'acrobatics',
  'animalHandling',
  'arcana',
  'athletics',
  'deception',
  'history',
  'insight',
  'intimidation',
  'investigation',
  'medicine',
  'nature',
  'perception',
  'performance',
  'persuasion',
  'religion',
  'sleightOfHand',
  'stealth',
  'survival',
] as const;

export function SkillsList() {
  const activeCharacter = useCharacterStore((s) => s.activeCharacter);
  const updateCharacter = useCharacterStore((s) => s.updateCharacter);

  if (!activeCharacter) return null;

  function toggleSkill(skillName: string) {
    if (!activeCharacter) return;
    const current = activeCharacter.skills[skillName]?.proficient ?? false;
    updateCharacter(activeCharacter.id, {
      skills: {
        ...activeCharacter.skills,
        [skillName]: { proficient: !current },
      },
    });
  }

  const passive = getPassivePerception(activeCharacter as Character);

  return (
    <div className="parchment-card p-3">
      <div className="section-header">Habilidades</div>
      <div className="space-y-0.5">
        {SKILLS.map((skillName) => {
          const mod = getSkillModifier(skillName, activeCharacter as Character);
          const proficient = activeCharacter.skills[skillName]?.proficient ?? false;
          const abilityKey = SKILL_ABILITY_MAP[skillName];
          const abilityShort = ABILITY_SHORT_LABELS[abilityKey] ?? '';
          return (
            <div key={skillName} className="flex items-center gap-1.5">
              <ProficiencyToggle
                proficient={proficient}
                onToggle={() => toggleSkill(skillName)}
                ariaLabel={`Competencia en ${SKILL_LABELS[skillName]}`}
              />
              <span
                className="w-7 text-right text-xs font-bold"
                style={{ color: '#b07820' }}
              >
                {formatModifier(mod)}
              </span>
              <span className="text-xs text-ink flex-1 truncate">
                {SKILL_LABELS[skillName]}
              </span>
              <span className="text-[10px] text-ink-muted">{abilityShort}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-2 pt-2 border-t border-parchment-300 flex items-center gap-2">
        <span className="text-xs text-ink-muted">Percepción pasiva</span>
        <span className="font-bold text-sm" style={{ color: '#b07820' }}>{passive}</span>
      </div>
    </div>
  );
}
