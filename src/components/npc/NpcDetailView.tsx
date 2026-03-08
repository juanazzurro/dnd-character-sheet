import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import { useNpcStore } from '../../store/npcStore';
import { useMainQuestStore, useSideQuestStore } from '../../store/questStore';
import { exportNpc } from '../../utils/npcImportExport';
import {
  getAbilityModifier,
  formatModifier,
  getXpFromCR,
  getProficiencyBonusFromCR,
  ABILITY_LABELS,
  ABILITY_SHORT_LABELS,
  SKILL_LABELS,
  SKILL_ABILITY_MAP,
} from '../../utils/calculations';
import { PageContainer } from '../layout/PageContainer';
import { CollapsibleSection } from '../common/CollapsibleSection';
import { StatBlock } from '../common/StatBlock';
import { ProficiencyToggle } from '../common/ProficiencyToggle';
import { ImageUpload } from '../common/ImageUpload';
import { EditableField } from '../common/EditableField';
import { CrossReferenceChips } from '../common/CrossReferenceChips';
import { NpcActionList } from './NpcActionList';
import type { Npc, NpcAction } from '../../types/npc';

const ALIGNMENTS = [
  '', 'Legal bueno', 'Neutral bueno', 'Caotico bueno',
  'Legal neutral', 'Neutral', 'Caotico neutral',
  'Legal malvado', 'Neutral malvado', 'Caotico malvado',
];

const CATEGORIES = [
  '', 'Aliado', 'Enemigo', 'Neutral', 'Mercader', 'Tabernero',
  'Noble', 'Guardia', 'Villano', 'Deidad', 'Otro',
];

const CR_OPTIONS: { value: number; label: string }[] = [
  { value: 0, label: '0' },
  { value: 0.125, label: '1/8' },
  { value: 0.25, label: '1/4' },
  { value: 0.5, label: '1/2' },
  ...Array.from({ length: 30 }, (_, i) => ({ value: i + 1, label: String(i + 1) })),
];

const ATTITUDES = ['', 'Amistoso', 'Neutral', 'Hostil'];

const ABILITY_KEYS = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'] as const;

const SKILL_KEYS = Object.keys(SKILL_LABELS);

