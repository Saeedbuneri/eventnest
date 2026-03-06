import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import PromoCode from '@/models/PromoCode';
import Event from '@/models/Event';
import { withAuth } from '@/middleware/withAuth';

// GET /api/promoCodes?eventId=xxx — list promo codes for an event (organizer/admin)
async function getHandler(request, ctx, user) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return NextResponse.json({ error: 'eventId is required' }, { status: 400 });
    }

    // Ensure organizer owns the event
    if (user.role === 'organizer') {
      const event = await Event.findOne({ _id: eventId, organizer: user.id }).lean();
      if (!event) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const promoCodes = await PromoCode.find({ event: eventId }).lean();
    return NextResponse.json({ promoCodes });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/promoCodes — create a promo code
async function postHandler(request, ctx, user) {
  try {
    await connectDB();
    const { eventId, code, discountPercent, usageLimit, expiresAt } = await request.json();

    if (!eventId || !code || !discountPercent) {
      return NextResponse.json({ error: 'eventId, code, and discountPercent are required' }, { status: 400 });
    }

    // Ensure organizer owns the event
    if (user.role === 'organizer') {
      const event = await Event.findOne({ _id: eventId, organizer: user.id }).lean();
      if (!event) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const promoCode = await PromoCode.create({
      event: eventId,
      code,
      discountPercent,
      usageLimit: usageLimit || null,
      expiresAt: expiresAt || null,
      createdBy: user.id,
    });

    return NextResponse.json({ promoCode }, { status: 201 });
  } catch (err) {
    if (err.code === 11000) {
      return NextResponse.json({ error: 'Promo code already exists for this event' }, { status: 409 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const GET  = withAuth(getHandler,  { roles: ['organizer', 'admin'] });
export const POST = withAuth(postHandler, { roles: ['organizer', 'admin'] });
