import { useCharacterStore } from '../../store/characterStore';
import { Heart, Skull } from 'lucide-react';

export function DeathSaves() {
  const activeCharacter = useCharacterStore((s) => s.activeCharacter);
  const updateCharacter = useCharacterStore((s) => s.updateCharacter);

  if (!activeCharacter) return null;

  function toggleSuccess(index: number) {
    if (!activeCharacter) return;
    const next = [...activeCharacter.deathSaveSuccesses] as [boolean, boolean, boolean];
    next[index] = !next[index];
    updateCharacter(activeCharacter.id, { deathSaveSuccesses: next });
  }

  function toggleFailure(index: number) {
    if (!activeCharacter) return;
    const next = [...activeCharacter.deathSaveFailures] as [boolean, boolean, boolean];
    next[index] = !next[index];
    updateCharacter(activeCharacter.id, { deathSaveFailures: next });
  }

  return (
    <div className="parchment-card p-3">
      <div className="section-header">Tiradas de muerte</div>
      <div className="space-y-2">
        {/* Successes */}
        <div className="flex items-center gap-2">
          <Heart size={14} className="text-green-700 flex-shrink-0" />
          <span className="text-xs text-ink-muted w-14">Éxitos</span>
          <div className="flex gap-2">
            {activeCharacter.deathSaveSuccesses.map((val, i) => (
              <button
                key={i}
                onClick={() => toggleSuccess(i)}
                aria-label={`Éxito de muerte ${i + 1}`}
                className="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-150"
                style={{
                  borderColor: val ? '#16a34a' : '#cc9230',
                  background: val ? '#16a34a' : 'transparent',
                }}
              >
                {val && <span className="block w-2.5 h-2.5 rounded-full bg-white" />}
              </button>
            ))}
          </div>
        </div>

        {/* Failures */}
        <div className="flex items-center gap-2">
          <Skull size={14} className="text-dnd-red flex-shrink-0" />
          <span className="text-xs text-ink-muted w-14">Fracasos</span>
          <div className="flex gap-2">
            {activeCharacter.deathSaveFailures.map((val, i) => (
              <button
                key={i}
                onClick={() => toggleFailure(i)}
                aria-label={`Fracaso de muerte ${i + 1}`}
                className="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-150"
                style={{
                  borderColor: val ? '#8b0000' : '#cc9230',
                  background: val ? '#8b0000' : 'transparent',
                }}
              >
                {val && <span className="block w-2.5 h-2.5 rounded-full bg-white" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
