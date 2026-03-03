import type { Character, AbilityScores } from '../types/character';

export const SKILL_ABILITY_MAP: Record<string, keyof AbilityScores> = {
  acrobatics: 'dexterity',
  animalHandling: 'wisdom',
  arcana: 'intelligence',
  athletics: 'strength',
  deception: 'charisma',
  history: 'intelligence',
  insight: 'wisdom',
  intimidation: 'charisma',
  investigation: 'intelligence',
  medicine: 'wisdom',
  nature: 'intelligence',
  perception: 'wisdom',
  performance: 'charisma',
  persuasion: 'charisma',
  religion: 'intelligence',
  sleightOfHand: 'dexterity',
  stealth: 'dexterity',
  survival: 'wisdom',
};

export const SKILL_LABELS: Record<string, string> = {
  acrobatics: 'Acrobacias',
  animalHandling: 'Trato con animales',
  arcana: 'Conocimiento arcano',
  athletics: 'Atletismo',
  deception: 'Engaño',
  history: 'Historia',
  insight: 'Perspicacia',
  intimidation: 'Intimidación',
  investigation: 'Investigación',
  medicine: 'Medicina',
  nature: 'Naturaleza',
  perception: 'Percepción',
  performance: 'Actuación',
  persuasion: 'Persuasión',
  religion: 'Religión',
  sleightOfHand: 'Juego de manos',
  stealth: 'Sigilo',
  survival: 'Supervivencia',
};

export const ABILITY_LABELS: Record<string, string> = {
  strength: 'Fuerza',
  dexterity: 'Destreza',
  constitution: 'Constitución',
  intelligence: 'Inteligencia',
  wisdom: 'Sabiduría',
  charisma: 'Carisma',
};

export const ABILITY_SHORT_LABELS: Record<string, string> = {
  strength: 'FUE',
  dexterity: 'DES',
  constitution: 'CON',
  intelligence: 'INT',
  wisdom: 'SAB',
  charisma: 'CAR',
};

export function getAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function getProficiencyBonus(level: number): number {
  return Math.ceil(level / 4) + 1;
}

export function formatModifier(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

export function getSavingThrow(ability: keyof AbilityScores, char: Character): number {
  const score = char[ability] as number;
  const mod = getAbilityModifier(score);
  const pb = char.proficiencyBonusOverride ?? getProficiencyBonus(char.level);
  const proficient = char.savingThrows[ability]?.proficient ?? false;
  return mod + (proficient ? pb : 0);
}

export function getSkillModifier(skillName: string, char: Character): number {
  const ability = SKILL_ABILITY_MAP[skillName];
  if (!ability) return 0;
  const score = char[ability] as number;
  const mod = getAbilityModifier(score);
  const pb = char.proficiencyBonusOverride ?? getProficiencyBonus(char.level);
  const proficient = char.skills[skillName]?.proficient ?? false;
  return mod + (proficient ? pb : 0);
}

export function getPassivePerception(char: Character): number {
  return 10 + getSkillModifier('perception', char);
}

export function getInitiative(char: Character): number {
  if (char.initiativeOverride !== null) return char.initiativeOverride;
  return getAbilityModifier(char.dexterity);
}

export function getSpellcastingAbilityMod(char: Character): number {
  const ability = char.spellcastingAbility as keyof AbilityScores;
  const score = (char[ability] as number) ?? 10;
  return getAbilityModifier(score);
}

export function getSpellSaveDC(char: Character): number {
  if (char.spellSaveDCOverride !== null) return char.spellSaveDCOverride;
  const pb = char.proficiencyBonusOverride ?? getProficiencyBonus(char.level);
  return 8 + pb + getSpellcastingAbilityMod(char);
}

export function getSpellAttackBonus(char: Character): number {
  if (char.spellAttackBonusOverride !== null) return char.spellAttackBonusOverride;
  const pb = char.proficiencyBonusOverride ?? getProficiencyBonus(char.level);
  return pb + getSpellcastingAbilityMod(char);
}
