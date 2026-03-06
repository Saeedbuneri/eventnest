'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search, MapPin, ArrowRight, Ticket, CheckCircle, QrCode,
  Users, Star, CalendarDays, Zap, ShieldCheck, LayoutDashboard,
  ChevronRight,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EventCard from '@/components/events/EventCard';
import { EVENT_CATEGORIES } from '@/lib/constants';
import { api } from '@/lib/api';

// ─── Static data ──────────────────────────────────────────────────────────────

const STATS = [
  { value: '50,000+', label: 'Tickets Sold',    icon: Ticket },
  { value: '2,000+',  label: 'Events Hosted',   icon: CalendarDays },
  { value: '500+',    label: 'Active Organizers', icon: Users },
  { value: '4.9 / 5', label: 'Avg. Rating',     icon: Star },
];

const FEATURES = [
  {
    icon: Zap,
    color: 'bg-amber-50 text-amber-500',
    title: 'Book in Under a Minute',
    desc: 'Find an event, pick your seats, and check out — all in under 60 seconds. Digital ticket delivered instantly.',
  },
  {
    icon: QrCode,
    color: 'bg-brand-50 text-brand-600',
    title: 'Tamper-Proof QR Entry',
    desc: 'Every ticket carries a unique, server-verified QR code. One scan, one entry. No duplicates, no fraud.',
  },
  {
    icon: LayoutDashboard,
    color: 'bg-blue-50 text-blue-600',
    title: 'Organizer Command Center',
    desc: 'Live revenue charts, attendee lists, promo codes and refund management — all from one beautiful dashboard.',
  },
  {
    icon: ShieldCheck,
    color: 'bg-green-50 text-green-600',
    title: 'Secure Payments',
    desc: 'Payments are encrypted end-to-end. Refunds are processed automatically within 48 hours — no back-and-forth.',
  },
];

const HOW_IT_WORKS = [
  {
    icon: Search,
    step: '1',
    title: 'Discover',
    desc: 'Browse events by category, city, date, or price. Hundreds of concerts, meetups, sports events and more across Islamabad.',
  },
  {
    icon: Ticket,
    step: '2',
    title: 'Book Instantly',
    desc: 'Select tickets, apply a promo code if you have one, and pay securely. Confirmation is instant.',
  },
  {
    icon: CheckCircle,
    step: '3',
    title: 'Scan & Enjoy',
    desc: 'Open your ticket in the app, show your QR code at the door. No printouts. No queues. Just walk in.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Aisha Rahman',
    role: 'Event Attendee',
    text: 'I\'ve been to four events this month through EventNest. The QR entry is so fast — I\'ve never waited more than ten seconds at the door.',
    avatar: 'A',
  },
  {
    name: 'Bilal Chaudhry',
    role: 'Tech Meetup Organizer',
    text: 'Sold 200 tickets in 48 hours. The dashboard showed me exactly where sales were coming from. It\'s the tool I wish existed years ago.',
    avatar: 'B',
  },
  {
    name: 'Sana Mirza',
    role: 'Festival Director',
    text: 'We run a monthly food festival and EventNest handles everything — ticketing, promo codes, gate scanning, even refunds. Flawless.',
    avatar: 'S',
  },
];

const TRENDING = ['Music Concerts', 'Tech Talks', 'Food Festivals', 'Free Events', 'Sports'];

// ─── Page component ───────────────────────────────────────────────────────────

