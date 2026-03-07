'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  MessageCircle, X, Send, RotateCcw, ChevronDown, ChevronRight,
  Sparkles, Zap,
} from 'lucide-react';

const BOT_NAME = 'Navi';
const STORAGE_KEY = 'en_chat_v2';

//  Knowledge base 
const KB = [
  {
    id: 'buy',
    patterns: ['ticket', 'buy', 'purchase', 'book', 'how to get'],
    answer: '**Buying a ticket is easy:**\n\n1. Browse to any event\n2. Click **Buy Tickets**\n3. Choose your ticket type & quantity\n4. Fill in your details\n5. Complete secure checkout\n\nYour QR ticket is **emailed instantly** and saved under **My Tickets**.',
    suggestions: ['How does QR entry work?', 'How do I get a refund?', 'Are there promo codes?'],
    icon: '',
  },
  {
    id: 'qr',
    patterns: ['qr', 'scan', 'entry', 'door', 'check in', 'venue', 'enter'],
    answer: '**At the venue door:**\n\nOpen **My Tickets** on your phone  tap the event  your QR code appears. Staff scan it in under 2 seconds.\n\n **Tips:** Increase screen brightness, no printing needed, and each QR is valid for **one entry only** to prevent fraud.',
    suggestions: ['What if my QR won\'t scan?', 'Can I transfer my ticket?', 'Buy another ticket'],
    icon: '',
  },
  {
    id: 'refund',
    patterns: ['refund', 'cancel', 'money back', 'return'],
    answer: '**Refund Policy:**\n\nRefund eligibility depends on the organizer\'s policy shown on each event page.\n\n Within the refund window  email **support@eventnest.pk** with your Booking ID\n Approved refunds are processed in **48 hours**\n Free events have no refund needed',
    suggestions: ['How do I find my Booking ID?', 'Contact support', 'Buy another ticket'],
    icon: '',
  },
  {
    id: 'organizer',
    patterns: ['organizer', 'create event', 'host', 'sell ticket', 'publish event', 'list event'],
    answer: '**Start selling in minutes:**\n\n1. Sign up as an **Organizer** at /auth/signup\n2. Go to **Organizer Dashboard  Create Event**\n3. Add title, description, date, venue & banner\n4. Set ticket types & prices\n5. Hit **Publish** \n\n**Fee:** 0% on free events  5% on paid events',
    suggestions: ['How do promo codes work?', 'How do I scan tickets at the door?', 'Contact support'],
    icon: '',
  },
  {
    id: 'promo',
    patterns: ['promo', 'discount', 'coupon', 'code', 'voucher'],
    answer: '**Using a promo code:**\n\nEnter it on the **payment step** of checkout  the discount applies instantly before you pay.\n\n**Creating promo codes (Organizers):**\nOrganizer Dashboard  Promo Codes  Create New. Set percentage or fixed discount, expiry date, and usage limit.',
    suggestions: ['How do I buy a ticket?', 'How do I create an event?'],
    icon: '',
  },
  {
    id: 'contact',
    patterns: ['contact', 'support', 'help', 'email', 'phone', 'whatsapp', 'reach'],
    answer: '**Get in touch with us:**\n\n **hello@eventnest.pk**\n **+92 51 111 000 111**\n WhatsApp: **+92 300 000 1234**\n F-7 Markaz, Islamabad\n\nSupport hours: **MonSat 9am9pm PKT**\n\nOr use the **Contact** page for a support form.',
    suggestions: ['How do I get a refund?', 'Report a technical issue'],
    icon: '',
  },
  {
    id: 'password',
    patterns: ['password', 'forgot', 'reset', 'login', 'sign in', 'account', 'access'],
    answer: '**Login problems?**\n\n **Forgot password**  click "Forgot Password" on the login page; check your email (including spam)\n **Account locked**  email support@eventnest.pk with your registered email\n **Social login**  use the same Google/Facebook account you signed up with\n\nMost issues resolve in under 5 minutes!',
    suggestions: ['Contact support', 'How do I create an event?'],
    icon: '',
  },
  {
    id: 'free',
    patterns: ['free event', 'free ticket', 'no cost', 'zero price', 'free', 'cost nothing'],
    answer: '**Free events on EventNest:**\n\nYes! Lots of events are completely free.\n\n Filter by **Price: Free** on the Events page\n Look for the **Free** badge on event cards\n EventNest charges 0% on free events  no hidden fees!\n\n Great for meetups, community events, and workshops.',
    suggestions: ['How do I buy a ticket?', 'How does QR entry work?'],
    icon: '',
  },
  {
    id: 'about',
    patterns: ['about', 'eventnest', 'who', 'company', 'team', 'founded', 'history'],
    answer: '**About EventNest:**\n\nEventNest is **Islamabad\'s premier event ticketing platform**, founded in 2024.\n\n 50,000+ tickets sold\n 2,000+ events hosted\n 500+ active organizers\n 4.9 average rating\n\nBased in F-7 Markaz, Islamabad  proudly serving the twin cities!',
    suggestions: ['Contact support', 'How do I create an event?', 'How do I buy a ticket?'],
    icon: '',
  },
  {
    id: 'price',
    patterns: ['price', 'fee', 'cost', 'charge', 'platform fee', 'service fee'],
    answer: '**EventNest Pricing:**\n\n **Free events**  0% platform fee\n **Paid events**  5% service fee (shown at checkout)\n No monthly subscription for organizers\n No hidden charges\n\nThe exact fee is always shown **before you pay** so there are never surprises.',
    suggestions: ['How do I create an event?', 'Contact support'],
    icon: '',
  },
  {
    id: 'transfer',
    patterns: ['transfer', 'gift', 'send ticket', 'give ticket', 'share ticket'],
    answer: '**Transferring a ticket:**\n\nCurrently, ticket transfers are managed manually. Email **support@eventnest.pk** with:\n\n Your Booking ID\n The new attendee\'s name & email\n\nWe\'ll reissue the QR within 24 hours. Note: transfers may be restricted by organizer policy.',
    suggestions: ['How does QR entry work?', 'How do I get a refund?', 'Contact support'],
    icon: '',
  },
  {
    id: 'technical',
    patterns: ['bug', 'error', 'crash', 'not working', 'issue', 'problem', 'broken', 'technical'],
    answer: '**Technical Issues:**\n\nSorry about that! Please try:\n\n1. **Hard refresh** the page (Ctrl+Shift+R)\n2. **Clear browser cache** and retry\n3. **Try a different browser** (Chrome / Firefox)\n\nIf it persists, email **support@eventnest.pk** with a screenshot and your browser/device details  we\'ll fix it fast! ',
    suggestions: ['Contact support', 'How do I login?'],
    icon: '',
  },
  {
    id: 'islamabad',
    patterns: ['islamabad', 'rawalpindi', 'city', 'location', 'twin cities', 'where', 'based'],
    answer: '**EventNest covers:**\n\n Islamabad & Rawalpindi (the twin cities)\n\nWe feature events from F-7 Markaz, Blue Area, Bahria Town, Gulberg, Rawalpindi Saddar, and all surrounding areas.\n\nWant events near you? Use the **City filter** on the events page!',
    suggestions: ['Browse free events', 'How do I buy a ticket?'],
    icon: '',
  },
];

