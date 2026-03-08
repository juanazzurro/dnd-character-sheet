import type { Character } from '../types/character';
import type { Npc } from '../types/npc';
import type { Quest } from '../types/quest';
import type { GameMap } from '../types/gameMap';
import { useCharacterStore } from '../store/characterStore';
import { useNpcStore } from '../store/npcStore';
import { useMainQuestStore, useSideQuestStore } from '../store/questStore';
import { useMapStore } from '../store/mapStore';

export interface CampaignData {
  version: number;
  exportDate: string;
  characters: Character[];
  npcs: Npc[];
  mainQuests: Quest[];
  sideQuests: Quest[];
  maps: GameMap[];
}

export function exportCampaign(): void {
  const data: CampaignData = {
    version: 1,
    exportDate: new Date().toISOString(),
    characters: useCharacterStore.getState().characters,
    npcs: useNpcStore.getState().npcs,
    mainQuests: useMainQuestStore.getState().quests,
    sideQuests: useSideQuestStore.getState().quests,
    maps: useMapStore.getState().maps,
  };

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'campana_dnd5e.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importCampaign(file: File): Promise<CampaignData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);

        if (!parsed || typeof parsed !== 'object') {
          reject(new Error('Archivo JSON invalido'));
          return;
        }
        if (parsed.version !== 1) {
          reject(new Error('Version de campana no soportada'));
          return;
        }
        if (!Array.isArray(parsed.characters) || !Array.isArray(parsed.npcs) ||
            !Array.isArray(parsed.mainQuests) || !Array.isArray(parsed.sideQuests) ||
            !Array.isArray(parsed.maps)) {
          reject(new Error('El archivo no contiene datos de campana validos'));
          return;
        }

        resolve(parsed as CampaignData);
      } catch {
        reject(new Error('Error al leer el archivo JSON'));
      }
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.readAsText(file);
  });
}
