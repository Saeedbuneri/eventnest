# EventNest 🎟️

A full-stack event ticketing platform built with **Next.js 14**, **MongoDB Atlas**, and **Tailwind CSS**. Users can discover events, buy QR-code tickets, and organizers can manage events with real-time dashboards.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS 3 + custom `brand`/`accent` colors |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT (7-day), bcryptjs, cookie + localStorage |
| Forms | React Hook Form + Zod validation |
| HTTP Client | Axios (named export `{ api }`) |
| QR Codes | `qrcode.react` (generation) + `html5-qrcode` (scanning) |

---

## Project Structure

```
eventnest/
├── app/
│   ├── page.jsx                  # Home page
│   ├── auth/login/               # Login page
│   ├── auth/signup/              # Signup page
│   ├── events/                   # Browse + event detail
│   ├── checkout/[eventId]/       # Ticket checkout flow
│   ├── my-tickets/               # Attendee ticket wallet
│   ├── profile/                  # User profile / password change
│   ├── organizer/                # Organizer dashboard + events
│   ├── staff/scan/               # QR ticket scanner
│   ├── admin/                    # Admin panel (users, events, analytics)
│   └── api/                      # All API routes (Next.js Route Handlers)
│       ├── auth/                 # login, signup, me
│       ├── events/               # CRUD + attendees
│       ├── bookings/             # Create + list bookings
│       ├── my-tickets/           # Attendee bookings
│       ├── organizer/            # Organizer stats, events, revenue
│       ├── admin/                # Admin users, events, stats
│       ├── scan/                 # QR code verification
│       ├── refund/               # Refund requests
│       └── promoCodes/           # Promo code management
├── components/
│   ├── layout/                   # Navbar, Footer, DashboardLayout
│   ├── events/                   # EventCard, TicketSelector, EventFilters
│   ├── dashboard/                # StatsCard, RevenueChart
│   └── ui/                       # Button, Input, Badge, Modal, Spinner
├── context/
│   └── AuthContext.jsx           # Global auth state (user, login, logout)
├── lib/
│   ├── api.js                    # Axios instance (always import as { api })
│   ├── auth.js                   # JWT sign/verify, bcrypt helpers
│   ├── db.js                     # MongoDB connection with caching
│   ├── utils.js                  # formatDate, formatCurrency, cn()
│   └── constants.js              # EVENT_CATEGORIES, CATEGORY_MAP
├── middleware/
│   └── withAuth.js               # API route JWT guard (withAuth wrapper)
├── middleware.js                 # Next.js Edge Middleware — route-level role enforcement
├── models/
│   ├── User.js                   # Mongoose user model
│   ├── Event.js                  # Mongoose event model
│   └── Booking.js                # Mongoose booking model
└── scripts/
    └── seed.js                   # Creates demo users in MongoDB
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) v18+
- [Git](https://git-scm.com)
- A free [MongoDB Atlas](https://cloud.mongodb.com) cluster

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/eventnest.git
cd eventnest
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example file and fill in your values:

```bash
copy .env.local.example .env.local
```

Open `.env.local` and set:

```env
# MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/eventnest?retryWrites=true&w=majority

# Any long random string — used to sign JWT tokens
JWT_SECRET=your_super_secret_jwt_key_change_this

# The URL your app runs on (development)
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

> ⚠️ **Never commit `.env.local`** — it's in `.gitignore` already.

### 4. Seed demo users

This creates four demo accounts in your database:

```bash
node scripts/seed.js
```

Output:
```
Connected to MongoDB
  CREATE admin@demo.com     (admin)
  CREATE organizer@demo.com (organizer)
  CREATE staff@demo.com     (staff)
  CREATE attendee@demo.com  (attendee)
```

### 5. Start the development server

```bash
npm run dev
```

Open **http://localhost:3000**

---

## Demo Accounts

| Email | Password | Role | Lands on |
|---|---|---|---|
| `admin@demo.com` | `demo1234` | Admin | `/admin/dashboard` |
| `organizer@demo.com` | `demo1234` | Organizer | `/organizer/dashboard` |
| `staff@demo.com` | `demo1234` | Staff | `/staff/scan` |
| `attendee@demo.com` | `demo1234` | Attendee | Home |

---

## Role System

