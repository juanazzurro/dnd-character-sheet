import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import { exportQuest } from '../../utils/questImportExport';
import { PageContainer } from '../layout/PageContainer';
import { CollapsibleSection } from '../common/CollapsibleSection';
import { EditableField } from '../common/EditableField';
import { QuestObjectiveList } from './QuestObjectiveList';
import { SessionLogList } from './SessionLogList';
import { QUEST_CONFIG } from './questConfig';
import type { QuestType } from './questConfig';
import type { Quest } from '../../types/quest';

const STATUSES = ['Pendiente', 'Activa', 'Completada', 'Fallida', 'Abandonada'];

interface QuestDetailViewProps {
  questType: QuestType;
}

export function QuestDetailView({ questType }: QuestDetailViewProps) {
  const config = QUEST_CONFIG[questType];
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const setActiveQuest = config.useStore((s) => s.setActiveQuest);
  const updateQuest = config.useStore((s) => s.updateQuest);
  const quest = config.useStore((s) => s.quests.find((q) => q.id === id) ?? null);

  useEffect(() => {
    if (id) setActiveQuest(id);
    return () => setActiveQuest(null);
  }, [id, setActiveQuest]);

  if (!quest) {
    return (
      <PageContainer>
        <p className="text-ink-muted text-center py-8">Mision no encontrada.</p>
        <button onClick={() => navigate(config.basePath)} className="btn-secondary mx-auto block">
          Volver a la lista
        </button>
      </PageContainer>
    );
  }

  function update(updates: Partial<Quest>) {
    updateQuest(quest!.id, updates);
  }

  const completedObjectives = quest.objectives.filter((o) => o.completed).length;
  const totalObjectives = quest.objectives.length;

  return (
    <PageContainer key={quest.id}>
      {/* Header bar */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate(config.basePath)}
          className="btn-secondary text-sm flex items-center gap-1"
        >
          <ArrowLeft size={14} />
          {config.title}
        </button>
        <button
          onClick={() => exportQuest(quest, config.importSuffix)}
          className="btn-secondary text-sm flex items-center gap-1"
        >
          <Download size={14} />
          Exportar
        </button>
      </div>

      <div className="space-y-4">
        {/* Header card */}
        <div className="parchment-card p-4 space-y-3">
          <EditableField
            value={quest.title}
            onChange={(v) => update({ title: v as string })}
            placeholder="Titulo de la mision"
            className="text-lg font-serif font-bold"
          />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-ink-muted font-semibold">Estado</label>
              <select
                value={quest.status}
                onChange={(e) => update({ status: e.target.value })}
                className="parchment-input w-full"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-ink-muted font-semibold">Prioridad</label>
              <select
                value={quest.priority}
                onChange={(e) => update({ priority: e.target.value })}
                className="parchment-input w-full"
              >
                <option value="">Sin prioridad</option>
                {config.priorities.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <EditableField
              value={quest.questGiver}
              onChange={(v) => update({ questGiver: v as string })}
              placeholder="Quien da la mision"
              label="Quien da la mision"
            />
            <EditableField
              value={quest.location}
              onChange={(v) => update({ location: v as string })}
              placeholder="Ubicacion"
              label="Ubicacion"
            />
          </div>
          <EditableField
            value={quest.reward}
            onChange={(v) => update({ reward: v as string })}
            placeholder="Recompensa"
            label="Recompensa"
          />
        </div>

        {/* Description */}
        <CollapsibleSection title="Descripcion" defaultOpen>
          <EditableField
            value={quest.description}
            onChange={(v) => update({ description: v as string })}
            multiline
            rows={6}
            placeholder="Descripcion de la mision..."
          />
        </CollapsibleSection>

        {/* Objectives */}
        <CollapsibleSection
          title="Objetivos"
          defaultOpen
          badge={totalObjectives > 0 ? `${completedObjectives}/${totalObjectives}` : undefined}
        >
          <QuestObjectiveList
            objectives={quest.objectives}
            onChange={(objectives) => update({ objectives })}
          />
        </CollapsibleSection>

        {/* Session Log */}
        <CollapsibleSection
          title="Registro de Sesiones"
          badge={quest.sessionLog.length > 0 ? String(quest.sessionLog.length) : undefined}
        >
          <SessionLogList
            entries={quest.sessionLog}
            onChange={(sessionLog) => update({ sessionLog })}
          />
        </CollapsibleSection>

        {/* Connections */}
        <CollapsibleSection title="Conexiones">
          <div className="space-y-2">
            <EditableField
              value={quest.relatedNpcs}
              onChange={(v) => update({ relatedNpcs: v as string })}
              multiline
              placeholder="NPCs relacionados..."
              label="NPCs Relacionados"
            />
            <EditableField
              value={quest.relatedQuests}
              onChange={(v) => update({ relatedQuests: v as string })}
              multiline
              placeholder="Misiones relacionadas..."
              label="Misiones Relacionadas"
            />
            <EditableField
              value={quest.relatedLocations}
              onChange={(v) => update({ relatedLocations: v as string })}
              multiline
              placeholder="Ubicaciones relacionadas..."
              label="Ubicaciones Relacionadas"
            />
          </div>
        </CollapsibleSection>

        {/* DM Notes */}
        <CollapsibleSection title="Notas del DM">
          <EditableField
            value={quest.dmNotes}
            onChange={(v) => update({ dmNotes: v as string })}
            multiline
            rows={6}
            placeholder="Notas privadas del DM..."
          />
        </CollapsibleSection>
      </div>
    </PageContainer>
  );
}
