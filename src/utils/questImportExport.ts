import type { Quest } from '../types/quest';
import { createDefaultQuest } from '../types/quest';

export function exportQuest(quest: Quest, suffix: string): void {
  const json = JSON.stringify(quest, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeName = (quest.title || 'mision').replace(/[^a-z0-9]/gi, '_').toLowerCase();
  a.href = url;
  a.download = `${safeName}_${suffix}_dnd5e.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importQuest(file: File): Promise<Quest> {
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
        if (!parsed.id || parsed.title === undefined) {
          reject(new Error('El archivo no parece ser una mision de D&D 5E'));
          return;
        }

        const quest = { ...createDefaultQuest(), ...parsed, id: parsed.id } as Quest;
        resolve(quest);
      } catch {
        reject(new Error('Error al leer el archivo JSON'));
      }
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.readAsText(file);
  });
}
