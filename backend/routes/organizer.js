import { Router } from 'express';
import { connectDB } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';
import Event from '../models/Event.js';
import Booking from '../models/Booking.js';

const router = Router();

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// GET /api/organizer/stats
router.get('/stats', requireAuth(['organizer', 'admin']), async (req, res) => {
  try {
    await connectDB();
    const myEvents = await Event.find({ organizer: req.user.id }).select('_id').lean();
    const eventIds = myEvents.map((e) => e._id);

    const [revenueAgg, ticketsAgg, activeEvents, totalAttendees] = await Promise.all([
      Booking.aggregate([
        { $match: { event: { $in: eventIds }, status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Booking.aggregate([
        { $match: { event: { $in: eventIds }, status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$quantity' } } },
      ]),
      Event.countDocuments({ organizer: req.user.id, status: 'published' }),
      Booking.countDocuments({ event: { $in: eventIds }, status: { $ne: 'cancelled' } }),
    ]);

    res.json({
      totalRevenue:   revenueAgg[0]?.total ?? 0,
      totalTickets:   ticketsAgg[0]?.total ?? 0,
      activeEvents,
      totalAttendees,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/organizer/revenue
router.get('/revenue', requireAuth(['organizer', 'admin']), async (req, res) => {
  try {
    await connectDB();
    const myEvents = await Event.find({ organizer: req.user.id }).select('_id').lean();
    const eventIds = myEvents.map((e) => e._id);

    const data = await Booking.aggregate([
      { $match: { event: { $in: eventIds }, status: { $ne: 'cancelled' } } },
      {
        $group: {
          _id:     { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          tickets: { $sum: '$quantity' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 },
    ]);

    res.json(data.map((d) => ({ month: MONTHS[d._id.month - 1], revenue: d.revenue, tickets: d.tickets })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/organizer/events
router.get('/events', requireAuth(['organizer', 'admin']), async (req, res) => {
  try {
    await connectDB();
    const { q = '', page = '1', limit = '10' } = req.query;
    const p = Math.max(1, parseInt(page));
    const l = Math.min(50, parseInt(limit));

    const filter = { organizer: req.user.id };
    if (q) filter.title = { $regex: q, $options: 'i' };

    const [events, total] = await Promise.all([
      Event.find(filter).sort({ createdAt: -1 }).skip((p - 1) * l).limit(l).lean(),
      Event.countDocuments(filter),
    ]);

    const eventIds   = events.map((e) => e._id);
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

    res.json({ events: enriched, total, page: p, pages: Math.ceil(total / l) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
