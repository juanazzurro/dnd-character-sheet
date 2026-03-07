import { Outlet } from 'react-router-dom';
import { useQuestAutoSave } from '../../hooks/useQuestAutoSave';
import { useMainQuestStore } from '../../store/questStore';
import { mainQuestStorage } from '../../utils/questStorage';

export function MainQuestsSection() {
  useQuestAutoSave(useMainQuestStore, mainQuestStorage.saveQuests);

  return <Outlet />;
}
