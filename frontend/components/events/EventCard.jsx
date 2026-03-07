import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Calendar } from 'lucide-react';
import { formatDate, formatCurrency, getMinTicketPrice, truncate } from '@/lib/utils';
import { CATEGORY_MAP } from '@/lib/constants';

export default function EventCard({ event }) {
  const category   = CATEGORY_MAP[event.category];
  const minPrice   = getMinTicketPrice(event.ticketTypes);
  const totalSeats = event.ticketTypes?.reduce((s, t) => s + t.quantity, 0) || 0;
  const soldSeats  = event.ticketTypes?.reduce((s, t) => s + (t.sold || 0), 0) || 0;
  const soldPct    = totalSeats ? Math.round((soldSeats / totalSeats) * 100) : 0;
  const almostFull = soldPct >= 80;

  return (
    <Link href={`/events/${event._id}`} className="card group flex flex-col overflow-hidden card-lift">
      {/* Banner */}
      <div className="relative h-48 overflow-hidden bg-white/[.05]">
        <Image
          src={event.bannerImage || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800'}
          alt={event.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {category && (
          <span className={`absolute top-3 left-3 badge ${category.color} font-semibold shadow-sm`}>
            {category.icon} {category.label}
          </span>
        )}
        {almostFull && (
          <span className="absolute top-3 right-3 badge bg-red-500 text-white font-semibold">
             Almost Full
          </span>
        )}
        {event.featured && !almostFull && (
          <span className="absolute top-3 right-3 badge bg-accent-500 text-white font-semibold">
             Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="font-bold text-white leading-snug group-hover:text-brand-400 transition-colors line-clamp-2">
          {event.title}
        </h3>
        <p className="text-gray-400 text-sm line-clamp-2">{truncate(event.description, 100)}</p>

        <div className="flex flex-col gap-1.5 mt-auto pt-3 border-t border-white/[.06]">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Calendar className="w-3.5 h-3.5 text-brand-400 shrink-0" />
            {formatDate(event.startDate || event.startTime)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0" />
            {event.venue?.address || event.location?.address}, {event.venue?.city || event.location?.city}
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="text-brand-400 font-bold text-sm">
            {minPrice === 0 ? 'Free' : `From ${formatCurrency(minPrice)}`}
          </span>
          <span className="text-xs text-gray-500">{soldPct}% sold</span>
        </div>

        <div className="w-full h-1.5 bg-white/[.07] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${almostFull ? 'bg-red-400' : 'bg-brand-400'}`}
            style={{ width: `${soldPct}%` }}
          />
        </div>
      </div>
    </Link>
  );
}