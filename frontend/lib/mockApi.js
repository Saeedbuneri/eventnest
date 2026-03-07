/**
 * mockApi.js — complete offline mock for all backend endpoints.
 *
 * When NEXT_PUBLIC_USE_MOCK=true (or API calls fail), every api.get/post/put/delete
 * returns data from this module. Enables full workflow testing on Vercel without
 * a running backend.
 *
 * Mock users (all password: demo1234):
 *   admin@demo.com      → admin
 *   organizer@demo.com  → organizer
 *   staff@demo.com      → staff
 *   attendee@demo.com   → attendee  (also: ahmed@test.pk)
 */

// ─── Utility ─────────────────────────────────────────────────────────────────

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

function ok(data, status = 200) {
  return { data, status, headers: {}, config: {}, statusText: 'OK' };
}

function err(message, status = 400) {
  const e = new Error(message);
  e.response = { data: { error: message }, status };
  throw e;
}

// Produce a real base64url-encoded JWT payload so the Edge middleware can
// decode the role without signature verification.
function makeMockJwt(user) {
  const b64url = (obj) =>
    btoa(JSON.stringify(obj)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const header  = b64url({ alg: 'none', typ: 'JWT' });
  const payload = b64url({
    _id:   user._id,
    id:    user._id,
    role:  user.role,
    name:  user.name,
    email: user.email,
    iat:   Math.floor(Date.now() / 1000),
    exp:   Math.floor(Date.now() / 1000) + 7 * 24 * 3600,
  });
  return `${header}.${payload}.mock`;
}

// ─── Mock DB (in-memory, resets on hard reload) ───────────────────────────────

const MOCK_USERS = [
  { _id: 'u_admin',     id: 'u_admin',     name: 'Demo Admin',     email: 'admin@demo.com',     role: 'admin',     status: 'active', createdAt: '2025-01-01T00:00:00Z' },
  { _id: 'u_organizer', id: 'u_organizer', name: 'Demo Organizer', email: 'organizer@demo.com', role: 'organizer', status: 'active', createdAt: '2025-01-01T00:00:00Z' },
  { _id: 'u_staff',     id: 'u_staff',     name: 'Demo Staff',     email: 'staff@demo.com',     role: 'staff',     status: 'active', createdAt: '2025-01-01T00:00:00Z' },
  { _id: 'u_attendee',  id: 'u_attendee',  name: 'Ahmed Khan',     email: 'attendee@demo.com',  role: 'attendee',  status: 'active', createdAt: '2025-01-01T00:00:00Z' },
  { _id: 'u_ahmed',     id: 'u_ahmed',     name: 'Ahmed Khan',     email: 'ahmed@test.pk',      role: 'attendee',  status: 'active', createdAt: '2025-02-01T00:00:00Z' },
  { _id: 'u_ali',       id: 'u_ali',       name: 'Ali Hassan',     email: 'ali.hassan@test.pk', role: 'attendee',  status: 'active', createdAt: '2025-03-01T00:00:00Z' },
];

const MOCK_EVENTS = [
  {
    _id: 'evt_1', id: 'evt_1',
    title: 'Islamabad Music Festival 2026',
    description: 'A night of live music featuring top artists from across Pakistan. Food stalls, art installations and two outdoor stages at F-9 Park. Headlined by Sajjad Ali, Strings, and Atif Aslam.',
    category: 'music',
    bannerImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
    venue: { address: 'F-9 Park, Islamabad', city: 'Islamabad' },
    startDate: '2026-04-15T18:00:00Z', endDate: '2026-04-15T23:00:00Z',
    ticketTypes: [
      { _id: 'tt_1a', name: 'General Admission', price: 500,  quantity: 300, sold: 180, maxPerUser: 6 },
      { _id: 'tt_1b', name: 'VIP',               price: 1500, quantity: 50,  sold: 22,  maxPerUser: 2 },
    ],
    organizer: { _id: 'u_organizer', name: 'Demo Organizer', email: 'organizer@demo.com' },
    status: 'published', isPublic: true, featured: true, attendeesCount: 202,
    refundPolicy: '48hours', createdAt: '2026-01-01T00:00:00Z',
  },
  {
    _id: 'evt_2', id: 'evt_2',
    title: 'Blue Area TechMeet — AI & Startups',
    description: 'Islamabad\'s premier tech gathering. 20+ speakers, live demos, investor speed-dating, and late-night networking at Centaurus Mall. Topics: AI, Web3, SaaS, Fintech.',
    category: 'tech',
    bannerImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    venue: { address: 'Centaurus Mall, Blue Area', city: 'Islamabad' },
    startDate: '2026-04-18T10:00:00Z', endDate: '2026-04-18T20:00:00Z',
    ticketTypes: [
      { _id: 'tt_2a', name: 'Standard',     price: 800, quantity: 200, sold: 140, maxPerUser: 4 },
      { _id: 'tt_2b', name: 'Speaker Pass', price: 0,   quantity: 30,  sold: 28,  maxPerUser: 1 },
    ],
    organizer: { _id: 'u_organizer', name: 'Demo Organizer', email: 'organizer@demo.com' },
    status: 'published', isPublic: true, featured: true, attendeesCount: 168,
    refundPolicy: '24hours', createdAt: '2026-01-05T00:00:00Z',
  },
  {
    _id: 'evt_3', id: 'evt_3',
    title: 'PNCA Lok Virsa Cultural Night',
    description: 'An evening celebrating Pakistani folk music, classical dance, and live art at Lok Virsa Heritage Museum. Free for all. Featuring Thari folk singers and Punjabi bhangra performers.',
    category: 'arts',
    bannerImage: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&q=80',
    venue: { address: 'Lok Virsa Heritage Museum, Shakarparian', city: 'Islamabad' },
    startDate: '2026-04-20T17:00:00Z', endDate: '2026-04-20T21:00:00Z',
    ticketTypes: [
      { _id: 'tt_3a', name: 'Free Entry', price: 0, quantity: 400, sold: 310, maxPerUser: 4 },
    ],
    organizer: { _id: 'u_organizer', name: 'Demo Organizer', email: 'organizer@demo.com' },
    status: 'published', isPublic: true, featured: false, attendeesCount: 310,
    refundPolicy: 'no_refund', createdAt: '2026-01-10T00:00:00Z',
  },
  {
    _id: 'evt_4', id: 'evt_4',
    title: 'F-7 Markaz Street Food Festival',
    description: 'Taste 40+ food stalls from across Pakistan. Biryani battles, BBQ pit, dessert alley, and live dhol performances all weekend long at Jinnah Super.',
    category: 'food',
    bannerImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    venue: { address: 'Jinnah Super Market, F-7 Markaz', city: 'Islamabad' },
    startDate: '2026-04-25T12:00:00Z', endDate: '2026-04-25T22:00:00Z',
    ticketTypes: [
      { _id: 'tt_4a', name: 'Day Pass', price: 300, quantity: 600, sold: 420, maxPerUser: 8 },
    ],
    organizer: { _id: 'u_organizer', name: 'Demo Organizer', email: 'organizer@demo.com' },
    status: 'published', isPublic: true, featured: true, attendeesCount: 420,
    refundPolicy: 'no_refund', createdAt: '2026-01-12T00:00:00Z',
  },
  {
    _id: 'evt_5', id: 'evt_5',
    title: 'NUST vs FAST Basketball Final',
    description: 'The annual inter-university basketball championship final. Cheer your university! Open to all students and alumni. Refreshments available inside the complex.',
    category: 'sports',
    bannerImage: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80',
    venue: { address: 'NUST Sports Complex, H-12', city: 'Islamabad' },
    startDate: '2026-04-22T14:00:00Z', endDate: '2026-04-22T18:00:00Z',
    ticketTypes: [
      { _id: 'tt_5a', name: 'Student', price: 100, quantity: 300, sold: 240, maxPerUser: 2 },
      { _id: 'tt_5b', name: 'General', price: 200, quantity: 200, sold: 110, maxPerUser: 4 },
    ],
    organizer: { _id: 'u_organizer', name: 'Demo Organizer', email: 'organizer@demo.com' },
    status: 'published', isPublic: true, featured: false, attendeesCount: 350,
    refundPolicy: '24hours', createdAt: '2026-01-15T00:00:00Z',
  },
  {
    _id: 'evt_6', id: 'evt_6',
    title: 'Rawalpindi Startup Pitch Night',
    description: '8 early-stage startups pitch live to a panel of investors and mentors. Open networking mixer after. Free entry. Childcare available on request.',
    category: 'business',
    bannerImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80',
    venue: { address: 'Bahria Town Phase 7, Rawalpindi', city: 'Rawalpindi' },
    startDate: '2026-05-02T18:00:00Z', endDate: '2026-05-02T21:30:00Z',
    ticketTypes: [
      { _id: 'tt_6a', name: 'Free', price: 0, quantity: 150, sold: 98, maxPerUser: 2 },
    ],
    organizer: { _id: 'u_organizer', name: 'Demo Organizer', email: 'organizer@demo.com' },
    status: 'published', isPublic: true, featured: false, attendeesCount: 98,
    refundPolicy: 'no_refund', createdAt: '2026-01-20T00:00:00Z',
  },
  {
    _id: 'evt_7', id: 'evt_7',
    title: 'Islamabad Running Club — 10K Race',
    description: 'Monthly community 10K run starting from Fatima Jinnah Park. All fitness levels welcome. Medal and breakfast for finishers. Join our WhatsApp group after registration.',
    category: 'sports',
    bannerImage: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
    venue: { address: 'Fatima Jinnah Park, F-9', city: 'Islamabad' },
    startDate: '2026-05-08T06:30:00Z', endDate: '2026-05-08T10:00:00Z',
    ticketTypes: [
      { _id: 'tt_7a', name: 'Runner Pass', price: 400, quantity: 200, sold: 156, maxPerUser: 4 },
    ],
    organizer: { _id: 'u_organizer', name: 'Demo Organizer', email: 'organizer@demo.com' },
    status: 'published', isPublic: true, featured: false, attendeesCount: 156,
    refundPolicy: '48hours', createdAt: '2026-02-01T00:00:00Z',
  },
  {
    _id: 'evt_8', id: 'evt_8',
    title: 'COMSATS College Fest 2026',
    description: 'Three-day inter-department festival with singing competition, drama, debate, gaming, and a tech expo. Open to all. Public day on Saturday.',
    category: 'education',
    bannerImage: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80',
    venue: { address: 'COMSATS University, Park Road', city: 'Islamabad' },
    startDate: '2026-05-12T09:00:00Z', endDate: '2026-05-14T18:00:00Z',
    ticketTypes: [
      { _id: 'tt_8a', name: 'Student Pass', price: 0,   quantity: 500, sold: 380, maxPerUser: 1 },
      { _id: 'tt_8b', name: 'Public Pass',  price: 150, quantity: 200, sold: 60,  maxPerUser: 4 },
    ],
    organizer: { _id: 'u_organizer', name: 'Demo Organizer', email: 'organizer@demo.com' },
    status: 'published', isPublic: true, featured: true, attendeesCount: 440,
    refundPolicy: 'no_refund', createdAt: '2026-02-10T00:00:00Z',
  },
  {
    _id: 'evt_9', id: 'evt_9',
    title: 'Islamabad Photography Walk — Margalla Trails',
    description: 'Guided morning photography walk through Margalla Hills with professional tips on landscape, wildlife, and portrait photography. Bring your camera or smartphone.',
    category: 'arts',
    bannerImage: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=80',
    venue: { address: 'Trail 3, Margalla Hills', city: 'Islamabad' },
    startDate: '2026-05-16T06:00:00Z', endDate: '2026-05-16T10:00:00Z',
    ticketTypes: [
      { _id: 'tt_9a', name: 'Participant', price: 500, quantity: 30, sold: 18, maxPerUser: 2 },
    ],
    organizer: { _id: 'u_organizer', name: 'Demo Organizer', email: 'organizer@demo.com' },
    status: 'published', isPublic: true, featured: false, attendeesCount: 18,
    refundPolicy: '48hours', createdAt: '2026-02-15T00:00:00Z',
  },
  {
    _id: 'evt_10', id: 'evt_10',
    title: 'ISB Comedy Night — Stand Up Uncensored',
    description: '4 of Pakistan\'s best comedians perform back-to-back. Fully seated, BYOB-friendly venue with food packages available. 18+ only.',
    category: 'entertainment',
    bannerImage: 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=800&q=80',
    venue: { address: 'Monal Restaurant, Margalla Hills', city: 'Islamabad' },
    startDate: '2026-05-20T20:00:00Z', endDate: '2026-05-20T23:30:00Z',
    ticketTypes: [
      { _id: 'tt_10a', name: 'Regular',  price: 1200, quantity: 120, sold: 80, maxPerUser: 4 },
      { _id: 'tt_10b', name: 'VIP Table', price: 5000, quantity: 10, sold: 4,  maxPerUser: 1 },
    ],
    organizer: { _id: 'u_organizer', name: 'Demo Organizer', email: 'organizer@demo.com' },
    status: 'published', isPublic: true, featured: true, attendeesCount: 84,
    refundPolicy: 'no_refund', createdAt: '2026-02-20T00:00:00Z',
  },
];

let MOCK_BOOKINGS = [
  {
    _id: 'bk_1', id: 'bk_1',
    event: 'evt_1', user: 'u_attendee',
    ticketTypeId: 'tt_1b', ticketTypeName: 'VIP', ticketTypePrice: 1500,
    quantity: 1, totalAmount: 1500,
    status: 'confirmed', qrToken: 'EN-EVT1-VIP-A1B2C3',
    attendeeName: 'Ahmed Khan', attendeeEmail: 'attendee@demo.com',
    discount: 0, createdAt: '2026-03-05T12:00:00Z',
  },
  {
    _id: 'bk_2', id: 'bk_2',
    event: 'evt_2', user: 'u_attendee',
    ticketTypeId: 'tt_2a', ticketTypeName: 'Standard', ticketTypePrice: 800,
    quantity: 2, totalAmount: 1600,
    status: 'confirmed', qrToken: 'EN-EVT2-STD-D4E5F6',
    attendeeName: 'Ahmed Khan', attendeeEmail: 'attendee@demo.com',
    discount: 0, createdAt: '2026-03-05T14:00:00Z',
  },
  {
    _id: 'bk_3', id: 'bk_3',
    event: 'evt_3', user: 'u_attendee',
    ticketTypeId: 'tt_3a', ticketTypeName: 'Free Entry', ticketTypePrice: 0,
    quantity: 1, totalAmount: 0,
    status: 'used', qrToken: 'EN-EVT3-FREE-G7H8I9',
    attendeeName: 'Ahmed Khan', attendeeEmail: 'attendee@demo.com',
    discount: 0, createdAt: '2026-03-01T09:00:00Z',
  },
  {
    _id: 'bk_4', id: 'bk_4',
    event: 'evt_4', user: 'u_organizer',
    ticketTypeId: 'tt_4a', ticketTypeName: 'Day Pass', ticketTypePrice: 300,
    quantity: 3, totalAmount: 900,
    status: 'confirmed', qrToken: 'EN-EVT4-DAY-J1K2L3',
    attendeeName: 'Demo Organizer', attendeeEmail: 'organizer@demo.com',
    discount: 0, createdAt: '2026-03-02T10:00:00Z',
  },
];

const MOCK_PROMO_CODES = [
  { _id: 'pc_1', event: 'evt_1', code: 'ISB2026', discountPercent: 15, usageLimit: 50,  usedCount: 12, isActive: true, expiresAt: '2026-04-10T00:00:00Z' },
  { _id: 'pc_2', event: 'evt_2', code: 'TECH20',  discountPercent: 20, usageLimit: 30,  usedCount: 8,  isActive: true, expiresAt: null },
  { _id: 'pc_3', event: 'evt_1', code: 'EARLYBIRD', discountPercent: 10, usageLimit: 100, usedCount: 55, isActive: false, expiresAt: '2026-04-01T00:00:00Z' },
];

const MOCK_REVENUE = [
  { month: 'Oct',  revenue: 42000,  tickets: 84  },
  { month: 'Nov',  revenue: 67000,  tickets: 122 },
  { month: 'Dec',  revenue: 91000,  tickets: 185 },
  { month: 'Jan',  revenue: 74000,  tickets: 148 },
  { month: 'Feb',  revenue: 115000, tickets: 231 },
  { month: 'Mar',  revenue: 148000, tickets: 296 },
];

const MOCK_CATEGORIES = [
  { name: 'Music',         value: 35, color: '#f43f5e' },
  { name: 'Tech',          value: 22, color: '#3b82f6' },
  { name: 'Sports',        value: 18, color: '#22c55e' },
  { name: 'Food',          value: 12, color: '#f97316' },
  { name: 'Arts',          value: 8,  color: '#a855f7' },
  { name: 'Entertainment', value: 5,  color: '#94a3b8' },
];

// ─── Session state (survives across calls within a tab) ───────────────────────

let _sessionUser = null;  // Set on mock login; read by auth/me

function getSessionUser() {
  if (_sessionUser) return _sessionUser;
  // Reconnect from localStorage (survives page refresh within same mock session)
  try {
    const saved = typeof window !== 'undefined' && localStorage.getItem('en_user');
    if (saved) {
      const u = JSON.parse(saved);
      if (u?._id || u?.id) {
        _sessionUser = u;
        return u;
      }
    }
  } catch {}
  return null;
}

// ─── Route handlers ───────────────────────────────────────────────────────────

async function handleGet(path, params = {}) {
  await delay();

  // ── Auth ──────────────────────────────────────────────────────────────────
  if (path === '/auth/me') {
    const u = getSessionUser();
    if (!u) err('Unauthorized', 401);
    return ok({ user: u });
  }

  // ── Events list ───────────────────────────────────────────────────────────
  if (path === '/events') {
    let events = [...MOCK_EVENTS];
    const { q, search, category, city, price, sort, upcoming, featured, limit, page } = params;
    const query = q || search;  // pages may send either 'q' or 'search'

    if (query)    events = events.filter(e => e.title.toLowerCase().includes(query.toLowerCase()) || e.description.toLowerCase().includes(query.toLowerCase()));
    if (category) events = events.filter(e => e.category === category);
    if (city)     events = events.filter(e => e.venue.city.toLowerCase().includes(city.toLowerCase()));
    if (upcoming) events = events.filter(e => new Date(e.startDate) > new Date());
    if (featured) events = events.filter(e => e.featured);

    if (price === 'free')    events = events.filter(e => e.ticketTypes.some(t => t.price === 0));
    if (price === 'paid')    events = events.filter(e => e.ticketTypes.every(t => t.price > 0));
    if (price === 'under25') events = events.filter(e => e.ticketTypes.some(t => t.price > 0 && t.price < 25));

    const sortMap = {
      newest:      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      'date-asc':  (a, b) => new Date(a.startDate) - new Date(b.startDate),
      date_asc:    (a, b) => new Date(a.startDate) - new Date(b.startDate),
      'price-asc': (a, b) => Math.min(...a.ticketTypes.map(t => t.price)) - Math.min(...b.ticketTypes.map(t => t.price)),
      price_asc:   (a, b) => Math.min(...a.ticketTypes.map(t => t.price)) - Math.min(...b.ticketTypes.map(t => t.price)),
      'price-desc':(a, b) => Math.max(...b.ticketTypes.map(t => t.price)) - Math.max(...a.ticketTypes.map(t => t.price)),
      price_desc:  (a, b) => Math.max(...b.ticketTypes.map(t => t.price)) - Math.max(...a.ticketTypes.map(t => t.price)),
      popular:     (a, b) => b.attendeesCount - a.attendeesCount,
    };
    if (sort && sortMap[sort]) events.sort(sortMap[sort]);

    const total = events.length;
    const l = Math.min(50, parseInt(limit || '12'));
    const p = Math.max(1, parseInt(page || '1'));
    events = events.slice((p - 1) * l, p * l);

    return ok({ events, total, page: p, pages: Math.ceil(total / l) });
  }

  // ── Single event ──────────────────────────────────────────────────────────
  const evtMatch = path.match(/^\/events\/([^/]+)$/);
  if (evtMatch) {
    const event = MOCK_EVENTS.find(e => e._id === evtMatch[1] || e.id === evtMatch[1]);
    if (!event) err('Event not found', 404);
    return ok({ event });
  }

  // ── Attendees list for an event ──────────────────────────────────────────
  const attendeesMatch = path.match(/^\/events\/([^/]+)\/attendees$/);
  if (attendeesMatch) {
    const eventId = attendeesMatch[1];
    const bookings = MOCK_BOOKINGS.filter(b => b.event === eventId);
    const attendees = bookings.map(b => ({
      id: b._id, name: b.attendeeName, email: b.attendeeEmail,
      ticketType: b.ticketTypeName, price: b.ticketTypePrice,
      quantity: b.quantity, status: b.status, qrToken: b.qrToken,
      purchasedAt: b.createdAt,
    }));
    return ok({ attendees, total: attendees.length, page: 1, pages: 1 });
  }

  // ── My Tickets ────────────────────────────────────────────────────────────
  if (path === '/my-tickets') {
    const u = getSessionUser();
    const userId = u?._id || u?.id;
    const bookings = MOCK_BOOKINGS.filter(b => b.user === userId);
    const tickets = bookings.map(b => {
      const ev = MOCK_EVENTS.find(e => e._id === b.event);
      return {
        _id: b._id, eventId: b.event,
        eventTitle:   ev?.title     || 'Unknown Event',
        eventBanner:  ev?.bannerImage,
        startTime:    ev?.startDate,
        endTime:      ev?.endDate,
        location:     ev?.venue ? `${ev.venue.address}, ${ev.venue.city}` : '',
        ticketType:   b.ticketTypeName,
        ticketPrice:  b.ticketTypePrice,
        quantity:     b.quantity,
        totalAmount:  b.totalAmount,
        status:       b.status,
        qrToken:      b.qrToken,
        attendeeName: b.attendeeName,
        attendeeEmail: b.attendeeEmail,
        purchasedAt:  b.createdAt,
      };
    });
    return ok({ tickets });
  }

  // ── Organizer stats ───────────────────────────────────────────────────────
  if (path === '/organizer/stats') {
    return ok({ totalRevenue: 246000, totalTickets: 531, activeEvents: 8, totalAttendees: 531 });
  }

  // ── Organizer revenue ─────────────────────────────────────────────────────
  if (path === '/organizer/revenue') {
    return ok(MOCK_REVENUE);
  }

  // ── Organizer events ──────────────────────────────────────────────────────
  if (path === '/organizer/events') {
    const { q = '', page: pg = '1', limit: lm = '10' } = params;
    let events = MOCK_EVENTS.map(e => ({
      ...e, revenue: e.ticketTypes.reduce((s, t) => s + (t.price * t.sold), 0),
      soldCount: e.ticketTypes.reduce((s, t) => s + t.sold, 0),
    }));
    if (q) events = events.filter(e => e.title.toLowerCase().includes(q.toLowerCase()));
    const total = events.length;
    const l = parseInt(lm);
    const p = parseInt(pg);
    return ok({ events: events.slice((p-1)*l, p*l), total, page: p, pages: Math.ceil(total/l) });
  }

  // ── Admin stats ───────────────────────────────────────────────────────────
  if (path === '/admin/stats') {
    return ok({ totalRevenue: 580000, totalUsers: 1284, totalEvents: 47, totalTickets: 2840 });
  }

  // ── Admin events ──────────────────────────────────────────────────────────
  if (path === '/admin/events') {
    const { q = '', page: pg = '1', limit: lm = '20' } = params;
    let events = MOCK_EVENTS;
    if (q) events = events.filter(e => e.title.toLowerCase().includes(q.toLowerCase()));
    const total = events.length;
    const l = parseInt(lm);
    const p = parseInt(pg);
    return ok({ events: events.slice((p-1)*l, p*l), total, page: p, pages: Math.ceil(total/l) });
  }

  // ── Admin users ───────────────────────────────────────────────────────────
  if (path === '/admin/users') {
    const { q = '', role = '', status: st = '', page: pg = '1', limit: lm = '20' } = params;
    let users = MOCK_USERS;
    if (q)    users = users.filter(u => u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase()));
    if (role) users = users.filter(u => u.role === role);
    if (st)   users = users.filter(u => u.status === st);
    const total = users.length;
    const l = parseInt(lm);
    const p = parseInt(pg);
    return ok({ users: users.slice((p-1)*l, p*l), total, page: p, pages: Math.ceil(total/l) });
  }

  // ── Promo codes ───────────────────────────────────────────────────────────
  if (path === '/promoCodes') {
    const { eventId } = params;
    const codes = eventId ? MOCK_PROMO_CODES.filter(c => c.event === eventId) : MOCK_PROMO_CODES;
    return ok({ promoCodes: codes });
  }

  // ── Health check ──────────────────────────────────────────────────────────
  if (path === '/health') {
    return ok({ ok: true, database: 'mock', host: 'localhost', dbName: 'eventnest_mock', timestamp: new Date().toISOString() });
  }

  err(`Mock GET ${path} not found`, 404);
}

