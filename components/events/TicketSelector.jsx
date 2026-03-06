'use client';

import { useState } from 'react';
import { Plus, Minus, ShoppingCart, Info } from 'lucide-react';
import { formatCurrency, getAvailableTickets } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default function TicketSelector({ ticketTypes = [], onCheckout }) {
  const [quantities, setQuantities] = useState(
    Object.fromEntries(ticketTypes.map((t) => [t.name, 0]))
  );

  const adjust = (name, delta) => {
    setQuantities((prev) => {
      const tt    = ticketTypes.find((t) => t.name === name);
      const avail = getAvailableTickets(tt);
      const next  = Math.max(0, Math.min(prev[name] + delta, avail, 10));
      return { ...prev, [name]: next };
    });
  };

  const total       = ticketTypes.reduce((s, t) => s + t.price * (quantities[t.name] || 0), 0);
  const ticketCount = Object.values(quantities).reduce((s, q) => s + q, 0);

  const handleCheckout = () => {
    const selected = ticketTypes
      .filter((t) => quantities[t.name] > 0)
      .map((t) => ({ ...t, quantity: quantities[t.name] }));
    onCheckout?.(selected, total);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
      <h3 className="font-bold text-gray-900 text-lg">Select Tickets</h3>

      {ticketTypes.map((tt) => {
        const avail   = getAvailableTickets(tt);
        const qty     = quantities[tt.name] || 0;
        const soldOut = avail <= 0;

        return (
          <div
            key={tt.name}
            className={`border rounded-xl p-4 transition-colors ${
              qty > 0 ? 'border-brand-200 bg-brand-50/30' : 'border-gray-100'
            } ${soldOut ? 'opacity-60' : ''}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 text-sm">{tt.name}</span>
                  {tt.name === 'VIP' && (
                    <span className="badge bg-yellow-100 text-yellow-700 text-xs">✨ VIP</span>
                  )}
                  {soldOut && (
                    <span className="badge bg-gray-100 text-gray-500 text-xs">Sold Out</span>
                  )}
                </div>
                <p className="text-brand-700 font-bold mt-0.5">
                  {formatCurrency(tt.price)}
                </p>
                {!soldOut && (
                  <p className="text-xs text-gray-400 mt-0.5">{avail} left</p>
                )}
              </div>

              {/* Quantity control */}
              {!soldOut && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => adjust(tt.name, -1)}
                    disabled={qty === 0}
                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center font-semibold text-sm">{qty}</span>
                  <button
                    onClick={() => adjust(tt.name, 1)}
                    disabled={qty >= Math.min(avail, 10)}
                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Total + CTA */}
      {ticketCount > 0 && (
        <div className="border-t border-gray-100 pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {ticketCount} ticket{ticketCount > 1 ? 's' : ''} selected
            </span>
            <span className="font-bold text-gray-900 text-lg">{formatCurrency(total)}</span>
          </div>
          <Button className="w-full" size="lg" onClick={handleCheckout}>
            <ShoppingCart className="w-4 h-4" />
            Checkout — {formatCurrency(total)}
          </Button>
        </div>
      )}

      {ticketCount === 0 && (
        <div className="flex items-center gap-2 text-xs text-gray-400 pt-1">
          <Info className="w-3.5 h-3.5 shrink-0" />
          Max 10 tickets per order
        </div>
      )}
    </div>
  );
}
