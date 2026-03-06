'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, Plus, Trash2, ChevronRight, ChevronLeft, Upload } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { EVENT_CATEGORIES } from '@/lib/constants';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

const STEPS = [
  { id: 1, label: 'Basic Info'    },
  { id: 2, label: 'Tickets'       },
  { id: 3, label: 'Settings'      },
  { id: 4, label: 'Publish'       },
];

const basicSchema = z.object({
  title:       z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category:    z.string().min(1, 'Select a category'),
  address:     z.string().min(5, 'Enter an address'),
  city:        z.string().min(2, 'Enter a city'),
  startDate:   z.string().min(1, 'Start date required'),
  startTime:   z.string().min(1, 'Start time required'),
  endDate:     z.string().min(1, 'End date required'),
  endTime:     z.string().min(1, 'End time required'),
});

const ticketsSchema = z.object({
  ticketTypes: z.array(z.object({
    name:     z.string().min(1, 'Name required'),
    price:    z.number({ invalid_type_error: 'Enter a number' }).min(0),
    quantity: z.number({ invalid_type_error: 'Enter a number' }).min(1),
    maxPerUser: z.number().min(1).max(20).default(10),
  })).min(1, 'Add at least one ticket type'),
});

const settingsSchema = z.object({
  refundPolicy: z.string().min(1, 'Select a refund policy'),
  isPublic:     z.boolean().default(true),
  promoCode:    z.string().optional(),
  promoDiscount: z.number().optional(),
});

