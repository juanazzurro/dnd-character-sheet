import { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Users, Skull, Map, Crown, Scroll, Archive } from 'lucide-react';
import { exportCampaign, importCampaign } from '../../utils/campaignImportExport';
import { useCharacterStore } from '../../store/characterStore';
import { useNpcStore } from '../../store/npcStore';
import { useMainQuestStore, useSideQuestStore } from '../../store/questStore';
import { useMapStore } from '../../store/mapStore';

const sections = [
  { id: 'personajes', label: 'Personajes', icon: Users, path: '/personajes' },
  { id: 'npcs', label: 'NPCs', icon: Skull, path: '/npcs' },
  { id: 'mapa', label: 'Mapa', icon: Map, path: '/mapa' },
  { id: 'misiones-principales', label: 'Misiones', icon: Crown, path: '/misiones-principales' },
  { id: 'misiones-secundarias', label: 'Secundarias', icon: Scroll, path: '/misiones-secundarias' },
] as const;

export type SectionId = (typeof sections)[number]['id'];

export function TopNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const importCharacter = useCharacterStore((s) => s.importCharacter);
  const importNpc = useNpcStore((s) => s.importNpc);
  const importMainQuest = useMainQuestStore((s) => s.importQuest);
  const importSideQuest = useSideQuestStore((s) => s.importQuest);
  const importMap = useMapStore((s) => s.importMap);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleImport(file: File) {
    try {
      const data = await importCampaign(file);
      for (const c of data.characters) importCharacter(c);
      for (const n of data.npcs) importNpc(n);
      for (const q of data.mainQuests) importMainQuest(q);
      for (const q of data.sideQuests) importSideQuest(q);
      for (const m of data.maps) importMap(m);
      alert('Campana importada correctamente.');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al importar la campana.');
    }
  }

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

      <div className="flex-1" />

      {/* Campaign export/import menu */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center justify-center w-8 h-8 rounded hover:bg-white/10 transition-colors"
          title="Campana"
        >
          <Archive size={16} className="text-ink-muted" />
        </button>

        {menuOpen && (
          <div
            className="absolute right-0 top-full mt-1 w-48 rounded border shadow-lg z-50 overflow-hidden"
            style={{ background: '#1a1a2e', borderColor: '#2a2a3e' }}
          >
            <button
              type="button"
              className="w-full text-left px-3 py-2 text-sm hover:bg-dnd-gold/20 transition-colors"
              style={{ color: '#e2d8c3' }}
              onClick={() => {
                exportCampaign();
                setMenuOpen(false);
              }}
            >
              Exportar Campana
            </button>
            <button
              type="button"
              className="w-full text-left px-3 py-2 text-sm hover:bg-dnd-gold/20 transition-colors"
              style={{ color: '#e2d8c3' }}
              onClick={() => {
                fileInputRef.current?.click();
                setMenuOpen(false);
              }}
            >
              Importar Campana
            </button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImport(file);
            e.target.value = '';
          }}
        />
      </div>
    </nav>
  );
}
