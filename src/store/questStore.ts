import { create } from 'zustand';
import type { Quest } from '../types/quest';
import { createDefaultQuest } from '../types/quest';

type SaveStatus = 'saved' | 'saving' | 'unsaved';

interface QuestStore {
  quests: Quest[];
  activeQuestId: string | null;
  activeQuest: Quest | null;
  saveStatus: SaveStatus;

  createQuest: () => string;
  updateQuest: (id: string, updates: Partial<Quest>) => void;
  deleteQuest: (id: string) => void;
  setActiveQuest: (id: string | null) => void;
  importQuest: (data: Quest) => void;
  setSaveStatus: (status: SaveStatus) => void;
}

function createQuestStore(storage: {
  loadQuests: () => Quest[];
  saveQuests: (quests: Quest[]) => void;
  loadActiveQuestId: () => string | null;
  saveActiveQuestId: (id: string | null) => void;
}) {
  const initialQuests = storage.loadQuests();
  const initialActiveId = storage.loadActiveQuestId();
  const resolvedActiveId =
    initialQuests.length > 0
      ? (initialActiveId && initialQuests.find((q) => q.id === initialActiveId)
          ? initialActiveId
          : initialQuests[0].id)
      : null;

  return create<QuestStore>((set) => ({
    quests: initialQuests,
    activeQuestId: resolvedActiveId,
    activeQuest:
      resolvedActiveId
        ? (initialQuests.find((q) => q.id === resolvedActiveId) ?? null)
        : null,
    saveStatus: 'saved',

    createQuest: () => {
      const newQuest = createDefaultQuest();
      set((state) => {
        const quests = [...state.quests, newQuest];
        storage.saveActiveQuestId(newQuest.id);
        return { quests, activeQuestId: newQuest.id, activeQuest: newQuest, saveStatus: 'unsaved' };
      });
      return newQuest.id;
    },

    updateQuest: (id, updates) => {
      set((state) => {
        const quests = state.quests.map((q) =>
          q.id === id ? { ...q, ...updates, updatedAt: Date.now() } : q
        );
        const activeQuest = quests.find((q) => q.id === state.activeQuestId) ?? null;
        return { quests, activeQuest, saveStatus: 'unsaved' };
      });
    },

    deleteQuest: (id) => {
      set((state) => {
        const quests = state.quests.filter((q) => q.id !== id);
        let activeQuestId = state.activeQuestId;
        if (activeQuestId === id) {
          activeQuestId = quests.length > 0 ? quests[0].id : null;
          storage.saveActiveQuestId(activeQuestId);
        }
        const activeQuest = quests.find((q) => q.id === activeQuestId) ?? null;
        storage.saveQuests(quests);
        return { quests, activeQuestId, activeQuest, saveStatus: 'saved' };
      });
    },

    setActiveQuest: (id) => {
      storage.saveActiveQuestId(id);
      set((state) => ({
        activeQuestId: id,
        activeQuest: id ? (state.quests.find((q) => q.id === id) ?? null) : null,
      }));
    },

    importQuest: (data) => {
      set((state) => {
        const existing = state.quests.find((q) => q.id === data.id);
        let quests: Quest[];
        if (existing) {
          quests = state.quests.map((q) => (q.id === data.id ? data : q));
        } else {
          quests = [...state.quests, data];
        }
        storage.saveQuests(quests);
        storage.saveActiveQuestId(data.id);
        return { quests, activeQuestId: data.id, activeQuest: data, saveStatus: 'saved' };
      });
    },

    setSaveStatus: (status) => set({ saveStatus: status }),
  }));
}

import { mainQuestStorage, sideQuestStorage } from '../utils/questStorage';

export const useMainQuestStore = createQuestStore(mainQuestStorage);
export const useSideQuestStore = createQuestStore(sideQuestStorage);
