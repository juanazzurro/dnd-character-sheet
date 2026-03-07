import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Upload, Search } from 'lucide-react';
import { importQuest } from '../../utils/questImportExport';
import { QuestCard } from './QuestCard';
import { PageContainer } from '../layout/PageContainer';
import { QUEST_CONFIG } from './questConfig';
import type { QuestType } from './questConfig';

const STATUSES = ['Todas', 'Activa', 'Completada', 'Fallida', 'Abandonada', 'Pendiente'];

interface QuestListViewProps {
  questType: QuestType;
}

export function QuestListView({ questType }: QuestListViewProps) {
  const config = QUEST_CONFIG[questType];
  const Icon = config.icon;
  const navigate = useNavigate();
  const quests = config.useStore((s) => s.quests);
  const createQuest = config.useStore((s) => s.createQuest);
  const importQuestAction = config.useStore((s) => s.importQuest);
  const deleteQuest = config.useStore((s) => s.deleteQuest);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todas');
  const fileRef = useRef<HTMLInputElement>(null);

  function handleCreate() {
    const id = createQuest();
    navigate(`${config.basePath}/${id}`);
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const quest = await importQuest(file);
      importQuestAction(quest);
      navigate(`${config.basePath}/${quest.id}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al importar mision');
    }
    e.target.value = '';
  }

  const filtered = quests.filter((quest) => {
    const matchesSearch = !search || quest.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'Todas' || quest.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (quests.length === 0) {
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
            <Icon size={36} />
          </div>
          <h1 className="font-serif text-3xl font-bold text-ink mb-3">{config.title}</h1>
          <p className="text-ink-muted mb-6">
            Crea tu primera mision para comenzar a rastrear aventuras.
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={handleCreate} className="btn-primary text-base px-6 py-3">
              Crear Mision
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
        <h1 className="font-serif text-2xl font-bold text-ink">{config.title}</h1>
        <div className="flex gap-2">
          <button onClick={handleCreate} className="btn-primary text-sm flex items-center gap-1">
            <Plus size={14} />
            Crear Mision
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
            placeholder="Buscar por titulo..."
            className="parchment-input pl-8 w-full"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="parchment-input w-full sm:w-40"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-ink-muted text-center py-8">No se encontraron misiones.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              basePath={config.basePath}
              onDelete={deleteQuest}
            />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
