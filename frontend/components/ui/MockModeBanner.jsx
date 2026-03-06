'use client';

/**
 * Shown at the top of every page when NEXT_PUBLIC_USE_MOCK=true.
 * Gives testers a hint about demo credentials without cluttering the real UI.
 */
export default function MockModeBanner() {
  if (process.env.NEXT_PUBLIC_USE_MOCK !== 'true') return null;

  return (
    <div className="w-full bg-amber-400 text-amber-900 text-center text-xs font-semibold py-1.5 px-4 tracking-wide z-50">
      🎭 Demo mode — using mock data. Login with{' '}
      <span className="font-mono">admin@demo.com</span>,{' '}
      <span className="font-mono">organizer@demo.com</span>,{' '}
      <span className="font-mono">staff@demo.com</span>{' '}or{' '}
      <span className="font-mono">attendee@demo.com</span>{' '}
      / password: <span className="font-mono">demo1234</span>
    </div>
  );
}
