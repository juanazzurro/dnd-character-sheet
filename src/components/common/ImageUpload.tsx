import { useRef, useState } from 'react';
import { Upload, X, User } from 'lucide-react';

interface ImageUploadProps {
  image: string | null;
  onImageChange: (base64: string | null) => void;
  className?: string;
}

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export function ImageUpload({ image, onImageChange, className = '' }: ImageUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function processFile(file: File) {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError('Solo se admiten imágenes');
      return;
    }
    if (file.size > MAX_SIZE) {
      setError('La imagen no puede superar 5 MB');
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
    <div className={`relative ${className}`}>
      {image ? (
        <div className="relative w-full h-full">
          <img
            src={image}
            alt="Retrato del personaje"
            className="w-full h-full object-cover rounded-lg border-2 border-parchment-400"
          />
          <button
            onClick={() => onImageChange(null)}
            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-dnd-red text-parchment-50 flex items-center justify-center hover:bg-dnd-darkred transition-colors"
            title="Eliminar imagen"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          className={`w-full h-full flex flex-col items-center justify-center rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
            dragOver
              ? 'border-dnd-gold bg-parchment-200'
              : 'border-parchment-400 bg-parchment-100 hover:bg-parchment-200 hover:border-dnd-gold'
          }`}
        >
          <User size={32} className="text-parchment-400 mb-2" />
          <Upload size={14} className="text-ink-muted mb-1" />
          <span className="text-xs text-ink-muted text-center px-2">
            Subir retrato
          </span>
          {error && (
            <span className="text-xs text-dnd-red mt-1 text-center px-1">{error}</span>
          )}
        </div>
      )}
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
