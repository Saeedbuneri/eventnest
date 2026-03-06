'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search, MapPin, ArrowRight, Ticket, QrCode, CheckCircle,
  Users, Star, Zap,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EventCard from '@/components/events/EventCard';
import { EVENT_CATEGORIES } from '@/lib/constants';
import { api } from '@/lib/api';

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
  const router = useRouter();

  useEffect(() => {
    api.get('/events', { params: { featured: true, limit: 6 } })
      .then((res) => setFeatured(res.data.events || []))
      .catch(() => {});
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
