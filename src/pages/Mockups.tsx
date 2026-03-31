import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Palette, Search, Edit2, Clock, Layers } from 'lucide-react';
import { useStore } from '../store/useStore';

const DEFAULT_BG = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80';

export function Mockups() {
  const { quotes, customers } = useStore();
  const [search, setSearch] = useState('');

  const withMockups = quotes.filter(q =>
    q.mockupElements && q.mockupElements.length > 0
  );

  const filtered = withMockups.filter(q => {
    const c = customers.find(x => x.id === q.customerId);
    const s = search.toLowerCase();
    return (
      q.id.toLowerCase().includes(s) ||
      c?.company.toLowerCase().includes(s) ||
      c?.name.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Design Mockups</h1>
          <p className="text-slate-500 mt-1">
            View and edit all saved garment mockups linked to quotes.
          </p>
        </div>
        <Link
          to="/quotes"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
          <Palette className="w-4 h-4 mr-2" />
          Go to Quotes
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by quote or customer..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Stats row */}
      <div className="flex gap-4">
        <div className="bg-white border border-slate-200 rounded-xl px-5 py-3 flex items-center gap-3">
          <Palette className="w-5 h-5 text-indigo-500" />
          <div>
            <p className="text-xl font-bold text-slate-900">{withMockups.length}</p>
            <p className="text-xs text-slate-500">Total Mockups</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl px-5 py-3 flex items-center gap-3">
          <Layers className="w-5 h-5 text-indigo-500" />
          <div>
            <p className="text-xl font-bold text-slate-900">
              {withMockups.reduce((sum, q) => sum + (q.mockupElements?.length ?? 0), 0)}
            </p>
            <p className="text-xs text-slate-500">Design Elements</p>
          </div>
        </div>
      </div>

      {/* Gallery */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-16 text-center">
          <Palette className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="font-medium text-slate-600 mb-1">
            {search ? 'No mockups match your search.' : 'No mockups saved yet.'}
          </p>
          <p className="text-sm text-slate-400 mb-5">
            {search ? 'Try a different search term.' : 'Open a quote and click "Create Design Mockup" to get started.'}
          </p>
          {!search && (
            <Link
              to="/quotes"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
              <Palette className="w-4 h-4 mr-2" />
              Browse Quotes
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(q => {
            const customer = customers.find(c => c.id === q.customerId);
            const elementCount = q.mockupElements?.length ?? 0;
            const bgUrl = q.mockupBackground || DEFAULT_BG;
            const hasUploadedImage = q.mockupElements?.some(e => e.type === 'image' && e.content?.startsWith('data:'));

            return (
              <div
                key={q.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group">

                {/* Thumbnail */}
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={bgUrl}
                    alt="Mockup background"
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay showing element count */}
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors" />
                  <div className="absolute top-2 right-2 bg-slate-900/70 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Layers className="w-3 h-3" />
                    {elementCount} element{elementCount !== 1 ? 's' : ''}
                  </div>
                  {hasUploadedImage && (
                    <div className="absolute top-2 left-2 bg-indigo-600/90 text-white text-[10px] px-2 py-0.5 rounded-full">
                      Custom Art
                    </div>
                  )}
                  {/* Floating edit button on hover */}
                  <Link
                    to={`/mockup/${q.id}`}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-white text-slate-900 font-semibold text-sm px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 hover:bg-indigo-50">
                      <Edit2 className="w-4 h-4" />
                      Open Editor
                    </span>
                  </Link>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-slate-900 text-sm">{q.id}</h3>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      q.status === 'Approved' ? 'bg-green-100 text-green-700' :
                      q.status === 'Sent' ? 'bg-amber-100 text-amber-700' :
                      q.status === 'Draft' ? 'bg-slate-100 text-slate-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {q.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 font-medium truncate">{customer?.company}</p>
                  <p className="text-xs text-slate-400 truncate">{customer?.name}</p>
                  <div className="flex items-center gap-1 mt-3 text-xs text-slate-400">
                    <Clock className="w-3 h-3" />
                    Updated {new Date(q.updatedAt).toLocaleDateString()}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Link
                      to={`/mockup/${q.id}`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                      <Edit2 className="w-3 h-3" />
                      Edit Mockup
                    </Link>
                    <Link
                      to={`/quotes/${q.id}`}
                      className="flex-1 flex items-center justify-center py-1.5 border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors">
                      View Quote
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
