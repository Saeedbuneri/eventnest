# EventNest — Frontend Requirements

Everything the backend developer (or you) needs to wire up before this frontend goes live.

---

## 1. Run the Frontend

```bash
cd eventnest
npm install
npm run dev          # http://localhost:3000
```

> The app works fully **without a backend** using built-in mock data.  
> To connect a real API, copy `.env.local.example` → `.env.local` and fill in the values.

---

## 2. Environment Variables

Create a file named `.env.local` in the `eventnest/` root:

```dotenv
# ── Required ────────────────────────────────────────────
NEXT_PUBLIC_API_URL=http://localhost:5000/api   # Your backend base URL

# ── Stripe (required for real payments) ─────────────────
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...                  # Server-side only, never expose

# ── Optional ────────────────────────────────────────────
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=               # Venue map embed
NEXT_PUBLIC_SENTRY_DSN=                        # Error monitoring
```

---

## 3. NPM Packages & Versions

| Package | Version | Purpose |
|---|---|---|
| `next` | 14.2.0 | React framework (App Router) |
| `react` | ^18 | UI library |
| `react-dom` | ^18 | DOM renderer |
| `tailwindcss` | ^3.4 | Utility CSS |
| `autoprefixer` | ^10 | CSS vendor prefixes |
| `postcss` | ^8 | CSS processor |
| `@tanstack/react-query` | ^5 | Server-state / data fetching |
| `axios` | ^1.6 | HTTP client with interceptors |
| `react-hook-form` | ^7 | Form state management |
| `@hookform/resolvers` | ^3 | Zod adapter for react-hook-form |
| `zod` | ^3 | Schema validation |
| `lucide-react` | ^0.378 | Icon library |
| `recharts` | ^2.12 | Charts (AreaChart, BarChart) |
| `qrcode.react` | ^3.1 | QR code generation (SVG) |
| `html5-qrcode` | ^2.3 | Camera-based QR code scanning |
| `react-hot-toast` | ^2.4 | Toast notifications |
| `js-cookie` | ^3.0 | JWT cookie storage |
| `clsx` | ^2.1 | Conditional className utility |
| `tailwind-merge` | ^2.3 | Merge Tailwind classes safely |
| `@stripe/stripe-js` | ^3 | Stripe browser SDK |
| `@stripe/react-stripe-js` | ^2 | Stripe React hooks |
| `framer-motion` | ^11 | Animations (optional) |

Install everything at once:
```bash
npm install
```

---

## 4. Backend API Endpoints

The frontend calls these endpoints via `lib/api.js` (Axios instance).  
Base URL is `NEXT_PUBLIC_API_URL`.  
All protected routes require `Authorization: Bearer <token>` header.

### 4.1 Authentication

| Method | Endpoint | Body | Response | Auth |
|---|---|---|---|---|
| POST | `/auth/login` | `{ email, password }` | `{ token, user: { id, name, email, role } }` | No |
| POST | `/auth/signup` | `{ name, email, password, role }` | `{ token, user }` | No |
| GET | `/auth/me` | — | `{ user }` | Yes |
| POST | `/auth/logout` | — | `{ success: true }` | Yes |

**`role`** values: `attendee` | `organizer` | `staff` | `admin`

---

### 4.2 Events

| Method | Endpoint | Query / Body | Response | Auth |
|---|---|---|---|---|
| GET | `/events` | `?q&category&city&price&sort&page&limit` | `{ events[], total, page, pages }` | No |
| GET | `/events/:id` | — | `{ event }` | No |
| POST | `/events` | (see Event schema below) | `{ event }` | Organizer |
| PUT | `/events/:id` | (partial event fields) | `{ event }` | Organizer (owner) |
| DELETE | `/events/:id` | — | `{ success: true }` | Organizer (owner) |
| GET | `/events/:id/attendees` | `?q&page&limit` | `{ attendees[], total }` | Organizer |

**Event schema (POST body)**:
```json
{
  "title": "string",
  "description": "string",
  "category": "music|sports|food|art|tech|theatre|fitness|community",
  "bannerImage": "url string",
  "startDate": "ISO 8601",
  "endDate": "ISO 8601",
  "venue": {
    "address": "string",
    "city": "string",
    "coordinates": { "lat": 0, "lng": 0 }
  },
  "ticketTypes": [
    { "name": "string", "price": 0, "quantity": 100, "maxPerUser": 5 }
  ],
  "refundPolicy": "no_refund|48h|7days",
  "isPublic": true,
  "promoCode": "string",
  "promoDiscount": 10
}
```

---

### 4.3 Bookings & Tickets

| Method | Endpoint | Body | Response | Auth |
|---|---|---|---|---|
| POST | `/bookings` | `{ eventId, tickets: [{ typeId, quantity }], promoCode? }` | `{ booking, paymentIntent }` | Attendee |
| GET | `/my-tickets` | — | `[{ id, event, ticketType, status, qrToken, purchasedAt }]` | Attendee |
| GET | `/tickets/:id` | — | `{ ticket }` | Owner |

**Booking ticket item**:
```json
{
  "id": "string",
  "event": { "id", "title", "bannerImage", "startDate", "location" },
  "ticketType": { "id", "name", "price" },
  "status": "confirmed | used | cancelled | pending",
  "qrToken": "string",
  "purchasedAt": "ISO 8601",
  "attendeeName": "string"
}
```

