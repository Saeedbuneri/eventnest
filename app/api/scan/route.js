import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import { withAuth } from '@/middleware/withAuth';

async function handler(request, ctx, user) {
  try {
    await connectDB();
    const { token } = await request.json();

    if (!token?.trim()) {
      return NextResponse.json({ valid: false, message: 'Token is required' }, { status: 400 });
    }

    const booking = await Booking.findOne({ qrToken: token.trim() })
      .populate('event', 'title startDate endDate')
      .lean();

    if (!booking) {
      return NextResponse.json({ valid: false, message: 'Invalid token — not found' });
    }
    if (booking.status === 'used') {
      return NextResponse.json({ valid: false, message: 'Already scanned — ticket already used' });
    }
    if (booking.status === 'cancelled') {
      return NextResponse.json({ valid: false, message: 'Ticket has been cancelled' });
    }

    // Mark as used
    await Booking.findByIdAndUpdate(booking._id, { status: 'used' });

    return NextResponse.json({
      valid: true,
      ticket: {
        id:           booking._id,
        attendeeName: booking.attendeeName,
        eventTitle:   booking.event?.title,
        ticketType:   booking.ticketTypeName,
        status:       'confirmed',
      },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const POST = withAuth(handler, { roles: ['staff', 'organizer', 'admin'] });
