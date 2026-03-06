import { Router } from 'express';
import { connectDB } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';
import Booking from '../models/Booking.js';
import Event from '../models/Event.js';

const router = Router();

// POST /api/refund
router.post('/', requireAuth(['organizer', 'admin']), async (req, res) => {
  try {
    await connectDB();
    const { bookingId } = req.body;
    if (!bookingId) return res.status(400).json({ error: 'bookingId is required' });

    const booking = await Booking.findById(bookingId).populate('event');
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    if (req.user.role === 'organizer') {
      const organizerId = booking.event?.organizer?.toString();
      if (organizerId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ error: 'Booking is already cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    await Event.updateOne(
      { _id: booking.event._id, 'ticketTypes._id': booking.ticketTypeId },
      { $inc: { 'ticketTypes.$.sold': -booking.quantity } }
    );

    res.json({
      message: 'Booking cancelled and refund processed.',
      booking: { _id: booking._id, status: booking.status, totalAmount: booking.totalAmount },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
