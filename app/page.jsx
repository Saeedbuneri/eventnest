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
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-purple-700 text-white">
        {/* decorative blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-36">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              100+ events happening this weekend in your city
            </div>

            <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
              Find Your Next<br />
              <span className="text-accent-300">Local Experience</span>
            </h1>

            <p className="text-xl text-brand-100 mb-10 leading-relaxed max-w-2xl mx-auto">
              Discover concerts, festivals, workshops, and more. Book instantly, get QR tickets, and enjoy seamless entry.
            </p>

            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-2xl max-w-2xl mx-auto"
            >
              <div className="flex items-center gap-3 flex-1 px-3">
                <Search className="w-5 h-5 text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search events, artists, categories…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 text-gray-900 text-sm py-2 outline-none bg-transparent placeholder-gray-400"
                />
              </div>
              <div className="flex items-center gap-2 px-3 border-t sm:border-t-0 sm:border-l border-gray-200 pt-2 sm:pt-0">
                <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-28 text-gray-900 text-sm py-2 outline-none bg-transparent placeholder-gray-400"
                />
              </div>
              <button
                type="submit"
                className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
              >
                Search
              </button>
            </form>

            {/* Quick links */}
            <div className="flex items-center justify-center flex-wrap gap-2 mt-6 text-sm text-brand-200">
              <span>Popular:</span>
              {['Music', 'Tech', 'Sports', 'Free Events'].map((k) => (
                <Link
                  key={k}
                  href={`/events?q=${k}`}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-3 py-1 transition-colors"
                >
                  {k}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ─────────────────────────────────────────────────────── */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-extrabold text-accent-400">{s.value}</div>
                <div className="text-sm text-gray-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">Browse by Category</h2>
            <p className="section-subtitle">Find events that match your vibe</p>
          </div>
          <Link href="/events" className="text-brand-600 hover:text-brand-700 font-medium text-sm flex items-center gap-1">
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
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">Featured Events</h2>
              <p className="section-subtitle">Handpicked experiences you'll love</p>
            </div>
            <Link href="/events" className="text-brand-600 hover:text-brand-700 font-medium text-sm flex items-center gap-1">
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
          <h2 className="section-title">How EventNest Works</h2>
          <p className="section-subtitle">From discovery to the door in minutes</p>
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
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">Loved by thousands</h2>
            <p className="section-subtitle">Here's what people are saying</p>
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
      <section className="bg-gradient-to-r from-brand-600 to-purple-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm font-medium mb-6">
            <Zap className="w-4 h-4 text-accent-300" />
            Start in under 5 minutes
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Ready to host your event?
          </h2>
          <p className="text-brand-100 text-lg mb-8 max-w-xl mx-auto">
            Create your event, set up ticket tiers, and start selling — all in one place. No technical skills needed.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/auth/signup"
              className="bg-white text-brand-700 hover:bg-brand-50 font-bold px-8 py-3.5 rounded-xl transition-colors"
            >
              Create Free Account
            </Link>
            <Link
              href="/events"
              className="bg-white/10 hover:bg-white/20 border border-white/30 font-semibold px-8 py-3.5 rounded-xl transition-colors"
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
