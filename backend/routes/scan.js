import { Router } from 'express';
import { connectDB } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';
import Booking from '../models/Booking.js';

const router = Router();

// POST /api/scan
router.post('/', requireAuth(['staff', 'organizer', 'admin']), async (req, res) => {
  try {
    await connectDB();
    const { token } = req.body;
    if (!token?.trim()) return res.status(400).json({ valid: false, message: 'Token is required' });

    const booking = await Booking.findOne({ qrToken: token.trim() })
      .populate('event', 'title startDate endDate')
      .lean();

    if (!booking) return res.json({ valid: false, message: 'Invalid token — not found' });
    if (booking.status === 'used') return res.json({ valid: false, message: 'Already scanned — ticket already used' });
    if (booking.status === 'cancelled') return res.json({ valid: false, message: 'Ticket has been cancelled' });

    await Booking.findByIdAndUpdate(booking._id, { status: 'used' });

    res.json({
      valid: true,
      ticket: {
        id:           booking._id,
        attendeeName: booking.attendeeName,
        eventTitle:   booking.event?.title,
        ticketType:   booking.ticketTypeName,
        status:       'confirmed',
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
