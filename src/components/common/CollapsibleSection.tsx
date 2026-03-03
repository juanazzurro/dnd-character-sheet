import { useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: string | number;
  className?: string;
  headerExtra?: React.ReactNode;
}

export function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  badge,
  className = '',
  headerExtra,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`border border-parchment-300 rounded-lg overflow-hidden ${className}`}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-2 bg-parchment-200 hover:bg-parchment-300 transition-colors text-left"
        type="button"
      >
        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-sm text-ink">{title}</span>
          {badge !== undefined && (
            <span className="text-xs bg-parchment-400 text-dnd-gold px-1.5 py-0.5 rounded-full font-semibold">
              {badge}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {headerExtra}
          <ChevronDown
            size={16}
            className="text-ink-muted transition-transform duration-200"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </div>
      </button>

      <div
        ref={contentRef}
        style={{
          maxHeight: open ? '2000px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.3s ease-in-out',
        }}
      >
        <div className="p-3 bg-parchment-50">{children}</div>
      </div>
    </div>
  );
}
