import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Event from '@/models/Event';
import { withAuth } from '@/middleware/withAuth';

async function handler(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const q     = searchParams.get('q')     || '';
    const page  = Math.max(1, parseInt(searchParams.get('page')  || '1'));
    const limit = Math.min(50, parseInt(searchParams.get('limit') || '20'));

    const filter = {};
    if (q) filter.title = { $regex: q, $options: 'i' };

    const [events, total] = await Promise.all([
      Event.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('organizer', 'name email')
        .lean(),
      Event.countDocuments(filter),
    ]);

    return NextResponse.json({ events, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const GET = withAuth(handler, { roles: ['admin'] });
