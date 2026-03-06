export const EVENT_CATEGORIES = [
  { id: 'music',     label: 'Music',       icon: '🎵', color: 'bg-pink-100 text-pink-700' },
  { id: 'tech',      label: 'Technology',  icon: '💻', color: 'bg-blue-100 text-blue-700' },
  { id: 'sports',    label: 'Sports',      icon: '⚽', color: 'bg-green-100 text-green-700' },
  { id: 'college',   label: 'College',     icon: '🎓', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'food',      label: 'Food & Drink',icon: '🍕', color: 'bg-orange-100 text-orange-700' },
  { id: 'arts',      label: 'Arts',        icon: '🎨', color: 'bg-purple-100 text-purple-700' },
  { id: 'business',  label: 'Business',    icon: '💼', color: 'bg-gray-100 text-gray-700' },
  { id: 'community', label: 'Community',   icon: '🤝', color: 'bg-teal-100 text-teal-700' },
];

export const CATEGORY_MAP = Object.fromEntries(EVENT_CATEGORIES.map((c) => [c.id, c]));

export const USER_ROLES = {
  ATTENDEE:  'attendee',
  ORGANIZER: 'organizer',
  STAFF:     'staff',
  ADMIN:     'admin',
};

export const BOOKING_STATUS = {
  PENDING:   'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  USED:      'used',
};

export const EVENT_SORT_OPTIONS = [
  { value: 'date-asc',   label: 'Date: Earliest First' },
  { value: 'date-desc',  label: 'Date: Latest First' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'popularity', label: 'Most Popular' },
];

// ─── Mock data (used when backend is unavailable) ────────────────────────────
export const MOCK_EVENTS = [
  {
    _id: '1',
    title: 'TechFest 2026 — Innovation Summit',
    description:
      'Join 500+ tech leaders for a day of keynotes, hands-on demos, AI showcases, and deep networking sessions with industry experts.',
    category: 'tech',
    bannerImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format',
    location: { address: 'Javits Convention Center', city: 'New York' },
    startTime: '2026-04-15T09:00:00Z',
    endTime:   '2026-04-15T18:00:00Z',
    ticketTypes: [
      { name: 'General',    price: 49,  quantity: 300, sold: 180 },
      { name: 'VIP',        price: 149, quantity: 50,  sold: 30  },
      { name: 'Early Bird', price: 29,  quantity: 50,  sold: 50  },
    ],
    organizerName: 'TechHub NYC',
    status: 'published',
    featured: true,
    attendeesCount: 260,
  },
  {
    _id: '2',
    title: 'Summer Music Festival',
    description:
      'An outdoor music festival featuring 20+ local and international artists across three stages. Food trucks, art installations, and good vibes.',
    category: 'music',
    bannerImage: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format',
    location: { address: 'Central Park Great Lawn', city: 'New York' },
    startTime: '2026-04-20T14:00:00Z',
    endTime:   '2026-04-20T23:00:00Z',
    ticketTypes: [
      { name: 'General', price: 35,  quantity: 500, sold: 320 },
      { name: 'VIP',     price: 99,  quantity: 100, sold: 65  },
    ],
    organizerName: 'NYC Events Co',
    status: 'published',
    featured: true,
    attendeesCount: 385,
  },
  {
    _id: '3',
    title: 'Local Startup Pitch Night',
    description:
      '10 early-stage startups pitch in 5 minutes each to a panel of investors. Open Q&A + networking mixer after.',
    category: 'business',
    bannerImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format',
    location: { address: 'WeWork Times Square', city: 'New York' },
    startTime: '2026-04-18T18:00:00Z',
    endTime:   '2026-04-18T21:00:00Z',
    ticketTypes: [
      { name: 'General', price: 0, quantity: 100, sold: 78 },
    ],
    organizerName: 'StartupNYC',
    status: 'published',
    featured: false,
    attendeesCount: 78,
  },
  {
    _id: '4',
    title: 'College Basketball Championship',
    description:
      'The annual inter-college basketball tournament finals. Cheer for your favourite team! Free refreshments for all attendees.',
    category: 'sports',
    bannerImage: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format',
    location: { address: 'Brooklyn University Stadium', city: 'Brooklyn' },
    startTime: '2026-04-22T10:00:00Z',
    endTime:   '2026-04-22T20:00:00Z',
    ticketTypes: [
      { name: 'Student', price: 5,  quantity: 200, sold: 140 },
      { name: 'General', price: 15, quantity: 300, sold: 200 },
    ],
    organizerName: 'Brooklyn University',
    status: 'published',
    featured: false,
    attendeesCount: 340,
  },
  {
    _id: '5',
    title: 'Art & Culture Night',
    description:
      'Explore original works by 30+ emerging local artists. Live painting, poetry slam, and acoustic performances in a gallery setting.',
    category: 'arts',
    bannerImage: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&auto=format',
    location: { address: 'Brooklyn Museum East Wing', city: 'Brooklyn' },
    startTime: '2026-04-25T17:00:00Z',
    endTime:   '2026-04-25T22:00:00Z',
    ticketTypes: [
      { name: 'General', price: 20, quantity: 150, sold: 90 },
    ],
    organizerName: 'Arts Brooklyn',
    status: 'published',
    featured: true,
    attendeesCount: 90,
  },
  {
    _id: '6',
    title: 'International Community Food Festival',
    description:
      'Taste cuisines from 25+ countries at this beloved annual celebration. Cooking demos, cultural performances, and family activities.',
    category: 'food',
    bannerImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format',
    location: { address: 'Jackson Heights Plaza', city: 'Queens' },
    startTime: '2026-05-01T11:00:00Z',
    endTime:   '2026-05-01T20:00:00Z',
    ticketTypes: [
      { name: 'General', price: 10, quantity: 500, sold: 310 },
    ],
    organizerName: 'Queens Community Board',
    status: 'published',
    featured: false,
    attendeesCount: 310,
  },
];

export const MOCK_MY_TICKETS = [
  {
    _id: 'tk1',
    eventId: '1',
    eventTitle: 'TechFest 2026 — Innovation Summit',
    eventBanner: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&auto=format',
    ticketType: 'VIP',
    price: 149,
    qrToken: 'TKEV1-VIP-abc123xyz',
    status: 'confirmed',
    purchasedAt: '2026-03-01T10:00:00Z',
    startTime: '2026-04-15T09:00:00Z',
    location: 'Javits Convention Center, New York',
    attendeeName: 'Alex Johnson',
  },
  {
    _id: 'tk2',
    eventId: '2',
    eventTitle: 'Summer Music Festival',
    eventBanner: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&auto=format',
    ticketType: 'General',
    price: 35,
    qrToken: 'TKEV2-GEN-def456uvw',
    status: 'confirmed',
    purchasedAt: '2026-03-02T14:00:00Z',
    startTime: '2026-04-20T14:00:00Z',
    location: 'Central Park Great Lawn, New York',
    attendeeName: 'Alex Johnson',
  },
];

export const MOCK_REVENUE_DATA = [
  { month: 'Oct', revenue: 3200 },
  { month: 'Nov', revenue: 4800 },
  { month: 'Dec', revenue: 6100 },
  { month: 'Jan', revenue: 5200 },
  { month: 'Feb', revenue: 7400 },
  { month: 'Mar', revenue: 9200 },
];
