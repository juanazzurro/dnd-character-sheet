export interface QuestObjective {
  id: string;
  description: string;
  completed: boolean;
  notes: string;
}

export interface SessionLogEntry {
  id: string;
  date: string; // ISO string
  sessionNumber: number;
  text: string;
}

export interface Quest {
  id: string;
  createdAt: number;
  updatedAt: number;

  title: string;
  status: string;
  priority: string;
  questGiver: string;
  location: string;
  reward: string;
  description: string;

  objectives: QuestObjective[];
  sessionLog: SessionLogEntry[];

  relatedNpcs: string;
  relatedQuests: string;
  relatedLocations: string;

  dmNotes: string;
}

export function createDefaultQuest(): Quest {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,

    title: '',
    status: 'Pendiente',
    priority: '',
    questGiver: '',
    location: '',
    reward: '',
    description: '',

    objectives: [],
    sessionLog: [],

    relatedNpcs: '',
    relatedQuests: '',
    relatedLocations: '',

    dmNotes: '',
  };
}
