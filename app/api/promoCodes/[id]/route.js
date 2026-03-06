import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import PromoCode from '@/models/PromoCode';
import Event from '@/models/Event';
import { withAuth } from '@/middleware/withAuth';

// DELETE /api/promoCodes/[id]
async function deleteHandler(request, ctx, user) {
  try {
    await connectDB();
    const { id } = ctx.params;

    const promo = await PromoCode.findById(id).populate('event', 'organizer');
    if (!promo) return NextResponse.json({ error: 'Promo code not found' }, { status: 404 });

    if (user.role === 'organizer' && promo.event.organizer.toString() !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await promo.deleteOne();
    return NextResponse.json({ message: 'Promo code deleted' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH /api/promoCodes/[id] — toggle isActive
async function patchHandler(request, ctx, user) {
  try {
    await connectDB();
    const { id } = ctx.params;
    const { isActive } = await request.json();

    const promo = await PromoCode.findById(id).populate('event', 'organizer');
    if (!promo) return NextResponse.json({ error: 'Promo code not found' }, { status: 404 });

    if (user.role === 'organizer' && promo.event.organizer.toString() !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    promo.isActive = isActive ?? !promo.isActive;
    await promo.save();
    return NextResponse.json({ promoCode: promo });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const DELETE = withAuth(deleteHandler, { roles: ['organizer', 'admin'] });
export const PATCH  = withAuth(patchHandler,  { roles: ['organizer', 'admin'] });
