import { useCharacterStore } from '../../store/characterStore';

const COINS = [
  { key: 'cp', label: 'PC', color: '#b87333', tooltip: 'Piezas de cobre' },
  { key: 'ep', label: 'PE', color: '#aaa9ad', tooltip: 'Piezas de electrum' },
  { key: 'sp', label: 'PL', color: '#c0c0c0', tooltip: 'Piezas de plata' },
  { key: 'gp', label: 'PO', color: '#d4af37', tooltip: 'Piezas de oro' },
  { key: 'pp', label: 'PPt', color: '#e5e4e2', tooltip: 'Piezas de platino' },
] as const;

export function CurrencyTracker() {
  const activeCharacter = useCharacterStore((s) => s.activeCharacter);
  const updateCharacter = useCharacterStore((s) => s.updateCharacter);

  if (!activeCharacter) return null;

  const currency = activeCharacter.currency;

  function updateCoin(coin: keyof typeof currency, value: number) {
    updateCharacter(activeCharacter!.id, {
      currency: { ...currency, [coin]: Math.max(0, value) },
    });
  }

  return (
    <div className="parchment-card p-3">
      <div className="section-header">Monedas</div>
      <div className="flex gap-2 flex-wrap">
        {COINS.map(({ key, label, color, tooltip }) => (
          <div key={key} className="flex flex-col items-center gap-1 flex-1 min-w-[48px]" title={tooltip}>
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow"
              style={{ background: color }}
            >
              {label}
            </div>
            <input
              type="number"
              value={currency[key as keyof typeof currency]}
              onChange={(e) => updateCoin(key as keyof typeof currency, Number(e.target.value))}
              min={0}
              className="w-full text-center parchment-input text-sm font-bold"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
