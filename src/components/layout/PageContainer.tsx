interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className={`flex-1 overflow-y-auto p-4 ${className}`}>
      {children}
    </div>
  );
}
