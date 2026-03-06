import { getUserFromRequest } from '../lib/auth.js';

/**
 * Express middleware factory that validates JWT and optionally checks roles.
 *
 * Usage:
 *   router.get('/protected', requireAuth(), handler)
 *   router.post('/admin-only', requireAuth(['admin']), handler)
 */
export function requireAuth(roles = []) {
  return (req, res, next) => {
    const user = getUserFromRequest(req);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized — please log in' });
    }

    if (roles.length > 0 && !roles.includes(user.role)) {
      return res.status(403).json({ error: 'Forbidden — insufficient permissions' });
    }

    req.user = user;
    next();
  };
}
