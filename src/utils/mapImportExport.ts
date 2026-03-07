import type { GameMap } from '../types/gameMap';
import { createDefaultGameMap } from '../types/gameMap';

export function exportMap(map: GameMap): void {
  const json = JSON.stringify(map, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeName = (map.name || 'mapa').replace(/[^a-z0-9]/gi, '_').toLowerCase();
  a.href = url;
  a.download = `${safeName}_mapa_dnd5e.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importMap(file: File): Promise<GameMap> {
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
        if (!parsed.id || parsed.name === undefined) {
          reject(new Error('El archivo no parece ser un mapa de D&D 5E'));
          return;
        }

        const map = { ...createDefaultGameMap(), ...parsed, id: parsed.id } as GameMap;
        resolve(map);
      } catch {
        reject(new Error('Error al leer el archivo JSON'));
      }
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.readAsText(file);
  });
}
