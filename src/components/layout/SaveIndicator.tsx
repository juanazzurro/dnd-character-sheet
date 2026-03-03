import { Check, Loader2, AlertCircle } from 'lucide-react';

interface SaveIndicatorProps {
  status: 'saved' | 'saving' | 'unsaved';
}

export function SaveIndicator({ status }: SaveIndicatorProps) {
  return (
    <div className="flex items-center gap-1 text-xs">
      {status === 'saved' && (
        <>
          <Check size={12} className="text-green-600" />
          <span className="text-ink-muted">Guardado</span>
        </>
      )}
      {status === 'saving' && (
        <>
          <Loader2 size={12} className="text-dnd-gold animate-spin" />
          <span className="text-ink-muted">Guardando...</span>
        </>
      )}
      {status === 'unsaved' && (
        <>
          <AlertCircle size={12} className="text-dnd-red" />
          <span className="text-ink-muted">Sin guardar</span>
        </>
      )}
    </div>
  );
}
