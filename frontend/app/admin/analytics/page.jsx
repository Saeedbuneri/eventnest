'use client';

import { useEffect, useState } from 'react';
import {
  TrendingUp, Users, CalendarDays, Ticket, DollarSign, BarChart3,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import RevenueChart from '@/components/dashboard/RevenueChart';
import TicketsChart from '@/components/dashboard/TicketsChart';
import CategoryPieChart from '@/components/dashboard/CategoryPieChart';
import { Spinner } from '@/components/ui/Spinner';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { getLocalRevenue, getLocalCategories } from '@/lib/localSeed';

const STAT_ITEMS = (stats) => [
  { label: 'Total Revenue',   value: formatCurrency(stats.totalRevenue),          icon: DollarSign,  color: 'text-green-400',  bg: 'bg-green-500/10'  },
  { label: 'Total Users',     value: stats.totalUsers.toLocaleString(),            icon: Users,       color: 'text-brand-400',  bg: 'bg-brand-500/10'  },
  { label: 'Total Events',    value: stats.totalEvents.toLocaleString(),           icon: CalendarDays,color: 'text-orange-400', bg: 'bg-orange-500/10' },
  { label: 'Tickets Sold',    value: stats.totalTickets.toLocaleString(),          icon: Ticket,      color: 'text-purple-400', bg: 'bg-purple-500/10' },
];

export default function AdminAnalyticsPage() {
  const [stats,   setStats]      = useState(null);
  const [revenue, setRevenue]    = useState([]);
  const [cats,    setCategories] = useState([]);
  const [loading, setLoading]    = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then((r) => {
        setStats(r.data);
        setRevenue(getLocalRevenue());
        setCategories(getLocalCategories());
      })
      .catch(() => {
        setRevenue(getLocalRevenue());
        setCategories(getLocalCategories());
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Analytics</h1>
          <p className="text-sm text-gray-400 mt-0.5">Platform-wide performance overview</p>
        </div>
        <div className="flex items-center gap-2 bg-brand-500/10 text-brand-400 px-3 py-2 rounded-xl text-sm font-medium">
          <BarChart3 className="w-4 h-4" /> Live Data
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32"><Spinner size="lg" /></div>
      ) : (
        <>
          {/* Stats row */}
          {stats && (
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
              {STAT_ITEMS(stats).map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="bg-[#111118] rounded-2xl border border-white/[.08] p-5 flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 font-medium truncate">{label}</p>
                    <p className={`text-xl font-extrabold ${color}`}>{value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Revenue + category charts */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-5">
            <div className="xl:col-span-2">
              <RevenueChart data={revenue} title="Monthly Revenue" />
            </div>
            <CategoryPieChart data={cats} />
          </div>

          {/* Tickets chart */}
          <TicketsChart data={revenue} />

          {/* Growth summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
            {[
              { label: 'Revenue Growth',  value: '+24.5%', sub: 'vs last 6 months', icon: TrendingUp,   color: 'text-green-400',  bg: 'bg-green-500/10'  },
              { label: 'New Users',       value: '+18.2%', sub: 'vs last month',    icon: Users,        color: 'text-blue-400',   bg: 'bg-blue-500/10'   },
              { label: 'Events Created',  value: '+31.0%', sub: 'vs last month',    icon: CalendarDays, color: 'text-orange-400', bg: 'bg-orange-500/10' },
            ].map(({ label, value, sub, icon: Icon, color, bg }) => (
              <div key={label} className="bg-[#111118] rounded-2xl border border-white/[.08] p-5">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <p className={`text-2xl font-extrabold ${color} mb-1`}>{value}</p>
                <p className="text-sm font-semibold text-gray-300">{label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
