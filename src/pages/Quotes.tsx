import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Filter } from 'lucide-react';
import { useStore } from '../store/useStore';
import { StatusBadge } from '../components/StatusBadge';
export function Quotes() {
  const { quotes, customers } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const filtered = quotes.filter((q) => {
    const c = customers.find((x) => x.id === q.customerId);
    const matchSearch =
    q.id.toLowerCase().includes(search.toLowerCase()) ||
    c?.company.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || q.status === statusFilter;
    return matchSearch && matchStatus;
  });
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quotes</h1>
          <p className="text-slate-500 mt-1">
            Create and manage customer quotes.
          </p>
        </div>
        <Link
          to="/quotes/new"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
          
          <Plus className="w-4 h-4 mr-2" />
          New Quote
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-3 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search quotes or customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-300 rounded-lg text-sm py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              
              <option value="All">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Sent">Sent</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-3">Quote</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Items</th>
              <th className="px-6 py-3 text-right">Total</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((q) => {
              const c = customers.find((x) => x.id === q.customerId);
              return (
                <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3.5 font-medium text-slate-900">
                    <Link
                      to={`/quotes/${q.id}`}
                      className="hover:text-indigo-600">
                      
                      {q.id}
                    </Link>
                  </td>
                  <td className="px-6 py-3.5">
                    <Link
                      to={`/customers/${c?.id}`}
                      className="text-slate-900 hover:text-indigo-600 font-medium">
                      
                      {c?.company}
                    </Link>
                  </td>
                  <td className="px-6 py-3.5 text-slate-600">
                    {q.items.length} product{q.items.length !== 1 ? 's' : ''}
                  </td>
                  <td className="px-6 py-3.5 text-right font-medium text-slate-900">
                    $
                    {q.total.toLocaleString(undefined, {
                      minimumFractionDigits: 2
                    })}
                  </td>
                  <td className="px-6 py-3.5">
                    <StatusBadge status={q.status} />
                  </td>
                  <td className="px-6 py-3.5 text-slate-500">
                    {new Date(q.createdAt).toLocaleDateString()}
                  </td>
                </tr>);

            })}
            {filtered.length === 0 &&
            <tr>
                <td
                colSpan={6}
                className="px-6 py-12 text-center text-slate-500">
                
                  No quotes found.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>);

}