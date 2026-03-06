import Link from 'next/link';
import { Ticket, Twitter, Instagram, Facebook, Linkedin } from 'lucide-react';

const FOOTER_COLS = {
  Discover: [
    { label: 'Browse Events',   href: '/events' },
    { label: 'Music',           href: '/events?category=music' },
    { label: 'Technology',      href: '/events?category=tech' },
    { label: 'Sports',          href: '/events?category=sports' },
    { label: 'Free Events',     href: '/events?price=free' },
  ],
  Organize: [
    { label: 'Create Event',        href: '/organizer/events/create' },
    { label: 'Organizer Dashboard', href: '/organizer/dashboard' },
    { label: 'Manage Tickets',      href: '/organizer/events' },
    { label: 'Scan QR Tickets',     href: '/staff/scan' },
  ],
  Company: [
    { label: 'About Us',  href: '#' },
    { label: 'Blog',      href: '#' },
    { label: 'Careers',   href: '#' },
    { label: 'Contact',   href: '#' },
  ],
  Support: [
    { label: 'Help Center',     href: '#' },
    { label: 'Privacy Policy',  href: '#' },
    { label: 'Terms of Service',href: '#' },
    { label: 'Refund Policy',   href: '#' },
  ],
};

const SOCIALS = [
  { Icon: Twitter,   href: '#', label: 'Twitter'   },
  { Icon: Instagram, href: '#', label: 'Instagram' },
  { Icon: Facebook,  href: '#', label: 'Facebook'  },
  { Icon: Linkedin,  href: '#', label: 'LinkedIn'  },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-extrabold text-xl text-white mb-4">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                <Ticket className="w-5 h-5 text-white" />
              </div>
              EventNest
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Your local hub for discovering and booking events. Secure tickets, QR entry, real memories.
            </p>
            <div className="flex items-center gap-2">
              {SOCIALS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 bg-gray-800 hover:bg-brand-600 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_COLS).map(([section, links]) => (
            <div key={section}>
              <h3 className="font-bold text-xs tracking-widest text-gray-400 uppercase mb-4">{section}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg">Stay in the loop</h3>
              <p className="text-gray-400 text-sm mt-1">Get notified about trending events near you</p>
            </div>
            <form className="flex gap-2 w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-72 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="submit"
                className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shrink-0"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-500">
          <p>© 2026 EventNest. All rights reserved.</p>
          <p>Made with ❤️ for local communities</p>
        </div>
      </div>
    </footer>
  );
}
