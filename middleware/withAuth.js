import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

/**
 * Wraps an API route handler with JWT authentication.
 * The decoded user is passed as the third argument to the handler.
 *
 * Usage:
 *   export const GET = withAuth(async (req, ctx, user) => { ... });
 *   export const POST = withAuth(handler, { roles: ['organizer', 'admin'] });
 */
export function withAuth(handler, { roles } = {}) {
  return async (request, context) => {
    const user = getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized — please log in' }, { status: 401 });
    }

    if (roles && !roles.includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden — insufficient permissions' }, { status: 403 });
    }

    return handler(request, context, user);
  };
}
