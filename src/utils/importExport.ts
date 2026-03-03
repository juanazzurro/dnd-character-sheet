import type { Character } from '../types/character';

export function exportCharacter(character: Character): void {
  const json = JSON.stringify(character, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeName = (character.name || 'personaje').replace(/[^a-z0-9]/gi, '_').toLowerCase();
  a.href = url;
  a.download = `${safeName}_dnd5e.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importCharacter(file: File): Promise<Character> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);

        // Basic validation
        if (!parsed || typeof parsed !== 'object') {
          reject(new Error('Archivo JSON inválido'));
          return;
        }
        if (!parsed.id || parsed.name === undefined) {
          reject(new Error('El archivo no parece ser una hoja de personaje de D&D 5E'));
          return;
        }

        // Ensure id is fresh if it conflicts
        const character = parsed as Character;
        resolve(character);
      } catch {
        reject(new Error('Error al leer el archivo JSON'));
      }
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.readAsText(file);
  });
}
