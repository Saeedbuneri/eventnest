import { Router } from 'express';
import { connectDB } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';
import Booking from '../models/Booking.js';

const router = Router();

// GET /api/my-tickets
router.get('/', requireAuth(), async (req, res) => {
  try {
    await connectDB();
    const bookings = await Booking.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('event', 'title bannerImage startDate endDate venue category')
      .lean();

    const tickets = bookings.map((b) => ({
      _id:           b._id,
      eventId:       b.event?._id,
      eventTitle:    b.event?.title,
      eventBanner:   b.event?.bannerImage,
      startTime:     b.event?.startDate,
      endTime:       b.event?.endDate,
      location:      b.event?.venue?.address ? `${b.event.venue.address}, ${b.event.venue.city}` : '',
      ticketType:    b.ticketTypeName,
      ticketPrice:   b.ticketTypePrice,
      quantity:      b.quantity,
      totalAmount:   b.totalAmount,
      status:        b.status,
      qrToken:       b.qrToken,
      attendeeName:  b.attendeeName,
      attendeeEmail: b.attendeeEmail,
      purchasedAt:   b.createdAt,
    }));

    res.json({ tickets });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
