/**
 * LocalStorage static seed — populates demo data so the UI works
 * even when MongoDB is unavailable. Called once on app start.
 */

export const SEED_EVENTS = [
  {
    _id: 'ls_evt_1',
    title: 'Islamabad Music Festival 2026',
    description: 'A night of live music featuring top artists from across Pakistan. Food stalls, art installations and two outdoor stages at F-9 Park.',
    category: 'music',
    bannerImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
    venue: { address: 'F-9 Park, Islamabad', city: 'Islamabad' },
    startDate: '2026-04-15T18:00:00Z',
    endDate:   '2026-04-15T23:00:00Z',
    ticketTypes: [
      { name: 'General Admission', price: 500,  quantity: 300, sold: 180 },
      { name: 'VIP',               price: 1500, quantity: 50,  sold: 22 },
    ],
    organizerName: 'EventNest ISB',
    status: 'published', featured: true, attendeesCount: 202,
  },
  {
    _id: 'ls_evt_2',
    title: 'Blue Area TechMeet — AI & Startups',
    description: 'Islamabad\'s premier tech gathering. 20+ speakers, live demos, investor speed-dating, and late-night networking at Centaurus.',
    category: 'tech',
    bannerImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    venue: { address: 'Centaurus Mall, Blue Area', city: 'Islamabad' },
    startDate: '2026-04-18T10:00:00Z',
    endDate:   '2026-04-18T20:00:00Z',
    ticketTypes: [
      { name: 'Standard', price: 800,  quantity: 200, sold: 140 },
      { name: 'Speaker Pass', price: 0, quantity: 30, sold: 28 },
    ],
    organizerName: 'TechHub ISB',
    status: 'published', featured: true, attendeesCount: 168,
  },
  {
    _id: 'ls_evt_3',
    title: 'PNCA Lok Virsa Cultural Night',
    description: 'An evening celebrating Pakistani folk music, classical dance, and live art at Lok Virsa Heritage Museum. Free for all.',
    category: 'arts',
    bannerImage: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&q=80',
    venue: { address: 'Lok Virsa Heritage Museum, Shakarparian', city: 'Islamabad' },
    startDate: '2026-04-20T17:00:00Z',
    endDate:   '2026-04-20T21:00:00Z',
    ticketTypes: [
      { name: 'Free Entry', price: 0, quantity: 400, sold: 310 },
    ],
    organizerName: 'PNCA Pakistan',
    status: 'published', featured: false, attendeesCount: 310,
  },
  {
    _id: 'ls_evt_4',
    title: 'F-7 Markaz Street Food Festival',
    description: 'Taste 40+ food stalls from across Pakistan. Biryani battles, BBQ pit, dessert alley, and live dhol performances all weekend.',
    category: 'food',
    bannerImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    venue: { address: 'Jinnah Super Market, F-7 Markaz', city: 'Islamabad' },
    startDate: '2026-04-25T12:00:00Z',
    endDate:   '2026-04-25T22:00:00Z',
    ticketTypes: [
      { name: 'Day Pass', price: 300, quantity: 600, sold: 420 },
    ],
    organizerName: 'ISB Food Fest',
    status: 'published', featured: true, attendeesCount: 420,
  },
  {
    _id: 'ls_evt_5',
    title: 'NUST vs FAST Basketball Final',
    description: 'The annual inter-university basketball championship final. Cheer your university! Open to all students and alumni.',
    category: 'sports',
    bannerImage: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80',
    venue: { address: 'NUST Sports Complex, H-12', city: 'Islamabad' },
    startDate: '2026-04-22T14:00:00Z',
    endDate:   '2026-04-22T18:00:00Z',
    ticketTypes: [
      { name: 'Student', price: 100, quantity: 300, sold: 240 },
      { name: 'General', price: 200, quantity: 200, sold: 110 },
    ],
    organizerName: 'NUST Sports Board',
    status: 'published', featured: false, attendeesCount: 350,
  },
  {
    _id: 'ls_evt_6',
    title: 'Rawalpindi Startup Pitch Night',
    description: '8 early-stage startups pitch live to a panel of investors and mentors. Open networking mixer after the pitches. Free entry.',
    category: 'business',
    bannerImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80',
    venue: { address: 'Bahria Town Phase 7, Rawalpindi', city: 'Rawalpindi' },
    startDate: '2026-05-02T18:00:00Z',
    endDate:   '2026-05-02T21:30:00Z',
    ticketTypes: [
      { name: 'Free', price: 0, quantity: 150, sold: 98 },
    ],
    organizerName: 'RWP Startup Hub',
    status: 'published', featured: false, attendeesCount: 98,
  },
  {
    _id: 'ls_evt_7',
    title: 'Islamabad Running Club — 10K Race',
    description: 'Monthly community 10K run starting from Fatima Jinnah Park. All fitness levels welcome. Medal and breakfast for finishers.',
    category: 'sports',
    bannerImage: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
    venue: { address: 'Fatima Jinnah Park, F-9', city: 'Islamabad' },
    startDate: '2026-05-08T06:30:00Z',
    endDate:   '2026-05-08T10:00:00Z',
    ticketTypes: [
      { name: 'Runner', price: 400, quantity: 200, sold: 156 },
    ],
    organizerName: 'ISB Running Club',
    status: 'published', featured: false, attendeesCount: 156,
  },
  {
    _id: 'ls_evt_8',
    title: 'COMSATS College Fest 2026',
    description: 'Three-day inter-department festival with singing competition, drama, debate, gaming, and a tech expo. Open to all.',
    category: 'college',
    bannerImage: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80',
    venue: { address: 'COMSATS University, Park Road', city: 'Islamabad' },
    startDate: '2026-05-12T09:00:00Z',
    endDate:   '2026-05-14T18:00:00Z',
    ticketTypes: [
      { name: 'Student Pass', price: 0,   quantity: 500, sold: 380 },
      { name: 'Public Pass',  price: 150, quantity: 200, sold: 60 },
    ],
    organizerName: 'COMSATS Student Union',
    status: 'published', featured: true, attendeesCount: 440,
  },
];

