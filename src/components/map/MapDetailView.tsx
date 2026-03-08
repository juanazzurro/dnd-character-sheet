import { useState, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Tag, Plus, Minus, RotateCcw, MapPin as MapPinIcon, X } from 'lucide-react';
import { useMapStore } from '../../store/mapStore';
import { useNpcStore } from '../../store/npcStore';
import { useMainQuestStore, useSideQuestStore } from '../../store/questStore';
import { exportMap } from '../../utils/mapImportExport';
import { createDefaultMapPin } from '../../types/gameMap';
import { PIN_TYPES } from '../../types/gameMap';
import { MapImageUpload } from './MapImageUpload';
import { MapPinMarker } from './MapPinMarker';
import { MapPinPanel } from './MapPinPanel';
import type { GameMap } from '../../types/gameMap';
import type { Suggestion } from '../common/AutocompleteField';

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

export function MapDetailView() {
  const { id } = useParams<{ id: string }>();
  const maps = useMapStore((s) => s.maps);
  const map = maps.find((m) => m.id === id);

  const npcs = useNpcStore((s) => s.npcs);
  const mainQuests = useMainQuestStore((s) => s.quests);
  const sideQuests = useSideQuestStore((s) => s.quests);

  const npcSuggestions = useMemo(() =>
    npcs.filter((n) => n.name).map((n) => ({ id: n.id, name: n.name, route: `/npcs/${n.id}` })),
    [npcs]
  );

  const questSuggestions = useMemo(() => [
    ...mainQuests.filter((q) => q.title).map((q) => ({ id: q.id, name: q.title, route: `/misiones-principales/${q.id}` })),
    ...sideQuests.filter((q) => q.title).map((q) => ({ id: q.id, name: q.title, route: `/misiones-secundarias/${q.id}` })),
  ], [mainQuests, sideQuests]);

  if (!map) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ background: '#0f0f1a' }}>
        <p className="text-ink-muted">Mapa no encontrado</p>
      </div>
    );
  }

  // key={map.id} forces remount when switching maps, resetting all canvas state
  return (
    <MapDetailViewInner
      key={map.id}
      map={map}
      npcSuggestions={npcSuggestions}
      questSuggestions={questSuggestions}
    />
  );
}

interface MapDetailViewInnerProps {
  map: GameMap;
  npcSuggestions: Suggestion[];
  questSuggestions: Suggestion[];
}