### What each role can do

| Feature | Attendee | Organizer | Staff | Admin |
|---|---|---|---|---|
| Browse & search events | ✅ | ✅ | ✅ | ✅ |
| Buy tickets / checkout | ✅ | ✅ | ✅ | ✅ |
| View my tickets (QR) | ✅ | ✅ | ✅ | ✅ |
| Create & manage events | ❌ | ✅ | ❌ | ✅ |
| Organizer dashboard | ❌ | ✅ | ❌ | ✅ |
| Scan QR tickets at door | ❌ | ✅ | ✅ | ✅ |
| Manage all users | ❌ | ❌ | ❌ | ✅ |
| Promote / change roles | ❌ | ❌ | ❌ | ✅ |
| View platform analytics | ❌ | ❌ | ❌ | ✅ |

### How to create a Staff or Admin account

1. New user signs up at `/auth/signup` as **Attendee** (they cannot self-assign admin/staff)
2. Admin logs in → goes to `/admin/users`
3. Finds the user → changes the **Role dropdown** to `Staff` or `Admin`
4. User refreshes — the new role takes effect immediately (no re-login needed)

---

## Key Features

### For Attendees
- Browse and search events by keyword, category, city, date, and price
- Multi-step checkout: attendee details → payment → confirmation
- Digital QR code tickets stored in **My Tickets**
- Profile page with name, email, and password management

### For Organizers
- Create events with banner image URL, ticket types, promo codes, refund policy
- Real-time dashboard: revenue, tickets sold, active events, attendees
- Attendee list with check-in status per event
- Delete events with inline confirmation (no browser dialogs)
- End date/time is validated against start date/time before publishing

### For Staff
- Scan QR codes with device camera at event entrance
- Real-time validation — marks ticket as checked in on scan

### For Admins
- Platform-wide analytics dashboard
- Manage all users: search, filter by role/status, suspend/activate
- Promote any user to any role via dropdown
- View and manage all events platform-wide

---

## API Routes

All protected routes use the `withAuth(handler, { roles: [...] })` wrapper.

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Login, returns JWT |
| POST | `/api/auth/signup` | Public | Register (attendee/organizer only) |
| GET/PUT | `/api/auth/me` | Any | Get/update current user |
| GET | `/api/events` | Public | List/search events |
| POST | `/api/events` | organizer, admin | Create event |
| GET/PUT/DELETE | `/api/events/:id` | Public/organizer/admin | Get, update, delete event |
| POST | `/api/bookings` | Any | Book tickets |
| GET | `/api/my-tickets` | Any | Get current user's bookings |
| POST | `/api/scan` | staff, organizer, admin | Validate + check in a QR ticket |
| GET | `/api/organizer/stats` | organizer, admin | Dashboard stats |
| GET | `/api/organizer/revenue` | organizer, admin | Revenue chart data |
| GET | `/api/admin/users` | admin | List all users |
| PUT | `/api/admin/users/:id/role` | admin | Change user role |
| PUT | `/api/admin/users/:id/suspend` | admin | Suspend user |
| PUT | `/api/admin/users/:id/activate` | admin | Activate user |

---

## Route Protection

Protected by `middleware.js` (Next.js Edge Middleware) — runs before every page render:

| Route pattern | Required role |
|---|---|
| `/admin/*` | `admin` |
| `/organizer/*` | `organizer` or `admin` |
| `/staff/*` | `staff`, `organizer`, or `admin` |
| `/my-tickets`, `/profile`, `/checkout/*` | Any logged-in user |
| `/auth/login`, `/auth/signup` | Redirects away if already logged in |

---

## Production Deployment (Vercel)

1. Push to GitHub (see below)
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo
3. Add environment variables in the Vercel dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_API_URL` → set to your Vercel URL (e.g. `https://eventnest.vercel.app/api`)
4. Deploy — Vercel handles the rest

---

## Pushing to GitHub

```bash
# First time only — install Git from https://git-scm.com
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

cd "C:\Users\Dell Pc\Desktop\munawar\eventnest"
git init
git add .
git commit -m "Initial commit — EventNest full stack app"
git remote add origin https://github.com/YOUR_USERNAME/eventnest.git
git branch -M main
git push -u origin main
```

---

## License

MIT — free to use and modify.
