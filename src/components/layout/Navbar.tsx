import { useState } from 'react';
import {
  Sword,
  Heart,
  Backpack,
  User,
  Sparkles,
  ScrollText,
  Plus,
  Trash2,
  ChevronRight,
  Download,
  Upload,
} from 'lucide-react';
import { useCharacterStore } from '../../store/characterStore';
import { SaveIndicator } from './SaveIndicator';
import { useAutoSave } from '../../hooks/useAutoSave';
import { exportCharacter, importCharacter } from '../../utils/importExport';
import { useRef } from 'react';

export type TabId =
  | 'core'
  | 'personality'
  | 'equipment'
  | 'details'
  | 'spellcasting'
  | 'spellnotes';

const TABS: { id: TabId; icon: React.ReactNode; label: string; tooltip: string }[] = [
  { id: 'core', icon: <Sword size={20} />, label: 'Estadísticas', tooltip: 'Core Stats (Page 1)' },
  { id: 'personality', icon: <Heart size={20} />, label: 'Personalidad', tooltip: 'Personality & Traits (Page 2)' },
  { id: 'equipment', icon: <Backpack size={20} />, label: 'Equipo', tooltip: 'Equipment & Currency (Page 3)' },
  { id: 'details', icon: <User size={20} />, label: 'Detalles', tooltip: 'Character Details (Page 4)' },
  { id: 'spellcasting', icon: <Sparkles size={20} />, label: 'Conjuros', tooltip: 'Spellcasting (Page 5)' },
  { id: 'spellnotes', icon: <ScrollText size={20} />, label: 'Notas', tooltip: 'Spell Notes & Campaign (Page 6)' },
];

interface NavbarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const [expanded, setExpanded] = useState(true);
  const characters = useCharacterStore((s) => s.characters);
  const activeCharacterId = useCharacterStore((s) => s.activeCharacterId);
  const activeCharacter = useCharacterStore((s) => s.activeCharacter);
  const createCharacter = useCharacterStore((s) => s.createCharacter);
  const deleteCharacter = useCharacterStore((s) => s.deleteCharacter);
  const setActiveCharacter = useCharacterStore((s) => s.setActiveCharacter);
  const importCharacterAction = useCharacterStore((s) => s.importCharacter);
  const saveStatus = useAutoSave();
  const importRef = useRef<HTMLInputElement>(null);

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const char = await importCharacter(file);
      importCharacterAction(char);
    } catch (err) {
      alert((err as Error).message);
    }
    e.target.value = '';
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col h-full transition-all duration-200 no-print"
        style={{
          width: expanded ? '200px' : '60px',
          background: '#16213e',
          borderRight: '1px solid #2a2a4a',
          minHeight: '100vh',
          flexShrink: 0,
        }}
      >
        {/* Top: D20 logo + collapse toggle */}
        <div className="flex items-center justify-between p-3 border-b border-parchment-300">
          <div className="flex items-center gap-2 overflow-hidden">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-serif font-bold text-parchment-100 text-sm"
              style={{ background: '#8b0000' }}
              title="D&D 5E Character Sheet"
            >
              d20
            </div>
            {expanded && (
              <span className="font-serif font-bold text-ink text-sm truncate">D&D 5E</span>
            )}
          </div>
          <button
            onClick={() => setExpanded((e) => !e)}
            className="p-1 rounded hover:bg-parchment-200 text-ink-muted"
          >
            <ChevronRight
              size={14}
              style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
            />
          </button>
        </div>

        {/* Character name display */}
        {expanded && activeCharacter && (
          <div className="px-3 py-2 border-b border-parchment-300">
            <div className="text-xs text-ink-muted font-semibold uppercase tracking-wide mb-0.5">Personaje</div>
            <div className="font-serif font-bold text-ink text-sm truncate">
              {activeCharacter.name || 'Sin nombre'}
            </div>
            <div className="text-xs text-ink-muted">
              {activeCharacter.class || '—'} Nivel {activeCharacter.level}
            </div>
          </div>
        )}

        {/* Tabs */}
        <nav className="flex-1 py-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              title={tab.tooltip}
              className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors text-left ${
                activeTab === tab.id ? 'tab-active' : 'tab-inactive'
              }`}
            >
              <span className="flex-shrink-0">{tab.icon}</span>
              {expanded && (
                <span className="text-sm font-medium truncate">{tab.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Save status */}
        <div className="px-3 py-2 border-t border-parchment-300">
          {expanded && <SaveIndicator status={saveStatus} />}
        </div>

        {/* Import/Export */}
        {expanded && activeCharacter && (
          <div className="px-3 py-2 border-t border-parchment-300 flex gap-2">
            <button
              onClick={() => exportCharacter(activeCharacter)}
              className="flex-1 flex items-center justify-center gap-1 btn-secondary text-xs py-1"
              title="Export character JSON"
            >
              <Download size={12} /> Exportar
            </button>
            <button
              onClick={() => importRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-1 btn-secondary text-xs py-1"
              title="Import character JSON"
            >
              <Upload size={12} /> Importar
            </button>
            <input ref={importRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
          </div>
        )}

        {/* Character switcher */}
        <div className="border-t border-parchment-300 p-2">
          {expanded && (
            <div className="section-header mb-1">Personajes</div>
          )}
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {characters.map((char) => (
              <div
                key={char.id}
                className={`flex items-center gap-1 rounded px-2 py-1 cursor-pointer transition-colors ${
                  char.id === activeCharacterId
                    ? 'bg-parchment-300'
                    : 'hover:bg-parchment-200'
                }`}
                onClick={() => setActiveCharacter(char.id)}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: '#8b0000', color: '#f0e6d0' }}
                >
                  {(char.name || '?')[0].toUpperCase()}
                </div>
                {expanded && (
                  <span className="text-xs text-ink truncate flex-1">
                    {char.name || 'Sin nombre'}
                  </span>
                )}
                {expanded && characters.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`¿Eliminar a "${char.name || 'Sin nombre'}"?`)) {
                        deleteCharacter(char.id);
                      }
                    }}
                    className="text-ink-muted hover:text-dnd-red p-0.5"
                  >
                    <Trash2 size={10} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={createCharacter}
            className="mt-2 w-full flex items-center justify-center gap-1 btn-primary text-xs py-1"
            title="Nuevo personaje"
          >
            <Plus size={12} />
            {expanded && 'Nuevo'}
          </button>
        </div>
      </aside>

      {/* Mobile bottom tab bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 flex border-t border-parchment-300 z-50 no-print"
        style={{ background: '#16213e' }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex flex-col items-center py-2 text-xs transition-colors ${
              activeTab === tab.id
                ? 'text-dnd-gold border-t-2 border-dnd-gold'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            {tab.icon}
            <span className="text-[9px] mt-0.5 leading-tight">{tab.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
