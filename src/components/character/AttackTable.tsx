import { Trash2, Plus } from 'lucide-react';
import { useCharacterStore } from '../../store/characterStore';
import type { Attack } from '../../types/character';

function newAttack(): Attack {
  return { id: crypto.randomUUID(), name: '', bonus: '', damageType: '' };
}

export function AttackTable() {
  const activeCharacter = useCharacterStore((s) => s.activeCharacter);
  const updateCharacter = useCharacterStore((s) => s.updateCharacter);

  if (!activeCharacter) return null;

  const attacks = activeCharacter.attacks;
  // Ensure minimum 3 visible rows
  const displayAttacks = attacks.length < 3
    ? [...attacks, ...Array.from({ length: 3 - attacks.length }, (_, i) => ({
        id: `phantom-${i}`, name: '', bonus: '', damageType: ''
      }))]
    : attacks;

  function updateAttack(id: string, field: keyof Attack, value: string) {
    const updated = activeCharacter!.attacks.map((a) =>
      a.id === id ? { ...a, [field]: value } : a
    );
    // If editing a display-only (not in real list), add it
    const inList = activeCharacter!.attacks.find((a) => a.id === id);
    if (!inList) {
      const newRow = displayAttacks.find((a) => a.id === id);
      if (newRow) {
        updateCharacter(activeCharacter!.id, {
          attacks: [...activeCharacter!.attacks, { ...newRow, [field]: value }],
        });
        return;
      }
    }
    updateCharacter(activeCharacter!.id, { attacks: updated });
  }

  function deleteAttack(id: string) {
    updateCharacter(activeCharacter!.id, {
      attacks: activeCharacter!.attacks.filter((a) => a.id !== id),
    });
  }

  function addAttack() {
    updateCharacter(activeCharacter!.id, {
      attacks: [...activeCharacter!.attacks, newAttack()],
    });
  }

  return (
    <div className="parchment-card p-3">
      <div className="section-header">Ataques y hechizos</div>
      <table className="w-full text-xs">
        <thead>
          <tr className="text-ink-muted font-semibold">
            <th className="text-left pb-1 w-2/5">Nombre</th>
            <th className="text-center pb-1 w-1/5">Bonif.</th>
            <th className="text-left pb-1 w-2/5">Daño / Tipo</th>
            <th className="w-4"></th>
          </tr>
        </thead>
        <tbody>
          {displayAttacks.map((attack) => {
            const isReal = activeCharacter.attacks.some((a) => a.id === attack.id);
            return (
              <tr key={attack.id} className="border-t border-parchment-200">
                <td className="py-0.5 pr-1">
                  <input
                    type="text"
                    value={attack.name}
                    onChange={(e) => updateAttack(attack.id, 'name', e.target.value)}
                    placeholder="Nombre"
                    className="parchment-input text-xs"
                  />
                </td>
                <td className="py-0.5 px-1">
                  <input
                    type="text"
                    value={attack.bonus}
                    onChange={(e) => updateAttack(attack.id, 'bonus', e.target.value)}
                    placeholder="+0"
                    className="parchment-input text-xs text-center"
                  />
                </td>
                <td className="py-0.5 pl-1">
                  <input
                    type="text"
                    value={attack.damageType}
                    onChange={(e) => updateAttack(attack.id, 'damageType', e.target.value)}
                    placeholder="1d6 cortante"
                    className="parchment-input text-xs"
                  />
                </td>
                <td className="py-0.5 pl-1">
                  {isReal && (
                    <button
                      onClick={() => deleteAttack(attack.id)}
                      className="text-ink-muted hover:text-dnd-red transition-colors"
                      title="Eliminar ataque"
                    >
                      <Trash2 size={10} />
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button onClick={addAttack} className="mt-2 flex items-center gap-1 btn-secondary text-xs py-1 px-2">
        <Plus size={12} /> Añadir ataque
      </button>
    </div>
  );
}