const CATEGORIES = [
  { label: 'Tickets', icon: '', prompts: ['How do I buy a ticket?', 'How does QR entry work?', 'Can I transfer my ticket?'] },
  { label: 'Organizer', icon: '', prompts: ['How do I create an event?', 'How do promo codes work?', 'What are the fees?'] },
  { label: 'Account', icon: '', prompts: ['I forgot my password', 'Login issues', 'How do I contact support?'] },
  { label: 'About', icon: '', prompts: ['Tell me about EventNest', 'Where is EventNest based?', 'Are there free events?'] },
];

function getBotResponse(text) {
  const lower = text.toLowerCase();
  for (const entry of KB) {
    if (entry.patterns.some((p) => lower.includes(p))) return entry;
  }
  return {
    id: 'fallback',
    answer: "I'm not sure about that one! Here's how to get human help:\n\n **support@eventnest.pk**\n **+92 51 111 000 111**\n\nOr visit the **Contact** page  our team typically responds within a few hours!",
    suggestions: ['How do I buy a ticket?', 'Contact support', 'About EventNest'],
    icon: '',
  };
}

function formatAnswer(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/\n/g, '<br />');
}

function timeAgo(ts) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

// Typing dots
function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 justify-start">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center shadow-[0_0_10px_rgba(225,29,72,.4)] shrink-0">
        <Sparkles className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="bg-[#1a1a2e] border border-white/[.07] rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}

