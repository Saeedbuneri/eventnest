import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import Event from '@/models/Event';
import { withAuth } from '@/middleware/withAuth';

async function handler(request, ctx, user) {
  try {
    await connectDB();
    const { bookingId } = await request.json();

    if (!bookingId) {
      return NextResponse.json({ error: 'bookingId is required' }, { status: 400 });
    }

    const booking = await Booking.findById(bookingId).populate('event');
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Organizers may only refund bookings for their own events; admins can refund any
    if (user.role === 'organizer') {
      const organizerId = booking.event?.organizer?.toString();
      if (organizerId !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    if (booking.status === 'cancelled') {
      return NextResponse.json({ error: 'Booking is already cancelled' }, { status: 400 });
    }

    // Cancel booking and restore ticket availability
    booking.status = 'cancelled';
    await booking.save();

    // Restore sold count on the ticket type
    await Event.updateOne(
      { _id: booking.event._id, 'ticketTypes._id': booking.ticketTypeId },
      { $inc: { 'ticketTypes.$.sold': -booking.quantity } }
    );

    return NextResponse.json({
      message: 'Booking cancelled and refund processed.',
      booking: {
        _id: booking._id,
        status: booking.status,
        totalAmount: booking.totalAmount,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const POST = withAuth(handler, { roles: ['organizer', 'admin'] });
