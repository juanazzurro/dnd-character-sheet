import { useRef, useState } from 'react';
import { Upload, Image } from 'lucide-react';

interface MapImageUploadProps {
  onImageChange: (base64: string) => void;
}

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export function MapImageUpload({ onImageChange }: MapImageUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function processFile(file: File) {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError('Solo se admiten imagenes');
      return;
    }
    if (file.size > MAX_SIZE) {
      setError('La imagen no puede superar 10 MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      onImageChange(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onClick={() => fileRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        className={`w-full aspect-video flex flex-col items-center justify-center rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
          dragOver
            ? 'border-dnd-gold bg-parchment-200'
            : 'border-parchment-400 bg-parchment-100 hover:bg-parchment-200 hover:border-dnd-gold'
        }`}
      >
        <Image size={48} className="text-parchment-400 mb-3" />
        <Upload size={18} className="text-ink-muted mb-2" />
        <span className="text-sm text-ink-muted text-center px-4">
          Sube una imagen de tu mapa
        </span>
        <span className="text-xs text-ink-muted mt-1">
          Arrastra o haz clic para seleccionar (max 10 MB)
        </span>
        {error && (
          <span className="text-xs text-dnd-red mt-2 text-center px-2">{error}</span>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />
    </div>
  );
}
