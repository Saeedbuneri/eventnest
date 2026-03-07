'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Ticket, LayoutDashboard, CalendarDays, Users, QrCode,
  Settings, ChevronLeft, ChevronRight, BarChart3, ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import Navbar from './Navbar';

const ORGANIZER_NAV = [
  { href: '/organizer/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/organizer/events',    icon: CalendarDays,     label: 'My Events' },
  { href: '/organizer/events/create', icon: Ticket, label: 'Create Event' },
  { href: '/staff/scan',          icon: QrCode,           label: 'Scan Tickets' },
];

const ADMIN_NAV = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard'  },
  { href: '/admin/users',     icon: Users,            label: 'Users'      },
  { href: '/admin/events',    icon: CalendarDays,     label: 'Events'     },
  { href: '/admin/analytics', icon: BarChart3,        label: 'Analytics'  },
  { href: '/admin/settings',  icon: Settings,         label: 'Settings'   },
];

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router   = useRouter();
  const { user, loading }  = useAuth();

  // Client-side role guard (belt-and-suspenders with middleware.js)
  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace('/auth/login?redirect=' + pathname); return; }
    if (pathname.startsWith('/admin') && user.role !== 'admin') {
      router.replace(user.role === 'organizer' ? '/organizer/dashboard' : '/');
    } else if (pathname.startsWith('/organizer') && user.role !== 'organizer' && user.role !== 'admin') {
      router.replace('/');
    } else if (pathname.startsWith('/staff') && !['staff','organizer','admin'].includes(user.role)) {
      router.replace('/');
    }
  }, [user, loading, pathname, router]);

  const isAdmin    = user?.role === 'admin';
  const navItems   = isAdmin ? ADMIN_NAV : ORGANIZER_NAV;
  const sidebarTitle = isAdmin ? 'Admin Panel' : 'Organizer';

  return (
    <div className="min-h-screen bg-[#07070e]">
      <Navbar />

      {/* Mobile tab bar */}
      <div className="md:hidden flex overflow-x-auto border-b border-white/[.07] bg-[#0c0c18] px-2 gap-0.5 no-scrollbar">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-1.5 px-3 py-3 text-[11px] font-semibold whitespace-nowrap shrink-0 border-b-2 transition-colors',
                active
                  ? 'border-brand-500 text-brand-400'
                  : 'border-transparent text-gray-500 hover:text-gray-200'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </Link>
          );
        })}
      </div>

      <div className="flex">

        {/* Sidebar — desktop only */}
        <aside
          className={cn(
            'hidden md:flex flex-col bg-[#0c0c18] border-r border-white/[.07] min-h-[calc(100vh-64px)] sticky top-16 transition-all duration-300',
            collapsed ? 'w-16' : 'w-60'
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-white/[.07]">
            {!collapsed && (
              <div className="flex items-center gap-2">
                {isAdmin ? (
                  <ShieldCheck className="w-5 h-5 text-brand-400" />
                ) : (
                  <Ticket className="w-5 h-5 text-brand-400" />
                )}
                <span className="font-bold text-sm text-gray-200">{sidebarTitle}</span>
              </div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className={cn(
                'p-1.5 rounded-lg hover:bg-white/5 transition-colors text-gray-400',
                collapsed && 'mx-auto'
              )}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map(({ href, icon: Icon, label }) => {
              const active = pathname === href || pathname.startsWith(href + '/');
              return (
                <Link
                  key={href}
                  href={href}
                  title={collapsed ? label : undefined}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                    active
                      ? 'bg-brand-500/10 text-brand-400'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white',
                    collapsed && 'justify-center px-0'
                  )}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {!collapsed && <span>{label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* User info at bottom */}
          {!collapsed && user && (
            <div className="px-4 py-4 border-t border-white/[.07]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand-500/10 rounded-full flex items-center justify-center text-brand-400 font-bold text-sm shrink-0">
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 min-w-0">{children}</main>
      </div>
    </div>
  );
}
