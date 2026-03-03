import { Plus, Trash2 } from 'lucide-react';
import { useCharacterStore } from '../../store/characterStore';
import { CurrencyTracker } from '../character/CurrencyTracker';
import { PageContainer } from '../layout/PageContainer';
import type { EquipmentItem } from '../../types/character';

function newItem(): EquipmentItem {
  return { id: crypto.randomUUID(), name: '', quantity: 1, weight: '' };
}

export function EquipmentPage() {
  const activeCharacter = useCharacterStore((s) => s.activeCharacter);
  const updateCharacter = useCharacterStore((s) => s.updateCharacter);

  if (!activeCharacter) return <PageContainer><p className="text-ink-muted">No hay personaje activo</p></PageContainer>;

  const equipment = activeCharacter.equipment;

  function updateItem(id: string, changes: Partial<EquipmentItem>) {
    updateCharacter(activeCharacter!.id, {
      equipment: equipment.map((item) => (item.id === id ? { ...item, ...changes } : item)),
    });
  }

  function removeItem(id: string) {
    updateCharacter(activeCharacter!.id, {
      equipment: equipment.filter((item) => item.id !== id),
    });
  }

  function addItem() {
    updateCharacter(activeCharacter!.id, {
      equipment: [...equipment, newItem()],
    });
  }

  const totalWeight = equipment.reduce((sum, item) => {
    const w = parseFloat(item.weight) || 0;
    return sum + w * item.quantity;
  }, 0);

  return (
    <PageContainer>
      <h2 className="font-serif text-xl font-bold text-ink mb-4">Equipo y monedas</h2>

      <CurrencyTracker />

      <div className="parchment-card p-3 mt-4">
        <div className="flex items-center justify-between mb-2">
          <div className="section-header mb-0">Equipo</div>
          <span className="text-xs text-ink-muted">
            Peso total: <strong>{totalWeight.toFixed(1)} lb.</strong>
          </span>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="text-ink-muted font-semibold">
              <th className="text-left pb-1">Objeto</th>
              <th className="text-center pb-1 w-16">Cantidad</th>
              <th className="text-center pb-1 w-16">Peso</th>
              <th className="w-6"></th>
            </tr>
          </thead>
          <tbody>
            {equipment.map((item) => (
              <tr key={item.id} className="border-t border-parchment-200">
                <td className="py-1 pr-2">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(item.id, { name: e.target.value })}
                    placeholder="Nombre del objeto"
                    className="parchment-input text-xs w-full"
                  />
                </td>
                <td className="py-1 px-1">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, { quantity: Math.max(0, Number(e.target.value)) })}
                    className="parchment-input text-xs text-center w-full"
                    min={0}
                  />
                </td>
                <td className="py-1 px-1">
                  <input
                    type="text"
                    value={item.weight}
                    onChange={(e) => updateItem(item.id, { weight: e.target.value })}
                    placeholder="lb."
                    className="parchment-input text-xs text-center w-full"
                  />
                </td>
                <td className="py-1 pl-1">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-ink-muted hover:text-dnd-red transition-colors"
                  >
                    <Trash2 size={10} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={addItem}
          className="mt-2 flex items-center gap-1 btn-secondary text-xs py-1 px-2"
        >
          <Plus size={12} /> Añadir objeto
        </button>
      </div>

      <div className="parchment-card p-3 mt-4">
        <div className="section-header">Tesoro y objetos mágicos</div>
        <textarea
          defaultValue={activeCharacter.treasure}
          onChange={(e) => updateCharacter(activeCharacter.id, { treasure: e.target.value })}
          rows={5}
          placeholder="Gemas, joyas, objetos mágicos, pergaminos..."
          className="parchment-input resize-none leading-relaxed w-full"
        />
      </div>
    </PageContainer>
  );
}
