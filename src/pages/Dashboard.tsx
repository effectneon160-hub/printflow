import React from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  Briefcase,
  Clock,
  FileText,
  Plus,
  UserPlus } from
'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { KPICard } from '../components/KPICard';
import { StatusBadge } from '../components/StatusBadge';
export function Dashboard() {
  const { quotes, activities, customers, jobs, invoices } = useStore();
  const totalRevenue = invoices.
  filter((i) => i.status === 'Paid').
  reduce((s, i) => s + i.total, 0);
  const activeJobs = jobs.filter((j) => j.status !== 'Completed').length;
  const pendingApprovals = quotes.filter((q) => q.status === 'Sent').length;
  const unpaidInvoices = invoices.filter(
    (i) => i.status === 'Unpaid' || i.status === 'Overdue'
  ).length;
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">
            Welcome back. Here's what's happening today.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/customers"
            className="inline-flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            
            <UserPlus className="w-4 h-4 mr-2" />
            Add Customer
          </Link>
          <Link
            to="/quotes/new"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
            
            <Plus className="w-4 h-4 mr-2" />
            Create Quote
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <KPICard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend={{
            value: 12.5,
            isPositive: true
          }} />
        
        <KPICard title="Active Jobs" value={activeJobs} icon={Briefcase} />
        <KPICard
          title="Pending Approvals"
          value={pendingApprovals}
          icon={Clock} />
        
        <KPICard
          title="Unpaid Invoices"
          value={unpaidInvoices}
          icon={FileText}
          trend={{
            value: 2.4,
            isPositive: false
          }} />
        
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h2 className="font-semibold text-slate-900">Recent Quotes</h2>
              <Link
                to="/quotes"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                
                View all
              </Link>
            </div>
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Quote</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quotes.slice(0, 5).map((q) => {
                  const c = customers.find((x) => x.id === q.customerId);
                  return (
                    <tr
                      key={q.id}
                      className="hover:bg-slate-50 transition-colors">
                      
                      <td className="px-6 py-3.5 font-medium text-slate-900">
                        <Link
                          to={`/quotes/${q.id}`}
                          className="hover:text-indigo-600">
                          
                          {q.id}
                        </Link>
                      </td>
                      <td className="px-6 py-3.5 text-slate-600">
                        {c?.company}
                      </td>
                      <td className="px-6 py-3.5 font-medium text-slate-900">
                        ${q.total.toLocaleString()}
                      </td>
                      <td className="px-6 py-3.5">
                        <StatusBadge status={q.status} />
                      </td>
                      <td className="px-6 py-3.5 text-slate-500">
                        {new Date(q.createdAt).toLocaleDateString()}
                      </td>
                    </tr>);

                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-5">Recent Activity</h2>
          <div className="space-y-5">
            {activities.slice(0, 6).map((a, i) =>
            <motion.div
              key={a.id}
              initial={{
                opacity: 0,
                x: -8
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              transition={{
                delay: i * 0.08
              }}
              className="flex gap-3">
              
                <div className="relative shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 absolute top-1 left-1 z-10" />
                  <div className="w-4 h-4 rounded-full bg-indigo-100" />
                  {i < 5 &&
                <div className="absolute top-4 left-2 w-px h-full bg-slate-200 -ml-px" />
                }
                </div>
                <div>
                  <p className="text-sm text-slate-700 leading-snug">
                    {a.description}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(a.date).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>);

}