import { MapPin as MapPinIcon } from 'lucide-react';
import type { MapPin } from '../../types/gameMap';
import { PIN_STATUS_COLORS, PIN_TYPE_ICONS } from '../../types/gameMap';

interface MapPinMarkerProps {
  pin: MapPin;
  isSelected: boolean;
  showLabel: boolean;
  onMouseDown: (e: React.MouseEvent, pinId: string) => void;
  onClick: (e: React.MouseEvent, pinId: string) => void;
}

export function MapPinMarker({ pin, isSelected, showLabel, onMouseDown, onClick }: MapPinMarkerProps) {
  const color = PIN_STATUS_COLORS[pin.status] || '#6b7280';

  return (
    <div
      className="absolute"
      style={{
        left: `${pin.x}%`,
        top: `${pin.y}%`,
        transform: 'translate(-50%, -100%)',
        pointerEvents: 'auto',
        zIndex: isSelected ? 20 : 10,
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        onMouseDown(e, pin.id);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(e, pin.id);
      }}
    >
      <div
        className={`relative cursor-pointer transition-all ${isSelected ? 'scale-125' : 'hover:scale-110'}`}
        style={isSelected ? { filter: `drop-shadow(0 0 6px #d4af37) drop-shadow(0 0 12px #d4af37)` } : undefined}
      >
        <MapPinIcon size={28} fill={color} color="#1a1a2e" strokeWidth={1.5} />
        <span
          className="absolute left-1/2 -translate-x-1/2 pointer-events-none select-none"
          style={{ fontSize: '10px', lineHeight: 1, top: '3px' }}
        >
          {PIN_TYPE_ICONS[pin.type]}
        </span>
      </div>
      {showLabel && pin.name && (
        <div
          className="absolute left-1/2 -translate-x-1/2 top-full mt-0.5 whitespace-nowrap text-xs font-semibold px-1.5 py-0.5 rounded"
          style={{ background: '#1a1a2e', color: '#f0e6d0', border: '1px solid #2a2a3e' }}
        >
          {pin.name}
        </div>
      )}
    </div>
  );
}
