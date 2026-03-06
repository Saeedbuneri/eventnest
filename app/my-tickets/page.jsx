'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TicketCard from '@/components/tickets/TicketCard';
import QRCodeDisplay from '@/components/tickets/QRCodeDisplay';
import { Modal } from '@/components/ui/Modal';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Ticket } from 'lucide-react';
import Link from 'next/link';

export default function MyTicketsPage() {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [tickets,  setTickets]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/auth/login?redirect=/my-tickets');
      return;
    }
    if (!authLoading && user) {
      api.get('/my-tickets')
        .then((res) => setTickets(res.data.tickets || res.data || []))
        .catch(() => setTickets([]))
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-gray-100 animate-pulse h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">My Tickets</h1>
            <p className="text-sm text-gray-500 mt-1">{tickets.length} ticket{tickets.length !== 1 ? 's' : ''} in your wallet</p>
          </div>
          <Link href="/events" className="text-brand-600 hover:text-brand-700 text-sm font-medium">
            + Browse Events
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-gray-100 animate-pulse h-32" />
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <Ticket className="w-14 h-14 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No tickets yet</h3>
            <p className="text-gray-400 text-sm mb-6">Your purchased tickets will appear here.</p>
            <Link href="/events" className="btn-primary inline-flex px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 transition-colors">
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <TicketCard
                key={ticket._id}
                ticket={ticket}
                onViewQR={(t) => setSelectedTicket(t)}
              />
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={!!selectedTicket} onClose={() => setSelectedTicket(null)} title="Your Ticket" size="md">
        {selectedTicket && <QRCodeDisplay ticket={selectedTicket} />}
      </Modal>

      <Footer />
    </div>
  );
}
