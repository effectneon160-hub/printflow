import React from 'react';
import { BoxIcon } from 'lucide-react';
interface KPICardProps {
  title: string;
  value: string | number;
  icon: BoxIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}
export function KPICard({ title, value, icon: Icon, trend }: KPICardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className="p-2 bg-indigo-50 rounded-lg">
          <Icon className="w-4 h-4 text-indigo-600" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        {trend &&
        <span
          className={`text-sm font-medium ${trend.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
          
            {trend.isPositive ? '+' : '-'}
            {Math.abs(trend.value)}%
          </span>
        }
      </div>
    </div>);

}