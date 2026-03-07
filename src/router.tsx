import { createHashRouter, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { PersonajesSection } from './components/sections/PersonajesSection';
import { PlaceholderPage } from './components/pages/PlaceholderPage';
import { Skull, Map, Crown, Scroll } from 'lucide-react';

export const router = createHashRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/personajes" replace /> },
      { path: 'personajes', element: <PersonajesSection /> },
      {
        path: 'npcs',
        element: <PlaceholderPage title="NPCs" icon={<Skull size={32} />} />,
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
