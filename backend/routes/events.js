import { Router } from 'express';
import { connectDB } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';
import Event from '../models/Event.js';

const router = Router();

// GET /api/events
router.get('/', async (req, res) => {
  try {
    await connectDB();
    const { q = '', category = '', city = '', price = '', sort = 'newest', page = '1', limit = '12', upcoming } = req.query;

    const p = Math.max(1, parseInt(page));
    const l = Math.min(50, parseInt(limit));

    const filter = { status: 'published', isPublic: true };
    if (q)        filter.$text = { $search: q };
    if (category) filter.category = category;
    if (city)     filter['venue.city'] = { $regex: city, $options: 'i' };
    if (upcoming) filter.startDate = { $gt: new Date() };

    if (price === 'free')    filter.ticketTypes = { $elemMatch: { price: 0 } };
    if (price === 'paid')    filter.ticketTypes = { $not: { $elemMatch: { price: 0 } } };
    if (price === 'under25') filter.ticketTypes = { $elemMatch: { price: { $gt: 0, $lt: 25 } } };

    const sortMap = {
      newest:     { createdAt: -1 },
      date_asc:   { startDate: 1 },
      price_asc:  { 'ticketTypes.0.price': 1 },
      price_desc: { 'ticketTypes.0.price': -1 },
      popular:    { 'ticketTypes.sold': -1 },
    };
    const sortQuery = sortMap[sort] || { createdAt: -1 };

    const [events, total] = await Promise.all([
      Event.find(filter).sort(sortQuery).skip((p - 1) * l).limit(l).populate('organizer', 'name email avatar').lean(),
      Event.countDocuments(filter),
    ]);

    res.json({ events, total, page: p, pages: Math.ceil(total / l) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/events/:id
router.get('/:id', async (req, res) => {
  try {
    await connectDB();
    const event = await Event.findById(req.params.id).populate('organizer', 'name email avatar').lean();
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json({ event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/events
router.post('/', requireAuth(['organizer', 'admin']), async (req, res) => {
  try {
    await connectDB();
    const event = await Event.create({ ...req.body, organizer: req.user.id, status: req.body.status || 'published' });
    res.status(201).json({ event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/events/:id
router.put('/:id', requireAuth(['organizer', 'admin']), async (req, res) => {
  try {
    await connectDB();
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    Object.assign(event, req.body);
    await event.save();
    res.json({ event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/events/:id
router.delete('/:id', requireAuth(['organizer', 'admin']), async (req, res) => {
  try {
    await connectDB();
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    await event.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/events/:id/attendees
import Booking from '../models/Booking.js';

router.get('/:id/attendees', requireAuth(['organizer', 'admin', 'staff']), async (req, res) => {
  try {
    await connectDB();
    const event = await Event.findById(req.params.id).lean();
    if (!event) return res.status(404).json({ error: 'Event not found' });

    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { q = '', page = '1', limit = '20' } = req.query;
    const p = Math.max(1, parseInt(page));
    const l = Math.min(100, parseInt(limit));

    const bookings = await Booking.find({ event: req.params.id })
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .lean();

    let attendees = bookings.map((b) => ({
      id:          b._id,
      name:        b.attendeeName || b.user?.name || '—',
      email:       b.attendeeEmail || b.user?.email || '—',
      ticketType:  b.ticketTypeName,
      price:       b.ticketTypePrice,
      quantity:    b.quantity,
      status:      b.status,
      qrToken:     b.qrToken,
      purchasedAt: b.createdAt,
    }));

    if (q) {
      const lower = q.toLowerCase();
      attendees = attendees.filter(
        (a) => a.name.toLowerCase().includes(lower) || a.email.toLowerCase().includes(lower)
      );
    }

    const total = attendees.length;
    const paginated = attendees.slice((p - 1) * l, p * l);
    res.json({ attendees: paginated, total, page: p, pages: Math.ceil(total / l) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
