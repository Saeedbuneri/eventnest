'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Check, ChevronRight, Lock, CreditCard, Ticket, User, AlertCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { formatCurrency, formatDate } from '@/lib/utils';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

const attendeeSchema = z.object({
  firstName: z.string().min(1, 'First name required'),
  lastName:  z.string().min(1, 'Last name required'),
  email:     z.string().email('Valid email required'),
  phone:     z.string().min(8, 'Phone number required'),
});

const paymentSchema = z.object({
  cardName:   z.string().min(2, 'Name on card required'),
  cardNumber: z.string().min(16, 'Enter a valid 16-digit card number').max(19),
  expiry:     z.string().regex(/^\d{2}\/\d{2}$/, 'Format: MM/YY'),
  cvv:        z.string().regex(/^\d{3,4}$/, '3 or 4 digits'),
  promoCode:  z.string().optional(),
});

const STEPS = [
  { id: 1, label: 'Details' },
  { id: 2, label: 'Payment' },
  { id: 3, label: 'Confirm' },
];

function CheckoutContent({ eventId }) {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const [step,         setStep]         = useState(1);
  const [loading,      setLoading]      = useState(false);
  const [eventLoading, setEventLoading] = useState(true);
  const [event,        setEvent]        = useState(null);
  const [attendeeData, setAttendeeData] = useState(null);

  let selectedTickets = [];
  try {
    selectedTickets = JSON.parse(decodeURIComponent(searchParams.get('tickets') || '[]'));
  } catch {}

  // Fetch real event
  useEffect(() => {
    api.get(`/events/${eventId}`)
      .then((res) => setEvent(res.data.event))
      .catch(() => setEvent(null))
      .finally(() => setEventLoading(false));
  }, [eventId]);

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) {
      const currentPath = `/checkout/${eventId}?tickets=${searchParams.get('tickets') || ''}`;
      router.replace(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [user, authLoading, eventId, router, searchParams]);

  const subtotal = selectedTickets.reduce((s, t) => s + t.price * t.quantity, 0);
  const fee      = Math.round(subtotal * 0.05 * 100) / 100;
  const total    = subtotal + fee;

  const attendeeForm = useForm({
    resolver: zodResolver(attendeeSchema),
    defaultValues: {
      firstName: 'Ahmed',
      lastName:  'Khan',
      email:     'ahmed.khan@test.pk',
      phone:     '+92 300 1234567',
    },
  });
  const paymentForm = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardName:   'Ahmed Khan',
      cardNumber: '4111 1111 1111 1111',
      expiry:     '12/27',
      cvv:        '123',
      promoCode:  '',
    },
  });

  const onAttendeeSubmit = (data) => {
    setAttendeeData(data);
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onPaymentSubmit = async (paymentData) => {
    setLoading(true);
    try {
      await api.post('/bookings', {
        eventId,
        tickets:       selectedTickets.map((t) => ({ typeId: t._id, quantity: t.quantity })),
        promoCode:     paymentData.promoCode?.trim().toUpperCase() || undefined,
        attendeeName:  `${attendeeData.firstName} ${attendeeData.lastName}`,
        attendeeEmail: attendeeData.email,
      });
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || eventLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07070e]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) return null;

  if (!event) {
    return (
      <div className="min-h-screen bg-[#07070e]">
        <Navbar />
        <div className="text-center py-24">
          <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 font-medium">Event not found.</p>
          <Link href="/events" className="text-brand-400 hover:underline text-sm mt-2 inline-block">Back to events</Link>
        </div>
      </div>
    );
  }

  if (selectedTickets.length === 0) {
    return (
      <div className="min-h-screen bg-[#07070e]">
        <Navbar />
        <div className="text-center py-24">
          <Ticket className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 font-medium">No tickets selected.</p>
          <Link href={`/events/${eventId}`} className="text-brand-400 hover:underline text-sm mt-2 inline-block">Select tickets</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07070e]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-extrabold text-white mb-8">Checkout</h1>

        {/* Step Indicator */}
        <div className="flex items-center gap-0 mb-10">
          {STEPS.map((s, idx) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-9 h-9 rounded-full font-bold text-sm border-2 transition-colors ${
                step > s.id ? 'bg-brand-600 border-brand-600 text-white'
                  : step === s.id ? 'border-brand-600 text-brand-600 bg-[#07070e]'
                  : 'border-white/20 text-gray-500 bg-[#07070e]'
              }`}>
                {step > s.id ? <Check className="w-4 h-4" /> : s.id}
              </div>
              <span className={`ml-2 text-sm font-medium hidden sm:block ${step >= s.id ? 'text-white' : 'text-gray-500'}`}>{s.label}</span>
              {idx < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-3 ${step > s.id ? 'bg-brand-600' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* Left: Forms */}
          <div className="flex-1">

            {/* Step 1: Attendee Details */}
            {step === 1 && (
              <div className="bg-[#111118] rounded-2xl border border-white/[.08] p-6">
                <h2 className="font-bold text-lg text-white mb-5 flex items-center gap-2">
                  <User className="w-5 h-5 text-brand-400" /> Attendee Details
                </h2>
                <form onSubmit={attendeeForm.handleSubmit(onAttendeeSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="First Name" placeholder="John"
                      {...attendeeForm.register('firstName')}
                      error={attendeeForm.formState.errors.firstName?.message} />
                    <Input label="Last Name" placeholder="Doe"
                      {...attendeeForm.register('lastName')}
                      error={attendeeForm.formState.errors.lastName?.message} />
                  </div>
                  <Input label="Email Address" type="email" placeholder="john@example.com"
                    hint="Your QR ticket will be sent here"
                    {...attendeeForm.register('email')}
                    error={attendeeForm.formState.errors.email?.message} />
                  <Input label="Phone Number" type="tel" placeholder="+1 555 000 0000"
                    {...attendeeForm.register('phone')}
                    error={attendeeForm.formState.errors.phone?.message} />
                  <Button type="submit" className="w-full" size="lg">
                    Continue to Payment <ChevronRight className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="bg-[#111118] rounded-2xl border border-white/[.08] p-6">
                <h2 className="font-bold text-lg text-white mb-5 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-brand-400" /> Payment Details
                </h2>
                <form onSubmit={paymentForm.handleSubmit(onPaymentSubmit)} className="space-y-4">
                  {/* Promo code */}
                  <div>
                    <label className="label">Promo Code (optional)</label>
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      className="input-field uppercase"
                      {...paymentForm.register('promoCode')}
                    />
                    <p className="text-xs text-gray-400 mt-1">Discount will be applied at checkout if valid</p>
                  </div>

                  <Input label="Name on Card" placeholder="John Doe"
                    {...paymentForm.register('cardName')}
                    error={paymentForm.formState.errors.cardName?.message} />
                  <Input label="Card Number" placeholder="1234 5678 9012 3456" maxLength={19}
                    {...paymentForm.register('cardNumber')}
                    error={paymentForm.formState.errors.cardNumber?.message} />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Expiry (MM/YY)" placeholder="12/28" maxLength={5}
                      {...paymentForm.register('expiry')}
                      error={paymentForm.formState.errors.expiry?.message} />
                    <Input label="CVV" placeholder="123" type="password" maxLength={4}
                      {...paymentForm.register('cvv')}
                      error={paymentForm.formState.errors.cvv?.message} />
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/[.04] rounded-xl p-3">
                    <Lock className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    Your payment is protected with 256-bit SSL encryption. We never store card details.
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" type="button" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                    <Button type="submit" className="flex-1" size="lg" loading={loading}>
                      {loading ? 'Processingâ€¦' : `Pay ${formatCurrency(total)}`}
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <div className="bg-[#111118] rounded-2xl border border-white/[.08] p-8 text-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-400" />
                </div>
                <h2 className="text-2xl font-extrabold text-white mb-2">Booking Confirmed!</h2>
                <p className="text-gray-400 mb-2">
                  Your QR tickets have been sent to <strong>{attendeeData?.email}</strong>
                </p>
                <p className="text-sm text-gray-500 mb-8">
                  Check your inbox and spam folder. Tickets are also available in My Tickets.
                </p>
                <div className="flex flex-col gap-3">
                  <Button className="w-full" size="lg" onClick={() => router.push('/my-tickets')}>
                    <Ticket className="w-4 h-4" /> View My Tickets
                  </Button>
                  <Link href="/events" className="text-sm text-brand-400 hover:underline">Browse more events</Link>
                </div>
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="bg-[#111118] rounded-2xl border border-white/[.08] p-5 sticky top-24">
              <h3 className="font-bold text-white mb-4">Order Summary</h3>

              <div className="mb-4 pb-4 border-b border-white/[.08]">
                <p className="font-semibold text-sm text-gray-100 leading-snug mb-1">{event.title}</p>
                <p className="text-xs text-gray-400">{formatDate(event.startDate)}</p>
                <p className="text-xs text-gray-400">{event.venue?.address}, {event.venue?.city}</p>
              </div>

              <div className="space-y-2 mb-4">
                {selectedTickets.map((t) => (
                  <div key={t.name} className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{t.name} × {t.quantity}</span>
                    <span className="font-medium text-gray-200">{formatCurrency(t.price * t.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5 pt-3 border-t border-white/[.08] text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span><span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Platform fee (5%)</span><span>{formatCurrency(fee)}</span>
                </div>
                <div className="flex justify-between font-bold text-white text-base pt-2 border-t border-white/[.08]">
                  <span>Total</span><span>{formatCurrency(total)}</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 text-center mt-4 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" /> Secure checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage({ params }) {
  const { eventId } = params;
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Spinner size="lg" /></div>}>
      <CheckoutContent eventId={eventId} />
    </Suspense>
  );
}


