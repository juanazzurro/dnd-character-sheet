import { NavLink } from 'react-router-dom';
import { Users, Skull, Map, Crown, Scroll } from 'lucide-react';

const sections = [
  { id: 'personajes', label: 'Personajes', icon: Users, path: '/personajes' },
  { id: 'npcs', label: 'NPCs', icon: Skull, path: '/npcs' },
  { id: 'mapa', label: 'Mapa', icon: Map, path: '/mapa' },
  { id: 'misiones-principales', label: 'Misiones', icon: Crown, path: '/misiones-principales' },
  { id: 'misiones-secundarias', label: 'Secundarias', icon: Scroll, path: '/misiones-secundarias' },
] as const;

export type SectionId = (typeof sections)[number]['id'];

export function TopNav() {
  return (
    <nav
      className="flex items-center gap-1 px-3 overflow-x-auto flex-shrink-0"
      style={{ background: '#16213e', height: '48px', borderBottom: '1px solid #2a2a4a' }}
    >
      {sections.map((section) => {
        const Icon = section.icon;
        return (
          <NavLink
            key={section.id}
            to={section.path}
            className={({ isActive }) =>
              isActive ? 'topnav-item-active' : 'topnav-item-inactive'
            }
          >
            <Icon size={16} />
            <span className="text-xs font-semibold whitespace-nowrap">{section.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
