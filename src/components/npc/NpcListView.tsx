import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Upload, Skull, Search } from 'lucide-react';
import { useNpcStore } from '../../store/npcStore';
import { importNpc } from '../../utils/npcImportExport';
import { NpcCard } from './NpcCard';
import { PageContainer } from '../layout/PageContainer';

const CATEGORIES = [
  'Todos',
  'Aliado',
  'Enemigo',
  'Neutral',
  'Mercader',
  'Tabernero',
  'Noble',
  'Guardia',
  'Villano',
  'Deidad',
  'Otro',
];

export function NpcListView() {
  const navigate = useNavigate();
  const npcs = useNpcStore((s) => s.npcs);
  const createNpc = useNpcStore((s) => s.createNpc);
  const importNpcAction = useNpcStore((s) => s.importNpc);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');
  const fileRef = useRef<HTMLInputElement>(null);

  function handleCreate() {
    const id = createNpc();
    navigate(`/npcs/${id}`);
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const npc = await importNpc(file);
      importNpcAction(npc);
      navigate(`/npcs/${npc.id}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al importar NPC');
    }
    e.target.value = '';
  }

  const filtered = npcs.filter((npc) => {
    const matchesSearch = !search || npc.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'Todos' || npc.category === category;
    return matchesSearch && matchesCategory;
  });

  if (npcs.length === 0) {
    return (
      <div
        className="flex-1 flex flex-col items-center justify-center"
        style={{ background: '#0f0f1a' }}
      >
        <div className="text-center max-w-md px-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: '#8b0000', color: '#f0e6d0' }}
          >
            <Skull size={36} />
          </div>
          <h1 className="font-serif text-3xl font-bold text-ink mb-3">NPCs</h1>
          <p className="text-ink-muted mb-6">
            Crea tu primer NPC para comenzar a poblar tu mundo.
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={handleCreate} className="btn-primary text-base px-6 py-3">
              Crear NPC
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="btn-secondary text-base px-6 py-3"
            >
              <Upload size={16} className="inline mr-1" />
              Importar
            </button>
          </div>
          <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
        </div>
      </div>
    );
  }

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h1 className="font-serif text-2xl font-bold text-ink">NPCs</h1>
        <div className="flex gap-2">
          <button onClick={handleCreate} className="btn-primary text-sm flex items-center gap-1">
            <Plus size={14} />
            Crear NPC
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="btn-secondary text-sm flex items-center gap-1"
          >
            <Upload size={14} />
            Importar
          </button>
          <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre..."
            className="parchment-input pl-8 w-full"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="parchment-input w-full sm:w-40"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-ink-muted text-center py-8">No se encontraron NPCs.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((npc) => (
            <NpcCard key={npc.id} npc={npc} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
