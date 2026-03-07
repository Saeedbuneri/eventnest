'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search, MapPin, ArrowRight, Ticket, CheckCircle, QrCode,
  Users, Star, CalendarDays, Zap, ShieldCheck, LayoutDashboard, Sparkles,
  ChevronRight,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EventCard from '@/components/events/EventCard';
import { EVENT_CATEGORIES } from '@/lib/constants';
import { api } from '@/lib/api';

//  Scroll-reveal wrapper 
function Reveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.08 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity .7s cubic-bezier(.16,1,.3,1) ${delay}ms, transform .7s cubic-bezier(.16,1,.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

//  Static data 
const STATS = [
  { value: '50,000+', label: 'Tickets Sold',     color: 'text-brand-400' },
  { value: '2,000+',  label: 'Events Hosted',    color: 'text-violet-400' },
  { value: '500+',    label: 'Organizers',        color: 'text-blue-400' },
  { value: '4.9',    label: 'Average Rating',   color: 'text-amber-400' },
];

const FEATURES = [
  {
    icon: Zap,
    from: 'from-amber-500/20', to: 'to-orange-500/10',
    ring: 'hover:border-amber-500/30',
    blob: 'rgba(245,158,11,.12)',
    iconColor: 'text-amber-400',
    title: 'Book in Under a Minute',
    desc: 'Find an event, pick seats, and check out in under 60 seconds. Digital ticket delivered instantly.',
  },
  {
    icon: QrCode,
    from: 'from-brand-500/20', to: 'to-pink-500/10',
    ring: 'hover:border-brand-500/30',
    blob: 'rgba(225,29,72,.12)',
    iconColor: 'text-brand-400',
    title: 'Tamper-Proof QR Entry',
    desc: 'Every ticket carries a unique QR code. One scan, one entry. No duplicates, no fraud.',
  },
  {
    icon: LayoutDashboard,
    from: 'from-blue-500/20', to: 'to-cyan-500/10',
    ring: 'hover:border-blue-500/30',
    blob: 'rgba(59,130,246,.12)',
    iconColor: 'text-blue-400',
    title: 'Organizer Command Center',
    desc: 'Live charts, attendee lists, promo codes and refunds  all from one beautiful dashboard.',
  },
  {
    icon: ShieldCheck,
    from: 'from-emerald-500/20', to: 'to-green-500/10',
    ring: 'hover:border-emerald-500/30',
    blob: 'rgba(16,185,129,.12)',
    iconColor: 'text-emerald-400',
    title: 'Secure Payments',
    desc: 'Payments encrypted end-to-end. Refunds processed automatically within 48 hours.',
  },
];

const STEPS = [
  { icon: Search,       step: '01', title: 'Discover',       desc: 'Browse events by category, city, date, or price. Hundreds of concerts, meetups and sports events.' },
  { icon: Ticket,       step: '02', title: 'Book Instantly', desc: 'Select tickets, apply a promo code, and pay securely. Confirmation is instant.' },
  { icon: CheckCircle,  step: '03', title: 'Scan & Enjoy',   desc: 'Show your QR code at the door. No printouts, no queues. Just walk in and enjoy.' },
];

const TESTIMONIALS = [
  { name: 'Aisha Rahman',    role: 'Event Attendee',        avatar: 'A', grad: 'from-brand-500 to-pink-500',    text: "The QR entry is so fast  I've never waited more than ten seconds at the door. EventNest just works." },
  { name: 'Bilal Chaudhry',  role: 'Tech Meetup Organizer', avatar: 'B', grad: 'from-blue-500 to-violet-500',   text: "Sold 200 tickets in 48 hours. The dashboard showed me exactly where sales were coming from." },
  { name: 'Sana Mirza',      role: 'Festival Director',     avatar: 'S', grad: 'from-emerald-500 to-cyan-500',  text: "EventNest handles everything  ticketing, promo codes, gate scanning, refunds. Absolutely flawless." },
];

const HERO_FALLBACK = [
  { id: 'h1', title: 'Islamabad Music Festival 2026',      bannerImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80', startDate: '2026-04-15T18:00:00Z', venue: { city: 'Islamabad' }, ticketTypes: [{ price: 500 }] },
  { id: 'h2', title: 'Blue Area TechMeet  AI & Startups', bannerImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80', startDate: '2026-04-18T10:00:00Z', venue: { city: 'Islamabad' }, ticketTypes: [{ price: 800 }] },
  { id: 'h3', title: 'F-7 Markaz Street Food Festival',    bannerImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80', startDate: '2026-04-25T12:00:00Z', venue: { city: 'Islamabad' }, ticketTypes: [{ price: 300 }] },
];

//  Page 
export default function HomePage() {
  const [query,    setQuery]    = useState('');
  const [city,     setCity]     = useState('');
  const [featured, setFeatured] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const router = useRouter();

  useEffect(() => {
    api.get('/events', { params: { featured: true, limit: 6 } })
      .then((r) => setFeatured(r.data.events || [])).catch(() => {});
    api.get('/events', { params: { upcoming: true, limit: 6 } })
      .then((r) => setUpcoming(r.data.events || [])).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (query.trim()) p.set('q', query.trim());
    if (city.trim())  p.set('city', city.trim());
    router.push(`/events?${p.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#07070e]">
      <Navbar />

      {/*  HERO  */}
      <section className="relative overflow-hidden">
        {/* Atmospheric background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-56 -left-56 w-[1000px] h-[1000px] rounded-full bg-brand-600/[0.06] blur-[180px] animate-float-slow" />
          <div className="absolute -bottom-32 -right-32 w-[700px] h-[700px] rounded-full bg-violet-600/[0.06] blur-[140px]" style={{ animationName: 'float', animationDuration: '9s', animationIterationCount: 'infinite', animationTimingFunction: 'ease-in-out', animationDelay: '3s' }} />
          <div className="absolute inset-0 opacity-[0.018]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize: '64px 64px' }} />
          {/* Radial vignette */}
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(225,29,72,.06) 0%, transparent 55%)' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 sm:pt-20 sm:pb-28 lg:pt-28 lg:pb-36">
          <div className="grid lg:grid-cols-[1fr_44%] gap-14 xl:gap-20 items-center">

            {/* Left */}
            <div>
              {/* Live badge */}
              <div
              className="inline-flex items-center gap-2.5 bg-brand-500/[.08] border border-brand-500/20 text-brand-300 text-[11px] font-bold rounded-full px-4 py-2 mb-5 sm:mb-8 tracking-widest uppercase"
                style={{ opacity: 0, animation: 'fadeUp .7s .05s cubic-bezier(.16,1,.3,1) forwards' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
                100+ Events Live This Weekend in Islamabad
              </div>

              {/* Headline */}
              <h1
              className="text-4xl sm:text-5xl lg:text-[4.2rem] font-black text-white leading-[1.02] tracking-tighter mb-5 sm:mb-6"
                style={{ opacity: 0, animation: 'fadeUp .7s .18s cubic-bezier(.16,1,.3,1) forwards' }}>
                Discover &amp; Book<br />
                <span
                  className="animate-gradient"
                  style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundImage: 'linear-gradient(90deg, #fb7093, #e11d48, #a855f7, #fb7093)', backgroundSize: '200% 200%' }}
                >
                  Events Near You
                </span>
              </h1>

              <p
              className="text-gray-400 text-sm sm:text-[1.1rem] mb-7 sm:mb-10 max-w-[440px] leading-relaxed"
                style={{ opacity: 0, animation: 'fadeUp .7s .3s cubic-bezier(.16,1,.3,1) forwards' }}>
                Concerts, tech talks, food festivals &amp; sports across Islamabad &mdash; find what&apos;s happening and secure your seat in seconds.
              </p>

              {/* Search bar */}
              <form onSubmit={handleSearch}
                className="flex items-center bg-[#12121e] border border-white/[.09] rounded-2xl overflow-hidden mb-6 max-w-[580px] shadow-[0_8px_56px_rgba(0,0,0,.55)] hover:border-white/[.15] transition-all"
                style={{ opacity: 0, animation: 'fadeUp .7s .42s cubic-bezier(.16,1,.3,1) forwards' }}>
                <div className="flex items-center gap-3 flex-1 px-4 sm:px-5">
                  <Search className="w-4 h-4 text-gray-600 shrink-0" />
                  <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search events, artists, venues"
                    className="flex-1 min-w-0 text-white text-sm py-3.5 sm:py-4 outline-none bg-transparent placeholder-gray-600" />
                </div>
                <div className="hidden sm:block w-px h-8 bg-white/[.07] shrink-0" />
                <div className="hidden sm:flex items-center gap-2 px-4">
                  <MapPin className="w-4 h-4 text-gray-600 shrink-0" />
                  <input type="text" value={city} onChange={(e) => setCity(e.target.value)}
                    placeholder="Islamabad"
                    className="w-24 text-sm text-white py-4 outline-none bg-transparent placeholder-gray-600" />
                </div>
                <button type="submit"
                  className="bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white font-bold text-sm px-5 sm:px-7 py-[1.1rem] transition-colors shrink-0">
                  Search
                </button>
              </form>

              {/* Category chips */}
              <div className="flex flex-wrap gap-2"
                style={{ opacity: 0, animation: 'fadeUp .7s .54s cubic-bezier(.16,1,.3,1) forwards' }}>
                {EVENT_CATEGORIES.slice(0, 7).map((cat) => (
                  <Link key={cat.id} href={`/events?category=${cat.id}`}
                    className="flex items-center gap-1.5 text-xs bg-white/[.04] border border-white/[.08] text-gray-400 hover:bg-white/[.08] hover:border-white/[.16] hover:text-white rounded-full px-3.5 py-2 transition-all font-medium">
                    <span>{cat.icon}</span>{cat.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right — Hero Image */}
            <div className="hidden lg:flex flex-col gap-4"
              style={{ opacity: 0, animation: 'fadeUp .7s .28s cubic-bezier(.16,1,.3,1) forwards' }}>

              {/* Image card */}
              <div className="relative rounded-3xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,.65)] border border-white/[.08]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=900&q=85"
                  alt="Live events happening near you"
                  className="w-full h-[440px] object-cover"
                />
                {/* Top-to-bottom dark gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#07070e]/80 via-[#07070e]/10 to-transparent" />
                {/* Colour tint */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-600/[.08] via-transparent to-violet-600/[.08]" />

                {/* Live pill */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/50 backdrop-blur-md border border-white/[.12] text-white text-[10px] font-bold px-3 py-1.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
                  100+ Events Live
                </div>

                {/* Rating pill */}
                <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/50 backdrop-blur-md border border-white/[.12] text-amber-400 text-[10px] font-bold px-3 py-1.5 rounded-full">
                  <Star className="w-3 h-3 fill-current" />
                  4.9 · Islamabad
                </div>

                {/* Bottom overlay */}
                <div className="absolute bottom-0 inset-x-0 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    {['A', 'B', 'S'].map((initial, i) => (
                      <div key={i}
                        className={`w-7 h-7 rounded-full border-2 border-white/20 flex items-center justify-center text-white text-[11px] font-bold shrink-0 bg-gradient-to-br ${i === 0 ? 'from-brand-500 to-pink-500' : i === 1 ? 'from-blue-500 to-violet-500' : 'from-emerald-500 to-cyan-500'} ${i > 0 ? '-ml-2' : ''}`}>
                        {initial}
                      </div>
                    ))}
                    <span className="text-white/70 text-[11px] font-semibold ml-1">50,000+ tickets sold</span>
                  </div>
                  <p className="text-white font-bold text-base leading-snug">
                    Your next favourite event<br />
                    <span className="text-gray-300 font-normal text-sm">is happening right now in Islamabad.</span>
                  </p>
                </div>
              </div>

              {/* Browse all events */}
              <Link href="/events"
                className="flex items-center justify-center gap-2 text-xs font-semibold text-gray-500 border border-white/[.06] hover:border-brand-500/30 hover:text-brand-400 rounded-2xl py-4 transition-all">
                Browse all events <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[.06] to-transparent" />
      </section>

      {/*  STATS  */}
      <section className="border-y border-white/[.05] bg-[#0c0c18] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 100% at 50% 50%, rgba(225,29,72,.04) 0%, transparent 65%)' }} />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4">
            {STATS.map(({ value, label, color }, i) => (
              <Reveal key={label} delay={i * 100}
                className="flex flex-col items-center text-center py-12 px-6 border-r border-white/[.05] last:border-r-0 sm:[&:nth-child(2)]:border-r sm:[&:nth-child(4)]:border-r-0 [&:nth-child(2)]:border-r-0">
                <div className={`text-4xl md:text-5xl font-black mb-2 ${color}`}>{value}</div>
                <div className="text-xs text-gray-600 font-semibold uppercase tracking-[0.15em]">{label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/*  CATEGORIES  */}
      <section className="py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[11px] font-bold tracking-[0.22em] text-brand-500 uppercase mb-2">Browse</p>
              <h2 className="text-3xl font-black text-white tracking-tight">What are you into?</h2>
            </div>
            <Link href="/events" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-brand-400 transition-colors">
              All events <ArrowRight className="w-4 h-4" />
            </Link>
          </Reveal>
        </div>
        {/* Infinite marquee — overflows the max-w container intentionally */}
        <div className="relative">
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(90deg, #07070e 0%, transparent 100%)' }} />
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(270deg, #07070e 0%, transparent 100%)' }} />

          <div className="overflow-hidden">
            {/* Duplicate the list so it loops seamlessly */}
            <div className="animate-marquee gap-3 px-3">
              {[...EVENT_CATEGORIES, ...EVENT_CATEGORIES].map((cat, i) => (
                <Link
                  key={`${cat.id}-${i}`}
                  href={`/events?category=${cat.id}`}
                  className="group inline-flex flex-col items-center gap-2.5 p-4 mx-1.5 rounded-2xl bg-white/[.03] border border-white/[.07] hover:bg-white/[.07] hover:border-brand-500/30 hover:shadow-[0_8px_32px_rgba(225,29,72,.08)] transition-all cursor-pointer w-[100px] shrink-0"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{cat.icon}</span>
                  <span className="text-[11px] font-semibold text-gray-500 group-hover:text-white text-center leading-tight">{cat.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/*  FEATURED EVENTS  */}
      {featured.length > 0 && (
        <section className="py-16 bg-[#0b0b16]">
          <div className="max-w-7xl mx-auto px-4">
            <Reveal className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[11px] font-bold tracking-[0.22em] text-brand-500 uppercase mb-2">Featured</p>
                <h2 className="text-3xl font-black text-white tracking-tight">Handpicked for you</h2>
              </div>
              <Link href="/events" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-brand-400 transition-colors">
                See all <ArrowRight className="w-4 h-4" />
              </Link>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.map((event, i) => (
                <Reveal key={event._id || event.id} delay={i * 80}>
                  <EventCard event={event} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/*  FEATURES  */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 50% 50% at 50% 100%, rgba(139,92,246,.05) 0%, transparent 60%)' }} />
        <div className="relative max-w-7xl mx-auto px-4">
          <Reveal className="text-center mb-16">
            <p className="text-[11px] font-bold tracking-[0.22em] text-brand-500 uppercase mb-3">Why EventNest</p>
            <h2 className="text-3xl font-black text-white tracking-tight max-w-lg mx-auto leading-tight">
              Everything to attend  or run  a great event.
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map(({ icon: Icon, from, to, ring, blob, iconColor, title, desc }, i) => (
              <Reveal key={title} delay={i * 80}>
                <div className={`group relative flex gap-5 p-7 rounded-2xl bg-white/[.025] border border-white/[.07] ${ring} transition-all duration-300 overflow-hidden`}
                  style={{ '--blob': blob }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 20px 60px ${blob}, 0 0 0 1px rgba(255,255,255,.06)`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = ''; }}>
                  {/* Gradient blob on hover */}
                  <div className={`absolute -top-10 -right-10 w-36 h-36 rounded-full bg-gradient-to-br ${from} ${to} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
                  {/* Icon */}
                  <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${from} ${to} border border-white/[.06] flex items-center justify-center shrink-0 mt-0.5 shadow-[0_4px_20px_rgba(0,0,0,.3)]`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                  </div>
                  <div className="relative">
                    <h3 className="font-bold text-white mb-2 text-[1rem]">{title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/*  UPCOMING EVENTS  */}
      {upcoming.length > 0 && (
        <section className="py-16 bg-[#0b0b16]">
          <div className="max-w-7xl mx-auto px-4">
            <Reveal className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[11px] font-bold tracking-[0.22em] text-brand-500 uppercase mb-2">Coming Up</p>
                <h2 className="text-3xl font-black text-white tracking-tight">Don&apos;t miss these</h2>
              </div>
              <Link href="/events" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-brand-400 transition-colors">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {upcoming.slice(0, 6).map((event, i) => (
                <Reveal key={event._id || event.id} delay={i * 80}>
                  <div className="relative group">
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 glass rounded-lg px-2.5 py-1.5">
                      <CalendarDays className="w-3 h-3 text-brand-400" />
                      <span className="text-[10px] font-bold text-white">
                        {event.startDate ? new Date(event.startDate).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' }) : 'Upcoming'}
                      </span>
                    </div>
                    <EventCard event={event} />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/*  HOW IT WORKS  */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(225,29,72,.04) 0%, transparent 60%)' }} />
        <div className="relative max-w-4xl mx-auto px-4">
          <Reveal className="text-center mb-16">
            <p className="text-[11px] font-bold tracking-[0.22em] text-brand-500 uppercase mb-3">How It Works</p>
            <h2 className="text-3xl font-black text-white tracking-tight">From discovery to front door  in three steps.</h2>
          </Reveal>
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Dashed connector */}
            <div className="hidden md:block absolute top-8 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px"
              style={{ background: 'linear-gradient(90deg, rgba(225,29,72,.4) 0%, rgba(139,92,246,.4) 50%, rgba(225,29,72,.4) 100%)' }} />

            {STEPS.map(({ icon: Icon, step, title, desc }, i) => (
              <Reveal key={step} delay={i * 140} className="text-center relative">
                <div className="relative inline-flex mb-6">
                  <div
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center shadow-[0_0_36px_rgba(225,29,72,.4)]"
                    style={{ animation: `float 4s ${i * .8}s ease-in-out infinite` }}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="absolute -top-2.5 -right-2.5 w-6 h-6 bg-[#0b0b16] border border-white/[.12] rounded-full flex items-center justify-center text-[10px] font-black text-brand-400">{step}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/*  TESTIMONIALS  */}
      <section className="py-16 bg-[#0b0b16]">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal className="text-center mb-12">
            <p className="text-[11px] font-bold tracking-[0.22em] text-brand-500 uppercase mb-3">What People Say</p>
            <h2 className="text-3xl font-black text-white tracking-tight">Loved across Islamabad &amp; Rawalpindi.</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 100}>
                <div className="relative flex flex-col h-full p-7 rounded-2xl glass card-lift overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-px" style={{ background: `linear-gradient(90deg, transparent, rgba(225,29,72,.3), transparent)` }} />
                  <div className="flex gap-0.5 text-amber-400 mb-5">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-current" />)}
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed flex-1 mb-6">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/[.06]">
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.grad} flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-[0_0_12px_rgba(0,0,0,.4)]`}>
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-white">{t.name}</p>
                      <p className="text-xs text-gray-600">{t.role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/*  CTA  */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 70% at 50% 60%, rgba(225,29,72,.09) 0%, transparent 65%)' }} />
          <div className="absolute inset-0 opacity-[0.018]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize: '64px 64px' }} />
        </div>
        <div className="relative max-w-2xl mx-auto px-4 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 border border-brand-500/25 bg-brand-500/[.07] rounded-full px-4 py-1.5 text-xs font-bold mb-8 text-brand-300 tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" /> For Organizers
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight mb-5">
              Ready to sell tickets<br />
              <span className="animate-gradient" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundImage: 'linear-gradient(90deg, #fb7093, #e11d48, #a855f7, #fb7093)', backgroundSize: '200% 200%' }}>
                in Islamabad?
              </span>
            </h2>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed">
              Create your event, set your prices, and start selling  all from one dashboard. No setup fees.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup"
                className="group relative overflow-hidden bg-brand-600 hover:bg-brand-500 text-white font-bold px-8 py-4 rounded-xl transition-all btn-3d text-sm">
                <span className="relative z-10">Create Free Account</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[.12] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Link>
              <Link href="/events"
                className="border border-white/[.10] hover:bg-white/[.06] hover:border-white/[.18] text-gray-300 hover:text-white font-semibold px-8 py-4 rounded-xl transition-all text-sm">
                Browse Events
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}