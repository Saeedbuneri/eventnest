'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin, Calendar, Clock, Users, Share2, Heart, ChevronLeft, ExternalLink,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TicketSelector from '@/components/events/TicketSelector';
import EventCard from '@/components/events/EventCard';
import { Badge } from '@/components/ui/Badge';
import { CATEGORY_MAP } from '@/lib/constants';
import { formatDate, formatTime } from '@/lib/utils';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export default function EventDetailPage({ params }) {
  const { id }    = params;
  const router    = useRouter();
  const [liked,   setLiked]   = useState(false);
  const [event,   setEvent]   = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/events/${id}`)
      .then(async (res) => {
        const ev = res.data.event;
        setEvent(ev);
        // Fetch related events
        try {
          const rel = await api.get('/events', { params: { category: ev.category, limit: 4 } });
          setRelated((rel.data.events || []).filter((e) => e._id !== id).slice(0, 3));
        } catch {}
      })
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
  }, [id]);

  const category = event ? CATEGORY_MAP[event.category] : null;
  const soldCount = event?.ticketTypes?.reduce((s, t) => s + (t.sold || 0), 0) || 0;
  const organizerName = typeof event?.organizer === 'object'
    ? event.organizer?.name || 'EventNest Organizer'
    : 'EventNest Organizer';

  const handleCheckout = (selectedTickets) => {
    const encoded = encodeURIComponent(JSON.stringify(selectedTickets));
    router.push(`/checkout/${event._id}?tickets=${encoded}`);
  };

  const handleShare = async () => {
    try {
      await navigator.share({ title: event?.title, url: window.location.href });
    } catch {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07070e]">
        <Navbar />
        <div className="relative w-full h-72 sm:h-96 bg-white/[.07] animate-pulse" />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-4">
              <div className="h-10 bg-white/[.06] rounded-xl animate-pulse w-3/4" />
              <div className="h-4 bg-white/[.05] rounded animate-pulse w-1/2" />
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-20 bg-white/[.06] rounded-xl animate-pulse" />
                ))}
              </div>
              <div className="space-y-2 pt-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 bg-white/[.05] rounded animate-pulse" style={{ width: `${90 - i * 10}%` }} />
                ))}
              </div>
            </div>
            <div className="w-full lg:w-80 shrink-0">
              <div className="h-64 bg-white/[.06] rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#07070e]">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 text-center px-4">
          <h2 className="text-2xl font-bold text-white mb-2">Event not found</h2>
          <p className="text-gray-500 mb-6">This event may have been removed or the link is incorrect.</p>
          <Link href="/events" className="btn-primary py-2 px-5 text-sm rounded-lg">Browse Events</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07070e]">
      <Navbar />

      {/* Banner */}
      <div className="relative w-full h-72 sm:h-96 bg-white/[.07]">
        <Image
          src={event.bannerImage || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200'}
          alt={event.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />

        <Link
          href="/events"
          className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-gray-800 text-sm font-medium px-3 py-2 rounded-xl hover:bg-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Events
        </Link>

        {category && (
          <span className={`absolute top-4 right-4 badge ${category.color} font-semibold shadow`}>
            {category.icon} {category.label}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left */}
          <div className="flex-1 min-w-0 space-y-6">

            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">{event.title}</h1>
                <p className="text-gray-400 mt-1 text-sm">
                  Hosted by <span className="font-semibold text-gray-300">{organizerName}</span>
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => { setLiked(!liked); toast.success(liked ? 'Removed from saved' : 'Event saved!'); }}
                  aria-label={liked ? 'Remove from saved' : 'Save event'}
                  className={`p-2.5 rounded-xl border transition-colors ${liked ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'border-white/[.10] text-gray-500 hover:border-red-500/30 hover:text-red-400'}`}
                >
                  <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  aria-label="Share event"
                  className="p-2.5 rounded-xl border border-white/[.10] text-gray-500 hover:border-brand-500/30 hover:text-brand-400 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Event meta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Calendar, label: 'Date',      value: formatDate(event.startDate) },
                { icon: Clock,    label: 'Time',      value: `${formatTime(event.startDate)} â€“ ${formatTime(event.endDate)}` },
                { icon: MapPin,   label: 'Location',  value: `${event.venue?.address}, ${event.venue?.city}` },
                { icon: Users,    label: 'Attendees', value: `${soldCount.toLocaleString()} going` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3 bg-white/[.04] border border-white/[.06] rounded-xl p-3.5">
                  <div className="w-9 h-9 bg-brand-500/20 rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-brand-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium">{label}</p>
                    <p className="text-sm font-semibold text-white mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h2 className="font-bold text-lg text-white mb-3">About this event</h2>
              <p className="text-gray-400 leading-relaxed whitespace-pre-line">{event.description}</p>
            </div>


            {/* Venue */}
            <div>
              <h2 className="font-bold text-lg text-white mb-3">Venue</h2>
              <div className="h-48 bg-white/[.04] border border-white/[.07] rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-300">{event.venue?.address}</p>
                  <p className="text-xs text-gray-500">{event.venue?.city}</p>
                  <a
                    href={"https://maps.google.com?q=" + encodeURIComponent((event.venue?.address || '') + " " + (event.venue?.city || ''))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-xs text-brand-400 hover:text-brand-300 transition-colors"
                  >
                    Open in Maps <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Related Events */}
            {related.length > 0 && (
              <div>
                <h2 className="font-bold text-lg text-white mb-4">
                  More {category?.label} Events
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {related.map((e) => <EventCard key={e._id} event={e} />)}
                </div>
              </div>
            )}
          </div>

          {/* Right: Ticket selector (sticky) */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="sticky top-24">
              <TicketSelector ticketTypes={event.ticketTypes} onCheckout={handleCheckout} />
              <p className="text-xs text-gray-600 text-center mt-3">
                Secure checkout. Instant QR ticket delivery
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
