'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Grid3x3, List } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EventCard from '@/components/events/EventCard';
import EventFilters from '@/components/events/EventFilters';
import { Spinner } from '@/components/ui/Spinner';
import { api } from '@/lib/api';

function EventsContent() {
  const searchParams = useSearchParams();
  const [view,    setView]    = useState('grid');
  const [loading, setLoading] = useState(true);
  const [events,  setEvents]  = useState([]);

  const q        = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const price    = searchParams.get('price') || '';
  const sort     = searchParams.get('sort') || 'date-asc';
  const city     = searchParams.get('city') || '';

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (q)        params.search   = q;
    if (category) params.category = category;
    if (city)     params.city     = city;
    if (price)    params.price    = price;
    if (sort)     params.sort     = sort;

    api.get('/events', { params })
      .then((res) => setEvents(res.data.events || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [q, category, price, sort, city]);

  const heading = category
    ? `${category.charAt(0).toUpperCase() + category.slice(1)} Events`
    : q
    ? `Results for "${q}"`
    : 'All Events';

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Page Header */}
      <div className="bg-gradient-to-r from-brand-600 to-purple-600 text-white py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-extrabold mb-1">{heading}</h1>
          <p className="text-brand-100 text-sm">
            {loading ? 'Searching...' : `${events.length} event${events.length !== 1 ? 's' : ''} found`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <EventFilters className="w-full lg:w-56 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-500">
                {loading ? 'Loading...' : `${events.length} results`}
              </p>
              <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                <button onClick={() => setView('grid')} className={`p-1.5 rounded ${view === 'grid' ? 'bg-white shadow-sm' : ''} transition-colors`} title="Grid view">
                  <Grid3x3 className="w-4 h-4 text-gray-600" />
                </button>
                <button onClick={() => setView('list')} className={`p-1.5 rounded ${view === 'list' ? 'bg-white shadow-sm' : ''} transition-colors`} title="List view">
                  <List className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (<div key={i} className="rounded-2xl bg-gray-100 animate-pulse h-72" />))}
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-24">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">No events found</h3>
                <p className="text-gray-500 text-sm">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5' : 'flex flex-col gap-4'}>
                {events.map((event) => (<EventCard key={event._id} event={event} />))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Spinner size="lg" /></div>}>
      <EventsContent />
    </Suspense>
  );
}
