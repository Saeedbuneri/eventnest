'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { EVENT_CATEGORIES, EVENT_SORT_OPTIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function EventFilters({ className }) {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [price,    setPrice]    = useState(searchParams.get('price') || '');
  const [sort,     setSort]     = useState(searchParams.get('sort') || 'date-asc');
  const [dateFrom, setDateFrom] = useState(searchParams.get('dateFrom') || '');
  const [dateTo,   setDateTo]   = useState(searchParams.get('dateTo') || '');

  const applyFilters = (overrides = {}) => {
    const params = new URLSearchParams(searchParams.toString());
    const merged = { category, price, sort, dateFrom, dateTo, ...overrides };
    Object.entries(merged).forEach(([k, v]) => { if (v) params.set(k, v); else params.delete(k); });
    router.push(`/events?${params.toString()}`);
  };

  const handleCategory = (id) => { const next = category === id ? '' : id; setCategory(next); applyFilters({ category: next }); };
  const handlePrice    = (val) => { const next = price === val ? '' : val; setPrice(next); applyFilters({ price: next }); };
  const handleSort     = (val) => { setSort(val); applyFilters({ sort: val }); };
  const clearAll = () => { setCategory(''); setPrice(''); setSort('date-asc'); setDateFrom(''); setDateTo(''); router.push('/events'); setMobileOpen(false); };

  const hasFilters = !!(category || price || dateFrom || dateTo);
  const activeCount = [category, price, dateFrom, dateTo].filter(Boolean).length;

  return (
    <aside className={cn('w-full', className)}>

      {/*  Mobile toggle button (hidden on lg+)  */}
      <button
        className="lg:hidden w-full flex items-center justify-between px-4 py-3.5 bg-[#111118] border border-white/[.07] rounded-xl text-white text-sm font-semibold mb-3 active:scale-[.98] transition-all"
        onClick={() => setMobileOpen((o) => !o)}
      >
        <span className="flex items-center gap-2.5">
          <SlidersHorizontal className="w-4 h-4 text-brand-400" />
          Filters
          {activeCount > 0 && (
            <span className="bg-brand-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </span>
        <ChevronDown className={cn('w-4 h-4 text-gray-500 transition-transform duration-300', mobileOpen && 'rotate-180')} />
      </button>

      {/*  Filter panel  */}
      <div className={cn(
        'bg-[#111118] rounded-2xl border border-white/[.07] p-5 space-y-6 sticky top-24',
        mobileOpen ? 'block' : 'hidden lg:block'
      )}>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-white text-sm">
            <SlidersHorizontal className="w-4 h-4 text-brand-400" />
            Filters
          </div>
          {hasFilters && (
            <button onClick={clearAll} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors">
              <X className="w-3.5 h-3.5" /> Clear all
            </button>
          )}
        </div>

        {/* Sort */}
        <div>
          <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-gray-600 mb-3">Sort By</h3>
          <div className="space-y-1">
            {EVENT_SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSort(opt.value)}
                className={cn(
                  'w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors font-medium',
                  sort === opt.value
                    ? 'bg-brand-600/15 text-brand-300 border border-brand-500/25'
                    : 'text-gray-500 hover:bg-white/[.05] hover:text-gray-300 border border-transparent'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div>
          <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-gray-600 mb-3">Category</h3>
          <div className="flex flex-col gap-1">
            {EVENT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategory(cat.id)}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors w-full text-left font-medium border',
                  category === cat.id
                    ? 'bg-brand-600/15 text-brand-300 border-brand-500/25'
                    : 'text-gray-500 hover:bg-white/[.05] hover:text-gray-300 border-transparent'
                )}
              >
                <span className="text-base shrink-0">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        <div>
          <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-gray-600 mb-3">Price</h3>
          {[
            { value: 'free',    label: 'Free' },
            { value: 'paid',    label: 'Paid' },
            { value: 'under25', label: 'Under Rs 2,500' },
            { value: 'under50', label: 'Under Rs 5,000' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => handlePrice(opt.value)}
              className={cn(
                'w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors mb-1 font-medium border',
                price === opt.value
                  ? 'bg-brand-600/15 text-brand-300 border-brand-500/25'
                  : 'text-gray-500 hover:bg-white/[.05] hover:text-gray-300 border-transparent'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Date Range */}
        <div>
          <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-gray-600 mb-3">Date Range</h3>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => { setDateFrom(e.target.value); applyFilters({ dateFrom: e.target.value }); }}
                className="w-full px-3 py-2.5 bg-white/[.04] border border-white/[.10] rounded-lg text-sm text-white focus:outline-none focus:border-brand-500/50 transition [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">To</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => { setDateTo(e.target.value); applyFilters({ dateTo: e.target.value }); }}
                className="w-full px-3 py-2.5 bg-white/[.04] border border-white/[.10] rounded-lg text-sm text-white focus:outline-none focus:border-brand-500/50 transition [color-scheme:dark]"
              />
            </div>
            {(dateFrom || dateTo) && (
              <button
                onClick={() => { setDateFrom(''); setDateTo(''); applyFilters({ dateFrom: '', dateTo: '' }); }}
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                Clear dates
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}