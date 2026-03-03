interface ProficiencyToggleProps {
  proficient: boolean;
  onToggle: () => void;
  ariaLabel: string;
}

export function ProficiencyToggle({ proficient, onToggle, ariaLabel }: ProficiencyToggleProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={ariaLabel}
      aria-pressed={proficient}
      className={`prof-circle ${proficient ? 'active' : ''}`}
      type="button"
    >
      {proficient && (
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#0f0f1a',
            display: 'block',
          }}
        />
      )}
    </button>
  );
}
