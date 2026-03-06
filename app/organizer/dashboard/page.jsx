'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign, Ticket, CalendarDays, Users, Plus, ArrowRight, Eye,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import RevenueChart from '@/components/dashboard/RevenueChart';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { api } from '@/lib/api';
import { formatDate, formatCurrency } from '@/lib/utils';

export default function OrganizerDashboard() {
  const [stats,    setStats]    = useState(null);
  const [revenue,  setRevenue]  = useState([]);
  const [events,   setEvents]   = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/organizer/stats'),
      api.get('/organizer/revenue'),
      api.get('/organizer/events', { params: { limit: 5 } }),
    ])
      .then(([statsRes, revRes, evtsRes]) => {
        setStats(statsRes.data);
        setRevenue(revRes.data);
        setEvents(evtsRes.data.events || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const STAT_CARDS = stats ? [
    { title: 'Total Revenue',   value: formatCurrency(stats.totalRevenue),  icon: DollarSign,  color: 'green',  change: null },
    { title: 'Tickets Sold',    value: stats.totalTickets.toLocaleString(), icon: Ticket,      color: 'brand',  change: null },
    { title: 'Active Events',   value: String(stats.activeEvents),          icon: CalendarDays,color: 'orange', change: null },
    { title: 'Total Attendees', value: stats.totalAttendees.toLocaleString(),icon: Users,      color: 'purple', change: null },
  ] : [];

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Here's how your events are performing</p>
        </div>
        <Link href="/organizer/events/create">
          <Button size="sm"><Plus className="w-4 h-4" /> New Event</Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32"><Spinner size="lg" /></div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {STAT_CARDS.map((s) => (<StatsCard key={s.title} {...s} />))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">
            <div className="xl:col-span-2">
              <RevenueChart data={revenue} />
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2.5">
                {[
                  { href: '/organizer/events/create', label: 'Create New Event',  icon: Plus,        color: 'bg-brand-50 text-brand-600' },
                  { href: '/organizer/events',        label: 'Manage My Events',  icon: CalendarDays,color: 'bg-blue-50 text-blue-600' },
                  { href: '/staff/scan',              label: 'Scan QR Tickets',   icon: Ticket,      color: 'bg-green-50 text-green-600' },
                ].map(({ href, label, icon: Icon, color }) => (
                  <Link key={href} href={href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{label}</span>
                    <ArrowRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-gray-500" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">My Events</h3>
              <Link href="/organizer/events" className="text-sm text-brand-600 hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {events.length === 0 ? (
              <p className="text-sm text-gray-400 py-6 text-center">No events yet. <Link href="/organizer/events/create" className="text-brand-600 hover:underline">Create one</Link></p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {['Event','Date','Tickets','Revenue','Status',''].map((h) => (
                        <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {events.map((event) => {
                      const sold    = event.soldCount ?? event.ticketTypes?.reduce((s, t) => s + (t.sold || 0), 0) ?? 0;
                      const revenue = event.revenue ?? 0;
                      return (
                        <tr key={event._id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-3"><p className="font-medium text-gray-800 line-clamp-1">{event.title}</p></td>
                          <td className="py-3 px-3 text-gray-500 whitespace-nowrap">{formatDate(event.startDate || event.startTime)}</td>
                          <td className="py-3 px-3 text-gray-500">{sold} sold</td>
                          <td className="py-3 px-3 font-medium text-gray-800">{formatCurrency(revenue)}</td>
                          <td className="py-3 px-3"><Badge variant={event.status === 'published' ? 'success' : event.status === 'draft' ? 'warning' : 'danger'} dot>{event.status}</Badge></td>
                          <td className="py-3 px-3">
                            <Link href={`/events/${event._id}`} className="text-gray-400 hover:text-brand-600 transition-colors">
                              <Eye className="w-4 h-4" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
