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

// CR → XP table (D&D 5E)
export const CR_XP_TABLE: Record<number, number> = {
  0: 10,
  0.125: 25,
  0.25: 50,
  0.5: 100,
  1: 200,
  2: 450,
  3: 700,
  4: 1100,
  5: 1800,
  6: 2300,
  7: 2900,
  8: 3900,
  9: 5000,
  10: 5900,
  11: 7200,
  12: 8400,
  13: 10000,
  14: 11500,
  15: 13000,
  16: 15000,
  17: 18000,
  18: 20000,
  19: 22000,
  20: 25000,
  21: 33000,
  22: 41000,
  23: 50000,
  24: 62000,
  25: 75000,
  26: 90000,
  27: 105000,
  28: 120000,
  29: 135000,
  30: 155000,
};

export function getXpFromCR(cr: number): number {
  return CR_XP_TABLE[cr] ?? 0;
}

export function getProficiencyBonusFromCR(cr: number): number {
  if (cr <= 4) return 2;
  if (cr <= 8) return 3;
  if (cr <= 12) return 4;
  if (cr <= 16) return 5;
  if (cr <= 20) return 6;
  if (cr <= 24) return 7;
  if (cr <= 28) return 8;
  return 9;
}
