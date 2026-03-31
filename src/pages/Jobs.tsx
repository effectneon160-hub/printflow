import React, { useState } from 'react';
import { Search, Plus, Calendar, X, Palette } from 'lucide-react';
import { useStore, Job, JobStatus } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { StatusBadge } from '../components/StatusBadge';
import { useNavigate } from 'react-router-dom';
const COLUMNS: JobStatus[] = [
'Pending',
'In Design',
'Approved',
'In Production',
'Completed'];

const priorityColor = (p: string) =>
p === 'Rush' ?
'bg-rose-100 text-rose-700' :
p === 'High' ?
'bg-amber-100 text-amber-700' :
p === 'Medium' ?
'bg-blue-100 text-blue-700' :
'bg-slate-100 text-slate-600';
export function Jobs() {
  const { jobs, updateJob, customers, quotes } = useStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Job | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);
  const filtered = jobs.filter((j) => {
    const c = customers.find((x) => x.id === j.customerId);
    const s = search.toLowerCase();
    return (
      j.title.toLowerCase().includes(s) ||
      c?.company.toLowerCase().includes(s) ||
      j.id.toLowerCase().includes(s));

  });
  const onDragStart = (e: React.DragEvent, jobId: string) => {
    e.dataTransfer.setData('jobId', jobId);
    e.dataTransfer.effectAllowed = 'move';
  };
  const onDragOver = (e: React.DragEvent, col: string) => {
    e.preventDefault();
    setDragOverCol(col);
  };
  const onDragLeave = () => setDragOverCol(null);
  const onDrop = (e: React.DragEvent, status: JobStatus) => {
    e.preventDefault();
    setDragOverCol(null);
    const jobId = e.dataTransfer.getData('jobId');
    if (jobId)
    updateJob(jobId, {
      status
    });
  };
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Jobs Board</h1>
          <p className="text-slate-500 mt-1">
            Drag cards between columns to update status.
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
        {COLUMNS.map((col) => {
          const colJobs = filtered.filter((j) => j.status === col);
          return (
            <div
              key={col}
              className={`flex flex-col min-w-[280px] w-[280px] rounded-xl border transition-colors ${dragOverCol === col ? 'border-indigo-400 bg-indigo-50/30' : 'border-slate-200 bg-slate-50/50'}`}
              onDragOver={(e) => onDragOver(e, col)}
              onDragLeave={onDragLeave}
              onDrop={(e) => onDrop(e, col)}>
              
              <div className="p-3 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-xl">
                <h3 className="font-semibold text-slate-800 text-sm">{col}</h3>
                <span className="bg-slate-200 text-slate-700 text-xs font-medium px-2 py-0.5 rounded-full">
                  {colJobs.length}
                </span>
              </div>
              <div className="flex-1 p-2.5 space-y-2.5 overflow-y-auto min-h-[120px]">
                {colJobs.map((job) => {
                  const cust = customers.find((c) => c.id === job.customerId);
                  return (
                    <div
                      key={job.id}
                      draggable
                      onDragStart={(e) => onDragStart(e, job.id)}
                      onClick={() => setSelected(job)}
                      className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm cursor-grab active:cursor-grabbing hover:border-indigo-300 hover:shadow transition-all">
                      
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="text-[11px] font-medium text-slate-400">
                          {job.id}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${priorityColor(job.priority)}`}>
                          
                          {job.priority}
                        </span>
                      </div>
                      <h4 className="font-semibold text-slate-900 text-sm mb-1 line-clamp-2">
                        {job.title}
                      </h4>
                      <p className="text-xs text-slate-500 truncate mb-3">
                        {cust?.company}
                      </p>
                      <div className="flex items-center justify-between text-xs text-slate-400 pt-2.5 border-t border-slate-100">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(job.dueDate).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-[10px]">
                          {job.assignedTo.charAt(0)}
                        </div>
                      </div>
                    </div>);

                })}
              </div>
            </div>);

        })}
      </div>

      <AnimatePresence>
        {selected &&
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
          onClick={() => setSelected(null)}>
          
            <motion.div
            initial={{
              opacity: 0,
              scale: 0.95
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            exit={{
              opacity: 0,
              scale: 0.95
            }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}>
            
              <div className="flex justify-between items-center p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-slate-900">
                    {selected.id}
                  </h2>
                  <StatusBadge status={selected.status} />
                </div>
                <button
                onClick={() => setSelected(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full">
                
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">
                    {selected.title}
                  </h1>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                    <span>
                      {
                    customers.find((c) => c.id === selected.customerId)?.
                    company
                    }
                    </span>
                    <span>
                      Due: {new Date(selected.dueDate).toLocaleDateString()}
                    </span>
                    <span>Quote: {selected.quoteId}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-sm">
                    <h3 className="font-medium text-slate-900">Details</h3>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Priority</span>
                      <span
                      className={`font-medium px-2 py-0.5 rounded text-xs ${priorityColor(selected.priority)}`}>
                      
                        {selected.priority}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Assigned</span>
                      <span className="font-medium text-slate-900">
                        {selected.assignedTo}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Created</span>
                      <span className="text-slate-900">
                        {new Date(selected.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h3 className="font-medium text-slate-900 mb-2 text-sm">
                      Notes
                    </h3>
                    <p className="text-sm text-slate-600">
                      {selected.notes || 'No notes.'}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-slate-900 mb-3 text-sm">
                    Linked Quote Items
                  </h3>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-2 text-left">Item</th>
                          <th className="px-4 py-2 text-right">Qty</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {quotes.
                      find((q) => q.id === selected.quoteId)?.
                      items.map((item) =>
                      <tr key={item.id}>
                              <td className="px-4 py-2.5 text-slate-900">
                                {item.description}
                              </td>
                              <td className="px-4 py-2.5 text-right text-slate-600">
                                {item.quantity}
                              </td>
                            </tr>
                      ) ||
                      <tr>
                            <td
                          colSpan={2}
                          className="px-4 py-6 text-center text-slate-500">
                          
                              No linked quote found.
                            </td>
                          </tr>
                      }
                      </tbody>
                    </table>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/mockup/${selected.quoteId}`)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-xl text-sm font-medium transition-colors">
                  <Palette className="w-4 h-4" />
                  {quotes.find(q => q.id === selected.quoteId)?.mockupElements?.length
                    ? 'Edit Design Mockup'
                    : 'Create Design Mockup'}
                </button>
              </div>
            </motion.div>
          </div>
        }
      </AnimatePresence>
    </div>);

}