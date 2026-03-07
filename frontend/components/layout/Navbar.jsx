'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Ticket, Menu, X, ChevronDown, LogOut, LayoutDashboard, QrCode, Search, UserCircle,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/events',                     label: 'Browse Events' },
  { href: '/events?category=music',      label: 'Music' },
  { href: '/events?category=tech',       label: 'Tech' },
  { href: '/events?category=sports',     label: 'Sports' },
  { href: '/events?category=community',  label: 'Community' },
];

export default function Navbar() {
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeHref,   setActiveHref]   = useState('');
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router   = useRouter();
  const userMenuRef = useRef(null);

  // Sync active link with current URL (including query string)
  useEffect(() => {
    setActiveHref(pathname + (typeof window !== 'undefined' ? window.location.search : ''));
  }, [pathname]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    router.push('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/auth/login';
    const map = {
      organizer: '/organizer/dashboard',
      admin:     '/admin/dashboard',
      staff:     '/staff/scan',
    };
    return map[user.role] || '/my-tickets';
  };

  return (
    <nav className="sticky top-0 z-40 bg-[#0a0a10]/95 backdrop-blur-md border-b border-white/[0.07]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 font-extrabold text-xl text-white shrink-0">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shadow-[0_0_14px_rgba(225,29,72,0.5)]">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            EventNest
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setActiveHref(link.href)}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  activeHref === link.href
                    ? 'bg-brand-600/15 text-brand-400'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <div className="w-8 h-8 bg-brand-900/40 border border-brand-600/40 rounded-full flex items-center justify-center text-brand-400 font-bold text-sm shrink-0">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-gray-300">{user.name?.split(' ')[0]}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-1 w-52 bg-[#16161e] rounded-xl shadow-2xl border border-white/10 py-1 z-50">
                    <div className="px-4 py-2.5 border-b border-white/10">
                      <p className="font-semibold text-sm text-white">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role || 'attendee'}</p>
                    </div>
                    <Link
                      href={getDashboardLink()}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link
                      href="/my-tickets"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <QrCode className="w-4 h-4" /> My Tickets
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <UserCircle className="w-4 h-4" /> My Profile
                    </Link>
                    <hr className="my-1 border-white/10" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
                    >
                      <LogOut className="w-4 h-4" /> Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/auth/login" className="text-sm font-medium text-gray-400 hover:text-white px-3 py-2 transition-colors">
                  Log In
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#0a0a10] px-4 pb-4">
          <div className="flex flex-col gap-1 pt-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  activeHref === link.href
                    ? 'bg-brand-600/15 text-brand-400'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                )}
                onClick={() => { setMobileOpen(false); setActiveHref(link.href); }}
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-2 border-white/10" />
            {user ? (
              <>
                <Link href={getDashboardLink()} className="px-3 py-2.5 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white rounded-lg" onClick={() => setMobileOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/my-tickets" className="px-3 py-2.5 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white rounded-lg" onClick={() => setMobileOpen(false)}>
                  My Tickets
                </Link>
                <Link href="/profile" className="px-3 py-2.5 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white rounded-lg" onClick={() => setMobileOpen(false)}>
                  My Profile
                </Link>
                <button onClick={handleLogout} className="px-3 py-2.5 text-sm font-medium text-red-400 text-left hover:bg-red-500/10 rounded-lg">
                  Log Out
                </button>
              </>
            ) : (
              <div className="flex gap-2 mt-1">
                <Link href="/auth/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full" size="sm">Log In</Button>
                </Link>
                <Link href="/auth/signup" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full" size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
