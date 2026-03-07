import type { ReactNode } from 'react';

interface PlaceholderPageProps {
  title: string;
  icon: ReactNode;
}

export function PlaceholderPage({ title, icon }: PlaceholderPageProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-6" style={{ minHeight: '60vh' }}>
      <div
        className="text-center max-w-sm p-8 rounded-lg border"
        style={{ background: '#1a1a2e', borderColor: '#2a2a4a' }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: 'rgba(212, 175, 55, 0.1)', color: '#d4af37' }}
        >
          {icon}
        </div>
        <h2 className="font-serif text-xl font-bold mb-2" style={{ color: '#d4af37' }}>
          {title}
        </h2>
        <p className="text-sm" style={{ color: '#8a7a6a' }}>
          Proximamente
        </p>
      </div>
    </div>
  );
}
