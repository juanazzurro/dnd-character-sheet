import { useEffect, useRef } from 'react';
import type { Quest } from '../types/quest';

type SaveStatus = 'saved' | 'saving' | 'unsaved';

interface QuestStoreState {
  quests: Quest[];
  saveStatus: SaveStatus;
  setSaveStatus: (status: SaveStatus) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UseStoreHook = <T>(selector: (s: QuestStoreState) => T) => T;

export function useQuestAutoSave(
  useStore: UseStoreHook,
  saveFn: (quests: Quest[]) => void,
) {
  const quests = useStore((s) => s.quests);
  const saveStatus = useStore((s) => s.saveStatus);
  const setSaveStatus = useStore((s) => s.setSaveStatus);
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
      saveFn(quests);
      setSaveStatus('saved');
    }, 2000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [quests, setSaveStatus, saveFn]);

  return saveStatus;
}
