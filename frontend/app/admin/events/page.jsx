'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, Eye, CalendarDays, MapPin } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { getLocalEvents } from '@/lib/localSeed';

const STATUS_FILTERS = [
  { value: '',           label: 'All'       },
  { value: 'published',  label: 'Published' },
  { value: 'draft',      label: 'Draft'     },
  { value: 'cancelled',  label: 'Cancelled' },
];

export default function AdminEventsPage() {
  const [events,  setEvents]  = useState([]);
  const [total,   setTotal]   = useState(0);
  const [query,   setQuery]   = useState('');
  const [filter,  setFilter]  = useState('');
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback((q = '', status = '') => {
    setLoading(true);
    const params = { limit: 50 };
    if (q)      params.q = q;
    if (status) params.status = status;
    api.get('/admin/events', { params })
      .then((res) => {
        setEvents(res.data.events || getLocalEvents());
        setTotal(res.data.total   || 0);
      })
      .catch(() => {
        setEvents(getLocalEvents());
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchEvents('', filter); }, [filter, fetchEvents]);

  useEffect(() => {
    const t = setTimeout(() => fetchEvents(query, filter), 350);
    return () => clearTimeout(t);
  }, [query, filter, fetchEvents]);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-white">Event Management</h1>
        <p className="text-sm text-gray-400 mt-0.5">{total} total events</p>
      </div>

      {/* Status filters */}
      <div className="flex gap-2 flex-wrap mb-4">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === f.value
                ? 'bg-brand-600 text-white'
                : 'bg-white/[.05] border border-white/[.10] text-gray-400 hover:bg-white/[.08] hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search events..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      <div className="bg-[#111118] rounded-2xl border border-white/[.08] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Spinner size="lg" /></div>
        ) : events.length === 0 ? (
          <div className="text-center py-16"><p className="text-gray-400">No events found.</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/[.04] border-b border-white/[.07]">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Event</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Organizer</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Venue</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[.05]">
                {events.map((e) => (
                  <tr key={e._id} className="hover:bg-white/[.03] transition-colors">
                    {/* Event title + category */}
                    <td className="py-3.5 px-4 max-w-[200px]">
                      <div className="flex items-center gap-3">
                        {e.bannerImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={e.bannerImage} alt="" className="w-9 h-9 rounded-lg object-cover shrink-0" />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-brand-500/10 flex items-center justify-center shrink-0">
                            <CalendarDays className="w-4 h-4 text-brand-400" />
                          </div>
                        )}
                        <p className="font-medium text-gray-200 truncate">{e.title}</p>
                      </div>
                    </td>
                    {/* Organizer */}
                    <td className="py-3.5 px-4 hidden md:table-cell max-w-[140px]">
                      <p className="text-gray-400 truncate">{e.organizer?.name || e.organizerName || '—'}</p>
                    </td>
                    {/* Date */}
                    <td className="py-3.5 px-4 text-gray-400 whitespace-nowrap hidden sm:table-cell">
                      {e.startDate ? formatDate(e.startDate) : '—'}
                    </td>
                    {/* Venue */}
                    <td className="py-3.5 px-4 hidden lg:table-cell max-w-[160px]">
                      <div className="flex items-center gap-1 text-gray-400">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <p className="truncate">{e.venue?.city || '—'}</p>
                      </div>
                    </td>
                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <Badge variant={e.status === 'published' ? 'success' : e.status === 'cancelled' ? 'danger' : 'warning'} dot>
                        {e.status || 'draft'}
                      </Badge>
                    </td>
                    {/* Actions */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/events/${e._id}`}
                          className="p-1.5 text-gray-400 hover:text-brand-400 rounded-lg hover:bg-brand-500/10 transition-colors"
                          title="View event"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
