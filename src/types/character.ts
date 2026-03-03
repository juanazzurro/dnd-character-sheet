export interface Attack {
  id: string;
  name: string;
  bonus: string;
  damageType: string;
}

export interface SkillEntry {
  proficient: boolean;
}

export interface SavingThrowEntry {
  proficient: boolean;
}

export interface SpellEntry {
  id: string;
  name: string;
  prepared: boolean;
}

export interface SpellLevel {
  total: number;
  expended: number;
  spells: SpellEntry[];
}

export interface SpellDescription {
  id: string;
  name: string;
  level: number;
  school: string;
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  description: string;
}

export interface EquipmentItem {
  id: string;
  name: string;
  quantity: number;
  weight: string;
}

export interface AbilityScores {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface Character {
  id: string;
  createdAt: number;
  updatedAt: number;

  // Page 1 header
  name: string;
  class: string;
  level: number;
  race: string;
  background: string;
  alignment: string;
  experiencePoints: number;
  playerName: string;
  portrait: string | null; // base64

  // Ability scores
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;

  // Inspiration + proficiency
  inspiration: boolean;
  proficiencyBonusOverride: number | null;

  // Saving throws
  savingThrows: {
    strength: SavingThrowEntry;
    dexterity: SavingThrowEntry;
    constitution: SavingThrowEntry;
    intelligence: SavingThrowEntry;
    wisdom: SavingThrowEntry;
    charisma: SavingThrowEntry;
  };

  // Skills (18 skills)
  skills: Record<string, SkillEntry>;

  // Combat
  armorClass: number;
  initiativeOverride: number | null;
  speed: string;
  hitPointMaximum: number;
  currentHitPoints: number;
  temporaryHitPoints: number;
  hitDiceTotal: string;
  hitDiceCurrent: string;
  deathSaveSuccesses: [boolean, boolean, boolean];
  deathSaveFailures: [boolean, boolean, boolean];
  armorName: string;
  hasShield: boolean;
  shieldAC: number;
  attacks: Attack[];

  // Page 2
  personalityTraits: string;
  ideals: string;
  bonds: string;
  flaws: string;
  featuresAndTraits: string;
  otherProficienciesAndLanguages: string;

  // Page 3
  currency: { cp: number; ep: number; sp: number; gp: number; pp: number };
  equipment: EquipmentItem[];
  treasure: string;

  // Page 4
  age: string;
  height: string;
  weight: string;
  eyes: string;
  skin: string;
  hair: string;
  characterAppearance: string;
  backstory: string;
  alliesName: string;
  alliesSymbol: string;
  alliesNotes: string;
  additionalFeaturesAndTraits: string;

  // Page 5
  spellcastingClass: string;
  spellcastingAbility: string;
  spellSaveDCOverride: number | null;
  spellAttackBonusOverride: number | null;
  cantrips: SpellEntry[];
  spellsByLevel: { [key: number]: SpellLevel };

  // Page 6
  spellDescriptions: SpellDescription[];
  campaignNotes: string;
  backgroundDetails: string;
}

export function createDefaultCharacter(): Character {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,

    name: '',
    class: '',
    level: 1,
    race: '',
    background: '',
    alignment: '',
    experiencePoints: 0,
    playerName: '',
    portrait: null,

    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,

    inspiration: false,
    proficiencyBonusOverride: null,

    savingThrows: {
      strength: { proficient: false },
      dexterity: { proficient: false },
      constitution: { proficient: false },
      intelligence: { proficient: false },
      wisdom: { proficient: false },
      charisma: { proficient: false },
    },

    skills: {
      acrobatics: { proficient: false },
      animalHandling: { proficient: false },
      arcana: { proficient: false },
      athletics: { proficient: false },
      deception: { proficient: false },
      history: { proficient: false },
      insight: { proficient: false },
      intimidation: { proficient: false },
      investigation: { proficient: false },
      medicine: { proficient: false },
      nature: { proficient: false },
      perception: { proficient: false },
      performance: { proficient: false },
      persuasion: { proficient: false },
      religion: { proficient: false },
      sleightOfHand: { proficient: false },
      stealth: { proficient: false },
      survival: { proficient: false },
    },

    armorClass: 10,
    initiativeOverride: null,
    speed: '30 ft.',
    hitPointMaximum: 8,
    currentHitPoints: 8,
    temporaryHitPoints: 0,
    hitDiceTotal: '1d8',
    hitDiceCurrent: '1d8',
    deathSaveSuccesses: [false, false, false],
    deathSaveFailures: [false, false, false],
    armorName: '',
    hasShield: false,
    shieldAC: 2,
    attacks: [],

    personalityTraits: '',
    ideals: '',
    bonds: '',
    flaws: '',
    featuresAndTraits: '',
    otherProficienciesAndLanguages: '',

    currency: { cp: 0, ep: 0, sp: 0, gp: 0, pp: 0 },
    equipment: [],
    treasure: '',

    age: '',
    height: '',
    weight: '',
    eyes: '',
    skin: '',
    hair: '',
    characterAppearance: '',
    backstory: '',
    alliesName: '',
    alliesSymbol: '',
    alliesNotes: '',
    additionalFeaturesAndTraits: '',

    spellcastingClass: '',
    spellcastingAbility: 'intelligence',
    spellSaveDCOverride: null,
    spellAttackBonusOverride: null,
    cantrips: [],
    spellsByLevel: {
      1: { total: 0, expended: 0, spells: [] },
      2: { total: 0, expended: 0, spells: [] },
      3: { total: 0, expended: 0, spells: [] },
      4: { total: 0, expended: 0, spells: [] },
      5: { total: 0, expended: 0, spells: [] },
      6: { total: 0, expended: 0, spells: [] },
      7: { total: 0, expended: 0, spells: [] },
      8: { total: 0, expended: 0, spells: [] },
      9: { total: 0, expended: 0, spells: [] },
    },

    spellDescriptions: [],
    campaignNotes: '',
    backgroundDetails: '',
  };
}
