import { Router } from 'express';
import { connectDB } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';
import Event from '../models/Event.js';
import Booking from '../models/Booking.js';
import PromoCode from '../models/PromoCode.js';

const router = Router();

// POST /api/bookings
router.post('/', requireAuth(), async (req, res) => {
  try {
    await connectDB();
    const { eventId, tickets, promoCode, attendeeName, attendeeEmail } = req.body;

    if (!eventId || !Array.isArray(tickets) || tickets.length === 0) {
      return res.status(400).json({ error: 'eventId and tickets array are required' });
    }

    const event = await Event.findById(eventId);
    if (!event || event.status !== 'published') {
      return res.status(404).json({ error: 'Event not found or not available' });
    }

    let discountPct = 0;
    let promoDoc = null;
    if (promoCode) {
      promoDoc = await PromoCode.findOne({ event: eventId, code: promoCode.toUpperCase(), isActive: true });
      if (promoDoc) {
        if (promoDoc.expiresAt && promoDoc.expiresAt < new Date()) {
          return res.status(400).json({ error: 'Promo code has expired' });
        }
        if (promoDoc.usageLimit !== null && promoDoc.usedCount >= promoDoc.usageLimit) {
          return res.status(400).json({ error: 'Promo code usage limit reached' });
        }
        discountPct = promoDoc.discountPercent;
      } else if (event.promoCode && promoCode.toUpperCase() === event.promoCode.toUpperCase()) {
        discountPct = event.promoDiscount || 0;
      }
    }

    const createdBookings = [];

    for (const item of tickets) {
      const { typeId, quantity = 1 } = item;
      const ticketType = event.ticketTypes.id(typeId);

      if (!ticketType) return res.status(400).json({ error: `Ticket type ${typeId} not found` });
      if (ticketType.quantity - ticketType.sold < quantity) {
        return res.status(400).json({ error: `Not enough tickets for "${ticketType.name}"` });
      }
      if (quantity > ticketType.maxPerUser) {
        return res.status(400).json({ error: `Max ${ticketType.maxPerUser} tickets per user for "${ticketType.name}"` });
      }

      const subtotal    = ticketType.price * quantity;
      const totalAmount = Math.max(0, subtotal - subtotal * (discountPct / 100));

      const booking = await Booking.create({
        event: eventId, user: req.user.id, ticketTypeId: ticketType._id,
        ticketTypeName: ticketType.name, ticketTypePrice: ticketType.price,
        quantity, totalAmount, status: 'confirmed',
        attendeeName: attendeeName || req.user.name,
        attendeeEmail: attendeeEmail || req.user.email,
        promoCode: discountPct > 0 ? promoCode : undefined,
        discount: discountPct,
      });

      ticketType.sold += quantity;
      createdBookings.push(booking);
    }

    await event.save();
    if (promoDoc) await PromoCode.findByIdAndUpdate(promoDoc._id, { $inc: { usedCount: 1 } });

    res.status(201).json({ bookings: createdBookings, success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
