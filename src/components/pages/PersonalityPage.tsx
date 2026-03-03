import { useCharacterStore } from '../../store/characterStore';
import { PageContainer } from '../layout/PageContainer';

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  tooltip,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  tooltip?: string;
}) {
  return (
    <div className="parchment-card p-3" title={tooltip}>
      <div className="section-header">{label}</div>
      <textarea
        defaultValue={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="parchment-input resize-none leading-relaxed w-full"
      />
    </div>
  );
}

export function PersonalityPage() {
  const activeCharacter = useCharacterStore((s) => s.activeCharacter);
  const updateCharacter = useCharacterStore((s) => s.updateCharacter);

  if (!activeCharacter) return <PageContainer><p className="text-ink-muted">No hay personaje activo</p></PageContainer>;

  function update(field: string, value: string) {
    updateCharacter(activeCharacter!.id, { [field]: value } as never);
  }

  return (
    <PageContainer>
      <h2 className="font-serif text-xl font-bold text-ink mb-4">Personalidad y trasfondo</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <TextArea
          label="Rasgos de personalidad"
          value={activeCharacter.personalityTraits}
          onChange={(v) => update('personalityTraits', v)}
          placeholder="¿Cómo actúa tu personaje? ¿Qué manías tiene?"
          rows={5}
          tooltip="Personality Traits"
        />
        <TextArea
          label="Ideales"
          value={activeCharacter.ideals}
          onChange={(v) => update('ideals', v)}
          placeholder="¿En qué cree tu personaje? ¿Qué principios guían sus acciones?"
          rows={5}
          tooltip="Ideals"
        />
        <TextArea
          label="Vínculos"
          value={activeCharacter.bonds}
          onChange={(v) => update('bonds', v)}
          placeholder="¿A qué lugares, personas u objetos está ligado tu personaje?"
          rows={5}
          tooltip="Bonds"
        />
        <TextArea
          label="Defectos"
          value={activeCharacter.flaws}
          onChange={(v) => update('flaws', v)}
          placeholder="¿Cuáles son los defectos o debilidades de tu personaje?"
          rows={5}
          tooltip="Flaws"
        />
      </div>

      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <TextArea
          label="Rasgos y habilidades especiales"
          value={activeCharacter.featuresAndTraits}
          onChange={(v) => update('featuresAndTraits', v)}
          placeholder="Rasgos de raza, clase, trasfondo y dones..."
          rows={8}
          tooltip="Features & Traits"
        />
        <TextArea
          label="Otras competencias e idiomas"
          value={activeCharacter.otherProficienciesAndLanguages}
          onChange={(v) => update('otherProficienciesAndLanguages', v)}
          placeholder="Idiomas conocidos, competencias con armas, armaduras y herramientas..."
          rows={8}
          tooltip="Other Proficiencies & Languages"
        />
      </div>
    </PageContainer>
  );
}
