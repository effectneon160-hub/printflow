import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Building2, Mail, Phone } from 'lucide-react';
import { useStore } from '../store/useStore';
export function Customers() {
  const { customers } = useStore();
  const [search, setSearch] = useState('');
  const filtered = customers.filter(
    (c) =>
    c.company.toLowerCase().includes(search.toLowerCase()) ||
    c.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
          <p className="text-slate-500 mt-1">
            Manage your clients and their details.
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            
          </div>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-3">Company / Contact</th>
              <th className="px-6 py-3">Contact Info</th>
              <th className="px-6 py-3 text-right">Orders</th>
              <th className="px-6 py-3 text-right">Total Spent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((c) =>
            <tr
              key={c.id}
              className="hover:bg-slate-50 transition-colors group">
              
                <td className="px-6 py-4">
                  <Link to={`/customers/${c.id}`} className="block">
                    <div className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      {c.company}
                    </div>
                    <div className="text-slate-500 mt-0.5 ml-6">{c.name}</div>
                  </Link>
                </td>
                <td className="px-6 py-4 text-slate-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {c.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {c.phone}
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-medium text-slate-700">
                  {c.totalOrders}
                </td>
                <td className="px-6 py-4 text-right font-medium text-slate-900">
                  ${c.totalSpent.toLocaleString()}
                </td>
              </tr>
            )}
            {filtered.length === 0 &&
            <tr>
                <td
                colSpan={4}
                className="px-6 py-12 text-center text-slate-500">
                
                  No customers found.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>);

}