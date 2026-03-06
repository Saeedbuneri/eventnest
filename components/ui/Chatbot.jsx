'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Ticket, RotateCcw } from 'lucide-react';

const BOT_NAME = 'Navi';
const STORAGE_KEY = 'en_chat_history';

// Static Q&A knowledge base
const KB = [
  { patterns: ['ticket', 'buy', 'purchase', 'book'], answer: 'To buy a ticket: browse to an event → click **Buy Tickets** → choose your ticket type → fill in your details → complete checkout. Your QR ticket is emailed instantly and also saved under **My Tickets**.' },
  { patterns: ['qr', 'scan', 'entry', 'door', 'check in'], answer: 'Show your QR code at the venue entrance. Staff will scan it with the EventNest scanner. No printing needed — just open **My Tickets** on your phone and increase screen brightness.' },
  { patterns: ['refund', 'cancel', 'money back'], answer: 'Refund eligibility depends on the organizer\'s policy shown on the event page. If you\'re within the refund window, email **support@eventnest.pk** with your booking ID and we\'ll process it.' },
  { patterns: ['organizer', 'create event', 'host', 'sell ticket'], answer: 'Sign up as an **Organizer** at /auth/signup. Once logged in, go to **Organizer Dashboard → Create Event**. Add your details, set ticket types, and publish. We charge 0% on free events!' },
  { patterns: ['promo', 'discount', 'coupon', 'code'], answer: 'Enter your promo code on the payment step of checkout. Valid promo codes deduct the discount before payment. Organizers issue promo codes from their dashboard.' },
  { patterns: ['islamabad', 'rawalpindi', 'city', 'location', 'twin cities'], answer: 'EventNest is proudly based in **Islamabad, Pakistan** and covers the twin cities — Islamabad & Rawalpindi. Our office is at F-7 Markaz, Islamabad.' },
  { patterns: ['contact', 'support', 'help', 'email', 'phone'], answer: 'Reach us at:\n📧 hello@eventnest.pk\n📞 +92 51 111 000 111\n📍 F-7 Markaz, Islamabad\n\nOr visit our **Contact** page for a support form.' },
  { patterns: ['password', 'forgot', 'reset', 'login issue'], answer: 'If you\'ve forgotten your password, use the **Forgot Password** link on the login page. For other login issues email support@eventnest.pk.' },
  { patterns: ['free event', 'free ticket', 'no cost'], answer: 'Yes! Many events on EventNest are free. Browse **Free Events** from the home page or filter by **Price: Free** on the events page.' },
  { patterns: ['admin', 'role', 'staff', 'manage user'], answer: 'Admins can manage users and change roles from **Admin Dashboard → Users**. Staff accounts can scan QR codes at events. Contact admin@eventnest.pk if you need role changes.' },
  { patterns: ['about', 'eventnest', 'who', 'company'], answer: 'EventNest is Islamabad\'s premier event ticketing platform, founded in 2024. We\'ve sold 50,000+ tickets across 500+ events in the twin cities. Visit our **About** page to learn more!' },
  { patterns: ['price', 'fee', 'cost', 'charge'], answer: 'EventNest charges a small service fee (5%) only on paid events. Free events have zero platform fee. The exact fee is shown at checkout before you pay.' },
];

const QUICK_PROMPTS = [
  'How do I buy a ticket?',
  'How does QR entry work?',
  'How do I create an event?',
  'How do I get a refund?',
  'Contact support',
];

function getBotAnswer(text) {
  const lower = text.toLowerCase();
  for (const { patterns, answer } of KB) {
    if (patterns.some((p) => lower.includes(p))) return answer;
  }
  return "I'm not sure about that! For specific help, email **support@eventnest.pk** or call **+92 51 111 000 111**. You can also visit our Contact page.";
}

function formatAnswer(text) {
  // Bold **text** → <strong>
  return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />');
}

export default function Chatbot() {
  const [open,    setOpen]    = useState(false);
  const [input,   setInput]   = useState('');
  const [messages, setMessages] = useState(() => {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
  });
  const bottomRef = useRef(null);

  const greet = { id: 'greet', role: 'bot', text: "👋 Hi! I'm **Navi**, EventNest's assistant.\n\nAsk me anything about tickets, events, or how the platform works!" };

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([greet]);
    }
  }, [open]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)));
    }
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg = { id: Date.now(), role: 'user', text: trimmed };
    const botMsg  = { id: Date.now() + 1, role: 'bot', text: getBotAnswer(trimmed) };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput('');
  };

  const handleSubmit = (e) => { e.preventDefault(); send(input); };

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setMessages([greet]);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-brand-600 hover:bg-brand-500 text-white rounded-full shadow-[0_0_24px_rgba(225,29,72,0.45)] flex items-center justify-center transition-all active:scale-95"
        aria-label="Open chat"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[340px] sm:w-[380px] flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden" style={{ maxHeight: '520px' }}>
          {/* Header */}
          <div className="bg-[#0a0a10] text-white px-4 py-3.5 flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center shadow-[0_0_12px_rgba(225,29,72,0.4)]">
              <Ticket className="w-4.5 h-4.5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm">{BOT_NAME} — EventNest Assistant</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                <span className="text-xs text-gray-400">Online · Islamabad</span>
              </div>
            </div>
            <button onClick={clearHistory} title="Clear chat" className="text-gray-500 hover:text-white transition-colors">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#fafafa]" style={{ minHeight: 280, maxHeight: 340 }}>
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'bot' && (
                  <div className="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center mr-2 shrink-0 mt-0.5">
                    <Ticket className="w-3 h-3 text-brand-600" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-brand-600 text-white rounded-tr-sm'
                      : 'bg-white border border-gray-100 text-gray-700 rounded-tl-sm shadow-sm'
                  }`}
                  dangerouslySetInnerHTML={{ __html: formatAnswer(m.text) }}
                />
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Quick prompts */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5 bg-[#fafafa]">
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="text-xs border border-brand-100 text-brand-600 hover:bg-brand-50 rounded-full px-3 py-1 transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t border-gray-100 px-3 py-3 flex gap-2 bg-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything…"
              className="flex-1 text-sm px-3 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-400 transition"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-9 h-9 bg-brand-600 hover:bg-brand-500 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
