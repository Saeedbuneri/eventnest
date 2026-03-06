/**
 * Next.js Edge Middleware — route-level auth + role enforcement.
 *
 * Runs before every matched request, at the edge (no Node.js APIs).
 * Decodes the JWT payload from the `en_token` cookie WITHOUT verifying the
 * signature (signature verification happens server-side inside withAuth.js).
 * This is safe because:
 *  • The middleware only redirects — it never returns sensitive data.
 *  • Every API call is still verified by withAuth.js with full jwt.verify().
 *  • A tampered token would be caught at the API layer before any data is served.
 */

import { NextResponse } from 'next/server';

/** Decode (not verify) a JWT payload. Returns null on failure. */
function decodeJwt(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token   = request.cookies.get('en_token')?.value;
  const payload = token ? decodeJwt(token) : null;
  const role    = payload?.role ?? null;

  // ── Helper: redirect to login ──────────────────────────────────────────────
  const toLogin = () => {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  };

  // ── Helper: redirect to role home ──────────────────────────────────────────
  const toHome = () => {
    const url = request.nextUrl.clone();
    url.pathname =
      role === 'admin'     ? '/admin/dashboard'     :
      role === 'organizer' ? '/organizer/dashboard' :
      role === 'staff'     ? '/staff/scan'          : '/';
    url.search = '';
    return NextResponse.redirect(url);
  };

  // ── /admin/* → admin only ──────────────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    if (!role)            return toLogin();
    if (role !== 'admin') return toHome();
  }

  // ── /organizer/* → organizer or admin ─────────────────────────────────────
  if (pathname.startsWith('/organizer')) {
    if (!role)                                    return toLogin();
    if (role !== 'organizer' && role !== 'admin') return toHome();
  }

  // ── /staff/* → staff, organizer, or admin ─────────────────────────────────
  if (pathname.startsWith('/staff')) {
    if (!role)                                               return toLogin();
    if (!['staff', 'organizer', 'admin'].includes(role))    return toHome();
  }

  // ── Auth-required pages (any logged-in user) ──────────────────────────────
  if (
    pathname.startsWith('/my-tickets') ||
    pathname.startsWith('/profile')    ||
    pathname.startsWith('/checkout')
  ) {
    if (!role) return toLogin();
  }

  // ── Redirect already-logged-in users away from auth pages ─────────────────
  if (
    pathname.startsWith('/auth/login') ||
    pathname.startsWith('/auth/signup')
  ) {
    if (role) return toHome();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/organizer/:path*',
    '/staff/:path*',
    '/my-tickets/:path*',
    '/profile/:path*',
    '/checkout/:path*',
    '/auth/login',
    '/auth/signup',
  ],
};
