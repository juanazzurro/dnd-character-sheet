import { createHashRouter, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { PersonajesSection } from './components/sections/PersonajesSection';
import { NpcsSection } from './components/sections/NpcsSection';
import { NpcListView } from './components/npc/NpcListView';
import { NpcDetailView } from './components/npc/NpcDetailView';
import { PlaceholderPage } from './components/pages/PlaceholderPage';
import { Map, Crown, Scroll } from 'lucide-react';

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
        element: <PlaceholderPage title="Mapa" icon={<Map size={32} />} />,
      },
      {
        path: 'misiones-principales',
        element: <PlaceholderPage title="Misiones Principales" icon={<Crown size={32} />} />,
      },
      {
        path: 'misiones-secundarias',
        element: <PlaceholderPage title="Misiones Secundarias" icon={<Scroll size={32} />} />,
      },
    ],
  },
]);
