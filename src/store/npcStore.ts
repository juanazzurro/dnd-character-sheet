import { create } from 'zustand';
import type { Npc } from '../types/npc';
import { createDefaultNpc } from '../types/npc';
import {
  loadNpcs,
  saveNpcs,
  loadActiveNpcId,
  saveActiveNpcId,
} from '../utils/npcStorage';

type SaveStatus = 'saved' | 'saving' | 'unsaved';

interface NpcStore {
  npcs: Npc[];
  activeNpcId: string | null;
  activeNpc: Npc | null;
  saveStatus: SaveStatus;

  createNpc: () => string;
  updateNpc: (id: string, updates: Partial<Npc>) => void;
  deleteNpc: (id: string) => void;
  setActiveNpc: (id: string | null) => void;
  importNpc: (data: Npc) => void;
  setSaveStatus: (status: SaveStatus) => void;
}

const initialNpcs = loadNpcs();
const initialActiveId = loadActiveNpcId();
const resolvedActiveId =
  initialNpcs.length > 0
    ? (initialActiveId && initialNpcs.find((n) => n.id === initialActiveId)
        ? initialActiveId
        : initialNpcs[0].id)
    : null;

export const useNpcStore = create<NpcStore>((set) => ({
  npcs: initialNpcs,
  activeNpcId: resolvedActiveId,
  activeNpc:
    resolvedActiveId
      ? (initialNpcs.find((n) => n.id === resolvedActiveId) ?? null)
      : null,
  saveStatus: 'saved',

  createNpc: () => {
    const newNpc = createDefaultNpc();
    set((state) => {
      const npcs = [...state.npcs, newNpc];
      saveActiveNpcId(newNpc.id);
      return { npcs, activeNpcId: newNpc.id, activeNpc: newNpc, saveStatus: 'unsaved' };
    });
    return newNpc.id;
  },

  updateNpc: (id, updates) => {
    set((state) => {
      const npcs = state.npcs.map((n) =>
        n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n
      );
      const activeNpc = npcs.find((n) => n.id === state.activeNpcId) ?? null;
      return { npcs, activeNpc, saveStatus: 'unsaved' };
    });
  },

  deleteNpc: (id) => {
    set((state) => {
      const npcs = state.npcs.filter((n) => n.id !== id);
      let activeNpcId = state.activeNpcId;
      if (activeNpcId === id) {
        activeNpcId = npcs.length > 0 ? npcs[0].id : null;
        saveActiveNpcId(activeNpcId);
      }
      const activeNpc = npcs.find((n) => n.id === activeNpcId) ?? null;
      saveNpcs(npcs);
      return { npcs, activeNpcId, activeNpc, saveStatus: 'saved' };
    });
  },

  setActiveNpc: (id) => {
    saveActiveNpcId(id);
    set((state) => ({
      activeNpcId: id,
      activeNpc: id ? (state.npcs.find((n) => n.id === id) ?? null) : null,
    }));
  },

  importNpc: (data) => {
    set((state) => {
      const existing = state.npcs.find((n) => n.id === data.id);
      let npcs: Npc[];
      if (existing) {
        npcs = state.npcs.map((n) => (n.id === data.id ? data : n));
      } else {
        npcs = [...state.npcs, data];
      }
      saveNpcs(npcs);
      saveActiveNpcId(data.id);
      return { npcs, activeNpcId: data.id, activeNpc: data, saveStatus: 'saved' };
    });
  },

  setSaveStatus: (status) => set({ saveStatus: status }),
}));
