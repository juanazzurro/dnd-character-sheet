import { useEffect, useRef } from 'react';
import { useCharacterStore } from '../store/characterStore';
import { saveCharacters } from '../utils/storage';

export function useAutoSave() {
  const characters = useCharacterStore((s) => s.characters);
  const saveStatus = useCharacterStore((s) => s.saveStatus);
  const setSaveStatus = useCharacterStore((s) => s.setSaveStatus);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setSaveStatus('saving');

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      saveCharacters(characters);
      setSaveStatus('saved');
    }, 2000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [characters]);

  return saveStatus;
}
