import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import Event from '@/models/Event';
import { withAuth } from '@/middleware/withAuth';

async function handler(request, { params }, user) {
  try {
    await connectDB();
    const event = await Event.findById(params.id).lean();
    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

    if (event.organizer.toString() !== user.id && user.role !== 'admin' && user.role !== 'staff') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const q     = searchParams.get('q')     || '';
    const page  = Math.max(1, parseInt(searchParams.get('page')  || '1'));
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '20'));

    const bookings = await Booking.find({ event: params.id })
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .lean();

    let attendees = bookings.map((b) => ({
      id:          b._id,
      name:        b.attendeeName || b.user?.name || '—',
      email:       b.attendeeEmail || b.user?.email || '—',
      ticketType:  b.ticketTypeName,
      price:       b.ticketTypePrice,
      quantity:    b.quantity,
      status:      b.status,
      qrToken:     b.qrToken,
      purchasedAt: b.createdAt,
    }));

    if (q) {
      const lower = q.toLowerCase();
      attendees = attendees.filter(
        (a) => a.name.toLowerCase().includes(lower) || a.email.toLowerCase().includes(lower)
      );
    }

    const total = attendees.length;
    const paged = attendees.slice((page - 1) * limit, page * limit);

    return NextResponse.json({ attendees: paged, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const GET = withAuth(handler, { roles: ['organizer', 'admin', 'staff'] });
