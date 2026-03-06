import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Event from '@/models/Event';
import Booking from '@/models/Booking';
import { withAuth } from '@/middleware/withAuth';

async function handler(request, ctx, user) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const q     = searchParams.get('q')     || '';
    const page  = Math.max(1, parseInt(searchParams.get('page')  || '1'));
    const limit = Math.min(50, parseInt(searchParams.get('limit') || '10'));

    const filter = { organizer: user.id };
    if (q) filter.title = { $regex: q, $options: 'i' };

    const [events, total] = await Promise.all([
      Event.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Event.countDocuments(filter),
    ]);

    // Enrich with booking stats
    const eventIds  = events.map((e) => e._id);
    const bookingAgg = await Booking.aggregate([
      { $match: { event: { $in: eventIds }, status: { $ne: 'cancelled' } } },
      { $group: { _id: '$event', revenue: { $sum: '$totalAmount' }, sold: { $sum: '$quantity' } } },
    ]);
    const statsMap = Object.fromEntries(bookingAgg.map((b) => [b._id.toString(), b]));

    const enriched = events.map((e) => ({
      ...e,
      revenue:   statsMap[e._id.toString()]?.revenue ?? 0,
      soldCount: statsMap[e._id.toString()]?.sold    ?? 0,
    }));

    return NextResponse.json({ events: enriched, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const GET = withAuth(handler, { roles: ['organizer', 'admin'] });
