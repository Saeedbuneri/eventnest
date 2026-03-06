import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Event from '@/models/Event';
import { withAuth } from '@/middleware/withAuth';

// ── GET /api/events ─────────────────────────────────────────────────────────
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const q        = searchParams.get('q')        || '';
    const category = searchParams.get('category') || '';
    const city     = searchParams.get('city')     || '';
    const price    = searchParams.get('price')    || '';
    const sort     = searchParams.get('sort')     || 'newest';
    const page     = Math.max(1, parseInt(searchParams.get('page')  || '1'));
    const limit    = Math.min(50, parseInt(searchParams.get('limit') || '12'));

    const filter = { status: 'published', isPublic: true };
    if (q)        filter.$text = { $search: q };
    if (category) filter.category = category;
    if (city)     filter['venue.city'] = { $regex: city, $options: 'i' };

    if (price === 'free')    filter['ticketTypes'] = { $elemMatch: { price: 0 } };
    if (price === 'paid')    filter['ticketTypes'] = { $not: { $elemMatch: { price: 0 } } };
    if (price === 'under25') filter['ticketTypes'] = { $elemMatch: { price: { $gt: 0, $lt: 25 } } };

    const sortMap = {
      newest:     { createdAt: -1 },
      date_asc:   { startDate: 1 },
      price_asc:  { 'ticketTypes.0.price': 1 },
      price_desc: { 'ticketTypes.0.price': -1 },
      popular:    { 'ticketTypes.sold': -1 },
    };
    const sortQuery = sortMap[sort] || { createdAt: -1 };

    const [events, total] = await Promise.all([
      Event.find(filter)
        .sort(sortQuery)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('organizer', 'name email avatar')
        .lean(),
      Event.countDocuments(filter),
    ]);

    return NextResponse.json({ events, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ── POST /api/events ─────────────────────────────────────────────────────────
async function createEvent(request, ctx, user) {
  try {
    await connectDB();
    const body = await request.json();
    const event = await Event.create({ ...body, organizer: user.id, status: body.status || 'published' });
    return NextResponse.json({ event }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const POST = withAuth(createEvent, { roles: ['organizer', 'admin'] });
