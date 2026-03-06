import { Router } from 'express';
import mongoose from 'mongoose';
import { connectDB } from '../lib/db.js';

const router = Router();

// GET /api/health
router.get('/', async (req, res) => {
  try {
    await connectDB();
    const state = mongoose.connection.readyState;
    const stateLabel = ['disconnected', 'connected', 'connecting', 'disconnecting'][state] ?? 'unknown';
    res.json({
      ok: state === 1,
      database: stateLabel,
      host: mongoose.connection.host,
      dbName: mongoose.connection.name,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
