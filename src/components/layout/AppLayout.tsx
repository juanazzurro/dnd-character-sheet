import { Outlet } from 'react-router-dom';
import { TopNav } from './TopNav';

export function AppLayout() {
  return (
    <div className="flex flex-col h-screen" style={{ background: '#0f0f1a' }}>
      <TopNav />
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
