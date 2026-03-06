import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, QrCode, Download } from 'lucide-react';
import { formatDateTime, formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

const STATUS_MAP = {
  confirmed: { variant: 'success', label: 'Confirmed' },
  used:      { variant: 'default', label: 'Used'      },
  cancelled: { variant: 'danger',  label: 'Cancelled' },
  pending:   { variant: 'warning', label: 'Pending'   },
};

export default function TicketCard({ ticket, onViewQR }) {
  const status = STATUS_MAP[ticket.status] || STATUS_MAP.confirmed;

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Event thumb */}
        <div className="relative w-full sm:w-40 h-32 sm:h-auto bg-gray-100 shrink-0">
          <Image
            src={ticket.eventBanner || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400'}
            alt={ticket.eventTitle}
            fill
            className="object-cover"
            sizes="160px"
          />
        </div>

        {/* Details */}
        <div className="flex-1 p-4 flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/events/${ticket.eventId}`}
              className="font-bold text-gray-900 hover:text-brand-600 transition-colors leading-snug"
            >
              {ticket.eventTitle}
            </Link>
            <Badge variant={status.variant} dot className="shrink-0">{status.label}</Badge>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Calendar className="w-3.5 h-3.5 text-brand-500" />
              {formatDateTime(ticket.startTime)}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <MapPin className="w-3.5 h-3.5 text-brand-500" />
              {ticket.location}
            </div>
          </div>

          <div className="flex items-center gap-3 mt-auto pt-2 border-t border-gray-50 flex-wrap">
            <div>
              <span className="text-xs text-gray-400">Ticket Type</span>
              <p className="text-sm font-semibold text-gray-800">{ticket.ticketType}</p>
            </div>
            <div>
              <span className="text-xs text-gray-400">Paid</span>
              <p className="text-sm font-semibold text-gray-800">{formatCurrency(ticket.price)}</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              {ticket.status !== 'cancelled' && (
                <button
                  onClick={() => onViewQR?.(ticket)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 text-white text-xs font-semibold rounded-lg hover:bg-brand-700 transition-colors"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  View QR
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
