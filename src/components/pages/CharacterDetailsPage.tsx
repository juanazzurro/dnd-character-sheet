import { useCharacterStore } from '../../store/characterStore';
import { ImageUpload } from '../common/ImageUpload';
import { PageContainer } from '../layout/PageContainer';

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  tooltip?: string;
}

function Field({ label, value, onChange, placeholder, tooltip }: FieldProps) {
  return (
    <div title={tooltip}>
      <div className="section-header">{label}</div>
      <input
        type="text"
        defaultValue={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="parchment-input"
      />
    </div>
  );
}

export function CharacterDetailsPage() {
  const activeCharacter = useCharacterStore((s) => s.activeCharacter);
  const updateCharacter = useCharacterStore((s) => s.updateCharacter);

  if (!activeCharacter) return <PageContainer><p className="text-ink-muted">No hay personaje activo</p></PageContainer>;

  function update(field: string, value: string) {
    updateCharacter(activeCharacter!.id, { [field]: value } as never);
  }

  return (
    <PageContainer>
      <h2 className="font-serif text-xl font-bold text-ink mb-4">Detalles del personaje</h2>

      <div className="flex gap-4">
        {/* Portrait large */}
        <div className="w-40 h-52 flex-shrink-0">
          <ImageUpload
            image={activeCharacter.portrait}
            onImageChange={(img) => updateCharacter(activeCharacter.id, { portrait: img })}
            className="w-full h-full"
          />
        </div>

        {/* Physical characteristics */}
        <div className="flex-1">
          <div className="parchment-card p-3">
            <div className="section-header">Características físicas</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Field label="Edad" value={activeCharacter.age} onChange={(v) => update('age', v)} placeholder="Ej: 25" tooltip="Age" />
              <Field label="Estatura" value={activeCharacter.height} onChange={(v) => update('height', v)} placeholder="Ej: 1.80 m" tooltip="Height" />
              <Field label="Peso" value={activeCharacter.weight} onChange={(v) => update('weight', v)} placeholder="Ej: 75 kg" tooltip="Weight" />
              <Field label="Ojos" value={activeCharacter.eyes} onChange={(v) => update('eyes', v)} placeholder="Ej: Azules" tooltip="Eyes" />
              <Field label="Piel" value={activeCharacter.skin} onChange={(v) => update('skin', v)} placeholder="Ej: Clara" tooltip="Skin" />
              <Field label="Cabello" value={activeCharacter.hair} onChange={(v) => update('hair', v)} placeholder="Ej: Negro" tooltip="Hair" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid md:grid-cols-2 gap-4">
        {/* Appearance */}
        <div className="parchment-card p-3">
          <div className="section-header">Apariencia del personaje</div>
          <textarea
            defaultValue={activeCharacter.characterAppearance}
            onChange={(e) => update('characterAppearance', e.target.value)}
            rows={6}
            placeholder="Describe la apariencia física de tu personaje, cicatrices, tatuajes, vestimenta característica..."
            className="parchment-input resize-none leading-relaxed w-full"
          />
        </div>

        {/* Backstory */}
        <div className="parchment-card p-3">
          <div className="section-header">Historia del personaje</div>
          <textarea
            defaultValue={activeCharacter.backstory}
            onChange={(e) => update('backstory', e.target.value)}
            rows={6}
            placeholder="¿De dónde viene tu personaje? ¿Qué eventos importantes han marcado su vida?"
            className="parchment-input resize-none leading-relaxed w-full"
          />
        </div>

        {/* Allies & Organizations */}
        <div className="parchment-card p-3">
          <div className="section-header">Aliados y organizaciones</div>
          <div className="mb-2">
            <div className="section-header text-[10px]">Nombre</div>
            <input
              type="text"
              defaultValue={activeCharacter.alliesName}
              onChange={(e) => update('alliesName', e.target.value)}
              placeholder="Nombre del grupo u organización"
              className="parchment-input"
            />
          </div>
          <div className="mb-2">
            <div className="section-header text-[10px]">Símbolo / Emblema</div>
            <input
              type="text"
              defaultValue={activeCharacter.alliesSymbol}
              onChange={(e) => update('alliesSymbol', e.target.value)}
              placeholder="Descripción del símbolo"
              className="parchment-input"
            />
          </div>
          <div>
            <div className="section-header text-[10px]">Notas</div>
            <textarea
              defaultValue={activeCharacter.alliesNotes}
              onChange={(e) => update('alliesNotes', e.target.value)}
              rows={4}
              placeholder="Aliados, contactos, miembros del partido..."
              className="parchment-input resize-none leading-relaxed w-full"
            />
          </div>
        </div>

        {/* Additional Features */}
        <div className="parchment-card p-3">
          <div className="section-header">Rasgos y habilidades adicionales</div>
          <textarea
            defaultValue={activeCharacter.additionalFeaturesAndTraits}
            onChange={(e) => update('additionalFeaturesAndTraits', e.target.value)}
            rows={10}
            placeholder="Rasgos raciales, habilidades adicionales, dones extra, notas de trasfondo..."
            className="parchment-input resize-none leading-relaxed w-full"
          />
        </div>
      </div>
    </PageContainer>
  );
}
