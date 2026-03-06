import Link from 'next/link';
import { Ticket, Twitter, Instagram, Facebook, Linkedin, MapPin, Phone, Mail } from 'lucide-react';

const FOOTER_COLS = {
  Discover: [
    { label: 'Browse Events',        href: '/events' },
    { label: 'Music & Concerts',     href: '/events?category=music' },
    { label: 'Tech & Startups',      href: '/events?category=tech' },
    { label: 'Sports & Fitness',     href: '/events?category=sports' },
    { label: 'Food & Culture',       href: '/events?category=food' },
    { label: 'Free Events',          href: '/events?price=free' },
  ],
  Organize: [
    { label: 'Create Event',         href: '/organizer/events/create' },
    { label: 'Organizer Dashboard',  href: '/organizer/dashboard' },
    { label: 'Manage Tickets',       href: '/organizer/events' },
    { label: 'Scan QR Tickets',      href: '/staff/scan' },
    { label: 'Promo Codes',          href: '/organizer/events' },
  ],
  Company: [
    { label: 'About Us',     href: '#about' },
    { label: 'Our Story',    href: '#about' },
    { label: 'Careers',      href: 'mailto:careers@eventnest.pk' },
    { label: 'Press Kit',    href: 'mailto:press@eventnest.pk' },
    { label: 'Contact Us',   href: 'mailto:hello@eventnest.pk' },
  ],
  Support: [
    { label: 'Help Center',       href: 'mailto:support@eventnest.pk' },
    { label: 'Privacy Policy',    href: '#' },
    { label: 'Terms of Service',  href: '#' },
    { label: 'Refund Policy',     href: '#' },
    { label: 'Report an Issue',   href: 'mailto:support@eventnest.pk' },
  ],
};

const SOCIALS = [
  { Icon: Twitter,   href: 'https://twitter.com/eventnestpk',              label: 'Twitter'   },
  { Icon: Instagram, href: 'https://instagram.com/eventnestpk',            label: 'Instagram' },
  { Icon: Facebook,  href: 'https://facebook.com/eventnestpk',             label: 'Facebook'  },
  { Icon: Linkedin,  href: 'https://linkedin.com/company/eventnestpk',     label: 'LinkedIn'  },
];

const CONTACT = [
  { Icon: MapPin, text: 'F-7 Markaz, Islamabad, Pakistan' },
  { Icon: Phone,  text: '+92 51 111 000 111' },
  { Icon: Mail,   text: 'hello@eventnest.pk' },
];

export default function Footer() {
  return (
    <footer className="bg-[#080810] text-white">
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
              Islamabad&apos;s premier event ticketing platform. Discover concerts, tech meetups, sports events and more across the twin cities.
            </p>
            {/* Contact info */}
            <ul className="space-y-2 mb-5">
              {CONTACT.map(({ Icon, text }) => (
                <li key={text} className="flex items-start gap-2 text-gray-400 text-xs">
                  <Icon className="w-3.5 h-3.5 mt-0.5 shrink-0 text-brand-400" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2">
              {SOCIALS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 bg-white/5 border border-white/8 hover:bg-brand-600 hover:border-brand-600 rounded-lg flex items-center justify-center transition-all"
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
        <div className="border-t border-white/8 pt-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg">Stay in the loop</h3>
              <p className="text-gray-400 text-sm mt-1">Get notified about events happening in Islamabad &amp; Rawalpindi</p>
            </div>
            <form className="flex gap-2 w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-72 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="submit"
                className="bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shrink-0 shadow-[0_0_14px_rgba(225,29,72,0.3)]"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-600">
          <p>© 2026 EventNest. All rights reserved. · Islamabad, Pakistan</p>
          <p>Made with ❤️ for Islamabad&apos;s community</p>
        </div>
      </div>
    </footer>
  );
}
