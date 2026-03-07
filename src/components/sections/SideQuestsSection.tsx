import { Outlet } from 'react-router-dom';
import { useQuestAutoSave } from '../../hooks/useQuestAutoSave';
import { useSideQuestStore } from '../../store/questStore';
import { sideQuestStorage } from '../../utils/questStorage';

export function SideQuestsSection() {
  useQuestAutoSave(useSideQuestStore, sideQuestStorage.saveQuests);

  return <Outlet />;
}
