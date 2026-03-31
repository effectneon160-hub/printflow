import React from 'react';
export function PlaceholderPage({ title }: {title: string;}) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
        <span className="text-2xl">🚧</span>
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">{title}</h1>
      <p className="text-slate-500 max-w-md">This module is coming soon.</p>
    </div>);

}
export const Reports = () => <PlaceholderPage title="Reports & Analytics" />;
export const Settings = () => <PlaceholderPage title="Settings" />;