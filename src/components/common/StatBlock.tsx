import { getAbilityModifier, formatModifier } from '../../utils/calculations';

interface StatBlockProps {
  label: string;
  shortLabel: string;
  score: number;
  onScoreChange: (value: number) => void;
  tooltip?: string;
}

export function StatBlock({ label, shortLabel, score, onScoreChange, tooltip }: StatBlockProps) {
  const mod = getAbilityModifier(score);

  return (
    <div
      className="stat-box cursor-default select-none"
      style={{ minWidth: '72px' }}
      title={tooltip || label}
    >
      {/* Label */}
      <span className="font-serif text-xs font-bold uppercase tracking-wider text-ink-muted mb-1">
        {shortLabel}
      </span>

      {/* Score (editable) */}
      <input
        type="number"
        value={score}
        onChange={(e) => {
          const v = Math.min(30, Math.max(1, Number(e.target.value)));
          if (!isNaN(v)) onScoreChange(v);
        }}
        min={1}
        max={30}
        className="w-12 text-center text-2xl font-bold bg-transparent border-b border-dashed border-parchment-400 focus:outline-none focus:border-solid focus:border-dnd-gold text-ink"
        style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
      />

      {/* Modifier */}
      <div
        className="modifier-box mt-2"
        title={`Modificador de ${label}: ${formatModifier(mod)}`}
      >
        {formatModifier(mod)}
      </div>
    </div>
  );
}
