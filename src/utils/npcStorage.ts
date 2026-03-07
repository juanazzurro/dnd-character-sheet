import type { Npc } from '../types/npc';
import { createDefaultNpc } from '../types/npc';

const STORAGE_KEY = 'dnd5e_npcs';
const ACTIVE_KEY = 'dnd5e_active_npc';

export function loadNpcs(): Npc[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item: unknown) => item && typeof item === 'object')
      .map((item: unknown) => ({ ...createDefaultNpc(), ...(item as Partial<Npc>) }));
  } catch {
    return [];
  }
}

export function saveNpcs(npcs: Npc[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(npcs));
  } catch {
    console.warn('Failed to save NPCs to localStorage');
  }
}

export function loadActiveNpcId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_KEY);
  } catch {
    return null;
  }
}

export function saveActiveNpcId(id: string | null): void {
  if (id) {
    localStorage.setItem(ACTIVE_KEY, id);
  } else {
    localStorage.removeItem(ACTIVE_KEY);
  }
}
