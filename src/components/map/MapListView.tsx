import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Upload, Map, Search } from 'lucide-react';
import { useMapStore } from '../../store/mapStore';
import { importMap } from '../../utils/mapImportExport';
import { MapCard } from './MapCard';
import { PageContainer } from '../layout/PageContainer';

export function MapListView() {
  const navigate = useNavigate();
  const maps = useMapStore((s) => s.maps);
  const createMap = useMapStore((s) => s.createMap);
  const importMapAction = useMapStore((s) => s.importMap);
  const [search, setSearch] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  function handleCreate() {
    const id = createMap();
    navigate(`/mapa/${id}`);
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const map = await importMap(file);
      importMapAction(map);
      navigate(`/mapa/${map.id}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al importar mapa');
    }
    e.target.value = '';
  }

  const filtered = maps.filter((map) => {
    return !search || map.name.toLowerCase().includes(search.toLowerCase());
  });

  if (maps.length === 0) {
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
            <Map size={36} />
          </div>
          <h1 className="font-serif text-3xl font-bold text-ink mb-3">Mapas</h1>
          <p className="text-ink-muted mb-6">
            Crea tu primer mapa para comenzar a cartografiar tu mundo.
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={handleCreate} className="btn-primary text-base px-6 py-3">
              Crear Mapa
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
        <h1 className="font-serif text-2xl font-bold text-ink">Mapas</h1>
        <div className="flex gap-2">
          <button onClick={handleCreate} className="btn-primary text-sm flex items-center gap-1">
            <Plus size={14} />
            Crear Mapa
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

      {/* Search */}
      <div className="flex gap-2 mb-4">
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
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-ink-muted text-center py-8">No se encontraron mapas.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((map) => (
            <MapCard key={map.id} map={map} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