function MapDetailViewInner({ map, npcSuggestions, questSuggestions }: MapDetailViewInnerProps) {
  const navigate = useNavigate();
  const updateMap = useMapStore((s) => s.updateMap);
  const addPin = useMapStore((s) => s.addPin);
  const updatePin = useMapStore((s) => s.updatePin);
  const deletePin = useMapStore((s) => s.deletePin);
  const movePin = useMapStore((s) => s.movePin);

  // Canvas state — all reset naturally on remount via key={map.id}
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [placingPin, setPlacingPin] = useState(false);
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
  const [draggingPinId, setDraggingPinId] = useState<string | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>('Todos');
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);

  const viewportRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const viewport = viewportRef.current;
    if (!viewport) return;

    const rect = viewport.getBoundingClientRect();
    const vpX = e.clientX - rect.left;
    const vpY = e.clientY - rect.top;

    setScale((prev) => {
      const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
      const newScale = clamp(prev * factor, 0.25, 5.0);
      const ratio = newScale / prev;

      setTranslateX((tx) => vpX - (vpX - tx) * ratio);
      setTranslateY((ty) => vpY - (vpY - ty) * ratio);

      return newScale;
    });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;

    if (placingPin && imageSize) {
      const viewport = viewportRef.current;
      if (!viewport) return;
      const rect = viewport.getBoundingClientRect();
      const vpX = e.clientX - rect.left;
      const vpY = e.clientY - rect.top;
      const imgX = (vpX - translateX) / scale;
      const imgY = (vpY - translateY) / scale;
      const percentX = clamp((imgX / imageSize.width) * 100, 0, 100);
      const percentY = clamp((imgY / imageSize.height) * 100, 0, 100);
      const pin = createDefaultMapPin(percentX, percentY);
      addPin(map.id, pin);
      setSelectedPinId(pin.id);
      setPlacingPin(false);
      return;
    }

    setIsPanning(true);
    setPanStart({ x: e.clientX - translateX, y: e.clientY - translateY });
  }, [placingPin, map.id, imageSize, translateX, translateY, scale, addPin]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (draggingPinId && imageSize) {
      const viewport = viewportRef.current;
      if (!viewport) return;
      const rect = viewport.getBoundingClientRect();
      const vpX = e.clientX - rect.left;
      const vpY = e.clientY - rect.top;
      const imgX = (vpX - translateX) / scale;
      const imgY = (vpY - translateY) / scale;
      const percentX = clamp((imgX / imageSize.width) * 100, 0, 100);
      const percentY = clamp((imgY / imageSize.height) * 100, 0, 100);
      movePin(map.id, draggingPinId, percentX, percentY);
      return;
    }

    if (!isPanning) return;
    setTranslateX(e.clientX - panStart.x);
    setTranslateY(e.clientY - panStart.y);
  }, [draggingPinId, isPanning, panStart, map.id, imageSize, translateX, translateY, scale, movePin]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    setDraggingPinId(null);
  }, []);

  const handlePinMouseDown = useCallback((e: React.MouseEvent, pinId: string) => {
    e.stopPropagation();
    setDraggingPinId(pinId);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handlePinClick = useCallback((e: React.MouseEvent, pinId: string) => {
    e.stopPropagation();
    // Only select if we didn't drag significantly
    const dx = Math.abs(e.clientX - dragStartRef.current.x);
    const dy = Math.abs(e.clientY - dragStartRef.current.y);
    if (dx < 5 && dy < 5) {
      setSelectedPinId((prev) => (prev === pinId ? null : pinId));
    }
  }, []);

  function handleZoom(direction: 'in' | 'out' | 'reset') {
    if (direction === 'reset') {
      setScale(1);
      setTranslateX(0);
      setTranslateY(0);
      return;
    }
    const viewport = viewportRef.current;
    if (!viewport) return;
    const rect = viewport.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const factor = direction === 'in' ? 1.3 : 1 / 1.3;
    const newScale = clamp(scale * factor, 0.25, 5.0);
    const ratio = newScale / scale;
    setTranslateX(centerX - (centerX - translateX) * ratio);
    setTranslateY(centerY - (centerY - translateY) * ratio);
    setScale(newScale);
  }

  function handleImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const img = e.currentTarget;
    setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
  }

  const selectedPin = selectedPinId ? map.pins.find((p) => p.id === selectedPinId) : null;
  const filteredPins = typeFilter === 'Todos'
    ? map.pins
    : map.pins.filter((p) => p.type === typeFilter);

  return (
    <div className="flex flex-col h-full" style={{ background: '#0f0f1a' }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-3 py-2 border-b flex-shrink-0"
        style={{ borderColor: '#2a2a3e', background: '#1a1a2e' }}
      >
        <button
          onClick={() => navigate('/mapa')}
          className="text-ink-muted hover:text-ink transition-colors flex items-center gap-1 text-sm"
        >
          <ArrowLeft size={16} />
          Mapas
        </button>

        <input
          type="text"
          defaultValue={map.name}
          onChange={(e) => updateMap(map.id, { name: e.target.value })}
          placeholder="Nombre del mapa"
          className="flex-1 bg-transparent border-none text-ink font-serif font-bold text-lg focus:outline-none placeholder:text-ink-muted"
        />

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportMap(map)}
            className="btn-secondary text-xs flex items-center gap-1"
          >
            <Download size={12} />
            Exportar
          </button>
          <button
            onClick={() => setShowLabels((v) => !v)}
            className={`text-xs flex items-center gap-1 px-2 py-1 rounded border transition-colors ${
              showLabels
                ? 'border-dnd-gold text-dnd-gold'
                : 'border-parchment-400 text-ink-muted'
            }`}
            style={{ background: 'transparent' }}
          >
            <Tag size={12} />
            Etiquetas
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 min-h-0">
        {/* Canvas area */}
        <div
          ref={viewportRef}
          className="flex-1 relative overflow-hidden select-none"
          style={{
            cursor: placingPin ? 'crosshair' : isPanning ? 'grabbing' : 'grab',
            background: '#0a0a14',
          }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {!map.image ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <MapImageUpload onImageChange={(base64) => updateMap(map.id, { image: base64 })} />
            </div>
          ) : (
            <div
              style={{
                transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
                transformOrigin: '0 0',
                position: 'relative',
                display: 'inline-block',
              }}
            >
              <img
                src={map.image}
                alt={map.name}
                onLoad={handleImageLoad}
                draggable={false}
                style={{ pointerEvents: 'none', display: 'block' }}
              />
              {/* Pins overlay */}
              {imageSize && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: imageSize.width,
                    height: imageSize.height,
                    pointerEvents: 'none',
                  }}
                >
                  {filteredPins.map((pin) => (
                    <MapPinMarker
                      key={pin.id}
                      pin={pin}
                      isSelected={pin.id === selectedPinId}
                      showLabel={showLabels}
                      onMouseDown={handlePinMouseDown}
                      onClick={handlePinClick}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pin panel */}
        {selectedPin && (
          <MapPinPanel
            pin={selectedPin}
            onUpdate={(updates) => updatePin(map.id, selectedPin.id, updates)}
            onDelete={() => {
              deletePin(map.id, selectedPin.id);
              setSelectedPinId(null);
            }}
            onClose={() => setSelectedPinId(null)}
            npcSuggestions={npcSuggestions}
            questSuggestions={questSuggestions}
          />
        )}
      </div>

      {/* Bottom controls */}
      {map.image && (
        <div
          className="flex items-center gap-3 px-3 py-2 border-t flex-shrink-0"
          style={{ borderColor: '#2a2a3e', background: '#1a1a2e' }}
        >
          {/* Zoom controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleZoom('out')}
              className="w-7 h-7 flex items-center justify-center rounded hover:bg-parchment-200/10 text-ink-muted hover:text-ink transition-colors"
              title="Alejar"
            >
              <Minus size={14} />
            </button>
            <button
              onClick={() => handleZoom('reset')}
              className="px-2 h-7 flex items-center justify-center rounded hover:bg-parchment-200/10 text-ink-muted hover:text-ink transition-colors text-xs"
              title="Restablecer zoom"
            >
              <RotateCcw size={12} className="mr-1" />
              {Math.round(scale * 100)}%
            </button>
            <button
              onClick={() => handleZoom('in')}
              className="w-7 h-7 flex items-center justify-center rounded hover:bg-parchment-200/10 text-ink-muted hover:text-ink transition-colors"
              title="Acercar"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="w-px h-5" style={{ background: '#2a2a3e' }} />

          {/* Place pin */}
          <button
            onClick={() => setPlacingPin((v) => !v)}
            className={`text-xs flex items-center gap-1 px-2 py-1 rounded border transition-colors ${
              placingPin
                ? 'border-dnd-gold text-dnd-gold bg-dnd-gold/10'
                : 'border-parchment-400 text-ink-muted hover:text-ink'
            }`}
            style={!placingPin ? { background: 'transparent' } : undefined}
          >
            <MapPinIcon size={12} />
            Colocar Pin
          </button>

          {placingPin && (
            <button
              onClick={() => setPlacingPin(false)}
              className="text-xs text-ink-muted hover:text-ink transition-colors"
            >
              <X size={14} />
            </button>
          )}

          <div className="w-px h-5" style={{ background: '#2a2a3e' }} />

          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="parchment-input text-xs py-1"
          >
            <option value="Todos">Todos los tipos</option>
            {PIN_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <div className="flex-1" />

          <span className="text-xs text-ink-muted">
            {map.pins.length} pin{map.pins.length !== 1 ? 'es' : ''}
          </span>
        </div>
      )}
    </div>
  );
}