export default function CreateEventPage() {
  const [step,      setStep]      = useState(1);
  const [formData,  setFormData]  = useState({});
  const [bannerUrl, setBannerUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const basicForm = useForm({ resolver: zodResolver(basicSchema) });
  const ticketsForm = useForm({
    resolver: zodResolver(ticketsSchema),
    defaultValues: {
      ticketTypes: [{ name: 'General', price: 0, quantity: 100, maxPerUser: 10 }],
    },
  });
  const settingsForm = useForm({ resolver: zodResolver(settingsSchema), defaultValues: { isPublic: true } });

  const { fields, append, remove } = useFieldArray({ control: ticketsForm.control, name: 'ticketTypes' });

  const handleBasicNext = basicForm.handleSubmit((data) => {
    setFormData((p) => ({ ...p, ...data }));
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const handleTicketsNext = ticketsForm.handleSubmit((data) => {
    setFormData((p) => ({ ...p, ...data }));
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const handleSettingsNext = settingsForm.handleSubmit((data) => {
    setFormData((p) => ({ ...p, ...data }));
    setStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const handlePublish = async () => {
    setIsSubmitting(true);
    try {
      const ticketsData = formData.ticketTypes || [];
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime   = new Date(`${formData.endDate}T${formData.endTime}`);

      if (endDateTime <= startDateTime) {
        toast.error('End date/time must be after start date/time');
        setIsSubmitting(false);
        return;
      }

      await api.post('/events', {
        title:         formData.title,
        description:   formData.description,
        category:      formData.category,
        bannerImage:   bannerUrl || undefined,
        startDate:     startDateTime.toISOString(),
        endDate:       endDateTime.toISOString(),
        venue: {
          address:     formData.address,
          city:        formData.city,
        },
        ticketTypes:   ticketsData.map((t) => ({
          name:       t.name,
          price:      Number(t.price),
          quantity:   Number(t.quantity),
          maxPerUser: Number(t.maxPerUser) || 10,
        })),
        refundPolicy:  formData.refundPolicy,
        isPublic:      formData.isPublic !== false,
        promoCode:     formData.promoCode || undefined,
        promoDiscount: Number(formData.promoDiscount) || 0,
        status:        'published',
      });
      toast.success('Event published successfully!');
      router.push('/organizer/events');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to publish event. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions = [
    { value: '', label: 'Select a category' },
    ...EVENT_CATEGORIES.map((c) => ({ value: c.id, label: `${c.icon} ${c.label}` })),
  ];

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900">Create New Event</h1>
          <p className="text-sm text-gray-500 mt-1">Fill in the details to publish your event</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-0 mb-8">
          {STEPS.map((s, idx) => (
            <div key={s.id} className="flex items-center flex-1">
              <button
                onClick={() => step > s.id && setStep(s.id)}
                className={`flex items-center justify-center w-9 h-9 rounded-full font-bold text-sm border-2 transition-colors ${
                  step > s.id  ? 'bg-brand-600 border-brand-600 text-white cursor-pointer hover:bg-brand-700'
                  : step === s.id ? 'border-brand-600 text-brand-600 bg-white'
                  : 'border-gray-200 text-gray-400 bg-white'
                }`}
              >
                {step > s.id ? <Check className="w-4 h-4" /> : s.id}
              </button>
              <span className={`ml-2 text-xs font-medium hidden sm:block ${step >= s.id ? 'text-gray-700' : 'text-gray-400'}`}>
                {s.label}
              </span>
              {idx < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-3 ${step > s.id ? 'bg-brand-400' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* ── Step 1: Basic Info ─────────────────────────────────────────── */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-bold text-gray-900 text-lg">Event Details</h2>

            <Input label="Event Title" placeholder="e.g. TechFest 2026 — Innovation Summit"
              {...basicForm.register('title')} error={basicForm.formState.errors.title?.message} />

            <Textarea label="Description" placeholder="Tell attendees what your event is about…" rows={4}
              {...basicForm.register('description')} error={basicForm.formState.errors.description?.message} />

            <Select label="Category" options={categoryOptions}
              {...basicForm.register('category')} error={basicForm.formState.errors.category?.message} />

            {/* Banner Upload */}
            <div>
              <label className="label">Banner Image URL</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                className="input-field"
              />
              {bannerUrl && (
                <img src={bannerUrl} alt="Preview" className="mt-2 rounded-xl h-32 w-full object-cover" onError={() => setBannerUrl('')} />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input label="Address" placeholder="123 Main St"
                {...basicForm.register('address')} error={basicForm.formState.errors.address?.message} />
              <Input label="City" placeholder="New York"
                {...basicForm.register('city')} error={basicForm.formState.errors.city?.message} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input label="Start Date" type="date" {...basicForm.register('startDate')}
                error={basicForm.formState.errors.startDate?.message} />
              <Input label="Start Time" type="time" {...basicForm.register('startTime')}
                error={basicForm.formState.errors.startTime?.message} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="End Date" type="date" {...basicForm.register('endDate')}
                error={basicForm.formState.errors.endDate?.message} />
              <Input label="End Time" type="time" {...basicForm.register('endTime')}
                error={basicForm.formState.errors.endTime?.message} />
            </div>

            <Button className="w-full" size="lg" onClick={handleBasicNext}>
              Next: Ticket Configuration <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* ── Step 2: Ticket Config ──────────────────────────────────────── */}
        {step === 2 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-bold text-gray-900 text-lg">Ticket Configuration</h2>

            <div className="space-y-4">
              {fields.map((field, idx) => (
                <div key={field.id} className="border border-gray-100 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-gray-700">Ticket Type #{idx + 1}</span>
                    {fields.length > 1 && (
                      <button onClick={() => remove(idx)} className="text-red-400 hover:text-red-600 transition-colors p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Name" placeholder="General, VIP, Early Bird…"
                      {...ticketsForm.register(`ticketTypes.${idx}.name`)}
                      error={ticketsForm.formState.errors.ticketTypes?.[idx]?.name?.message} />
                    <Input label="Price ($)" type="number" min={0} placeholder="0 for free"
                      {...ticketsForm.register(`ticketTypes.${idx}.price`, { valueAsNumber: true })}
                      error={ticketsForm.formState.errors.ticketTypes?.[idx]?.price?.message} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Total Quantity" type="number" min={1} placeholder="100"
                      {...ticketsForm.register(`ticketTypes.${idx}.quantity`, { valueAsNumber: true })}
                      error={ticketsForm.formState.errors.ticketTypes?.[idx]?.quantity?.message} />
                    <Input label="Max per User" type="number" min={1} max={20} placeholder="10"
                      {...ticketsForm.register(`ticketTypes.${idx}.maxPerUser`, { valueAsNumber: true })} />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => append({ name: '', price: 0, quantity: 50, maxPerUser: 10 })}
              className="flex items-center gap-2 text-brand-600 hover:text-brand-700 text-sm font-medium py-2"
            >
              <Plus className="w-4 h-4" /> Add Ticket Type
            </button>

            {ticketsForm.formState.errors.ticketTypes?.message && (
              <p className="text-xs text-red-600">{ticketsForm.formState.errors.ticketTypes.message}</p>
            )}

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                <ChevronLeft className="w-4 h-4" /> Back
              </Button>
              <Button className="flex-1" onClick={handleTicketsNext}>
                Next: Settings <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 3: Advanced Settings ─────────────────────────────────── */}
        {step === 3 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-bold text-gray-900 text-lg">Advanced Settings</h2>

            <Select
              label="Refund Policy"
              options={[
                { value: '',              label: 'Select policy'         },
                { value: 'no-refund',     label: 'No Refunds'            },
                { value: '24h-before',    label: 'Full refund 24h before'},
                { value: '48h-before',    label: 'Full refund 48h before'},
                { value: '7d-before',     label: 'Full refund 7 days before'},
              ]}
              {...settingsForm.register('refundPolicy')}
              error={settingsForm.formState.errors.refundPolicy?.message}
            />

            <div>
              <label className="label">Visibility</label>
              <div className="flex gap-3">
                {[{ v: true, l: '🌍 Public' }, { v: false, l: '🔒 Private' }].map(({ v, l }) => (
                  <label key={String(v)} className={`flex-1 flex items-center gap-2 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    settingsForm.watch('isPublic') === v ? 'border-brand-500 bg-brand-50' : 'border-gray-200'
                  }`}>
                    <input type="radio" className="text-brand-600" value={String(v)}
                      {...settingsForm.register('isPublic', { setValueAs: (v) => v === 'true' })} />
                    <span className="text-sm font-medium text-gray-800">{l}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input label="Promo Code (optional)" placeholder="SAVE10"
                {...settingsForm.register('promoCode')} />
              <Input label="Discount %" type="number" min={0} max={100} placeholder="10"
                {...settingsForm.register('promoDiscount', { valueAsNumber: true })} />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>
                <ChevronLeft className="w-4 h-4" /> Back
              </Button>
              <Button className="flex-1" onClick={handleSettingsNext}>
                Preview & Publish <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 4: Preview & Publish ─────────────────────────────────── */}
        {step === 4 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
            <h2 className="font-bold text-gray-900 text-lg">Preview & Publish</h2>

            {/* Summary */}
            <div className="space-y-3 bg-gray-50 rounded-xl p-4 text-sm">
              <p><span className="font-semibold text-gray-700">Title:</span> <span className="text-gray-600">{formData.title}</span></p>
              <p><span className="font-semibold text-gray-700">Category:</span> <span className="text-gray-600 capitalize">{formData.category}</span></p>
              <p><span className="font-semibold text-gray-700">Location:</span> <span className="text-gray-600">{formData.address}, {formData.city}</span></p>
              <p><span className="font-semibold text-gray-700">Start:</span> <span className="text-gray-600">{formData.startDate} at {formData.startTime}</span></p>
              <p><span className="font-semibold text-gray-700">End:</span> <span className="text-gray-600">{formData.endDate} at {formData.endTime}</span></p>
              <p><span className="font-semibold text-gray-700">Ticket Types:</span> <span className="text-gray-600">{formData.ticketTypes?.length || 0}</span></p>
              <p><span className="font-semibold text-gray-700">Refund Policy:</span> <span className="text-gray-600 capitalize">{formData.refundPolicy?.replace('-', ' ')}</span></p>
            </div>

            {bannerUrl && (
              <img src={bannerUrl} alt="" className="w-full h-40 object-cover rounded-xl" />
            )}

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-sm text-amber-800">
              ⚠️ Once published, your event will be visible to all users. You can still edit it afterwards.
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setStep(3)}>
                <ChevronLeft className="w-4 h-4" /> Back
              </Button>
              <Button className="flex-1" size="lg" loading={isSubmitting} onClick={handlePublish}>
                🚀 Publish Event
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