export default function Chatbot() {
  const [open,        setOpen]        = useState(false);
  const [minimized,   setMinimized]   = useState(false);
  const [input,       setInput]       = useState('');
  const [messages,    setMessages]    = useState([]);
  const [typing,      setTyping]      = useState(false);
  const [activeTab,   setActiveTab]   = useState(null); // category tab
  const [unread,      setUnread]      = useState(0);
  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);

  const greet = {
    id: 'greet',
    role: 'bot',
    text: " Hi! I'm **Navi**, your EventNest AI assistant.\n\nI can help you with tickets, events, accounts, and more. What can I help you with today?",
    ts: Date.now(),
    suggestions: ['How do I buy a ticket?', 'Create an event', 'QR entry help', 'Contact support'],
  };

  // Restore history
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      setMessages(saved.length ? saved : [greet]);
    } catch {
      setMessages([greet]);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-40)));
    }
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  }, [messages, typing]);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setMinimized(false);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open]);

  const send = useCallback((text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg = { id: Date.now(), role: 'user', text: trimmed, ts: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setActiveTab(null);
    setTyping(true);

    // Simulate AI "thinking" delay
    const delay = 600 + Math.random() * 700;
    setTimeout(() => {
      const resp = getBotResponse(trimmed);
      const botMsg = {
        id: Date.now() + 1,
        role: 'bot',
        text: resp.answer,
        suggestions: resp.suggestions,
        icon: resp.icon,
        ts: Date.now(),
      };
      setTyping(false);
      setMessages((prev) => [...prev, botMsg]);
      if (!open) setUnread((n) => n + 1);
    }, delay);
  }, [open]);

  const handleSubmit = (e) => { e.preventDefault(); send(input); };

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setMessages([greet]);
  };

  return (
    <>
      {/*  Floating button  */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-brand-500 to-brand-700 hover:from-brand-400 hover:to-brand-600 text-white rounded-full shadow-[0_0_32px_rgba(225,29,72,0.55)] flex items-center justify-center transition-all duration-300 active:scale-90 hover:scale-105"
        aria-label="Toggle chat"
      >
        <div className="absolute inset-0 rounded-full bg-brand-500/30 animate-ping opacity-60 pointer-events-none" />
        {open
          ? <X className="w-6 h-6 relative z-10" />
          : <MessageCircle className="w-6 h-6 relative z-10" />
        }
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-[#07070e] text-[10px] font-black text-[#07070e] flex items-center justify-center z-20">
            {unread}
          </span>
        )}
        {!open && unread === 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-green-400 rounded-full border-2 border-[#07070e] z-20" />
        )}
      </button>

      {/*  Chat window  */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 flex flex-col rounded-2xl overflow-hidden border border-white/[.08] shadow-[0_32px_80px_rgba(0,0,0,.8),0_0_0_1px_rgba(255,255,255,.04)]"
          style={{
            width: 'min(380px, calc(100vw - 24px))',
            maxHeight: minimized ? '60px' : '580px',
            height: minimized ? '60px' : '580px',
            transition: 'max-height .35s cubic-bezier(.16,1,.3,1), height .35s cubic-bezier(.16,1,.3,1)',
            animation: 'fadeUp .35s cubic-bezier(.16,1,.3,1) both',
            background: '#0d0d1a',
          }}
        >
          {/* Header */}
          <div className="relative flex items-center gap-3 px-4 py-3.5 border-b border-white/[.06] shrink-0"
            style={{ background: 'linear-gradient(135deg, #12122a 0%, #0d0d1e 100%)' }}>
            {/* Glow */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 80% at 20% 50%, rgba(225,29,72,.07) 0%, transparent 60%)' }} />
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-[0_0_18px_rgba(225,29,72,.5)]">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#12122a]" />
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0 relative">
              <p className="text-white font-bold text-sm leading-tight">{BOT_NAME} <span className="text-gray-500 font-normal"> EventNest</span></p>
              <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                <span className="w-1 h-1 bg-green-400 rounded-full inline-block" />
                AI Assistant  Online now
              </p>
            </div>
            {/* Actions */}
            <div className="flex items-center gap-1 relative shrink-0">
              <button onClick={clearHistory} title="Clear chat"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:text-gray-300 hover:bg-white/[.07] transition-all">
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setMinimized((m) => !m)} title={minimized ? 'Expand' : 'Minimize'}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:text-gray-300 hover:bg-white/[.07] transition-all">
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${minimized ? 'rotate-180' : ''}`} />
              </button>
              <button onClick={() => setOpen(false)} title="Close"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:text-red-400 hover:bg-white/[.07] transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Category tabs */}
              <div className="flex gap-1.5 px-3 pt-2.5 pb-1 shrink-0 border-b border-white/[.04]" style={{ background: '#0d0d1a' }}>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.label}
                    onClick={() => setActiveTab(activeTab === cat.label ? null : cat.label)}
                    className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-all ${
                      activeTab === cat.label
                        ? 'bg-brand-600/20 border border-brand-500/40 text-brand-300'
                        : 'text-gray-600 hover:text-gray-400 hover:bg-white/[.05] border border-transparent'
                    }`}
                  >
                    <span className="text-[12px]">{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Category quick prompts dropdown */}
              {activeTab && (
                <div className="px-3 py-2 flex flex-col gap-1 border-b border-white/[.04] shrink-0" style={{ background: '#0a0a18' }}>
                  {CATEGORIES.find((c) => c.label === activeTab)?.prompts.map((p) => (
                    <button key={p} onClick={() => send(p)}
                      className="text-left text-xs text-gray-400 hover:text-brand-300 hover:bg-white/[.04] px-3 py-2 rounded-lg transition-all flex items-center gap-2">
                      <ChevronRight className="w-3 h-3 shrink-0 text-brand-600" />
                      {p}
                    </button>
                  ))}
                </div>
              )}

              {/* Messages */}
              <div
                className="flex-1 overflow-y-auto px-3 py-4 space-y-4 scroll-smooth"
                style={{ background: 'linear-gradient(to bottom, #0d0d1a, #0b0b18)', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,.07) transparent' }}
              >
                {messages.map((m, i) => (
                  <div
                    key={m.id}
                    className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    style={{ animation: `fadeUp .35s ${Math.min(i * 20, 200)}ms cubic-bezier(.16,1,.3,1) both` }}
                  >
                    {m.role === 'bot' && (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center shadow-[0_0_10px_rgba(225,29,72,.35)] shrink-0 mt-0.5">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div className="flex flex-col gap-2 max-w-[82%]">
                      <div
                        className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          m.role === 'user'
                            ? 'bg-gradient-to-br from-brand-600 to-brand-700 text-white rounded-tr-sm shadow-[0_4px_20px_rgba(225,29,72,.3)]'
                            : 'bg-[#1a1a2e] border border-white/[.07] text-gray-300 rounded-tl-sm'
                        }`}
                        dangerouslySetInnerHTML={{ __html: formatAnswer(m.text) }}
                      />
                      {/* Timestamp */}
                      <p className={`text-[10px] text-gray-700 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>{timeAgo(m.ts)}</p>
                      {/* Suggestions */}
                      {m.role === 'bot' && m.suggestions && i === messages.length - 1 && (
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {m.suggestions.map((s) => (
                            <button key={s} onClick={() => send(s)}
                              className="text-[11px] font-medium bg-white/[.04] border border-white/[.09] text-gray-400 hover:bg-brand-500/15 hover:border-brand-500/40 hover:text-brand-300 rounded-full px-3 py-1.5 transition-all">
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {m.role === 'user' && (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold text-white">
                        U
                      </div>
                    )}
                  </div>
                ))}

                {typing && <TypingIndicator />}
                <div ref={bottomRef} />
              </div>

              {/* Powered by bar */}
              <div className="px-4 py-1.5 text-center border-t border-white/[.04] shrink-0" style={{ background: '#0b0b18' }}>
                <p className="text-[10px] text-gray-700 flex items-center justify-center gap-1.5">
                  <Zap className="w-2.5 h-2.5 text-brand-600" />
                  Powered by EventNest AI  Islamabad
                </p>
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit}
                className="flex items-center gap-2 px-3 py-3 border-t border-white/[.06] shrink-0"
                style={{ background: 'linear-gradient(135deg, #12122a 0%, #0d0d1e 100%)' }}>
                <div className="flex-1 flex items-center gap-2 bg-white/[.05] border border-white/[.09] hover:border-white/[.15] focus-within:border-brand-500/50 focus-within:bg-white/[.07] rounded-xl px-3.5 py-2.5 transition-all">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask anything about EventNest"
                    className="flex-1 text-xs text-white placeholder-gray-600 outline-none bg-transparent"
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send(input))}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!input.trim() || typing}
                  className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-700 hover:from-brand-400 hover:to-brand-600 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-all active:scale-90 shadow-[0_4px_16px_rgba(225,29,72,.4)]"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}