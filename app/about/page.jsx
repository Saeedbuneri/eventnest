import Link from 'next/link';
import { Ticket, Users, MapPin, Zap, ShieldCheck, Heart } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const TEAM = [
  { name: 'Saeed Buneri',    role: 'Founder & CEO',       avatar: 'S', bio: 'Event tech entrepreneur building Islamabad\'s digital ticketing future.' },
  { name: 'Ayesha Raza',     role: 'Head of Operations',  avatar: 'A', bio: 'Coordinates 100+ organizers across the twin cities every month.' },
  { name: 'Usman Tariq',     role: 'Lead Engineer',       avatar: 'U', bio: 'Full-stack developer obsessed with clean UX and fast systems.' },
  { name: 'Fatima Malik',    role: 'Community Manager',   avatar: 'F', bio: 'Connects local artists, organisers, and venues in Islamabad.' },
];

const VALUES = [
  { icon: MapPin,      title: 'Proudly Local',       desc: 'Built for Islamabad. Every feature is designed around the twin cities — Islamabad & Rawalpindi.' },
  { icon: Zap,         title: 'Fast & Seamless',     desc: 'Book a ticket in under 30 seconds. QR entry in under 5.' },
  { icon: ShieldCheck, title: 'Secure by Default',   desc: 'End-to-end encrypted payments, verified QR tokens, and role-based access for every stakeholder.' },
  { icon: Heart,       title: 'Community First',     desc: 'We exist to help local organizers succeed — not to take a huge cut. Fair pricing, always.' },
];

const MILESTONES = [
  { year: '2024', event: 'EventNest founded in Islamabad, Pakistan.' },
  { year: '2025', event: 'First 1,000 tickets sold at F-9 Park Music Night.' },
  { year: '2025', event: 'Onboarded 200+ organizers across Islamabad & Rawalpindi.' },
  { year: '2026', event: '50,000+ tickets sold. QR scan tech deployed at 500+ events.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-[#0a0a10] text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(ellipse 70% 50% at 10% 60%, rgba(225,29,72,0.12) 0%, transparent 55%)' }} />
        <div className="relative max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 border border-brand-500/25 bg-brand-500/10 rounded-full px-4 py-1.5 text-xs font-bold mb-6 text-brand-300 tracking-widest uppercase">
            <Ticket className="w-3.5 h-3.5" /> About EventNest
          </div>
          <h1 className="text-5xl sm:text-6xl font-black leading-tight tracking-tight mb-6">
            Islamabad&apos;s<br /><span className="text-brand-400">Event Platform.</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl leading-relaxed">
            We&apos;re on a mission to make every live experience in Islamabad accessible, seamless, and unforgettable — from buying the ticket to scanning at the door.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#111118] border-y border-white/5 text-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/5">
            {[
              { value: '50K+',  label: 'Tickets Sold' },
              { value: '500+',  label: 'Events Hosted' },
              { value: '200+',  label: 'Organizers' },
              { value: '4.9★',  label: 'Avg. Rating' },
            ].map((s) => (
              <div key={s.label} className="text-center py-8 px-4">
                <div className="text-3xl font-black text-brand-400">{s.value}</div>
                <div className="text-xs text-gray-500 mt-1 uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-3xl mx-auto px-4 py-20">
        <p className="text-xs font-bold tracking-[0.2em] text-brand-500 uppercase mb-3">Our Story</p>
        <h2 className="text-4xl font-black text-gray-950 tracking-tight mb-6">From a problem to a platform.</h2>
        <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
          <p>
            EventNest started in 2024 when our founder Saeed couldn&apos;t find a reliable way to buy tickets for a local concert at F-9 Park. He was sent a WhatsApp number, transferred money via JazzCash, and never received confirmation. He showed up at the door and was turned away.
          </p>
          <p>
            That experience — frustrating, but all too common in Islamabad — sparked the idea. What if there was a platform built specifically for the twin cities, where finding, booking, and attending events was as smooth as ordering food online?
          </p>
          <p>
            Today, EventNest powers hundreds of events monthly — concerts at Lok Virsa, tech meetups in Blue Area, food festivals in F-7 Markaz, and college fests across Islamabad. Every ticket is digital, every entry is QR-verified, and every organizer has a real dashboard.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-[#f4f4f7] py-16">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-xs font-bold tracking-[0.2em] text-brand-500 uppercase mb-3">Timeline</p>
          <h2 className="text-4xl font-black text-gray-950 tracking-tight mb-10">How we got here.</h2>
          <div className="space-y-6">
            {MILESTONES.map((m) => (
              <div key={m.year} className="flex gap-5">
                <div className="w-14 shrink-0 text-right">
                  <span className="text-sm font-black text-brand-600">{m.year}</span>
                </div>
                <div className="flex-1 border-l-2 border-brand-100 pl-5 pb-6">
                  <p className="text-gray-700 font-medium">{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <p className="text-xs font-bold tracking-[0.2em] text-brand-500 uppercase mb-3">Our Values</p>
        <h2 className="text-4xl font-black text-gray-950 tracking-tight mb-10">What we stand for.</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {VALUES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-brand-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="bg-[#f4f4f7] py-16">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-xs font-bold tracking-[0.2em] text-brand-500 uppercase mb-3">The Team</p>
          <h2 className="text-4xl font-black text-gray-950 tracking-tight mb-10">People behind the platform.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TEAM.map((m) => (
              <div key={m.name} className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm">
                <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-black text-2xl mx-auto mb-4">
                  {m.avatar}
                </div>
                <p className="font-bold text-gray-900">{m.name}</p>
                <p className="text-xs text-brand-600 font-semibold mb-2">{m.role}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0a0a10] text-white py-20 text-center">
        <div className="max-w-xl mx-auto px-4">
          <Users className="w-10 h-10 text-brand-400 mx-auto mb-4" />
          <h2 className="text-3xl font-black mb-3">Join the EventNest community</h2>
          <p className="text-gray-400 mb-8">Create an account to start discovering and booking events in Islamabad today.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/auth/signup" className="bg-brand-600 hover:bg-brand-500 text-white font-bold px-7 py-3 rounded-xl transition-colors shadow-[0_0_20px_rgba(225,29,72,0.3)]">
              Get Started Free
            </Link>
            <Link href="/events" className="border border-white/15 hover:border-white/30 text-gray-300 hover:text-white font-semibold px-7 py-3 rounded-xl transition-colors">
              Browse Events
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
