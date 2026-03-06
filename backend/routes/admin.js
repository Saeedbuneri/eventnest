import { Router } from 'express';
import { connectDB } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';
import User from '../models/User.js';
import Event from '../models/Event.js';
import Booking from '../models/Booking.js';

const router = Router();

const ALLOWED_ROLES = ['attendee', 'organizer', 'staff', 'admin'];

// GET /api/admin/stats
router.get('/stats', requireAuth(['admin']), async (req, res) => {
  try {
    await connectDB();
    const [totalUsers, totalEvents, revenueAgg, ticketsAgg] = await Promise.all([
      User.countDocuments(),
      Event.countDocuments(),
      Booking.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Booking.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$quantity' } } },
      ]),
    ]);

    res.json({
      totalRevenue: revenueAgg[0]?.total ?? 0,
      totalUsers,
      totalEvents,
      totalTickets: ticketsAgg[0]?.total ?? 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/events
router.get('/events', requireAuth(['admin']), async (req, res) => {
  try {
    await connectDB();
    const { q = '', page = '1', limit = '20' } = req.query;
    const p = Math.max(1, parseInt(page));
    const l = Math.min(50, parseInt(limit));

    const filter = {};
    if (q) filter.title = { $regex: q, $options: 'i' };

    const [events, total] = await Promise.all([
      Event.find(filter).sort({ createdAt: -1 }).skip((p - 1) * l).limit(l).populate('organizer', 'name email').lean(),
      Event.countDocuments(filter),
    ]);

    res.json({ events, total, page: p, pages: Math.ceil(total / l) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/users
router.get('/users', requireAuth(['admin']), async (req, res) => {
  try {
    await connectDB();
    const { q = '', role = '', status = '', page = '1', limit = '20' } = req.query;
    const p = Math.max(1, parseInt(page));
    const l = Math.min(100, parseInt(limit));

    const filter = {};
    if (q)      filter.$or = [{ name: { $regex: q, $options: 'i' } }, { email: { $regex: q, $options: 'i' } }];
    if (role)   filter.role = role;
    if (status) filter.status = status;

    const [users, total] = await Promise.all([
      User.find(filter).select('-password').sort({ createdAt: -1 }).skip((p - 1) * l).limit(l).lean(),
      User.countDocuments(filter),
    ]);

    res.json({ users, total, page: p, pages: Math.ceil(total / l) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/users/:id/activate
router.put('/users/:id/activate', requireAuth(['admin']), async (req, res) => {
  try {
    await connectDB();
    const user = await User.findByIdAndUpdate(req.params.id, { status: 'active' }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/users/:id/suspend
router.put('/users/:id/suspend', requireAuth(['admin']), async (req, res) => {
  try {
    await connectDB();
    const user = await User.findByIdAndUpdate(req.params.id, { status: 'suspended' }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/users/:id/role
router.put('/users/:id/role', requireAuth(['admin']), async (req, res) => {
  try {
    await connectDB();
    const { role } = req.body;
    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({ error: `Invalid role. Must be one of: ${ALLOWED_ROLES.join(', ')}` });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
