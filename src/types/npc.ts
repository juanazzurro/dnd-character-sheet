import type { SavingThrowEntry, SkillEntry } from './character';

export interface NpcAction {
  id: string;
  name: string;
  description: string;
}

export interface Npc {
  id: string;
  createdAt: number;
  updatedAt: number;

  // Basic info
  name: string;
  portrait: string | null;
  race: string;
  classOrOccupation: string;
  alignment: string;
  category: string;
  location: string;
  faction: string;

  // Ability scores
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;

  // Combat stats
  armorClass: number;
  hitPoints: number;
  speed: string;
  challengeRating: number;
  proficiencyBonusOverride: number | null;

  // Combat text fields
  damageVulnerabilities: string;
  damageResistances: string;
  damageImmunities: string;
  conditionImmunities: string;
  senses: string;
  languages: string;

  // Saving throws & skills
  savingThrows: Record<string, SavingThrowEntry>;
  skills: Record<string, SkillEntry>;

  // Action lists
  traits: NpcAction[];
  actions: NpcAction[];
  reactions: NpcAction[];
  legendaryActions: NpcAction[];

  // Personality
  personalityTraits: string;
  ideals: string;
  bonds: string;
  flaws: string;
  appearance: string;
  voiceAndMannerisms: string;
  secret: string;

  // Notes
  backstory: string;
  dmNotes: string;

  // Party relationship
  attitude: string;
  relationshipNotes: string;
}

export function createDefaultNpc(): Npc {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,

    name: '',
    portrait: null,
    race: '',
    classOrOccupation: '',
    alignment: '',
    category: '',
    location: '',
    faction: '',

    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,

    armorClass: 10,
    hitPoints: 1,
    speed: '30 ft.',
    challengeRating: 0,
    proficiencyBonusOverride: null,

    damageVulnerabilities: '',
    damageResistances: '',
    damageImmunities: '',
    conditionImmunities: '',
    senses: '',
    languages: '',

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

    traits: [],
    actions: [],
    reactions: [],
    legendaryActions: [],

    personalityTraits: '',
    ideals: '',
    bonds: '',
    flaws: '',
    appearance: '',
    voiceAndMannerisms: '',
    secret: '',

    backstory: '',
    dmNotes: '',

    attitude: '',
    relationshipNotes: '',
  };
}