export default function HomePage() {
  const [query,    setQuery]    = useState('');
  const [city,     setCity]     = useState('');
  const [featured, setFeatured] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const router = useRouter();

  useEffect(() => {
    api.get('/events', { params: { featured: true, limit: 6 } })
      .then((res) => setFeatured(res.data.events || []))
      .catch(() => {});
    api.get('/events', { params: { upcoming: true, limit: 6 } })
      .then((res) => setUpcoming(res.data.events || []))
      .catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (query.trim()) p.set('q', query.trim());
    if (city.trim())  p.set('city', city.trim());
    router.push(`/events?${p.toString()}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ═══════════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#07070e] text-white">

        {/* Subtle red glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(ellipse 70% 55% at 5% 65%, rgba(225,29,72,0.14) 0%, transparent 55%), radial-gradient(ellipse 40% 35% at 95% 10%, rgba(225,29,72,0.07) 0%, transparent 50%)' }}
        />

        {/* Dot grid texture */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />

        <div className="relative max-w-7xl mx-auto px-4 pt-20 pb-28 sm:pt-32 sm:pb-40">
          <div className="max-w-3xl">

            {/* Pill badge */}
            <div className="inline-flex items-center gap-2.5 border border-brand-500/20 bg-brand-500/8 rounded-full px-4 py-1.5 text-xs font-semibold mb-8 text-brand-300 tracking-widest uppercase">
              <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse" />
              Islamabad&apos;s Event Platform · 100+ Events This Month
            </div>

            <h1 className="text-[3.2rem] sm:text-6xl lg:text-7xl font-black leading-[1.0] tracking-tight mb-6">
              Every great night{' '}
              <span className="block text-brand-400">starts with a ticket.</span>
            </h1>

            <p className="text-gray-400 text-xl max-w-xl leading-relaxed mb-10">
              Discover concerts, tech talks, food festivals, sports events and more across
              Islamabad &amp; Rawalpindi — and book your spot in seconds.
            </p>

            {/* Search */}
            <form
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row gap-0 bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl overflow-hidden max-w-2xl mb-7"
            >
              <div className="flex items-center gap-3 flex-1 px-4 py-1">
                <Search className="w-4 h-4 text-gray-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Search events, artists, venues…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 text-white text-sm py-3 outline-none bg-transparent placeholder-gray-600"
                />
              </div>
              <div className="flex items-center gap-3 px-4 border-t sm:border-t-0 sm:border-l border-white/10">
                <MapPin className="w-4 h-4 text-gray-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Islamabad"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-28 text-white text-sm py-3 outline-none bg-transparent placeholder-gray-600"
                />
              </div>
              <button
                type="submit"
                className="bg-brand-600 hover:bg-brand-500 text-white font-bold px-7 py-3.5 text-sm transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] shrink-0"
              >
                Search →
              </button>
            </form>

            {/* Trending tags */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-600 font-medium tracking-wide uppercase">Trending:</span>
              {TRENDING.map((t) => (
                <Link
                  key={t}
                  href={`/events?q=${encodeURIComponent(t)}`}
                  className="text-xs border border-white/10 text-gray-500 hover:border-brand-500/40 hover:text-brand-300 rounded-full px-3.5 py-1.5 transition-all"
                >
                  {t}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          STATS
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#111118] border-y border-white/5 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4">
            {STATS.map(({ value, label, icon: Icon }, i) => (
              <div
                key={label}
                className={`flex flex-col items-center gap-1 py-7 px-4 ${i < 3 ? 'sm:border-r border-white/5' : ''} ${i === 0 ? 'border-r border-white/5 sm:border-r' : ''} ${i === 1 ? 'sm:border-r border-white/5' : ''} ${i === 2 ? 'border-r border-white/5 sm:border-r' : ''}`}
              >
                <Icon className="w-5 h-5 text-brand-500 mb-1 opacity-70" />
                <div className="text-2xl font-black text-white">{value}</div>
                <div className="text-[11px] text-gray-500 uppercase tracking-widest">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CATEGORIES
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[11px] font-bold tracking-[0.2em] text-brand-500 uppercase mb-2">Browse</p>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">What are you into?</h2>
          </div>
          <Link href="/events" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-gray-400 hover:text-brand-600 transition-colors">
            All events <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {EVENT_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/events?category=${cat.id}`}
              className="group flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-100 hover:border-brand-100 hover:bg-gradient-to-b hover:from-brand-50 hover:to-white transition-all cursor-pointer"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform duration-150">{cat.icon}</span>
              <span className="text-[11px] font-semibold text-gray-600 group-hover:text-brand-600 text-center leading-tight">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FEATURED EVENTS
      ══════════════════════════════════════════════════════════════════════ */}
      {featured.length > 0 && (
        <section className="bg-[#f6f6f9] py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[11px] font-bold tracking-[0.2em] text-brand-500 uppercase mb-2">Featured</p>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Handpicked for you</h2>
              </div>
              <Link href="/events" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-gray-400 hover:text-brand-600 transition-colors">
                See all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.map((event) => <EventCard key={event._id || event.id} event={event} />)}
            </div>
            <div className="mt-8 sm:hidden text-center">
              <Link href="/events" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline">
                See all events <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          WHY EVENTNEST — FEATURE GRID
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <p className="text-[11px] font-bold tracking-[0.2em] text-brand-500 uppercase mb-3">Why EventNest</p>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight max-w-lg mx-auto leading-tight">
            Everything you need to attend — or run — a great event.
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {FEATURES.map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="flex gap-5 p-6 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all bg-white">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          UPCOMING EVENTS
      ══════════════════════════════════════════════════════════════════════ */}
      {upcoming.length > 0 && (
        <section className="bg-[#07070e] text-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[11px] font-bold tracking-[0.2em] text-brand-500 uppercase mb-2">Coming Up</p>
                <h2 className="text-3xl font-black tracking-tight">Don&apos;t miss these</h2>
              </div>
              <Link href="/events" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-brand-400 transition-colors">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {upcoming.slice(0, 6).map((event) => (
                <div key={event._id || event.id} className="relative group">
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm border border-white/10 rounded-lg px-2.5 py-1.5">
                    <CalendarDays className="w-3 h-3 text-brand-400" />
                    <span className="text-[11px] font-bold text-white">
                      {event.startDate
                        ? new Date(event.startDate).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })
                        : 'Upcoming'}
                    </span>
                  </div>
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <p className="text-[11px] font-bold tracking-[0.2em] text-brand-500 uppercase mb-3">How It Works</p>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">From discovery to front door — in three steps.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-8 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gradient-to-r from-transparent via-brand-200 to-transparent" />

          {HOW_IT_WORKS.map(({ icon: Icon, step, title, desc }) => (
            <div key={step} className="text-center relative">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-600 text-white mb-5 shadow-[0_0_20px_rgba(225,29,72,0.25)]">
                <Icon className="w-7 h-7" />
              </div>
              <div className="text-[11px] font-black text-brand-500 tracking-[0.25em] mb-2">STEP {step}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#f6f6f9] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-[11px] font-bold tracking-[0.2em] text-brand-500 uppercase mb-3">What People Say</p>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Loved across Islamabad &amp; Rawalpindi.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-5">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                  <div className="w-9 h-9 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold text-sm shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          ORGANIZER CTA
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#07070e] text-white py-24 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(225,29,72,0.12) 0%, transparent 65%)' }}
        />
        <div className="relative max-w-2xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 border border-brand-500/20 bg-brand-500/8 rounded-full px-4 py-1.5 text-xs font-semibold mb-6 text-brand-300 tracking-widest uppercase">
            For Organizers
          </div>
          <h2 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight mb-5">
            Ready to sell tickets<br />
            <span className="text-brand-400">in Islamabad?</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 leading-relaxed">
            Create your event, set your prices, and start selling — all from one dashboard.
            No technical skills or setup fees required.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/auth/signup"
              className="bg-brand-600 hover:bg-brand-500 text-white font-bold px-8 py-3.5 rounded-xl transition-colors shadow-[0_0_24px_rgba(225,29,72,0.35)]"
            >
              Create Free Account
            </Link>
            <Link
              href="/events"
              className="border border-white/15 hover:bg-white/5 text-gray-300 hover:text-white font-semibold px-8 py-3.5 rounded-xl transition-colors"
            >
              Browse Events
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}


const STATS = [
  { value: '50K+', label: 'Tickets Sold'   },
  { value: '2K+',  label: 'Events Hosted'  },
  { value: '500+', label: 'Organizers'      },
  { value: '4.9★', label: 'Avg. Rating'    },
];

const HOW_IT_WORKS = [
  {
    icon: Search,
    color: 'bg-blue-100 text-blue-600',
    step: '01',
    title: 'Discover Events',
    desc:  'Browse local events by category, date, or location. Filter by price, get personalised suggestions.',
  },
  {
    icon: Ticket,
    color: 'bg-brand-100 text-brand-600',
    step: '02',
    title: 'Buy Your Ticket',
    desc:  'Secure checkout in seconds. Multiple payment options, instant digital ticket delivery to your inbox.',
  },
  {
    icon: CheckCircle,
    color: 'bg-green-100 text-green-600',
    step: '03',
    title: 'Scan & Enjoy',
    desc:  'Show your QR code at the door. Fast, paperless, contactless entry — no printing required.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Sarah K.',
    role: 'Event Attendee',
    text: 'Found three amazing local concerts I never would have discovered. The QR ticket system is so smooth!',
    avatar: 'S',
  },
  {
    name: 'Marcus V.',
    role: 'Event Organizer',
    text: 'Sold out my tech meetup in two days and managed everything from one dashboard. Incredible tool.',
    avatar: 'M',
  },
  {
    name: 'Priya M.',
    role: 'Community Leader',
    text: 'Our annual food festival ticketing was a breeze. Real-time sales dashboard gave us full visibility.',
    avatar: 'P',
  },
];

export default function HomePage() {
  const [query,    setQuery]    = useState('');
  const [city,     setCity]     = useState('');
  const [featured, setFeatured] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const router = useRouter();

  useEffect(() => {
    api.get('/events', { params: { featured: true, limit: 6 } })
      .then((res) => setFeatured(res.data.events || []))
      .catch(() => {});

    api.get('/events', { params: { upcoming: true, limit: 6 } })
      .then((res) => setUpcoming(res.data.events || []))
      .catch(() => setUpcoming(getLocalEvents({ upcoming: true })));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (query) p.set('q', query);
    if (city)  p.set('city', city);
    router.push(`/events?${p.toString()}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0a0a10] text-white">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none" style={{backgroundImage: 'radial-gradient(ellipse 80% 50% at 8% 60%, rgba(225,29,72,0.13) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 92% 15%, rgba(225,29,72,0.07) 0%, transparent 50%)'}} />

        <div className="relative max-w-7xl mx-auto px-4 pt-24 pb-32 sm:pt-36 sm:pb-44">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 border border-brand-500/25 bg-brand-500/10 rounded-full px-4 py-1.5 text-xs font-bold mb-8 text-brand-300 tracking-widest uppercase">
              <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse" />
              Live Now · 100+ Events This Weekend
            </div>

            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight mb-8">
              YOUR NEXT<br />
              <span className="text-brand-400">GREAT NIGHT</span><br />
              STARTS HERE.
            </h1>

            <p className="text-lg text-gray-400 mb-10 max-w-xl leading-relaxed">
              Islamabad&apos;s live event platform — concerts, meetups, sports &amp; more. Book in seconds, arrive with a QR code.
            </p>

            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-1.5 flex flex-col sm:flex-row gap-1.5 max-w-2xl mb-8"
            >
              <div className="flex items-center gap-3 flex-1 px-3">
                <Search className="w-4 h-4 text-gray-600 shrink-0" />
                <input
                  type="text"
                  placeholder="Search events, artists, categories…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 text-white text-sm py-2.5 outline-none bg-transparent placeholder-gray-600"
                />
              </div>
              <div className="flex items-center gap-2 px-3 border-t sm:border-t-0 sm:border-l border-white/10 pt-1.5 sm:pt-0">
                <MapPin className="w-4 h-4 text-gray-600 shrink-0" />
                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-28 text-white text-sm py-2.5 outline-none bg-transparent placeholder-gray-600"
                />
              </div>
              <button
                type="submit"
                className="bg-brand-600 hover:bg-brand-500 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm shadow-[0_0_20px_rgba(225,29,72,0.3)]"
              >
                Search
              </button>
            </form>

            {/* Quick links */}
            <div className="flex items-center flex-wrap gap-2 text-sm">
              <span className="text-gray-600 font-medium">Trending:</span>
              {['Music', 'Tech', 'Sports', 'Free Events'].map((k) => (
                <Link
                  key={k}
                  href={`/events?q=${k}`}
                  className="border border-white/10 text-gray-500 hover:border-brand-500/40 hover:text-brand-400 rounded-full px-3 py-1 transition-colors"
                >
                  {k}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ─────────────────────────────────────────────────────── */}
      <section className="bg-[#111118] border-y border-white/5 text-white">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/5">
            {STATS.map((s) => (
              <div key={s.label} className="text-center py-5 px-4">
                <div className="text-3xl font-black text-brand-400">{s.value}</div>
                <div className="text-xs text-gray-500 mt-1 uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-brand-500 uppercase mb-2">What&apos;s On</p>
            <h2 className="section-title">Browse by Category</h2>
          </div>
          <Link href="/events" className="text-sm font-semibold text-gray-400 hover:text-brand-600 flex items-center gap-1 transition-colors">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {EVENT_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/events?category=${cat.id}`}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-100 hover:border-brand-200 hover:bg-brand-50 transition-all group cursor-pointer"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">{cat.icon}</span>
              <span className="text-xs font-medium text-gray-700 text-center">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Events ───────────────────────────────────────────────── */}
      <section className="bg-[#f4f4f7] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-brand-500 uppercase mb-2">Featured</p>
              <h2 className="section-title">Handpicked for You</h2>
            </div>
            <Link href="/events" className="text-sm font-semibold text-gray-400 hover:text-brand-600 flex items-center gap-1 transition-colors">
              See all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Upcoming Events ──────────────────────────────────────────────── */}
      {upcoming.length > 0 && (
        <section className="bg-[#0a0a10] text-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-bold tracking-[0.2em] text-brand-500 uppercase mb-2">Coming Up</p>
                <h2 className="text-4xl font-black tracking-tight">Don&apos;t Miss These</h2>
              </div>
              <Link href="/events" className="text-sm font-semibold text-gray-400 hover:text-brand-400 flex items-center gap-1 transition-colors">
                See all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming.map((event) => (
                <div key={event._id || event.id} className="relative group">
                  {/* Date badge */}
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm border border-white/10 rounded-lg px-2.5 py-1.5">
                    <CalendarDays className="w-3.5 h-3.5 text-brand-400" />
                    <span className="text-xs font-bold text-white">
                      {event.startDate
                        ? new Date(event.startDate).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })
                        : 'Upcoming'}
                    </span>
                  </div>
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <p className="text-xs font-bold tracking-[0.2em] text-brand-500 uppercase mb-3">How It Works</p>
          <h2 className="section-title">Three Steps to Your Next Night Out</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {HOW_IT_WORKS.map(({ icon: Icon, color, step, title, desc }) => (
            <div key={step} className="text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${color} mb-5`}>
                <Icon className="w-7 h-7" />
              </div>
              <div className="text-xs font-bold text-gray-400 tracking-widest mb-2">STEP {step}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
              <p className="text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section className="bg-[#f4f4f7] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-[0.2em] text-brand-500 uppercase mb-3">Reviews</p>
            <h2 className="section-title">Loved by Islamabad</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="card p-6">
                <div className="flex items-center gap-1 text-yellow-400 mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <section className="bg-[#0a0a10] text-white py-28 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{backgroundImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(225,29,72,0.15) 0%, transparent 65%)'}} />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <p className="text-xs font-bold tracking-[0.2em] text-brand-500 uppercase mb-5">For Organizers</p>
          <h2 className="text-5xl sm:text-6xl font-black leading-[0.9] tracking-tight mb-6">
            HOST YOUR<br />EVENT IN<br /><span className="text-brand-400">ISLAMABAD.</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
            Create your event, set ticket prices, and start selling — all from one dashboard. No technical skills needed.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/auth/signup"
              className="bg-brand-600 hover:bg-brand-500 text-white font-bold px-8 py-3.5 rounded-xl transition-colors shadow-[0_0_24px_rgba(225,29,72,0.4)]"
            >
              Create Free Account
            </Link>
            <Link
              href="/events"
              className="border border-white/15 hover:border-white/30 text-gray-300 hover:text-white font-semibold px-8 py-3.5 rounded-xl transition-colors"
            >
              Explore Events
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
