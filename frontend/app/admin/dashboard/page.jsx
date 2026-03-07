'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign, Users, CalendarDays, Ticket, ArrowRight, ShieldAlert, Eye, UserCheck, Ban,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import RevenueChart from '@/components/dashboard/RevenueChart';
import TicketsChart from '@/components/dashboard/TicketsChart';
import CategoryPieChart from '@/components/dashboard/CategoryPieChart';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { api } from '@/lib/api';
import { formatDate, formatCurrency } from '@/lib/utils';
import { getLocalRevenue, getLocalCategories, getLocalEvents } from '@/lib/localSeed';

const statusMap = {
  active:    { variant: 'success', label: 'Active'    },
  pending:   { variant: 'warning', label: 'Pending'   },
  suspended: { variant: 'danger',  label: 'Suspended' },
};

export default function AdminDashboard() {
  const [stats,   setStats]   = useState(null);
  const [revenue,  setRevenue]  = useState([]);
  const [categories, setCategories] = useState([]);
  const [events,  setEvents]  = useState([]);
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/events',  { params: { limit: 5 } }),
      api.get('/admin/users',   { params: { limit: 5 } }),
    ])
      .then(([statsRes, evtsRes, usersRes]) => {
        setStats(statsRes.data);
        setRevenue(getLocalRevenue());
        setCategories(getLocalCategories());
        setEvents(evtsRes.data.events   || getLocalEvents());
        setUsers(usersRes.data.users    || []);
      })
      .catch(() => {
        setRevenue(getLocalRevenue());
        setCategories(getLocalCategories());
        setEvents(getLocalEvents());
      })
      .finally(() => setLoading(false));
  }, []);

  const STAT_CARDS = stats ? [
    { title: 'Platform Revenue', value: formatCurrency(stats.totalRevenue),  icon: DollarSign,  color: 'green'  },
    { title: 'Total Users',      value: stats.totalUsers.toLocaleString(),   icon: Users,       color: 'brand'  },
    { title: 'Total Events',     value: stats.totalEvents.toLocaleString(),  icon: CalendarDays,color: 'orange' },
    { title: 'Tickets Sold',     value: stats.totalTickets.toLocaleString(), icon: Ticket,      color: 'purple' },
  ] : [];

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Admin Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">Platform-wide overview</p>
        </div>
          <div className="flex items-center gap-2 bg-brand-500/10 text-brand-400 px-3 py-2 rounded-xl text-sm font-medium">
          <ShieldAlert className="w-4 h-4" /> Admin Mode
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32"><Spinner size="lg" /></div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {STAT_CARDS.map((s) => <StatsCard key={s.title} {...s} />)}
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">
            <div className="xl:col-span-2">
              <RevenueChart data={revenue} title="Platform Revenue" />
            </div>
            <CategoryPieChart data={categories} />
          </div>
          <div className="mb-6">
            <TicketsChart data={revenue} />
          </div>

          <div className="bg-[#111118] rounded-2xl border border-white/[.08] p-5 mb-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white">Recent Events</h3>
              <Link href="/admin/events" className="text-sm text-brand-400 hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {events.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No events yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[.07]">
                      {['Event','Organizer','Date','Status'].map((h) => (
                        <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[.05]">
                    {events.map((e) => (
                      <tr key={e._id} className="hover:bg-white/[.03]">
                        <td className="py-3 px-3 font-medium text-gray-200 line-clamp-1 max-w-[200px]">{e.title}</td>
                        <td className="py-3 px-3 text-gray-400">{e.organizer?.name || ''}</td>
                        <td className="py-3 px-3 text-gray-400 whitespace-nowrap">{formatDate(e.startDate || e.startTime)}</td>
                        <td className="py-3 px-3"><Badge variant={e.status === 'published' ? 'success' : 'warning'} dot>{e.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-[#111118] rounded-2xl border border-white/[.08] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white">Recent Users</h3>
              <Link href="/admin/users" className="text-sm text-brand-400 hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {users.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No users yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[.07]">
                      {['User','Email','Role','Status'].map((h) => (
                        <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[.05]">
                    {users.map((u) => {
                      const s = statusMap[u.status] || statusMap.active;
                      return (
                        <tr key={u._id} className="hover:bg-white/[.03]">
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 bg-brand-500/10 rounded-full flex items-center justify-center text-brand-400 font-bold text-xs shrink-0">{u.name?.[0] || '?'}</div>
                              <span className="text-gray-200">{u.name}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-gray-400">{u.email}</td>
                          <td className="py-3.5 px-3"><Badge variant={u.role === 'organizer' ? 'brand' : 'default'} className="capitalize">{u.role}</Badge></td>
                          <td className="py-3.5 px-3"><Badge variant={s.variant} dot>{s.label}</Badge></td>
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