import React, { useState } from 'react';
import { Search, Package, X } from 'lucide-react';
import { useStore, Product } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
export function Products() {
  const { products } = useStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState<Product | null>(null);
  const categories = [
  'All',
  ...Array.from(new Set(products.map((p) => p.category)))];

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || p.category === category;
    return matchSearch && matchCat;
  });
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Product Catalog</h1>
          <p className="text-slate-500 mt-1">
            Browse available products for quotes.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
        {categories.map((c) =>
        <button
          key={c}
          onClick={() => setCategory(c)}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${category === c ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
          
            {c}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((p) =>
        <div
          key={p.id}
          onClick={() => setSelected(p)}
          className="bg-white rounded-xl border border-slate-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow group">
          
            <div className="aspect-square bg-slate-100 overflow-hidden">
              <img
              src={p.image}
              alt={p.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            
            </div>
            <div className="p-4">
              <div className="text-xs font-medium text-indigo-600 mb-1">
                {p.category}
              </div>
              <h3 className="font-semibold text-slate-900 truncate">
                {p.name}
              </h3>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-lg font-bold text-slate-900">
                  ${p.basePrice.toFixed(2)}
                </span>
                <span className="text-xs text-slate-500">
                  {p.variants.length} variant
                  {p.variants.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {filtered.length === 0 &&
      <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No products found.</p>
        </div>
      }

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
            className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}>
            
              <div className="flex justify-between items-center p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">
                  Product Details
                </h2>
                <button
                onClick={() => setSelected(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full">
                
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="w-full md:w-1/2">
                    <div className="aspect-square rounded-xl overflow-hidden bg-slate-100">
                      <img
                      src={selected.image}
                      alt={selected.name}
                      className="w-full h-full object-cover" />
                    
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 space-y-5">
                    <div>
                      <div className="text-sm font-medium text-indigo-600 mb-1">
                        {selected.category}
                      </div>
                      <h1 className="text-2xl font-bold text-slate-900">
                        {selected.name}
                      </h1>
                      <p className="text-2xl font-bold text-slate-900 mt-2">
                        ${selected.basePrice.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-slate-900 mb-1">
                        Description
                      </h3>
                      <p className="text-slate-600 text-sm">
                        {selected.description}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-slate-900 mb-2">
                        Variants
                      </h3>
                      <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                            <tr>
                              <th className="px-4 py-2 text-left">Size</th>
                              <th className="px-4 py-2 text-left">Color</th>
                              <th className="px-4 py-2 text-left">SKU</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {selected.variants.map((v, i) =>
                          <tr key={i}>
                                <td className="px-4 py-2 font-medium">
                                  {v.size}
                                </td>
                                <td className="px-4 py-2 text-slate-600">
                                  {v.color}
                                </td>
                                <td className="px-4 py-2 text-slate-500 font-mono text-xs">
                                  {v.sku}
                                </td>
                              </tr>
                          )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        }
      </AnimatePresence>
    </div>);

}