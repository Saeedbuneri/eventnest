import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import bookingRoutes from './routes/bookings.js';
import myTicketsRoutes from './routes/myTickets.js';
import promoCodeRoutes from './routes/promoCodes.js';
import refundRoutes from './routes/refund.js';
import scanRoutes from './routes/scan.js';
import organizerRoutes from './routes/organizer.js';
import adminRoutes from './routes/admin.js';
import healthRoutes from './routes/health.js';

const app = express();

// ── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow requests with no origin (e.g. mobile apps / curl)
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

// ── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '2mb' }));

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',        authRoutes);
app.use('/api/events',      eventRoutes);
app.use('/api/bookings',    bookingRoutes);
app.use('/api/my-tickets',  myTicketsRoutes);
app.use('/api/promoCodes',  promoCodeRoutes);
app.use('/api/refund',      refundRoutes);
app.use('/api/scan',        scanRoutes);
app.use('/api/organizer',   organizerRoutes);
app.use('/api/admin',       adminRoutes);
app.use('/api/health',      healthRoutes);

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// ── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`EventNest API running on port ${PORT}`));

export default app;
