import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, Edit } from 'lucide-react';
import { useStore } from '../store/useStore';
import { StatusBadge } from '../components/StatusBadge';
export function CustomerDetail() {
  const { id } = useParams<{
    id: string;
  }>();
  const { customers, quotes, jobs, invoices } = useStore();
  const [tab, setTab] = useState<'overview' | 'quotes' | 'jobs' | 'invoices'>(
    'overview'
  );
  const customer = customers.find((c) => c.id === id);
  const cQuotes = quotes.filter((q) => q.customerId === id);
  const cJobs = jobs.filter((j) => j.customerId === id);
  const cInvoices = invoices.filter((i) => i.customerId === id);
  if (!customer)
  return (
    <div className="p-8 text-center text-slate-500">Customer not found.</div>);

  const tabs = [
  {
    id: 'overview',
    name: 'Overview'
  },
  {
    id: 'quotes',
    name: 'Quotes',
    count: cQuotes.length
  },
  {
    id: 'jobs',
    name: 'Jobs',
    count: cJobs.length
  },
  {
    id: 'invoices',
    name: 'Invoices',
    count: cInvoices.length
  }] as
  const;
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100">
              <Building2 className="w-7 h-7 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {customer.company}
              </h1>
              <p className="text-slate-500">{customer.name}</p>
            </div>
          </div>
          <button className="inline-flex items-center px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-5 border-t border-slate-100 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-slate-400" />
            {customer.email}
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-slate-400" />
            {customer.phone}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400" />
            San Francisco, CA
          </div>
        </div>
      </div>

      <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
          {tabs.map((t) =>
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`whitespace-nowrap py-3 px-1 border-b-2 text-sm font-medium flex items-center gap-2 ${tab === t.id ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
            
              {t.name}
              {'count' in t &&
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${tab === t.id ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
              
                  {t.count}
                </span>
            }
            </button>
          )}
        </nav>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 min-h-[300px]">
        {tab === 'overview' &&
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-sm text-slate-500 mb-1">Lifetime Value</p>
              <p className="text-3xl font-bold text-slate-900">
                ${customer.totalSpent.toLocaleString()}
              </p>
            </div>
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-sm text-slate-500 mb-1">Total Orders</p>
              <p className="text-3xl font-bold text-slate-900">
                {customer.totalOrders}
              </p>
            </div>
          </div>
        }
        {tab === 'quotes' &&
        <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cQuotes.map((q) =>
            <tr key={q.id} className="hover:bg-slate-50">
                  <td className="px-6 py-3.5 font-medium text-slate-900">
                    {q.id}
                  </td>
                  <td className="px-6 py-3.5 text-slate-500">
                    {new Date(q.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3.5 font-medium">
                    ${q.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-3.5">
                    <StatusBadge status={q.status} />
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <Link
                  to={`/quotes/${q.id}`}
                  className="text-indigo-600 hover:text-indigo-800 font-medium">
                  
                      View
                    </Link>
                  </td>
                </tr>
            )}
              {cQuotes.length === 0 &&
            <tr>
                  <td
                colSpan={5}
                className="px-6 py-12 text-center text-slate-500">
                
                    No quotes yet.
                  </td>
                </tr>
            }
            </tbody>
          </table>
        }
        {tab === 'jobs' &&
        <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cJobs.map((j) =>
            <tr key={j.id} className="hover:bg-slate-50">
                  <td className="px-6 py-3.5 font-medium text-slate-900">
                    {j.id}
                  </td>
                  <td className="px-6 py-3.5 text-slate-700">{j.title}</td>
                  <td className="px-6 py-3.5">
                    <StatusBadge status={j.status} />
                  </td>
                  <td className="px-6 py-3.5 text-slate-500">
                    {new Date(j.dueDate).toLocaleDateString()}
                  </td>
                </tr>
            )}
              {cJobs.length === 0 &&
            <tr>
                  <td
                colSpan={4}
                className="px-6 py-12 text-center text-slate-500">
                
                    No jobs yet.
                  </td>
                </tr>
            }
            </tbody>
          </table>
        }
        {tab === 'invoices' &&
        <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cInvoices.map((inv) =>
            <tr key={inv.id} className="hover:bg-slate-50">
                  <td className="px-6 py-3.5 font-medium text-slate-900">
                    {inv.id}
                  </td>
                  <td className="px-6 py-3.5 font-medium">
                    ${inv.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-3.5">
                    <StatusBadge status={inv.status} />
                  </td>
                  <td className="px-6 py-3.5 text-slate-500">
                    {new Date(inv.dueDate).toLocaleDateString()}
                  </td>
                </tr>
            )}
              {cInvoices.length === 0 &&
            <tr>
                  <td
                colSpan={4}
                className="px-6 py-12 text-center text-slate-500">
                
                    No invoices yet.
                  </td>
                </tr>
            }
            </tbody>
          </table>
        }
      </div>
    </div>);

}