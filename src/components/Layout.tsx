import React from 'react';
import { Sidebar } from './Sidebar';
import { useLocation } from 'react-router-dom';
export function Layout({ children }: {children: React.ReactNode;}) {
  const location = useLocation();
  const isFullScreen = location.pathname.startsWith('/mockup');
  if (isFullScreen) return <>{children}</>;
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-8 py-8">{children}</div>
      </main>
    </div>);

}