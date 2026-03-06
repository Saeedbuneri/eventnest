import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Event from '@/models/Event';
import Booking from '@/models/Booking';
import { withAuth } from '@/middleware/withAuth';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

async function handler(request, ctx, user) {
  try {
    await connectDB();
    const myEvents = await Event.find({ organizer: user.id }).select('_id').lean();
    const eventIds = myEvents.map((e) => e._id);

    const data = await Booking.aggregate([
      { $match: { event: { $in: eventIds }, status: { $ne: 'cancelled' } } },
      {
        $group: {
          _id:     { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          tickets: { $sum: '$quantity' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 },
    ]);

    const result = data.map((d) => ({
      month:   MONTHS[d._id.month - 1],
      revenue: d.revenue,
      tickets: d.tickets,
    }));

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const GET = withAuth(handler, { roles: ['organizer', 'admin'] });
