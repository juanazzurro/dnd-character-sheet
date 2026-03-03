import { useState } from 'react';
import { Navbar, type TabId } from './components/layout/Navbar';
import { CoreStatsPage } from './components/pages/CoreStatsPage';
import { PersonalityPage } from './components/pages/PersonalityPage';
import { EquipmentPage } from './components/pages/EquipmentPage';
import { CharacterDetailsPage } from './components/pages/CharacterDetailsPage';
import { SpellcastingPage } from './components/pages/SpellcastingPage';
import { SpellNotesPage } from './components/pages/SpellNotesPage';
import { useCharacterStore } from './store/characterStore';

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('core');
  const characters = useCharacterStore((s) => s.characters);
  const activeCharacterId = useCharacterStore((s) => s.activeCharacterId);
  const createCharacter = useCharacterStore((s) => s.createCharacter);

  // Create first character automatically if none exist
  if (characters.length === 0) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: '#0f0f1a' }}
      >
        <div className="text-center max-w-md px-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 font-serif font-bold text-3xl"
            style={{ background: '#8b0000', color: '#f0e6d0' }}
          >
            d20
          </div>
          <h1 className="font-serif text-3xl font-bold text-ink mb-3">
            Hoja de Personaje D&D 5E
          </h1>
          <p className="text-ink-muted mb-6">
            Crea tu primer personaje para comenzar.
          </p>
          <button
            onClick={createCharacter}
            className="btn-primary text-base px-6 py-3"
          >
            Crear personaje
          </button>
        </div>
      </div>
    );
  }

  function renderPage() {
    switch (activeTab) {
      case 'core': return <CoreStatsPage />;
      case 'personality': return <PersonalityPage />;
      case 'equipment': return <EquipmentPage />;
      case 'details': return <CharacterDetailsPage />;
      case 'spellcasting': return <SpellcastingPage />;
      case 'spellnotes': return <SpellNotesPage />;
    }
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0f0f1a' }}>
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <main key={activeCharacterId ?? 'none'} className="flex-1 overflow-y-auto pb-16 md:pb-0">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
