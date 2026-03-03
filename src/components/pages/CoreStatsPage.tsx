import { useCharacterStore } from '../../store/characterStore';
import type { Character } from '../../types/character';
import { AbilityScores } from '../character/AbilityScores';
import { SavingThrows } from '../character/SavingThrows';
import { SkillsList } from '../character/SkillsList';
import { CombatBlock } from '../character/CombatBlock';
import { AttackTable } from '../character/AttackTable';
import { DeathSaves } from '../character/DeathSaves';
import { ImageUpload } from '../common/ImageUpload';
import { PageContainer } from '../layout/PageContainer';

const ALIGNMENTS = [
  'Legal Bueno', 'Neutral Bueno', 'Caótico Bueno',
  'Legal Neutral', 'Neutral Verdadero', 'Caótico Neutral',
  'Legal Malvado', 'Neutral Malvado', 'Caótico Malvado',
];

export function CoreStatsPage() {
  const activeCharacter = useCharacterStore((s) => s.activeCharacter);
  const updateCharacter = useCharacterStore((s) => s.updateCharacter);

  if (!activeCharacter) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-full">
          <p className="text-ink-muted font-serif text-lg">No hay personaje activo</p>
        </div>
      </PageContainer>
    );
  }

  function update(field: keyof Character, value: Character[keyof Character]) {
    updateCharacter(activeCharacter!.id, { [field]: value } as Partial<Character>);
  }

  return (
    <PageContainer>
      {/* Character header */}
      <div className="parchment-card p-4 mb-4">
        <div className="flex gap-4">
          {/* Portrait */}
          <div className="w-24 h-28 flex-shrink-0">
            <ImageUpload
              image={activeCharacter.portrait}
              onImageChange={(img) => update('portrait', img)}
              className="w-full h-full"
            />
          </div>

          {/* Header fields */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <div className="section-header">Nombre del personaje</div>
              <input
                type="text"
                defaultValue={activeCharacter.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="Nombre"
                className="parchment-input text-lg font-serif font-bold"
              />
            </div>
            <div>
              <div className="section-header">Clase</div>
              <input
                type="text"
                defaultValue={activeCharacter.class}
                onChange={(e) => update('class', e.target.value)}
                placeholder="Ej: Guerrero"
                className="parchment-input"
              />
            </div>
            <div>
              <div className="section-header">Nivel</div>
              <input
                type="number"
                value={activeCharacter.level}
                onChange={(e) => update('level', Math.min(20, Math.max(1, Number(e.target.value))))}
                className="parchment-input"
                min={1}
                max={20}
              />
            </div>
            <div>
              <div className="section-header">Raza</div>
              <input
                type="text"
                defaultValue={activeCharacter.race}
                onChange={(e) => update('race', e.target.value)}
                placeholder="Ej: Elfo"
                className="parchment-input"
              />
            </div>
            <div>
              <div className="section-header">Trasfondo</div>
              <input
                type="text"
                defaultValue={activeCharacter.background}
                onChange={(e) => update('background', e.target.value)}
                placeholder="Ej: Soldado"
                className="parchment-input"
              />
            </div>
            <div>
              <div className="section-header">Alineamiento</div>
              <select
                value={activeCharacter.alignment}
                onChange={(e) => update('alignment', e.target.value)}
                className="parchment-input"
              >
                <option value="">— Seleccionar —</option>
                {ALIGNMENTS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div>
              <div className="section-header">Experiencia</div>
              <input
                type="number"
                value={activeCharacter.experiencePoints}
                onChange={(e) => update('experiencePoints', Number(e.target.value))}
                className="parchment-input"
                min={0}
              />
            </div>
            <div>
              <div className="section-header">Jugador</div>
              <input
                type="text"
                defaultValue={activeCharacter.playerName}
                onChange={(e) => update('playerName', e.target.value)}
                placeholder="Nombre del jugador"
                className="parchment-input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main three-column layout */}
      <div className="flex gap-4">
        {/* Left column */}
        <div className="flex flex-col gap-3" style={{ width: '210px', flexShrink: 0 }}>
          <AbilityScores />
          <SavingThrows />
          <SkillsList />
        </div>

        {/* Center / main column */}
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          <CombatBlock />
          <DeathSaves />
          <AttackTable />

          {/* Features & Proficiencies summary */}
          <div className="parchment-card p-3">
            <div className="section-header">Otras competencias e idiomas</div>
            <textarea
              defaultValue={activeCharacter.otherProficienciesAndLanguages}
              onChange={(e) => update('otherProficienciesAndLanguages', e.target.value)}
              rows={4}
              placeholder="Idiomas, competencias con armaduras, armas, herramientas..."
              className="parchment-input resize-none leading-relaxed w-full"
            />
          </div>

          <div className="parchment-card p-3">
            <div className="section-header">Rasgos, dones y habilidades especiales</div>
            <textarea
              defaultValue={activeCharacter.featuresAndTraits}
              onChange={(e) => update('featuresAndTraits', e.target.value)}
              rows={5}
              placeholder="Rasgos de clase, dones..."
              className="parchment-input resize-none leading-relaxed w-full"
            />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