async function handlePost(path, body = {}) {
  await delay();

  // ── Login ─────────────────────────────────────────────────────────────────
  if (path === '/auth/login') {
    const { email, password } = body;
    if (!email || !password) err('Email and password are required');
    const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) err('Invalid email or password', 401);
    if (password !== 'demo1234') err('Invalid email or password', 401);
    if (user.status === 'suspended') err('Account suspended', 403);
    _sessionUser = user;
    return ok({ token: makeMockJwt(user), user });
  }

  // ── Signup ────────────────────────────────────────────────────────────────
  if (path === '/auth/signup') {
    const { name, email, password, role } = body;
    if (!name || !email || !password) err('Name, email and password are required');
    if (MOCK_USERS.find(u => u.email === email.toLowerCase())) err('Email already registered', 409);
    const newUser = {
      _id: `u_${Date.now()}`, id: `u_${Date.now()}`,
      name: name.trim(), email: email.toLowerCase(),
      role: ['attendee','organizer'].includes(role) ? role : 'attendee',
      status: 'active', createdAt: new Date().toISOString(),
    };
    MOCK_USERS.push(newUser);
    _sessionUser = newUser;
    return ok({ token: makeMockJwt(newUser), user: newUser }, 201);
  }

  // ── Create Booking ────────────────────────────────────────────────────────
  if (path === '/bookings') {
    const u = getSessionUser();
    if (!u) err('Unauthorized', 401);
    const { eventId, tickets, attendeeName, attendeeEmail, promoCode } = body;
    if (!eventId || !Array.isArray(tickets) || !tickets.length) err('eventId and tickets are required');

    const event = MOCK_EVENTS.find(e => e._id === eventId || e.id === eventId);
    if (!event) err('Event not found', 404);

    const createdBookings = [];
    for (const item of tickets) {
      const tt = event.ticketTypes.find(t => t._id === item.typeId);
      if (!tt) err(`Ticket type ${item.typeId} not found`);
      const qty = item.quantity || 1;
      if (tt.quantity - tt.sold < qty) err(`Not enough tickets for "${tt.name}"`);

      let discountPct = 0;
      if (promoCode && promoCode.toUpperCase() === event.promoCode?.toUpperCase?.()) {
        discountPct = event.promoDiscount || 0;
      }
      const pc = MOCK_PROMO_CODES.find(c => c.event === eventId && c.code === promoCode?.toUpperCase() && c.isActive);
      if (pc) discountPct = pc.discountPercent;

      const subtotal    = tt.price * qty;
      const totalAmount = Math.max(0, subtotal - subtotal * (discountPct / 100));
      const booking = {
        _id: `bk_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        id:  `bk_${Date.now()}`,
        event: eventId, user: u._id || u.id,
        ticketTypeId: tt._id, ticketTypeName: tt.name, ticketTypePrice: tt.price,
        quantity: qty, totalAmount, status: 'confirmed',
        qrToken: `EN-MOCK-${Date.now().toString(36).toUpperCase()}`,
        attendeeName: attendeeName || u.name,
        attendeeEmail: attendeeEmail || u.email,
        discount: discountPct, createdAt: new Date().toISOString(),
      };
      tt.sold += qty;
      MOCK_BOOKINGS.push(booking);
      createdBookings.push(booking);
    }
    return ok({ bookings: createdBookings, success: true }, 201);
  }

  // ── Scan QR ───────────────────────────────────────────────────────────────
  if (path === '/scan') {
    const { token } = body;
    if (!token) return ok({ valid: false, message: 'Token is required' });
    const booking = MOCK_BOOKINGS.find(b => b.qrToken === token.trim());
    if (!booking)                     return ok({ valid: false, message: 'Invalid token — not found' });
    if (booking.status === 'used')    return ok({ valid: false, message: 'Already scanned' });
    if (booking.status === 'cancelled') return ok({ valid: false, message: 'Ticket cancelled' });
    booking.status = 'used';
    const ev = MOCK_EVENTS.find(e => e._id === booking.event);
    return ok({ valid: true, ticket: { id: booking._id, attendeeName: booking.attendeeName, eventTitle: ev?.title, ticketType: booking.ticketTypeName, status: 'confirmed' } });
  }

  // ── Create Promo Code ─────────────────────────────────────────────────────
  if (path === '/promoCodes') {
    const { eventId, code, discountPercent, usageLimit, expiresAt } = body;
    if (!eventId || !code || !discountPercent) err('eventId, code, and discountPercent are required');
    if (MOCK_PROMO_CODES.find(c => c.event === eventId && c.code === code.toUpperCase())) err('Promo code already exists', 409);
    const pc = {
      _id: `pc_${Date.now()}`, event: eventId, code: code.toUpperCase(),
      discountPercent, usageLimit: usageLimit || null,
      expiresAt: expiresAt || null, isActive: true, usedCount: 0,
      createdAt: new Date().toISOString(),
    };
    MOCK_PROMO_CODES.push(pc);
    return ok({ promoCode: pc }, 201);
  }

  // ── Refund ────────────────────────────────────────────────────────────────
  if (path === '/refund') {
    const { bookingId } = body;
    const booking = MOCK_BOOKINGS.find(b => b._id === bookingId);
    if (!booking) err('Booking not found', 404);
    if (booking.status === 'cancelled') err('Already cancelled');
    booking.status = 'cancelled';
    return ok({ message: 'Booking cancelled and refund processed.', booking: { _id: booking._id, status: booking.status, totalAmount: booking.totalAmount } });
  }

  err(`Mock POST ${path} not found`, 404);
}

async function handlePut(path, body = {}) {
  await delay();

  // ── Update profile ────────────────────────────────────────────────────────
  if (path === '/auth/me') {
    const u = getSessionUser();
    if (!u) err('Unauthorized', 401);
    const { name, email } = body;
    if (name)  u.name  = name.trim();
    if (email) u.email = email.toLowerCase();
    _sessionUser = u;
    return ok({ user: u });
  }

  // ── Admin: user status / role ─────────────────────────────────────────────
  const activateMatch = path.match(/^\/admin\/users\/([^/]+)\/(activate|suspend|role)$/);
  if (activateMatch) {
    const userId = activateMatch[1];
    const action = activateMatch[2];
    const user = MOCK_USERS.find(u => u._id === userId || u.id === userId);
    if (!user) err('User not found', 404);
    if (action === 'activate') user.status = 'active';
    if (action === 'suspend')  user.status = 'suspended';
    if (action === 'role')     user.role   = body.role;
    return ok({ user });
  }

  // ── Update/publish event ──────────────────────────────────────────────────
  const evtMatch = path.match(/^\/events\/([^/]+)$/);
  if (evtMatch) {
    const event = MOCK_EVENTS.find(e => e._id === evtMatch[1]);
    if (!event) err('Event not found', 404);
    Object.assign(event, body);
    return ok({ event });
  }

  err(`Mock PUT ${path} not found`, 404);
}

async function handlePatch(path, body = {}) {
  await delay();

  // ── Toggle promo code ─────────────────────────────────────────────────────
  const promoMatch = path.match(/^\/promoCodes\/([^/]+)$/);
  if (promoMatch) {
    const pc = MOCK_PROMO_CODES.find(c => c._id === promoMatch[1]);
    if (!pc) err('Promo code not found', 404);
    pc.isActive = body.isActive ?? !pc.isActive;
    return ok({ promoCode: pc });
  }

  err(`Mock PATCH ${path} not found`, 404);
}

async function handleDelete(path) {
  await delay();

  // ── Delete event ──────────────────────────────────────────────────────────
  const evtMatch = path.match(/^\/events\/([^/]+)$/);
  if (evtMatch) {
    const idx = MOCK_EVENTS.findIndex(e => e._id === evtMatch[1]);
    if (idx === -1) err('Event not found', 404);
    MOCK_EVENTS.splice(idx, 1);
    return ok({ success: true });
  }

  // ── Delete promo code ─────────────────────────────────────────────────────
  const promoMatch = path.match(/^\/promoCodes\/([^/]+)$/);
  if (promoMatch) {
    const idx = MOCK_PROMO_CODES.findIndex(c => c._id === promoMatch[1]);
    if (idx === -1) err('Promo code not found', 404);
    MOCK_PROMO_CODES.splice(idx, 1);
    return ok({ message: 'Promo code deleted' });
  }

  err(`Mock DELETE ${path} not found`, 404);
}

// ─── Public dispatcher ────────────────────────────────────────────────────────

export const mockApi = {
  get:    (path, config = {}) => handleGet(path,    config.params || {}),
  post:   (path, data  = {})  => handlePost(path,   data),
  put:    (path, data  = {})  => handlePut(path,    data),
  patch:  (path, data  = {})  => handlePatch(path,  data),
  delete: (path)              => handleDelete(path),
};

/** true when NEXT_PUBLIC_USE_MOCK=true OR running on Vercel without a backend */
export const isMockMode = () =>
  typeof window !== 'undefined' &&
  (process.env.NEXT_PUBLIC_USE_MOCK === 'true' ||
   window.__EVENTNEST_MOCK__ === true);
