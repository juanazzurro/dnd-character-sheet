import { create } from 'zustand';
import type { GameMap, MapPin } from '../types/gameMap';
import { createDefaultGameMap } from '../types/gameMap';
import {
  loadMaps,
  saveMaps,
  loadActiveMapId,
  saveActiveMapId,
} from '../utils/mapStorage';

type SaveStatus = 'saved' | 'saving' | 'unsaved';

interface MapStore {
  maps: GameMap[];
  activeMapId: string | null;
  activeMap: GameMap | null;
  saveStatus: SaveStatus;

  createMap: () => string;
  updateMap: (id: string, updates: Partial<GameMap>) => void;
  deleteMap: (id: string) => void;
  setActiveMap: (id: string | null) => void;
  importMap: (data: GameMap) => void;
  setSaveStatus: (status: SaveStatus) => void;

  addPin: (mapId: string, pin: MapPin) => void;
  updatePin: (mapId: string, pinId: string, updates: Partial<MapPin>) => void;
  deletePin: (mapId: string, pinId: string) => void;
  movePin: (mapId: string, pinId: string, x: number, y: number) => void;
}

const initialMaps = loadMaps();
const initialActiveId = loadActiveMapId();
const resolvedActiveId =
  initialMaps.length > 0
    ? (initialActiveId && initialMaps.find((m) => m.id === initialActiveId)
        ? initialActiveId
        : initialMaps[0].id)
    : null;

export const useMapStore = create<MapStore>((set) => ({
  maps: initialMaps,
  activeMapId: resolvedActiveId,
  activeMap:
    resolvedActiveId
      ? (initialMaps.find((m) => m.id === resolvedActiveId) ?? null)
      : null,
  saveStatus: 'saved',

  createMap: () => {
    const newMap = createDefaultGameMap();
    set((state) => {
      const maps = [...state.maps, newMap];
      saveActiveMapId(newMap.id);
      return { maps, activeMapId: newMap.id, activeMap: newMap, saveStatus: 'unsaved' };
    });
    return newMap.id;
  },

  updateMap: (id, updates) => {
    set((state) => {
      const maps = state.maps.map((m) =>
        m.id === id ? { ...m, ...updates, updatedAt: Date.now() } : m
      );
      const activeMap = maps.find((m) => m.id === state.activeMapId) ?? null;
      return { maps, activeMap, saveStatus: 'unsaved' };
    });
  },

  deleteMap: (id) => {
    set((state) => {
      const maps = state.maps.filter((m) => m.id !== id);
      let activeMapId = state.activeMapId;
      if (activeMapId === id) {
        activeMapId = maps.length > 0 ? maps[0].id : null;
        saveActiveMapId(activeMapId);
      }
      const activeMap = maps.find((m) => m.id === activeMapId) ?? null;
      saveMaps(maps);
      return { maps, activeMapId, activeMap, saveStatus: 'saved' };
    });
  },

  setActiveMap: (id) => {
    saveActiveMapId(id);
    set((state) => ({
      activeMapId: id,
      activeMap: id ? (state.maps.find((m) => m.id === id) ?? null) : null,
    }));
  },

  importMap: (data) => {
    set((state) => {
      const existing = state.maps.find((m) => m.id === data.id);
      let maps: GameMap[];
      if (existing) {
        maps = state.maps.map((m) => (m.id === data.id ? data : m));
      } else {
        maps = [...state.maps, data];
      }
      saveMaps(maps);
      saveActiveMapId(data.id);
      return { maps, activeMapId: data.id, activeMap: data, saveStatus: 'saved' };
    });
  },

  setSaveStatus: (status) => set({ saveStatus: status }),

  addPin: (mapId, pin) => {
    set((state) => {
      const maps = state.maps.map((m) =>
        m.id === mapId ? { ...m, pins: [...m.pins, pin], updatedAt: Date.now() } : m
      );
      const activeMap = maps.find((m) => m.id === state.activeMapId) ?? null;
      return { maps, activeMap, saveStatus: 'unsaved' };
    });
  },

  updatePin: (mapId, pinId, updates) => {
    set((state) => {
      const maps = state.maps.map((m) =>
        m.id === mapId
          ? {
              ...m,
              pins: m.pins.map((p) => (p.id === pinId ? { ...p, ...updates } : p)),
              updatedAt: Date.now(),
            }
          : m
      );
      const activeMap = maps.find((m) => m.id === state.activeMapId) ?? null;
      return { maps, activeMap, saveStatus: 'unsaved' };
    });
  },

  deletePin: (mapId, pinId) => {
    set((state) => {
      const maps = state.maps.map((m) =>
        m.id === mapId
          ? { ...m, pins: m.pins.filter((p) => p.id !== pinId), updatedAt: Date.now() }
          : m
      );
      const activeMap = maps.find((m) => m.id === state.activeMapId) ?? null;
      return { maps, activeMap, saveStatus: 'unsaved' };
    });
  },

  movePin: (mapId, pinId, x, y) => {
    set((state) => {
      const maps = state.maps.map((m) =>
        m.id === mapId
          ? {
              ...m,
              pins: m.pins.map((p) => (p.id === pinId ? { ...p, x, y } : p)),
              updatedAt: Date.now(),
            }
          : m
      );
      const activeMap = maps.find((m) => m.id === state.activeMapId) ?? null;
      return { maps, activeMap, saveStatus: 'unsaved' };
    });
  },
}));
