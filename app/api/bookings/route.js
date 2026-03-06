import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Event from '@/models/Event';
import Booking from '@/models/Booking';
import PromoCode from '@/models/PromoCode';
import { withAuth } from '@/middleware/withAuth';

async function handler(request, ctx, user) {
  try {
    await connectDB();
    const { eventId, tickets, promoCode, attendeeName, attendeeEmail } = await request.json();

    if (!eventId || !Array.isArray(tickets) || tickets.length === 0) {
      return NextResponse.json({ error: 'eventId and tickets array are required' }, { status: 400 });
    }

    const event = await Event.findById(eventId);
    if (!event || event.status !== 'published') {
      return NextResponse.json({ error: 'Event not found or not available' }, { status: 404 });
    }

    // Validate promo code — check PromoCode collection first, then event.promoCode fallback
    let discountPct = 0;
    let promoDoc = null;
    if (promoCode) {
      promoDoc = await PromoCode.findOne({
        event: eventId,
        code: promoCode.toUpperCase(),
        isActive: true,
      });
      if (promoDoc) {
        if (promoDoc.expiresAt && promoDoc.expiresAt < new Date()) {
          return NextResponse.json({ error: 'Promo code has expired' }, { status: 400 });
        }
        if (promoDoc.usageLimit !== null && promoDoc.usedCount >= promoDoc.usageLimit) {
          return NextResponse.json({ error: 'Promo code usage limit reached' }, { status: 400 });
        }
        discountPct = promoDoc.discountPercent;
      } else if (event.promoCode && promoCode.toUpperCase() === event.promoCode.toUpperCase()) {
        // Legacy: promo code stored directly on event
        discountPct = event.promoDiscount || 0;
      }
    }

    const createdBookings = [];

    for (const item of tickets) {
      const { typeId, quantity = 1 } = item;
      const ticketType = event.ticketTypes.id(typeId);

      if (!ticketType) {
        return NextResponse.json({ error: `Ticket type ${typeId} not found` }, { status: 400 });
      }
      if (ticketType.quantity - ticketType.sold < quantity) {
        return NextResponse.json(
          { error: `Not enough tickets for "${ticketType.name}"` },
          { status: 400 }
        );
      }
      if (quantity > ticketType.maxPerUser) {
        return NextResponse.json(
          { error: `Max ${ticketType.maxPerUser} tickets per user for "${ticketType.name}"` },
          { status: 400 }
        );
      }

      const subtotal      = ticketType.price * quantity;
      const discountAmt   = subtotal * (discountPct / 100);
      const totalAmount   = Math.max(0, subtotal - discountAmt);

      const booking = await Booking.create({
        event:           eventId,
        user:            user.id,
        ticketTypeId:    ticketType._id,
        ticketTypeName:  ticketType.name,
        ticketTypePrice: ticketType.price,
        quantity,
        totalAmount,
        status:          'confirmed',
        attendeeName:    attendeeName || user.name,
        attendeeEmail:   attendeeEmail || user.email,
        promoCode:       discountPct > 0 ? promoCode : undefined,
        discount:        discountPct,
      });

      ticketType.sold += quantity;
      createdBookings.push(booking);
    }

    await event.save();

    // Increment promo code usage if a PromoCode doc was matched
    if (promoDoc) {
      await PromoCode.findByIdAndUpdate(promoDoc._id, { $inc: { usedCount: 1 } });
    }

    return NextResponse.json({ bookings: createdBookings, success: true }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const POST = withAuth(handler);
