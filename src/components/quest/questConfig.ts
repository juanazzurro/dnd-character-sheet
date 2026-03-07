import { Crown, Scroll } from 'lucide-react';
import { useMainQuestStore, useSideQuestStore } from '../../store/questStore';
import { mainQuestStorage, sideQuestStorage } from '../../utils/questStorage';

export const QUEST_CONFIG = {
  principal: {
    title: 'Misiones Principales',
    basePath: '/misiones-principales',
    icon: Crown,
    useStore: useMainQuestStore,
    storage: mainQuestStorage,
    priorities: ['Critica', 'Alta', 'Media'],
    importSuffix: 'mision_principal',
  },
  secundaria: {
    title: 'Misiones Secundarias',
    basePath: '/misiones-secundarias',
    icon: Scroll,
    useStore: useSideQuestStore,
    storage: sideQuestStorage,
    priorities: ['Alta', 'Media', 'Baja'],
    importSuffix: 'mision_secundaria',
  },
} as const;

export type QuestType = keyof typeof QUEST_CONFIG;
