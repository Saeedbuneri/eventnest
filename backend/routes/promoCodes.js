import { Router } from 'express';
import { connectDB } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';
import PromoCode from '../models/PromoCode.js';
import Event from '../models/Event.js';

const router = Router();

// GET /api/promoCodes?eventId=xxx
router.get('/', requireAuth(['organizer', 'admin']), async (req, res) => {
  try {
    await connectDB();
    const { eventId } = req.query;
    if (!eventId) return res.status(400).json({ error: 'eventId is required' });

    if (req.user.role === 'organizer') {
      const event = await Event.findOne({ _id: eventId, organizer: req.user.id }).lean();
      if (!event) return res.status(403).json({ error: 'Forbidden' });
    }

    const promoCodes = await PromoCode.find({ event: eventId }).lean();
    res.json({ promoCodes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/promoCodes
router.post('/', requireAuth(['organizer', 'admin']), async (req, res) => {
  try {
    await connectDB();
    const { eventId, code, discountPercent, usageLimit, expiresAt } = req.body;
    if (!eventId || !code || !discountPercent) {
      return res.status(400).json({ error: 'eventId, code, and discountPercent are required' });
    }

    if (req.user.role === 'organizer') {
      const event = await Event.findOne({ _id: eventId, organizer: req.user.id }).lean();
      if (!event) return res.status(403).json({ error: 'Forbidden' });
    }

    const promoCode = await PromoCode.create({
      event: eventId, code, discountPercent,
      usageLimit: usageLimit || null,
      expiresAt: expiresAt || null,
      createdBy: req.user.id,
    });
    res.status(201).json({ promoCode });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Promo code already exists for this event' });
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/promoCodes/:id
router.delete('/:id', requireAuth(['organizer', 'admin']), async (req, res) => {
  try {
    await connectDB();
    const promo = await PromoCode.findById(req.params.id).populate('event', 'organizer');
    if (!promo) return res.status(404).json({ error: 'Promo code not found' });
    if (req.user.role === 'organizer' && promo.event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    await promo.deleteOne();
    res.json({ message: 'Promo code deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/promoCodes/:id
router.patch('/:id', requireAuth(['organizer', 'admin']), async (req, res) => {
  try {
    await connectDB();
    const { isActive } = req.body;
    const promo = await PromoCode.findById(req.params.id).populate('event', 'organizer');
    if (!promo) return res.status(404).json({ error: 'Promo code not found' });
    if (req.user.role === 'organizer' && promo.event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    promo.isActive = isActive ?? !promo.isActive;
    await promo.save();
    res.json({ promoCode: promo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