export function NpcDetailView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const setActiveNpc = useNpcStore((s) => s.setActiveNpc);
  const updateNpc = useNpcStore((s) => s.updateNpc);
  const npc = useNpcStore((s) => s.npcs.find((n) => n.id === id) ?? null);

  useEffect(() => {
    if (id) setActiveNpc(id);
    return () => setActiveNpc(null);
  }, [id, setActiveNpc]);

  if (!npc) {
    return (
      <PageContainer>
        <p className="text-ink-muted text-center py-8">NPC no encontrado.</p>
        <button onClick={() => navigate('/npcs')} className="btn-secondary mx-auto block">
          Volver a la lista
        </button>
      </PageContainer>
    );
  }

  function update(updates: Partial<Npc>) {
    updateNpc(npc!.id, updates);
  }

  const pb = npc.proficiencyBonusOverride ?? getProficiencyBonusFromCR(npc.challengeRating);

  return (
    <PageContainer key={npc.id}>
      {/* Header bar */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate('/npcs')}
          className="btn-secondary text-sm flex items-center gap-1"
        >
          <ArrowLeft size={14} />
          NPCs
        </button>
        <button
          onClick={() => exportNpc(npc)}
          className="btn-secondary text-sm flex items-center gap-1"
        >
          <Download size={14} />
          Exportar
        </button>
      </div>

      <div className="space-y-4">
        {/* Header card */}
        <div className="parchment-card p-4">
          <div className="flex gap-4">
            <ImageUpload
              image={npc.portrait}
              onImageChange={(portrait) => update({ portrait })}
              className="w-24 h-24 flex-shrink-0"
            />
            <div className="flex-1 space-y-2">
              <EditableField
                value={npc.name}
                onChange={(v) => update({ name: v as string })}
                placeholder="Nombre del NPC"
                className="text-lg font-serif font-bold"
              />
              <div className="grid grid-cols-2 gap-2">
                <EditableField
                  value={npc.race}
                  onChange={(v) => update({ race: v as string })}
                  placeholder="Raza"
                />
                <EditableField
                  value={npc.classOrOccupation}
                  onChange={(v) => update({ classOrOccupation: v as string })}
                  placeholder="Clase / Ocupacion"
                />
                <select
                  value={npc.alignment}
                  onChange={(e) => update({ alignment: e.target.value })}
                  className="parchment-input"
                >
                  <option value="">Alineamiento</option>
                  {ALIGNMENTS.filter(Boolean).map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
                <select
                  value={npc.category}
                  onChange={(e) => update({ category: e.target.value })}
                  className="parchment-input"
                >
                  <option value="">Categoria</option>
                  {CATEGORIES.filter(Boolean).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <EditableField
                  value={npc.location}
                  onChange={(v) => update({ location: v as string })}
                  placeholder="Ubicacion"
                />
                <EditableField
                  value={npc.faction}
                  onChange={(v) => update({ faction: v as string })}
                  placeholder="Faccion"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Ability Scores */}
        <CollapsibleSection title="Puntuaciones de Caracteristica" defaultOpen>
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            {ABILITY_KEYS.map((ability) => (
              <StatBlock
                key={ability}
                label={ABILITY_LABELS[ability]}
                shortLabel={ABILITY_SHORT_LABELS[ability]}
                score={npc[ability]}
                onScoreChange={(v) => update({ [ability]: v })}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs text-ink-muted font-semibold">CA</label>
              <input
                type="number"
                value={npc.armorClass}
                onChange={(e) => update({ armorClass: Number(e.target.value) || 0 })}
                className="parchment-input w-full"
                min={0}
              />
            </div>
            <div>
              <label className="text-xs text-ink-muted font-semibold">PG</label>
              <input
                type="number"
                value={npc.hitPoints}
                onChange={(e) => update({ hitPoints: Number(e.target.value) || 0 })}
                className="parchment-input w-full"
                min={0}
              />
            </div>
            <div>
              <label className="text-xs text-ink-muted font-semibold">Velocidad</label>
              <input
                type="text"
                defaultValue={npc.speed}
                onChange={(e) => update({ speed: e.target.value })}
                className="parchment-input w-full"
              />
            </div>
            <div>
              <label className="text-xs text-ink-muted font-semibold">VD (CR)</label>
              <select
                value={npc.challengeRating}
                onChange={(e) => update({ challengeRating: Number(e.target.value) })}
                className="parchment-input w-full"
              >
                {CR_OPTIONS.map((opt) => (
                  <option key={opt.label} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-2 text-xs text-ink-muted">
            <span>XP: <strong className="text-ink">{getXpFromCR(npc.challengeRating).toLocaleString()}</strong></span>
            <span>Bonificador de competencia: <strong className="text-ink">+{pb}</strong></span>
          </div>
        </CollapsibleSection>

        {/* Combat */}
        <CollapsibleSection title="Combate">
          {/* Saving throws */}
          <div className="mb-4">
            <div className="section-header">Tiradas de Salvacion</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ABILITY_KEYS.map((ability) => {
                const prof = npc.savingThrows[ability]?.proficient ?? false;
                const mod = getAbilityModifier(npc[ability]) + (prof ? pb : 0);
                return (
                  <div key={ability} className="flex items-center gap-1.5">
                    <ProficiencyToggle
                      proficient={prof}
                      onToggle={() => update({
                        savingThrows: {
                          ...npc.savingThrows,
                          [ability]: { proficient: !prof },
                        },
                      })}
                      ariaLabel={`Competencia en salvacion de ${ABILITY_LABELS[ability]}`}
                    />
                    <span className="text-xs text-ink-muted">{ABILITY_SHORT_LABELS[ability]}</span>
                    <span className="text-xs font-bold text-ink">{formatModifier(mod)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Skills */}
          <div className="mb-4">
            <div className="section-header">Habilidades</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {SKILL_KEYS.map((skill) => {
                const prof = npc.skills[skill]?.proficient ?? false;
                const ability = SKILL_ABILITY_MAP[skill] as typeof ABILITY_KEYS[number];
                const mod = getAbilityModifier(npc[ability]) + (prof ? pb : 0);
                return (
                  <div key={skill} className="flex items-center gap-1.5">
                    <ProficiencyToggle
                      proficient={prof}
                      onToggle={() => update({
                        skills: {
                          ...npc.skills,
                          [skill]: { proficient: !prof },
                        },
                      })}
                      ariaLabel={`Competencia en ${SKILL_LABELS[skill]}`}
                    />
                    <span className="text-xs text-ink-muted truncate">{SKILL_LABELS[skill]}</span>
                    <span className="text-xs font-bold text-ink">{formatModifier(mod)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Text combat fields */}
          <div className="space-y-2">
            <EditableField value={npc.damageVulnerabilities} onChange={(v) => update({ damageVulnerabilities: v as string })} placeholder="Vulnerabilidades de dano" label="Vulnerabilidades de Dano" />
            <EditableField value={npc.damageResistances} onChange={(v) => update({ damageResistances: v as string })} placeholder="Resistencias de dano" label="Resistencias de Dano" />
            <EditableField value={npc.damageImmunities} onChange={(v) => update({ damageImmunities: v as string })} placeholder="Inmunidades de dano" label="Inmunidades de Dano" />
            <EditableField value={npc.conditionImmunities} onChange={(v) => update({ conditionImmunities: v as string })} placeholder="Inmunidades a condiciones" label="Inmunidades a Condiciones" />
            <EditableField value={npc.senses} onChange={(v) => update({ senses: v as string })} placeholder="Vision en la oscuridad 60 pies..." label="Sentidos" />
            <EditableField value={npc.languages} onChange={(v) => update({ languages: v as string })} placeholder="Comun, Infracomun..." label="Idiomas" />
          </div>
        </CollapsibleSection>

        {/* Traits & Actions */}
        <CollapsibleSection title="Rasgos y Acciones">
          <div className="space-y-4">
            <NpcActionList
              items={npc.traits}
              onChange={(traits: NpcAction[]) => update({ traits })}
              label="Rasgos"
              addLabel="Agregar rasgo"
            />
            <NpcActionList
              items={npc.actions}
              onChange={(actions: NpcAction[]) => update({ actions })}
              label="Acciones"
              addLabel="Agregar accion"
            />
            <NpcActionList
              items={npc.reactions}
              onChange={(reactions: NpcAction[]) => update({ reactions })}
              label="Reacciones"
              addLabel="Agregar reaccion"
            />
            <NpcActionList
              items={npc.legendaryActions}
              onChange={(legendaryActions: NpcAction[]) => update({ legendaryActions })}
              label="Acciones Legendarias"
              addLabel="Agregar accion legendaria"
            />
          </div>
        </CollapsibleSection>

        {/* Personality */}
        <CollapsibleSection title="Personalidad">
          <div className="space-y-2">
            <EditableField value={npc.personalityTraits} onChange={(v) => update({ personalityTraits: v as string })} multiline placeholder="Rasgos de personalidad..." label="Rasgos de Personalidad" />
            <EditableField value={npc.ideals} onChange={(v) => update({ ideals: v as string })} multiline placeholder="Ideales..." label="Ideales" />
            <EditableField value={npc.bonds} onChange={(v) => update({ bonds: v as string })} multiline placeholder="Vinculos..." label="Vinculos" />
            <EditableField value={npc.flaws} onChange={(v) => update({ flaws: v as string })} multiline placeholder="Defectos..." label="Defectos" />
            <EditableField value={npc.appearance} onChange={(v) => update({ appearance: v as string })} multiline placeholder="Apariencia fisica..." label="Apariencia" />
            <EditableField value={npc.voiceAndMannerisms} onChange={(v) => update({ voiceAndMannerisms: v as string })} multiline placeholder="Voz y manierismos..." label="Voz y Manierismos" />
            <EditableField value={npc.secret} onChange={(v) => update({ secret: v as string })} multiline placeholder="Secreto del NPC..." label="Secreto" />
          </div>
        </CollapsibleSection>

        {/* Backstory */}
        <CollapsibleSection title="Trasfondo">
          <EditableField value={npc.backstory} onChange={(v) => update({ backstory: v as string })} multiline rows={6} placeholder="Historia del NPC..." />
        </CollapsibleSection>

        {/* DM Notes */}
        <CollapsibleSection title="Notas del DM">
          <EditableField value={npc.dmNotes} onChange={(v) => update({ dmNotes: v as string })} multiline rows={6} placeholder="Notas privadas del DM..." />
        </CollapsibleSection>

        {/* Party Relationship */}
        <CollapsibleSection title="Relacion con el Grupo">
          <div className="space-y-2">
            <div>
              <label className="text-xs text-ink-muted font-semibold">Actitud</label>
              <select
                value={npc.attitude}
                onChange={(e) => update({ attitude: e.target.value })}
                className="parchment-input w-full"
              >
                {ATTITUDES.map((att) => (
                  <option key={att} value={att}>{att || 'Sin definir'}</option>
                ))}
              </select>
            </div>
            <EditableField value={npc.relationshipNotes} onChange={(v) => update({ relationshipNotes: v as string })} multiline placeholder="Notas sobre la relacion con el grupo..." label="Notas de Relacion" />
          </div>
        </CollapsibleSection>

        {/* Connections */}
        <NpcConnectionsSection npcName={npc.name} />
      </div>
    </PageContainer>
  );
}

function NpcConnectionsSection({ npcName }: { npcName: string }) {
  const mainQuests = useMainQuestStore((s) => s.quests);
  const sideQuests = useSideQuestStore((s) => s.quests);

  const relatedQuests = useMemo(() => {
    if (!npcName) return [];
    const nameLower = npcName.toLowerCase();
    const results: { name: string; route: string }[] = [];

    for (const q of mainQuests) {
      if (
        q.questGiver.toLowerCase().includes(nameLower) ||
        q.relatedNpcs.toLowerCase().includes(nameLower)
      ) {
        results.push({ name: q.title || 'Sin titulo', route: `/misiones-principales/${q.id}` });
      }
    }
    for (const q of sideQuests) {
      if (
        q.questGiver.toLowerCase().includes(nameLower) ||
        q.relatedNpcs.toLowerCase().includes(nameLower)
      ) {
        results.push({ name: q.title || 'Sin titulo', route: `/misiones-secundarias/${q.id}` });
      }
    }
    return results;
  }, [npcName, mainQuests, sideQuests]);

  const chipValue = relatedQuests.map((q) => q.name).join(', ');

  return (
    <CollapsibleSection title="Conexiones">
      <div className="space-y-1">
        <div className="section-header">Misiones Relacionadas</div>
        <CrossReferenceChips
          value={chipValue}
          entities={relatedQuests}
          emptyText="Este NPC no esta referenciado en ninguna mision."
        />
      </div>
    </CollapsibleSection>
  );
}
