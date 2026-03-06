import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { connectDB } from '../lib/db.js';
import { comparePassword, hashPassword, signToken } from '../lib/auth.js';
import { requireAuth } from '../middleware/auth.js';
import User from '../models/User.js';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    await connectDB();
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    if (user.status === 'suspended') {
      return res.status(403).json({ error: 'Account suspended — contact support' });
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

    const token = signToken({ id: user._id, email: user.email, role: user.role, name: user.name });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    await connectDB();
    const { name, email, password, role } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const allowedRoles = ['attendee', 'organizer'];
    const userRole = allowedRoles.includes(role) ? role : 'attendee';

    const hashed = await hashPassword(password);
    const user = await User.create({ name: name.trim(), email: email.toLowerCase(), password: hashed, role: userRole });

    const token = signToken({ id: user._id, email: user.email, role: user.role, name: user.name });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me
router.get('/me', requireAuth(), async (req, res) => {
  try {
    await connectDB();
    const found = await User.findById(req.user.id).select('-password').lean();
    if (!found) return res.status(404).json({ error: 'User not found' });
    res.json({ user: found });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/auth/me
router.put('/me', requireAuth(), async (req, res) => {
  try {
    await connectDB();
    const { name, email, currentPassword, newPassword } = req.body;

    const found = await User.findById(req.user.id);
    if (!found) return res.status(404).json({ error: 'User not found' });

    if (name)  found.name  = name.trim();
    if (email) found.email = email.trim().toLowerCase();

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required to set a new password' });
      }
      const match = await bcrypt.compare(currentPassword, found.password);
      if (!match) return res.status(400).json({ error: 'Current password is incorrect' });
      found.password = await bcrypt.hash(newPassword, 12);
    }

    await found.save();
    const updated = found.toObject();
    delete updated.password;
    res.json({ user: updated });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Email already in use' });
    res.status(500).json({ error: err.message });
  }
});

export default router;
