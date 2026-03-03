import { create } from 'zustand';
import type { Character } from '../types/character';
import { createDefaultCharacter } from '../types/character';
import {
  loadCharacters,
  saveCharacters,
  loadActiveCharacterId,
  saveActiveCharacterId,
} from '../utils/storage';

type SaveStatus = 'saved' | 'saving' | 'unsaved';

interface CharacterStore {
  characters: Character[];
  activeCharacterId: string | null;
  activeCharacter: Character | null;
  saveStatus: SaveStatus;

  // Actions
  createCharacter: () => void;
  updateCharacter: (id: string, updates: Partial<Character>) => void;
  deleteCharacter: (id: string) => void;
  setActiveCharacter: (id: string) => void;
  importCharacter: (data: Character) => void;
  setSaveStatus: (status: SaveStatus) => void;
}

let saveTimeout: ReturnType<typeof setTimeout> | null = null;

function scheduleSave(characters: Character[]) {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveCharacters(characters);
  }, 2000);
}

const initialCharacters = loadCharacters();
const initialActiveId = loadActiveCharacterId();
const resolvedActiveId =
  initialCharacters.length > 0
    ? (initialActiveId && initialCharacters.find((c) => c.id === initialActiveId)
        ? initialActiveId
        : initialCharacters[0].id)
    : null;

export const useCharacterStore = create<CharacterStore>((set) => ({
  characters: initialCharacters,
  activeCharacterId: resolvedActiveId,
  activeCharacter:
    resolvedActiveId
      ? (initialCharacters.find((c) => c.id === resolvedActiveId) ?? null)
      : null,
  saveStatus: 'saved',

  createCharacter: () => {
    const newChar = createDefaultCharacter();
    set((state) => {
      const characters = [...state.characters, newChar];
      scheduleSave(characters);
      saveActiveCharacterId(newChar.id);
      return { characters, activeCharacterId: newChar.id, activeCharacter: newChar, saveStatus: 'saving' };
    });
  },

  updateCharacter: (id, updates) => {
    set((state) => {
      const characters = state.characters.map((c) =>
        c.id === id ? { ...c, ...updates, updatedAt: Date.now() } : c
      );
      const activeCharacter = characters.find((c) => c.id === state.activeCharacterId) ?? null;
      scheduleSave(characters);
      return { characters, activeCharacter, saveStatus: 'saving' };
    });
  },

  deleteCharacter: (id) => {
    set((state) => {
      const characters = state.characters.filter((c) => c.id !== id);
      let activeCharacterId = state.activeCharacterId;
      if (activeCharacterId === id) {
        activeCharacterId = characters.length > 0 ? characters[0].id : null;
        saveActiveCharacterId(activeCharacterId);
      }
      const activeCharacter = characters.find((c) => c.id === activeCharacterId) ?? null;
      saveCharacters(characters);
      return { characters, activeCharacterId, activeCharacter, saveStatus: 'saved' };
    });
  },

  setActiveCharacter: (id) => {
    saveActiveCharacterId(id);
    set((state) => ({
      activeCharacterId: id,
      activeCharacter: state.characters.find((c) => c.id === id) ?? null,
    }));
  },

  importCharacter: (data) => {
    set((state) => {
      const existing = state.characters.find((c) => c.id === data.id);
      let characters: Character[];
      if (existing) {
        characters = state.characters.map((c) => (c.id === data.id ? data : c));
      } else {
        characters = [...state.characters, data];
      }
      saveCharacters(characters);
      saveActiveCharacterId(data.id);
      return { characters, activeCharacterId: data.id, activeCharacter: data, saveStatus: 'saved' };
    });
  },

  setSaveStatus: (status) => set({ saveStatus: status }),
}));
