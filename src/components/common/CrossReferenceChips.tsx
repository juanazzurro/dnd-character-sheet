import { useNavigate } from 'react-router-dom';

interface Entity {
  name: string;
  route: string;
}

interface CrossReferenceChipsProps {
  value: string;
  entities: Entity[];
  emptyText?: string;
}

export function CrossReferenceChips({ value, entities, emptyText }: CrossReferenceChipsProps) {
  const navigate = useNavigate();

  const names = value
    .split(',')
    .map((n) => n.trim())
    .filter(Boolean);

  if (names.length === 0) {
    if (emptyText) {
      return <p className="text-xs text-ink-muted italic">{emptyText}</p>;
    }
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1.5 mt-1">
      {names.map((name, i) => {
        const match = entities.find(
          (e) => e.name.toLowerCase() === name.toLowerCase()
        );

        if (match) {
          return (
            <button
              key={`${name}-${i}`}
              type="button"
              onClick={() => navigate(match.route)}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold transition-colors cursor-pointer"
              style={{
                background: 'rgba(212, 175, 55, 0.2)',
                color: '#d4af37',
                border: '1px solid rgba(212, 175, 55, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(212, 175, 55, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(212, 175, 55, 0.2)';
              }}
            >
              {name}
            </button>
          );
        }

        return (
          <span
            key={`${name}-${i}`}
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
            style={{
              background: 'rgba(107, 114, 128, 0.2)',
              color: '#9ca3af',
              border: '1px solid rgba(107, 114, 128, 0.3)',
            }}
          >
            {name}
          </span>
        );
      })}
    </div>
  );
}
