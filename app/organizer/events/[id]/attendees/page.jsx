'use client';

import { use, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, Search, Download } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { api } from '@/lib/api';
import { formatDateTime } from '@/lib/utils';

export default function AttendeesPage({ params }) {
  const { id }       = use(params);
  const [query,      setQuery]      = useState('');
  const [attendees,  setAttendees]  = useState([]);
  const [eventTitle, setEventTitle] = useState('');
  const [loading,    setLoading]    = useState(true);

  const fetchAttendees = useCallback((q = '') => {
    setLoading(true);
    api.get(`/events/${id}/attendees`, { params: { q, limit: 200 } })
      .then((res) => setAttendees(res.data.attendees || []))
      .catch(() => setAttendees([]))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetchAttendees();
    api.get(`/events/${id}`)
      .then((res) => setEventTitle((res.data.event || res.data)?.title || ''))
      .catch(() => {});
  }, [id, fetchAttendees]);

  useEffect(() => {
    const t = setTimeout(() => fetchAttendees(query), 350);
    return () => clearTimeout(t);
  }, [query, fetchAttendees]);

  const downloadCSV = () => {
    const headers = 'Name,Email,Ticket Type,Status,Purchased At\n';
    const rows = attendees.map((a) =>
      `"${a.name}","${a.email}","${a.ticketType}","${a.status}","${formatDateTime(a.purchasedAt)}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href     = url;
    link.download = `attendees-${id}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const statusMap = { confirmed: 'success', used: 'default', cancelled: 'danger', pending: 'warning' };

  const stats = {
    total:     attendees.length,
    confirmed: attendees.filter((a) => a.status === 'confirmed').length,
    used:      attendees.filter((a) => a.status === 'used').length,
    cancelled: attendees.filter((a) => a.status === 'cancelled').length,
  };

  return (
    <DashboardLayout>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/organizer/events" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ChevronLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-extrabold text-gray-900 truncate">
            {eventTitle || `Event ${id}`} - Attendees
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{stats.total} attendees</p>
        </div>
        <Button variant="outline" size="sm" onClick={downloadCSV} disabled={loading || attendees.length === 0}>
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total',     value: stats.total,     color: 'bg-gray-50'  },
          { label: 'Confirmed', value: stats.confirmed, color: 'bg-green-50' },
          { label: 'Used',      value: stats.used,      color: 'bg-blue-50'  },
          { label: 'Cancelled', value: stats.cancelled, color: 'bg-red-50'   },
        ].map((s) => (
          <div key={s.label} className={`${s.color} rounded-xl p-4 text-center`}>
            <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Search by name or email..." value={query} onChange={(e) => setQuery(e.target.value)} className="input-field pl-10" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Spinner size="lg" /></div>
        ) : attendees.length === 0 ? (
          <div className="text-center py-16"><p className="text-gray-400">No attendees yet.</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Attendee</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Email</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Ticket</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Purchased</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {attendees.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold text-xs shrink-0">
                          {a.name?.[0] || '?'}
                        </div>
                        <span className="font-medium text-gray-800">{a.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 hidden sm:table-cell">{a.email}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant={a.ticketType === 'VIP' ? 'warning' : 'default'}>{a.ticketType}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 text-xs hidden md:table-cell">{formatDateTime(a.purchasedAt)}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant={statusMap[a.status] || 'default'} dot>
                        {a.status?.charAt(0).toUpperCase() + a.status?.slice(1)}
                      </Badge>
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