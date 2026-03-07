import { useEffect, useRef } from 'react';
import { useNpcStore } from '../store/npcStore';
import { saveNpcs } from '../utils/npcStorage';

export function useNpcAutoSave() {
  const npcs = useNpcStore((s) => s.npcs);
  const saveStatus = useNpcStore((s) => s.saveStatus);
  const setSaveStatus = useNpcStore((s) => s.setSaveStatus);
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
      saveNpcs(npcs);
      setSaveStatus('saved');
    }, 2000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [npcs, setSaveStatus]);

  return saveStatus;
}
