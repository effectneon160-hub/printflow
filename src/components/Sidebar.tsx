import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  Briefcase,
  FileSpreadsheet,
  Package,
  BarChart,
  Settings,
  Printer } from
'lucide-react';
const nav = [
{
  name: 'Dashboard',
  path: '/',
  icon: LayoutDashboard
},
{
  name: 'Customers',
  path: '/customers',
  icon: Users
},
{
  name: 'Quotes',
  path: '/quotes',
  icon: FileText
},
{
  name: 'Jobs',
  path: '/jobs',
  icon: Briefcase
},
{
  name: 'Invoices',
  path: '/invoices',
  icon: FileSpreadsheet
},
{
  name: 'Products',
  path: '/products',
  icon: Package
},
{
  name: 'Reports',
  path: '/reports',
  icon: BarChart
}];

export function Sidebar() {
  return (
    <div className="w-60 bg-slate-950 text-slate-300 flex flex-col h-screen sticky top-0 shrink-0 border-r border-slate-800">
      <div className="h-14 flex items-center px-5 border-b border-slate-800 gap-2.5">
        <Printer className="w-6 h-6 text-indigo-500" />
        <span className="text-white font-bold text-lg tracking-tight">
          PrintFlow
        </span>
      </div>
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3 px-2">
          Menu
        </p>
        {nav.map((i) =>
        <NavLink
          key={i.path}
          to={i.path}
          end={i.path === '/'}
          className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive ? 'bg-indigo-500/10 text-indigo-400' : 'hover:bg-slate-900 hover:text-white'}`
          }>
          
            <i.icon className="w-[18px] h-[18px]" />
            {i.name}
          </NavLink>
        )}
      </nav>
      <div className="p-3 border-t border-slate-800 space-y-1">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive ? 'bg-indigo-500/10 text-indigo-400' : 'hover:bg-slate-900 hover:text-white'}`
          }>
          
          <Settings className="w-[18px] h-[18px]" />
          Settings
        </NavLink>
        <div className="flex items-center gap-3 px-3 py-2 mt-2">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
            JD
          </div>
          <div>
            <p className="text-sm font-medium text-white">John Doe</p>
            <p className="text-[11px] text-slate-500">Admin</p>
          </div>
        </div>
      </div>
    </div>);

}