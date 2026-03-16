export const PIN_TYPES = [
  'Ciudad',
  'Pueblo',
  'Aldea',
  'Mazmorra',
  'Bosque',
  'Montana',
  'Ruinas',
  'Taberna',
  'Templo',
  'Puerto',
  'Castillo',
  'Campamento',
  'Otro',
] as const;

export type PinType = (typeof PIN_TYPES)[number];

export const PIN_STATUSES = [
  'Explorado',
  'No explorado',
  'Peligroso',
  'Seguro',
  'Bloqueado',
] as const;

export type PinStatus = (typeof PIN_STATUSES)[number];

export const PIN_TYPE_ICONS: Record<PinType, string> = {
  'Ciudad':     '🏙️',
  'Pueblo':     '🏘️',
  'Aldea':      '🏡',
  'Mazmorra':   '💀',
  'Bosque':     '🌲',
  'Montana':    '⛰️',
  'Ruinas':     '🏚️',
  'Taberna':    '🍺',
  'Templo':     '⛪',
  'Puerto':     '⚓',
  'Castillo':   '🏰',
  'Campamento': '⛺',
  'Otro':       '📍',
};

export const PIN_STATUS_COLORS: Record<PinStatus, string> = {
  'Explorado': '#22c55e',
  'No explorado': '#3b82f6',
  'Peligroso': '#ef4444',
  'Seguro': '#f59e0b',
  'Bloqueado': '#6b7280',
};

export interface MapPin {
  id: string;
  name: string;
  type: PinType;
  description: string;
  x: number;
  y: number;
  relatedNpcs: string;
  relatedQuests: string;
  status: PinStatus;
  dmNotes: string;
}

export interface GameMap {
  id: string;
  createdAt: number;
  updatedAt: number;
  name: string;
  description: string;
  image: string | null;
  pins: MapPin[];
  dmNotes: string;
}

export function createDefaultMapPin(x: number, y: number): MapPin {
  return {
    id: crypto.randomUUID(),
    name: '',
    type: 'Otro',
    description: '',
    x,
    y,
    relatedNpcs: '',
    relatedQuests: '',
    status: 'No explorado',
    dmNotes: '',
  };
}

export function createDefaultGameMap(): GameMap {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    name: '',
    description: '',
    image: null,
    pins: [],
    dmNotes: '',
  };
}
