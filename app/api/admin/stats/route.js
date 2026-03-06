import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Event from '@/models/Event';
import Booking from '@/models/Booking';
import { withAuth } from '@/middleware/withAuth';

async function handler() {
  try {
    await connectDB();
    const [totalUsers, totalEvents, revenueAgg, ticketsAgg] = await Promise.all([
      User.countDocuments(),
      Event.countDocuments(),
      Booking.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Booking.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$quantity' } } },
      ]),
    ]);

    return NextResponse.json({
      totalRevenue: revenueAgg[0]?.total ?? 0,
      totalUsers,
      totalEvents,
      totalTickets: ticketsAgg[0]?.total ?? 0,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const GET = withAuth(handler, { roles: ['admin'] });
