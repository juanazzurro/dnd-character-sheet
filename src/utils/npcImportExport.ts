import type { Npc } from '../types/npc';
import { createDefaultNpc } from '../types/npc';

export function exportNpc(npc: Npc): void {
  const json = JSON.stringify(npc, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeName = (npc.name || 'npc').replace(/[^a-z0-9]/gi, '_').toLowerCase();
  a.href = url;
  a.download = `${safeName}_npc_dnd5e.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importNpc(file: File): Promise<Npc> {
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
          reject(new Error('El archivo no parece ser un NPC de D&D 5E'));
          return;
        }

        const npc = { ...createDefaultNpc(), ...parsed, id: parsed.id } as Npc;
        resolve(npc);
      } catch {
        reject(new Error('Error al leer el archivo JSON'));
      }
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.readAsText(file);
  });
}
