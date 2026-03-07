import type { GameMap } from '../types/gameMap';
import { createDefaultGameMap } from '../types/gameMap';

const STORAGE_KEY = 'dnd5e_maps';
const ACTIVE_KEY = 'dnd5e_active_map';

export function loadMaps(): GameMap[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item: unknown) => item && typeof item === 'object')
      .map((item: unknown) => ({ ...createDefaultGameMap(), ...(item as Partial<GameMap>) }));
  } catch {
    return [];
  }
}

export function saveMaps(maps: GameMap[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(maps));
  } catch {
    console.warn('Failed to save maps to localStorage');
  }
}

export function loadActiveMapId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_KEY);
  } catch {
    return null;
  }
}

export function saveActiveMapId(id: string | null): void {
  if (id) {
    localStorage.setItem(ACTIVE_KEY, id);
  } else {
    localStorage.removeItem(ACTIVE_KEY);
  }
}
