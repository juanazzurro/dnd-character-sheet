import type { Character } from '../types/character';

const STORAGE_KEY = 'dnd5e_characters';
const ACTIVE_KEY = 'dnd5e_active_character';

export function loadCharacters(): Character[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Character[];
  } catch {
    return [];
  }
}

export function saveCharacters(chars: Character[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chars));
  } catch {
    // Storage might be full
    console.warn('Failed to save characters to localStorage');
  }
}

export function loadActiveCharacterId(): string | null {
  return localStorage.getItem(ACTIVE_KEY);
}

export function saveActiveCharacterId(id: string | null): void {
  if (id) {
    localStorage.setItem(ACTIVE_KEY, id);
  } else {
    localStorage.removeItem(ACTIVE_KEY);
  }
}
