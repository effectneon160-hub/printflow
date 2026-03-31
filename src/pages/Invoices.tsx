import React, { useState } from 'react';
import {
  Search,
  Download,
  Mail,
  CreditCard,
  CheckCircle2,
  X,
  DollarSign } from
'lucide-react';
import { useStore, Invoice, InvoiceStatus } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { StatusBadge } from '../components/StatusBadge';
export function Invoices() {
  const { invoices, customers, updateInvoice } = useStore();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'All' | InvoiceStatus>('All');
  const [selected, setSelected] = useState<Invoice | null>(null);
  const [showPay, setShowPay] = useState(false);
  const [payAmt, setPayAmt] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const tabs: ('All' | InvoiceStatus)[] = [
  'All',
  'Unpaid',
  'Partial',
  'Paid',
  'Overdue'];

  const filtered = invoices.filter((inv) => {
    const c = customers.find((x) => x.id === inv.customerId);
    const matchSearch =
    inv.id.toLowerCase().includes(search.toLowerCase()) ||
    c?.company.toLowerCase().includes(search.toLowerCase());
    return matchSearch && (tab === 'All' || inv.status === tab);
  });
  const outstanding = invoices.
  filter((i) => i.status !== 'Paid').
  reduce((s, i) => s + (i.total - i.amountPaid), 0);
  const overdue = invoices.
  filter((i) => i.status === 'Overdue').
  reduce((s, i) => s + (i.total - i.amountPaid), 0);
  const collected = invoices.reduce((s, i) => s + i.amountPaid, 0);
  const openPay = (inv: Invoice) => {
    setSelected(inv);
    setPayAmt(inv.total - inv.amountPaid);
    setShowPay(true);
    setSuccess(false);
  };
  const processPay = () => {
    if (!selected) return;
    setProcessing(true);
    setTimeout(() => {
      const newPaid = selected.amountPaid + payAmt;
      const newStatus: InvoiceStatus =
      newPaid >= selected.total ? 'Paid' : 'Partial';
      updateInvoice(selected.id, {
        amountPaid: newPaid,
        status: newStatus
      });
      setSelected({
        ...selected,
        amountPaid: newPaid,
        status: newStatus
      });
      setProcessing(false);
      setSuccess(true);
      setTimeout(() => setShowPay(false), 2000);
    }, 1500);
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Invoices</h1>
          <p className="text-slate-500 mt-1">
            Manage billing and collect payments.
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search invoices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-indigo-50 rounded-lg">
              <DollarSign className="w-4 h-4 text-indigo-600" />
            </div>
            <span className="text-sm text-slate-500">Outstanding</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            $
            {outstanding.toLocaleString(undefined, {
              minimumFractionDigits: 2
            })}
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-rose-200 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-rose-50 rounded-lg">
              <DollarSign className="w-4 h-4 text-rose-600" />
            </div>
            <span className="text-sm text-slate-500">Overdue</span>
          </div>
          <p className="text-2xl font-bold text-rose-600">
            $
            {overdue.toLocaleString(undefined, {
              minimumFractionDigits: 2
            })}
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-emerald-50 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-sm text-slate-500">Collected</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            $
            {collected.toLocaleString(undefined, {
              minimumFractionDigits: 2
            })}
          </p>
        </div>
      </div>

      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-6 overflow-x-auto hide-scrollbar">
          {tabs.map((t) =>
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`whitespace-nowrap py-3 px-1 border-b-2 text-sm font-medium ${tab === t ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
            
              {t}
              <span
              className={`ml-2 py-0.5 px-2 rounded-full text-xs ${tab === t ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
              
                {t === 'All' ?
              invoices.length :
              invoices.filter((i) => i.status === t).length}
              </span>
            </button>
          )}
        </nav>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-3">Invoice</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Balance</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Due</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((inv) => {
              const c = customers.find((x) => x.id === inv.customerId);
              const bal = inv.total - inv.amountPaid;
              return (
                <tr
                  key={inv.id}
                  className={`hover:bg-slate-50 transition-colors cursor-pointer ${inv.status === 'Overdue' ? 'bg-rose-50/30' : ''}`}
                  onClick={() => {
                    setSelected(inv);
                    setShowPay(false);
                    setSuccess(false);
                  }}>
                  
                  <td className="px-6 py-3.5 font-medium text-indigo-600">
                    {inv.id}
                  </td>
                  <td className="px-6 py-3.5 text-slate-900 font-medium">
                    {c?.company}
                    <div className="text-xs text-slate-500 font-normal mt-0.5">
                      Job: {inv.jobId}
                    </div>
                  </td>
                  <td className="px-6 py-3.5">${inv.total.toFixed(2)}</td>
                  <td className="px-6 py-3.5 font-medium">${bal.toFixed(2)}</td>
                  <td className="px-6 py-3.5">
                    <StatusBadge status={inv.status} />
                  </td>
                  <td
                    className={`px-6 py-3.5 ${inv.status === 'Overdue' ? 'text-rose-600 font-medium' : 'text-slate-500'}`}>
                    
                    {new Date(inv.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    {bal > 0 ?
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openPay(inv);
                      }}
                      className="text-indigo-600 hover:text-indigo-800 font-medium text-sm bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md">
                      
                        Pay Now
                      </button> :

                    <span className="text-slate-400 text-sm">Paid</span>
                    }
                  </td>
                </tr>);

            })}
            {filtered.length === 0 &&
            <tr>
                <td
                colSpan={7}
                className="px-6 py-12 text-center text-slate-500">
                
                  No invoices found.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      {/* Invoice Detail */}
      <AnimatePresence>
        {selected && !showPay &&
        <div
          className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
          onClick={() => setSelected(null)}>
          
            <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              y: 20
            }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}>
            
              <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
                <div className="flex gap-2">
                  <button className="inline-flex items-center px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm">
                    <Download className="w-4 h-4 mr-1.5" />
                    PDF
                  </button>
                  <button className="inline-flex items-center px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm">
                    <Mail className="w-4 h-4 mr-1.5" />
                    Send
                  </button>
                </div>
                <button
                onClick={() => setSelected(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full">
                
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8 overflow-y-auto flex-1">
                <div className="max-w-2xl mx-auto">
                  <div className="flex justify-between items-start mb-10">
                    <div>
                      <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                        INVOICE
                      </h1>
                      <p className="text-slate-500 mt-1">{selected.id}</p>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={selected.status} />
                      <p className="text-sm text-slate-500 mt-2">
                        Due: {new Date(selected.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-10 mb-10">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        From
                      </p>
                      <p className="font-semibold text-slate-900">
                        PrintFlow Inc.
                      </p>
                      <p className="text-slate-600 text-sm mt-1">
                        123 Production Way, Austin TX 78701
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        Billed To
                      </p>
                      <p className="font-semibold text-slate-900">
                        {
                      customers.find((c) => c.id === selected.customerId)?.
                      company
                      }
                      </p>
                      <p className="text-slate-600 text-sm mt-1">
                        {
                      customers.find((c) => c.id === selected.customerId)?.
                      email
                      }
                      </p>
                    </div>
                  </div>
                  <table className="w-full text-sm mb-6">
                    <thead className="border-b-2 border-slate-900 font-semibold text-slate-900">
                      <tr>
                        <th className="py-2 text-left">Description</th>
                        <th className="py-2 text-right">Qty</th>
                        <th className="py-2 text-right">Price</th>
                        <th className="py-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {selected.items.map((item, i) =>
                    <tr key={i}>
                          <td className="py-3">{item.description}</td>
                          <td className="py-3 text-right text-slate-600">
                            {item.quantity}
                          </td>
                          <td className="py-3 text-right text-slate-600">
                            ${item.unitPrice.toFixed(2)}
                          </td>
                          <td className="py-3 text-right font-medium">
                            ${item.total.toFixed(2)}
                          </td>
                        </tr>
                    )}
                    </tbody>
                  </table>
                  <div className="flex justify-end">
                    <div className="w-64 space-y-2 text-sm">
                      <div className="flex justify-between text-slate-600">
                        <span>Subtotal</span>
                        <span>${selected.subtotal.toFixed(2)}</span>
                      </div>
                      {selected.discount > 0 &&
                    <div className="flex justify-between text-slate-600">
                          <span>Discount</span>
                          <span>-${selected.discount.toFixed(2)}</span>
                        </div>
                    }
                      <div className="flex justify-between text-slate-600">
                        <span>Tax</span>
                        <span>${selected.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t-2 border-slate-900 pt-2">
                        <span>Total</span>
                        <span>${selected.total.toFixed(2)}</span>
                      </div>
                      <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-slate-500">Paid</span>
                          <span className="font-medium text-emerald-600">
                            ${selected.amountPaid.toFixed(2)}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2">
                          <div
                          className="bg-emerald-500 h-1.5 rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, selected.amountPaid / selected.total * 100)}%`
                          }} />
                        
                        </div>
                        <div className="flex justify-between font-bold">
                          <span>Balance</span>
                          <span className="text-rose-600">
                            ${(selected.total - selected.amountPaid).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {selected.total > selected.amountPaid &&
            <div className="p-5 border-t border-slate-100 flex justify-end">
                  <button
                onClick={() => openPay(selected)}
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 shadow-sm flex items-center">
                
                    <CreditCard className="w-4 h-4 mr-2" />
                    Record Payment
                  </button>
                </div>
            }
            </motion.div>
          </div>
        }
      </AnimatePresence>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPay && selected &&
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
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
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            
              {success ?
            <div className="p-8 text-center">
                  <motion.div
                initial={{
                  scale: 0
                }}
                animate={{
                  scale: 1
                }}
                className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
                
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Payment Successful!
                  </h2>
                  <p className="text-slate-500">
                    ${payAmt.toFixed(2)} applied to {selected.id}.
                  </p>
                </div> :

            <>
                  <div className="flex justify-between items-center p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">
                      Record Payment
                    </h2>
                    <button
                  onClick={() => setShowPay(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full">
                  
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-6 space-y-5">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between">
                      <div>
                        <p className="text-sm text-slate-500">Invoice</p>
                        <p className="font-semibold text-slate-900">
                          {selected.id}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-500">Balance</p>
                        <p className="font-bold text-rose-600">
                          ${(selected.total - selected.amountPaid).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Amount
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                      type="number"
                      min="0.01"
                      max={selected.total - selected.amountPaid}
                      step="0.01"
                      value={payAmt}
                      onChange={(e) => setPayAmt(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 text-lg font-semibold border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Method
                      </label>
                      <select className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                        <option>Credit Card (Stripe)</option>
                        <option>Bank Transfer</option>
                        <option>Check</option>
                        <option>Cash</option>
                      </select>
                    </div>
                    <button
                  onClick={processPay}
                  disabled={processing || payAmt <= 0}
                  className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 flex justify-center items-center">
                  
                      {processing ?
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> :

                  `Process $${payAmt.toFixed(2)}`
                  }
                    </button>
                  </div>
                </>
            }
            </motion.div>
          </div>
        }
      </AnimatePresence>
    </div>);

}