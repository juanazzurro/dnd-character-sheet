import { Outlet } from 'react-router-dom';
import { useMapAutoSave } from '../../hooks/useMapAutoSave';

export function MapSection() {
  useMapAutoSave();

  return <Outlet />;
}
