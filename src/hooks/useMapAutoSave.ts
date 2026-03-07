import { useEffect, useRef } from 'react';
import { useMapStore } from '../store/mapStore';
import { saveMaps } from '../utils/mapStorage';

export function useMapAutoSave() {
  const maps = useMapStore((s) => s.maps);
  const saveStatus = useMapStore((s) => s.saveStatus);
  const setSaveStatus = useMapStore((s) => s.setSaveStatus);
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
      saveMaps(maps);
      setSaveStatus('saved');
    }, 2000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [maps, setSaveStatus]);

  return saveStatus;
}
