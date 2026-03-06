import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Event from '@/models/Event';
import Booking from '@/models/Booking';
import { withAuth } from '@/middleware/withAuth';

async function handler(request, ctx, user) {
  try {
    await connectDB();
    const myEvents = await Event.find({ organizer: user.id }).select('_id').lean();
    const eventIds = myEvents.map((e) => e._id);

    const [revenueAgg, ticketsAgg, activeEvents, totalAttendees] = await Promise.all([
      Booking.aggregate([
        { $match: { event: { $in: eventIds }, status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Booking.aggregate([
        { $match: { event: { $in: eventIds }, status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$quantity' } } },
      ]),
      Event.countDocuments({ organizer: user.id, status: 'published' }),
      Booking.countDocuments({ event: { $in: eventIds }, status: { $ne: 'cancelled' } }),
    ]);

    return NextResponse.json({
      totalRevenue:   revenueAgg[0]?.total ?? 0,
      totalTickets:   ticketsAgg[0]?.total ?? 0,
      activeEvents,
      totalAttendees,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const GET = withAuth(handler, { roles: ['organizer', 'admin'] });
