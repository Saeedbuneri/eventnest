'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const CONTACT_INFO = [
  { icon: MapPin, label: 'Address',        value: 'F-7 Markaz, Islamabad, 44000, Pakistan' },
  { icon: Mail,   label: 'Email',          value: 'hello@eventnest.pk' },
  { icon: Phone,  label: 'Phone',          value: '+92 51 111 000 111' },
  { icon: Clock,  label: 'Support Hours',  value: 'Mon–Sat, 9:00 AM – 7:00 PM PKT' },
];

const FAQS = [
  { q: 'How do I get my ticket after purchase?',    a: 'Your ticket is instantly emailed and also available under My Tickets in your EventNest account.' },
  { q: 'Can I get a refund?',                        a: 'Refund eligibility depends on the organizer\'s policy shown on the event page. Contact us if you need help.' },
  { q: 'How does QR entry work?',                    a: 'Show your QR code (from My Tickets) at the door. Staff scan it with the EventNest Staff app — no printing needed.' },
  { q: 'I want to host an event in Islamabad.',       a: 'Sign up as an Organizer and use the Create Event dashboard. We charge 0% platform fee for free events.' },
  { q: 'My QR code is not scanning.',                a: 'Make sure your screen brightness is high. If issues persist, email support@eventnest.pk with your booking ID.' },
];

export default function ContactPage() {
  const [form, setForm]       = useState({ name: 'Ahmed Khan', email: 'ahmed@test.pk', subject: 'Ticket issue', message: 'I purchased a ticket for the Islamabad Music Festival but haven\'t received my QR code. Please help.' });
  const [sent, setSent]       = useState(false);
  const [sending, setSending] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    // Simulate sending (localStorage log)
    setTimeout(() => {
      const log = JSON.parse(localStorage.getItem('en_contact_log') || '[]');
      log.push({ ...form, sentAt: new Date().toISOString() });
      localStorage.setItem('en_contact_log', JSON.stringify(log));
      setSending(false);
      setSent(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-[#0a0a10] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(ellipse 60% 50% at 90% 50%, rgba(225,29,72,0.1) 0%, transparent 55%)' }} />
        <div className="relative max-w-4xl mx-auto px-4">
          <p className="text-xs font-bold tracking-[0.2em] text-brand-400 uppercase mb-4">Get In Touch</p>
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-tight mb-4">
            We&apos;re here<br /><span className="text-brand-400">to help.</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl">Questions, issues, or just want to say hi? Our Islamabad support team responds within a few hours.</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Info + FAQ */}
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-5">Contact Details</h2>
            <ul className="space-y-4">
              {CONTACT_INFO.map(({ icon: Icon, label, value }) => (
                <li key={label} className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-brand-50 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-brand-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
                    <p className="text-sm text-gray-700 mt-0.5">{value}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Embedded map placeholder */}
          <div className="bg-[#f4f4f7] rounded-2xl overflow-hidden h-48 flex items-center justify-center border border-gray-100">
            <div className="text-center text-gray-400 text-sm">
              <MapPin className="w-8 h-8 mx-auto mb-2 text-brand-300" />
              <p>F-7 Markaz, Islamabad</p>
              <p className="text-xs">Pakistan</p>
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-4">FAQ</h2>
            <div className="space-y-2">
              {FAQS.map((faq, i) => (
                <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full text-left px-4 py-3 text-sm font-semibold text-gray-800 flex justify-between items-center hover:bg-gray-50 transition-colors"
                  >
                    {faq.q}
                    <span className="text-brand-500 text-lg leading-none ml-2">{openFaq === i ? '−' : '+'}</span>
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-3 bg-gray-50">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            {sent ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <CheckCircle className="w-14 h-14 text-green-500 mb-4" />
                <h3 className="text-2xl font-black text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-500 max-w-xs">Our Islamabad support team will get back to you within a few hours (Mon–Sat, 9 AM – 7 PM PKT).</p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }} className="mt-6 text-brand-600 hover:underline text-sm font-semibold">
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-black text-gray-900 mb-1">Send us a message</h2>
                <p className="text-gray-400 text-sm mb-6">Typically reply within 2–4 hours on weekdays.</p>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
                      <input
                        required
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Ahmed Khan"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="ahmed@example.pk"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Subject</label>
                    <select
                      value={form.subject}
                      onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white transition"
                    >
                      <option>Ticket issue</option>
                      <option>Refund request</option>
                      <option>Organizer query</option>
                      <option>QR code not working</option>
                      <option>Report an event</option>
                      <option>Partnership inquiry</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Describe your issue or question in detail..."
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none transition"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-60 text-white font-bold px-7 py-3 rounded-xl transition-colors shadow-[0_0_18px_rgba(225,29,72,0.25)]"
                  >
                    {sending ? (
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : <Send className="w-4 h-4" />}
                    {sending ? 'Sending…' : 'Send Message'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