---

### 4.4 Payments

| Method | Endpoint | Body | Response | Auth |
|---|---|---|---|---|
| POST | `/payments/intent` | `{ bookingId, amount }` | `{ clientSecret }` | Attendee |
| POST | `/payments/confirm` | `{ bookingId, paymentIntentId }` | `{ booking }` | Attendee |

---

### 4.5 QR Code Scanning (Staff)

| Method | Endpoint | Body | Response | Auth |
|---|---|---|---|---|
| POST | `/scan` | `{ token }` | `{ valid, ticket?, message }` | Staff / Organizer |

**Success response**:
```json
{
  "valid": true,
  "ticket": {
    "id": "string",
    "attendeeName": "string",
    "eventTitle": "string",
    "ticketType": "string",
    "status": "confirmed"
  }
}
```
**Failure response**:
```json
{ "valid": false, "message": "Already scanned | Invalid token | Not found" }
```

---

### 4.6 Organizer Analytics

| Method | Endpoint | Query | Response | Auth |
|---|---|---|---|---|
| GET | `/organizer/stats` | — | `{ totalRevenue, totalTickets, activeEvents, totalAttendees }` | Organizer |
| GET | `/organizer/revenue` | `?period=monthly` | `[{ month, revenue }]` | Organizer |
| GET | `/organizer/events` | `?q&page&limit` | `{ events[], total }` | Organizer |

---

### 4.7 Admin

| Method | Endpoint | Query / Body | Response | Auth |
|---|---|---|---|---|
| GET | `/admin/stats` | — | `{ totalRevenue, totalUsers, totalEvents, totalTickets }` | Admin |
| GET | `/admin/users` | `?q&role&status&page&limit` | `{ users[], total }` | Admin |
| PUT | `/admin/users/:id/suspend` | — | `{ user }` | Admin |
| PUT | `/admin/users/:id/activate` | — | `{ user }` | Admin |
| GET | `/admin/events` | `?q&page&limit` | `{ events[], total }` | Admin |

---

## 5. External Service Accounts

| Service | Used For | Where to Get |
|---|---|---|
| **Stripe** | Payment processing | https://dashboard.stripe.com |
| **Google Maps Embed** | Venue map on event detail page | https://console.cloud.google.com (Maps Embed API) |
| **Cloudinary / AWS S3** | Banner image uploads for events | https://cloudinary.com or https://aws.amazon.com/s3 |
| **SendGrid / Resend** | Booking confirmation emails | https://sendgrid.com or https://resend.com |
| **Sentry** (optional) | Frontend error monitoring | https://sentry.io |

---

## 6. Auth Token Contract

- The login/signup endpoint returns `{ token: "<jwt>", user: { id, name, email, role } }`.
- The frontend stores the JWT in a cookie named `en_token` (7-day expiry).
- The `user` object is stored in `localStorage` under key `en_user` as JSON.
- Every Axios request automatically attaches `Authorization: Bearer <en_token>`.
- A `401` response from any endpoint redirects the user to `/auth/login`.

---

## 7. Image Domains

If you serve banner images from an external host, add the domain to `next.config.mjs`:

```js
images: {
  domains: ['your-s3-bucket.s3.amazonaws.com', 'res.cloudinary.com']
}
```

Currently allowed: `images.unsplash.com`, `picsum.photos`, `via.placeholder.com`.

---

## 8. Project Structure (quick reference)

```
eventnest/
├── app/
│   ├── page.jsx                        # Home / landing
│   ├── events/
│   │   ├── page.jsx                    # Browse events
│   │   └── [id]/page.jsx              # Event detail
│   ├── checkout/[eventId]/page.jsx     # 3-step checkout
│   ├── my-tickets/page.jsx
│   ├── auth/
│   │   ├── login/page.jsx
│   │   └── signup/page.jsx
│   ├── organizer/
│   │   ├── dashboard/page.jsx
│   │   ├── events/
│   │   │   ├── page.jsx               # Manage events
│   │   │   ├── create/page.jsx        # Create event wizard
│   │   │   └── [id]/attendees/page.jsx
│   ├── staff/scan/page.jsx            # QR scanner
│   └── admin/
│       ├── dashboard/page.jsx
│       └── users/page.jsx
├── components/
│   ├── ui/          # Button, Input, Modal, Badge, Spinner, Select
│   ├── layout/      # Navbar, Footer, DashboardLayout
│   ├── events/      # EventCard, EventFilters, TicketSelector
│   ├── tickets/     # TicketCard, QRCodeDisplay
│   └── dashboard/   # StatsCard, RevenueChart
├── context/
│   └── AuthContext.jsx
├── hooks/
│   └── useEvents.js
├── lib/
│   ├── api.js        # Axios instance
│   ├── constants.js  # Mock data + app constants
│   └── utils.js      # Helper functions
└── .env.local        # ← create this from .env.local.example
```

---

## 9. Demo Accounts (no backend needed)

| Email | Password | Role |
|---|---|---|
| `attendee@demo.com` | anything | Attendee |
| `organizer@demo.com` | anything | Organizer |
| `admin@demo.com` | anything | Admin |
| `staff@demo.com` | anything | Staff |
