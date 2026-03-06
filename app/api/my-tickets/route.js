import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Booking from '@/models/Booking';
import { withAuth } from '@/middleware/withAuth';

async function handler(request, ctx, user) {
  try {
    await connectDB();
    const bookings = await Booking.find({ user: user.id })
      .sort({ createdAt: -1 })
      .populate('event', 'title bannerImage startDate endDate venue category')
      .lean();

    const tickets = bookings.map((b) => ({
      _id:           b._id,
      eventId:       b.event?._id,
      eventTitle:    b.event?.title,
      eventBanner:   b.event?.bannerImage,
      startTime:     b.event?.startDate,
      endTime:       b.event?.endDate,
      location:      b.event?.venue?.address
                       ? `${b.event.venue.address}, ${b.event.venue.city}`
                       : '',
      ticketType:    b.ticketTypeName,
      ticketPrice:   b.ticketTypePrice,
      quantity:      b.quantity,
      totalAmount:   b.totalAmount,
      status:        b.status,
      qrToken:       b.qrToken,
      attendeeName:  b.attendeeName,
      attendeeEmail: b.attendeeEmail,
      purchasedAt:   b.createdAt,
    }));

    return NextResponse.json({ tickets });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const GET = withAuth(handler);
