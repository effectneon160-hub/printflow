import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Plus,
  Trash2,
  Save,
  Send,
  Image as ImageIcon,
  ArrowLeft } from
'lucide-react';
import { useStore, QuoteItem, QuoteStatus } from '../store/useStore';
export function QuoteBuilder() {
  const { id } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const { customers, quotes, addQuote, updateQuote } = useStore();
  const isEditing = Boolean(id && id !== 'new');
  const existing = isEditing ? quotes.find((q) => q.id === id) : null;
  const [customerId, setCustomerId] = useState(existing?.customerId || '');
  const [items, setItems] = useState<QuoteItem[]>(
    existing?.items || [
    {
      id: 'new_1',
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    }]

  );
  const [notes, setNotes] = useState(existing?.notes || '');
  const [discount, setDiscount] = useState(existing?.discount || 0);
  const taxRate = 8;
  const subtotal = items.reduce((s, i) => s + i.total, 0);
  const tax = (subtotal - discount) * (taxRate / 100);
  const total = subtotal - discount + tax;
  const updateItem = (
  idx: number,
  field: keyof QuoteItem,
  val: string | number) =>
  {
    const next = [...items];
    const item = {
      ...next[idx],
      [field]: val
    };
    if (field === 'quantity' || field === 'unitPrice')
    item.total = Number(item.quantity) * Number(item.unitPrice);
    next[idx] = item as QuoteItem;
    setItems(next);
  };
  const handleSave = (status: QuoteStatus) => {
    if (!customerId) {
      alert('Please select a customer');
      return;
    }
    const data = {
      customerId,
      status,
      items,
      subtotal,
      tax,
      discount,
      total,
      notes
    };
    if (isEditing && id) updateQuote(id, data);else
    addQuote(data);
    navigate('/quotes');
  };
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-500">
          
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isEditing ? `Edit Quote ${id}` : 'Create New Quote'}
          </h1>
          <p className="text-slate-500 mt-1">
            Build a quote and send it to your customer.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Customer */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">
              Customer Details
            </h2>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Select Customer *
            </label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              
              <option value="">-- Select a customer --</option>
              {customers.map((c) =>
              <option key={c.id} value={c.id}>
                  {c.company} ({c.name})
                </option>
              )}
            </select>
          </div>

          {/* Line Items */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Line Items</h2>
            <div className="hidden md:grid grid-cols-12 gap-4 text-sm font-medium text-slate-500 px-2 mb-2">
              <div className="col-span-6">Description</div>
              <div className="col-span-2 text-right">Qty</div>
              <div className="col-span-2 text-right">Price</div>
              <div className="col-span-2 text-right">Total</div>
            </div>
            <div className="space-y-3">
              {items.map((item, idx) =>
              <div
                key={item.id}
                className="grid grid-cols-12 gap-3 items-center">
                
                  <div className="col-span-12 md:col-span-6">
                    <input
                    type="text"
                    placeholder="Product description..."
                    value={item.description}
                    onChange={(e) =>
                    updateItem(idx, 'description', e.target.value)
                    }
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  
                  </div>
                  <div className="col-span-4 md:col-span-2">
                    <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                    updateItem(idx, 'quantity', Number(e.target.value))
                    }
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  
                  </div>
                  <div className="col-span-4 md:col-span-2">
                    <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) =>
                    updateItem(idx, 'unitPrice', Number(e.target.value))
                    }
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  
                  </div>
                  <div className="col-span-4 md:col-span-2 flex items-center justify-end gap-2">
                    <span className="font-medium text-slate-900 text-sm">
                      ${item.total.toFixed(2)}
                    </span>
                    <button
                    onClick={() =>
                    items.length > 1 &&
                    setItems(items.filter((_, i) => i !== idx))
                    }
                    className="text-slate-400 hover:text-rose-500 p-1">
                    
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() =>
              setItems([
              ...items,
              {
                id: `new_${Date.now()}`,
                description: '',
                quantity: 1,
                unitPrice: 0,
                total: 0
              }]
              )
              }
              className="mt-4 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700">
              
              <Plus className="w-4 h-4 mr-1" /> Add Line Item
            </button>
          </div>

          {/* Notes & Mockup */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <h2 className="font-semibold text-slate-900">
              Notes & Attachments
            </h2>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add terms, turnaround time, or special instructions..."
              className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            
            <div
              onClick={() => {
                if (!isEditing) {
                  alert('Save the quote first.');
                  return;
                }
                navigate(`/mockup/${id}`);
              }}
              className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
              
              <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-3 group-hover:text-indigo-500 transition-colors" />
              <p className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">
                {existing?.notes?.includes('[Mockup Attached]') ?
                'Edit Design Mockup' :
                'Create Design Mockup'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Open the interactive canvas editor
              </p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-24 space-y-4">
            <h2 className="font-semibold text-slate-900">Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Discount</span>
                <div className="flex items-center w-24">
                  <span className="mr-1">$</span>
                  <input
                    type="number"
                    min="0"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded px-2 py-1 text-right focus:outline-none focus:border-indigo-500" />
                  
                </div>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax ({taxRate}%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between font-bold text-lg text-slate-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <div className="pt-4 space-y-3">
              <button
                onClick={() => handleSave('Sent')}
                className="w-full flex items-center justify-center px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm">
                
                <Send className="w-4 h-4 mr-2" />
                Save & Send Quote
              </button>
              {(!isEditing || existing?.status === 'Draft') &&
              <button
                onClick={() => handleSave('Draft')}
                className="w-full flex items-center justify-center px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors">
                
                  <Save className="w-4 h-4 mr-2" />
                  Save as Draft
                </button>
              }
            </div>
          </div>
        </div>
      </div>
    </div>);

}