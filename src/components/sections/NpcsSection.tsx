import { Outlet } from 'react-router-dom';
import { useNpcAutoSave } from '../../hooks/useNpcAutoSave';

export function NpcsSection() {
  useNpcAutoSave();

  return <Outlet />;
}
