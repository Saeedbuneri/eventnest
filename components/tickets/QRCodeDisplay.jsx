'use client';

import { QRCodeSVG } from 'qrcode.react';
import { Download, Ticket, Calendar, MapPin } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

export default function QRCodeDisplay({ ticket }) {
  const qrValue = JSON.stringify({
    token:     ticket.qrToken,
    eventId:   ticket.eventId,
    ticketId:  ticket._id,
    type:      ticket.ticketType,
  });

  const handleDownload = () => {
    const svg  = document.getElementById(`qr-${ticket._id}`);
    if (!svg) return;
    const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `ticket-${ticket._id}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col items-center gap-5 p-4">
      {/* Event Info */}
      <div className="text-center">
        <h3 className="font-bold text-gray-900 text-lg leading-snug">{ticket.eventTitle}</h3>
        <div className="flex flex-col items-center gap-1 mt-2">
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Calendar className="w-4 h-4 text-brand-500" />
            {formatDateTime(ticket.startTime)}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <MapPin className="w-4 h-4 text-brand-500" />
            {ticket.location}
          </div>
        </div>
      </div>

      {/* QR Code */}
      <div className="bg-white p-4 rounded-2xl border-2 border-brand-100 shadow-inner">
        <QRCodeSVG
          id={`qr-${ticket._id}`}
          value={qrValue}
          size={200}
          level="H"
          includeMargin
          fgColor="#1a1a2e"
        />
      </div>

      {/* Ticket Type badge */}
      <div className="flex items-center gap-2 bg-brand-50 text-brand-700 px-4 py-2 rounded-xl">
        <Ticket className="w-4 h-4" />
        <span className="font-semibold text-sm">{ticket.ticketType} · {ticket.attendeeName}</span>
      </div>

      {/* Token */}
      <p className="text-xs text-gray-400 font-mono bg-gray-50 px-3 py-1.5 rounded-lg text-center break-all">
        {ticket.qrToken}
      </p>

      {/* Download */}
      <button
        onClick={handleDownload}
        className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors"
      >
        <Download className="w-4 h-4" />
        Download QR
      </button>
    </div>
  );
}
