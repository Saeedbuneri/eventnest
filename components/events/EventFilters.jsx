'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X } from 'lucide-react';
import { EVENT_CATEGORIES, EVENT_SORT_OPTIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function EventFilters({ className }) {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [price,    setPrice]    = useState(searchParams.get('price') || '');
  const [sort,     setSort]     = useState(searchParams.get('sort') || 'date-asc');

  const applyFilters = (overrides = {}) => {
    const params = new URLSearchParams(searchParams.toString());
    const merged = { category, price, sort, ...overrides };

    Object.entries(merged).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else   params.delete(k);
    });
    router.push(`/events?${params.toString()}`);
  };

  const handleCategory = (id) => {
    const next = category === id ? '' : id;
    setCategory(next);
    applyFilters({ category: next });
  };

  const handlePrice = (val) => {
    const next = price === val ? '' : val;
    setPrice(next);
    applyFilters({ price: next });
  };

  const handleSort = (val) => {
    setSort(val);
    applyFilters({ sort: val });
  };

  const clearAll = () => {
    setCategory(''); setPrice(''); setSort('date-asc');
    router.push('/events');
  };

  const hasFilters = category || price;

  return (
    <aside className={cn('w-full', className)}>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-gray-900">
            <SlidersHorizontal className="w-4 h-4 text-brand-600" />
            Filters
          </div>
          {hasFilters && (
            <button onClick={clearAll} className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1">
              <X className="w-3.5 h-3.5" /> Clear all
            </button>
          )}
        </div>

        {/* Sort */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Sort By</h3>
          <div className="space-y-1.5">
            {EVENT_SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSort(opt.value)}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                  sort === opt.value
                    ? 'bg-brand-50 text-brand-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Category</h3>
          <div className="flex flex-col gap-1.5">
            {EVENT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategory(cat.id)}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors w-full text-left',
                  category === cat.id
                    ? 'bg-brand-50 text-brand-700 font-medium ring-1 ring-brand-200'
                    : 'text-gray-600 hover:bg-gray-50'
                )}
              >
                <span className="text-base">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Price</h3>
          {[
            { value: 'free',   label: 'Free' },
            { value: 'paid',   label: 'Paid' },
            { value: 'under25',label: 'Under $25' },
            { value: 'under50',label: 'Under $50' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => handlePrice(opt.value)}
              className={cn(
                'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors mb-1',
                price === opt.value
                  ? 'bg-brand-50 text-brand-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
