import React from 'react';
interface StatusBadgeProps {
  status: string;
}
export function StatusBadge({ status }: StatusBadgeProps) {
  const s = status.toLowerCase();
  const styles =
  s === 'approved' || s === 'completed' || s === 'paid' ?
  'bg-emerald-50 text-emerald-700 border-emerald-200' :
  s === 'sent' || s === 'pending' || s === 'in design' || s === 'partial' ?
  'bg-amber-50 text-amber-700 border-amber-200' :
  s === 'in production' ?
  'bg-blue-50 text-blue-700 border-blue-200' :
  s === 'rejected' || s === 'overdue' ?
  'bg-rose-50 text-rose-700 border-rose-200' :
  s === 'rush' ?
  'bg-rose-50 text-rose-700 border-rose-200' :
  s === 'high' ?
  'bg-amber-50 text-amber-700 border-amber-200' :
  s === 'medium' ?
  'bg-blue-50 text-blue-700 border-blue-200' :
  s === 'low' ?
  'bg-slate-50 text-slate-600 border-slate-200' :
  'bg-slate-50 text-slate-600 border-slate-200';
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles}`}>
      
      {status}
    </span>);

}