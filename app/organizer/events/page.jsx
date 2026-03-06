'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Eye, Users, Trash2, AlertTriangle, X } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { api } from '@/lib/api';
import { formatDate, formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

function DeleteConfirmPopover({ onConfirm, onCancel }) {
  return (
    <div className="absolute right-0 top-8 z-20 w-56 bg-white rounded-xl shadow-lg border border-gray-100 p-4">
      <div className="flex items-start gap-2 mb-3">
        <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
        <p className="text-xs text-gray-700 font-medium">Delete this event? This cannot be undone.</p>
      </div>
      <div className="flex gap-2">
        <button onClick={onCancel} className="flex-1 px-2 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
        <button onClick={onConfirm} className="flex-1 px-2 py-1.5 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Delete</button>
      </div>
    </div>
  );
}

export default function OrganizerEventsPage() {
  const [query,      setQuery]      = useState('');
  const [events,     setEvents]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [confirmId,  setConfirmId]  = useState(null);

  const fetchEvents = useCallback((q = '') => {
    setLoading(true);
    api.get('/organizer/events', { params: { q, limit: 50 } })
      .then((res) => setEvents(res.data.events || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  useEffect(() => {
    const t = setTimeout(() => fetchEvents(query), 350);
    return () => clearTimeout(t);
  }, [query, fetchEvents]);

  const handleDelete = async (id) => {
    setConfirmId(null);
    try {
      await api.delete(`/events/${id}`);
      setEvents((prev) => prev.filter((e) => e._id !== id));
      toast.success('Event deleted');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete event');
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">My Events</h1>
          <p className="text-sm text-gray-500 mt-0.5">{events.length} event{events.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/organizer/events/create">
          <Button size="sm"><Plus className="w-4 h-4" /> Create Event</Button>
        </Link>
      </div>

      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Search events..." value={query} onChange={(e) => setQuery(e.target.value)} className="input-field pl-10" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Spinner size="lg" /></div>
        ) : events.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">No events found.</p>
            <Link href="/organizer/events/create" className="mt-3 inline-block text-brand-600 hover:underline text-sm">Create your first event</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Event</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Tickets</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Revenue</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {events.map((event) => {
                  const sold    = event.soldCount ?? event.ticketTypes?.reduce((s, t) => s + (t.sold || 0), 0) ?? 0;
                  const total   = event.ticketTypes?.reduce((s, t) => s + t.quantity, 0) ?? 0;
                  const revenue = event.revenue ?? 0;
                  return (
                    <tr key={event._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                            <Image src={event.bannerImage || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=80'} alt={event.title} fill className="object-cover" sizes="40px" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 line-clamp-1">{event.title}</p>
                            <p className="text-xs text-gray-400">{event.venue?.city || ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap hidden md:table-cell">{formatDate(event.startDate || event.startTime)}</td>
                      <td className="py-3.5 px-4 hidden sm:table-cell">
                        <div className="text-gray-700 font-medium">{sold}/{total}</div>
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-brand-400 rounded-full" style={{ width: `${total ? (sold / total) * 100 : 0}%` }} />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-gray-800 hidden lg:table-cell">{formatCurrency(revenue)}</td>
                      <td className="py-3.5 px-4">
                        <Badge variant={event.status === 'published' ? 'success' : event.status === 'draft' ? 'warning' : 'danger'} dot>
                          {event.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link href={`/events/${event._id}`} className="p-1.5 text-gray-400 hover:text-brand-600 rounded-lg hover:bg-brand-50 transition-colors" title="Preview">
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link href={`/organizer/events/${event._id}/attendees`} className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors" title="Attendees">
                            <Users className="w-4 h-4" />
                          </Link>
                          <div className="relative">
                            <button onClick={() => setConfirmId(confirmId === event._id ? null : event._id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                            {confirmId === event._id && (
                              <DeleteConfirmPopover
                                onConfirm={() => handleDelete(event._id)}
                                onCancel={() => setConfirmId(null)}
                              />
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
