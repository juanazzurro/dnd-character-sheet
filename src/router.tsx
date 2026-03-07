import { createHashRouter, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { PersonajesSection } from './components/sections/PersonajesSection';
import { NpcsSection } from './components/sections/NpcsSection';
import { NpcListView } from './components/npc/NpcListView';
import { NpcDetailView } from './components/npc/NpcDetailView';
import { MainQuestsSection } from './components/sections/MainQuestsSection';
import { SideQuestsSection } from './components/sections/SideQuestsSection';
import { QuestListView } from './components/quest/QuestListView';
import { QuestDetailView } from './components/quest/QuestDetailView';
import { MapSection } from './components/sections/MapSection';
import { MapListView } from './components/map/MapListView';
import { MapDetailView } from './components/map/MapDetailView';

export const router = createHashRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/personajes" replace /> },
      { path: 'personajes', element: <PersonajesSection /> },
      {
        path: 'npcs',
        element: <NpcsSection />,
        children: [
          { index: true, element: <NpcListView /> },
          { path: ':id', element: <NpcDetailView /> },
        ],
      },
      {
        path: 'mapa',
        element: <MapSection />,
        children: [
          { index: true, element: <MapListView /> },
          { path: ':id', element: <MapDetailView /> },
        ],
      },
      {
        path: 'misiones-principales',
        element: <MainQuestsSection />,
        children: [
          { index: true, element: <QuestListView questType="principal" /> },
          { path: ':id', element: <QuestDetailView questType="principal" /> },
        ],
      },
      {
        path: 'misiones-secundarias',
        element: <SideQuestsSection />,
        children: [
          { index: true, element: <QuestListView questType="secundaria" /> },
          { path: ':id', element: <QuestDetailView questType="secundaria" /> },
        ],
      },
    ],
  },
]);