export const SEED_MY_TICKETS = [
  {
    _id: 'ls_tk_1',
    eventId: 'ls_evt_1',
    eventTitle: 'Islamabad Music Festival 2026',
    eventBanner: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80',
    ticketType: 'VIP',
    price: 1500,
    qrToken: 'EN-ISB-MF26-VIP-A1B2C3',
    status: 'confirmed',
    purchasedAt: '2026-03-05T12:00:00Z',
    startDate: '2026-04-15T18:00:00Z',
    location: 'F-9 Park, Islamabad',
    attendeeName: 'Ahmed Khan',
  },
  {
    _id: 'ls_tk_2',
    eventId: 'ls_evt_2',
    eventTitle: 'Blue Area TechMeet — AI & Startups',
    eventBanner: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80',
    ticketType: 'Standard',
    price: 800,
    qrToken: 'EN-ISB-TM26-STD-D4E5F6',
    status: 'confirmed',
    purchasedAt: '2026-03-05T14:00:00Z',
    startDate: '2026-04-18T10:00:00Z',
    location: 'Centaurus Mall, Blue Area, Islamabad',
    attendeeName: 'Ahmed Khan',
  },
  {
    _id: 'ls_tk_3',
    eventId: 'ls_evt_3',
    eventTitle: 'PNCA Lok Virsa Cultural Night',
    eventBanner: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=400&q=80',
    ticketType: 'Free Entry',
    price: 0,
    qrToken: 'EN-ISB-LV26-FREE-G7H8I9',
    status: 'used',
    purchasedAt: '2026-03-01T09:00:00Z',
    startDate: '2026-04-20T17:00:00Z',
    location: 'Lok Virsa, Shakarparian, Islamabad',
    attendeeName: 'Ahmed Khan',
  },
];

export const SEED_REVENUE_DATA = [
  { month: 'Oct',  revenue: 42000,  tickets: 84  },
  { month: 'Nov',  revenue: 67000,  tickets: 122 },
  { month: 'Dec',  revenue: 91000,  tickets: 185 },
  { month: 'Jan',  revenue: 74000,  tickets: 148 },
  { month: 'Feb',  revenue: 115000, tickets: 231 },
  { month: 'Mar',  revenue: 148000, tickets: 296 },
];

export const SEED_CATEGORY_DATA = [
  { name: 'Music',    value: 35, color: '#f43f5e' },
  { name: 'Tech',     value: 22, color: '#3b82f6' },
  { name: 'Sports',   value: 18, color: '#22c55e' },
  { name: 'Food',     value: 12, color: '#f97316' },
  { name: 'Arts',     value: 8,  color: '#a855f7' },
  { name: 'Other',    value: 5,  color: '#94a3b8' },
];

const SEED_VERSION = 'v1.2';

export function seedLocalStorage() {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem('en_seed_version') === SEED_VERSION) return;

  localStorage.setItem('en_seed_events',       JSON.stringify(SEED_EVENTS));
  localStorage.setItem('en_seed_my_tickets',   JSON.stringify(SEED_MY_TICKETS));
  localStorage.setItem('en_seed_revenue',      JSON.stringify(SEED_REVENUE_DATA));
  localStorage.setItem('en_seed_categories',   JSON.stringify(SEED_CATEGORY_DATA));
  localStorage.setItem('en_seed_version',      SEED_VERSION);
}

/** Returns localStorage events if API fails */
export function getLocalEvents(filters = {}) {
  try {
    let events = JSON.parse(localStorage.getItem('en_seed_events') || '[]');
    if (filters.category) events = events.filter(e => e.category === filters.category);
    if (filters.featured) events = events.filter(e => e.featured);
    if (filters.upcoming) events = events.filter(e => new Date(e.startDate) > new Date());
    if (filters.search) {
      const q = filters.search.toLowerCase();
      events = events.filter(e => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q));
    }
    return events;
  } catch { return []; }
}

export function getLocalTickets() {
  try { return JSON.parse(localStorage.getItem('en_seed_my_tickets') || '[]'); } catch { return []; }
}

export function getLocalRevenue() {
  try { return JSON.parse(localStorage.getItem('en_seed_revenue') || '[]'); } catch { return []; }
}

export function getLocalCategories() {
  try { return JSON.parse(localStorage.getItem('en_seed_categories') || '[]'); } catch { return []; }
}
