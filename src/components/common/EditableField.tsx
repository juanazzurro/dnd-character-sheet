import { useRef, useCallback } from 'react';

interface EditableFieldProps {
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  multiline?: boolean;
  type?: 'text' | 'number';
  className?: string;
  min?: number;
  max?: number;
  label?: string;
  rows?: number;
}

export function EditableField({
  value,
  onChange,
  placeholder,
  multiline = false,
  type = 'text',
  className = '',
  min,
  max,
  label,
  rows = 3,
}: EditableFieldProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const raw = e.target.value;
      const val = type === 'number' ? (raw === '' ? 0 : Number(raw)) : raw;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onChange(val);
      }, 300);
      // Immediate DOM update via uncontrolled
    },
    [onChange, type]
  );

  const baseClass = `parchment-input ${className}`;

  if (multiline) {
    return (
      <div className="w-full">
        {label && <div className="section-header">{label}</div>}
        <textarea
          defaultValue={value as string}
          onChange={handleChange}
          placeholder={placeholder}
          rows={rows}
          className={`${baseClass} resize-none leading-relaxed`}
          style={{ borderBottomWidth: '1px' }}
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      {label && <div className="section-header">{label}</div>}
      <input
        type={type}
        defaultValue={value}
        onChange={handleChange}
        placeholder={placeholder}
        min={min}
        max={max}
        className={baseClass}
      />
    </div>
  );
}

interface NumberFieldProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  min?: number;
  max?: number;
  className?: string;
  showButtons?: boolean;
}

export function NumberField({
  value,
  onChange,
  label,
  min = 0,
  max = 999,
  className = '',
  showButtons = false,
}: NumberFieldProps) {
  if (showButtons) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {label && <span className="text-xs text-ink-muted font-semibold">{label}</span>}
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-6 h-6 rounded bg-parchment-300 hover:bg-parchment-400 text-ink font-bold text-sm flex items-center justify-center border border-parchment-400"
        >
          −
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (!isNaN(v)) onChange(Math.min(max, Math.max(min, v)));
          }}
          min={min}
          max={max}
          className="w-12 text-center parchment-input"
        />
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-6 h-6 rounded bg-parchment-300 hover:bg-parchment-400 text-ink font-bold text-sm flex items-center justify-center border border-parchment-400"
        >
          +
        </button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {label && <span className="text-xs text-ink-muted font-semibold mb-0.5">{label}</span>}
      <input
        type="number"
        value={value}
        onChange={(e) => {
          const v = Number(e.target.value);
          if (!isNaN(v)) onChange(Math.min(max, Math.max(min, v)));
        }}
        min={min}
        max={max}
        className="w-full text-center parchment-input"
      />
    </div>
  );
}
