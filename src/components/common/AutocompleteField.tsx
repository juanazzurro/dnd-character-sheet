import { useState, useRef, useCallback, useEffect } from 'react';

export interface Suggestion {
  id: string;
  name: string;
  route: string;
}

interface AutocompleteFieldProps {
  value: string;
  onChange: (value: string) => void;
  suggestions: Suggestion[];
  placeholder?: string;
  label?: string;
  multiline?: boolean;
  rows?: number;
}

export function AutocompleteField({
  value,
  onChange,
  suggestions,
  placeholder,
  label,
  multiline = false,
  rows = 2,
}: AutocompleteFieldProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [filtered, setFiltered] = useState<Suggestion[]>([]);
  const [currentText, setCurrentText] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const raw = e.target.value;
      setCurrentText(raw);

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onChange(raw);
      }, 300);

      // Get current word (after last comma)
      const parts = raw.split(',');
      const currentWord = (parts[parts.length - 1] || '').trim().toLowerCase();

      if (currentWord.length > 0) {
        const matches = suggestions.filter(
          (s) => s.name.toLowerCase().includes(currentWord)
        ).slice(0, 5);
        setFiltered(matches);
        setShowDropdown(matches.length > 0);
      } else {
        setShowDropdown(false);
      }
    },
    [onChange, suggestions]
  );

  function selectSuggestion(suggestion: Suggestion) {
    const parts = currentText.split(',').map((p) => p.trim()).filter(Boolean);
    // Replace the last (incomplete) entry with the suggestion
    if (parts.length > 0) {
      parts[parts.length - 1] = suggestion.name;
    } else {
      parts.push(suggestion.name);
    }
    const newValue = parts.join(', ');
    setCurrentText(newValue);
    onChange(newValue);
    setShowDropdown(false);

    // Update the input element directly since it's uncontrolled-ish
    if (containerRef.current) {
      const input = containerRef.current.querySelector('input, textarea') as HTMLInputElement | HTMLTextAreaElement | null;
      if (input) {
        input.value = newValue;
        input.focus();
      }
    }
  }

  const baseClass = 'parchment-input';

  return (
    <div className="w-full relative" ref={containerRef}>
      {label && <div className="section-header">{label}</div>}
      {multiline ? (
        <textarea
          defaultValue={value}
          onChange={handleChange}
          placeholder={placeholder}
          rows={rows}
          className={`${baseClass} resize-none leading-relaxed w-full`}
          style={{ borderBottomWidth: '1px' }}
          onFocus={() => {
            // Re-check suggestions on focus
            const parts = currentText.split(',');
            const currentWord = (parts[parts.length - 1] || '').trim().toLowerCase();
            if (currentWord.length > 0) {
              const matches = suggestions.filter(
                (s) => s.name.toLowerCase().includes(currentWord)
              ).slice(0, 5);
              setFiltered(matches);
              setShowDropdown(matches.length > 0);
            }
          }}
        />
      ) : (
        <input
          type="text"
          defaultValue={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`${baseClass} w-full`}
          onFocus={() => {
            const parts = currentText.split(',');
            const currentWord = (parts[parts.length - 1] || '').trim().toLowerCase();
            if (currentWord.length > 0) {
              const matches = suggestions.filter(
                (s) => s.name.toLowerCase().includes(currentWord)
              ).slice(0, 5);
              setFiltered(matches);
              setShowDropdown(matches.length > 0);
            }
          }}
        />
      )}

      {showDropdown && filtered.length > 0 && (
        <div
          className="absolute left-0 right-0 z-50 border rounded shadow-lg overflow-hidden"
          style={{ background: '#1a1a2e', borderColor: '#2a2a3e', top: '100%' }}
        >
          {filtered.map((s) => (
            <button
              key={s.id}
              type="button"
              className="w-full text-left px-3 py-1.5 text-sm hover:bg-dnd-gold/20 transition-colors"
              style={{ color: '#e2d8c3' }}
              onMouseDown={(e) => {
                e.preventDefault();
                selectSuggestion(s);
              }}
            >
              {s.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
