import type { Quest } from '../types/quest';
import { createDefaultQuest } from '../types/quest';

function createQuestStorage(storageKey: string, activeKey: string) {
  function loadQuests(): Quest[] {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((item: unknown) => item && typeof item === 'object')
        .map((item: unknown) => ({ ...createDefaultQuest(), ...(item as Partial<Quest>) }));
    } catch {
      return [];
    }
  }

  function saveQuests(quests: Quest[]): void {
    try {
      localStorage.setItem(storageKey, JSON.stringify(quests));
    } catch {
      console.warn(`Failed to save quests to localStorage (${storageKey})`);
    }
  }

  function loadActiveQuestId(): string | null {
    try {
      return localStorage.getItem(activeKey);
    } catch {
      return null;
    }
  }

  function saveActiveQuestId(id: string | null): void {
    if (id) {
      localStorage.setItem(activeKey, id);
    } else {
      localStorage.removeItem(activeKey);
    }
  }

  return { loadQuests, saveQuests, loadActiveQuestId, saveActiveQuestId };
}

export const mainQuestStorage = createQuestStorage('dnd5e_main_quests', 'dnd5e_active_main_quest');
export const sideQuestStorage = createQuestStorage('dnd5e_side_quests', 'dnd5e_active_side_quest');
