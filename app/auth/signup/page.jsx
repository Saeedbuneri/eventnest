'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Ticket } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

const schema = z.object({
  name:            z.string().min(2, 'Full name required'),
  email:           z.string().email('Valid email required'),
  password:        z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  role:            z.enum(['attendee', 'organizer'], { required_error: 'Select account type' }),
  terms:           z.literal(true, { errorMap: () => ({ message: 'You must accept the terms' }) }),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const ROLES = [
  {
    value: 'attendee',
    label: 'Attendee',
    desc:  'Browse and buy tickets for events',
    icon:  '🎟️',
  },
  {
    value: 'organizer',
    label: 'Organizer',
    desc:  'Create events and sell tickets',
    icon:  '🎪',
  },
];

export default function SignupPage() {
  const [showPw, setShowPw]   = useState(false);
  const { signup } = useAuth();
  const router     = useRouter();

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: 'attendee' },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data) => {
    try {
      const user = await signup({ name: data.name, email: data.email, password: data.password, role: data.role });
      toast.success(`Account created! Welcome, ${user.name}!`);
      const redirects = { organizer: '/organizer/dashboard', admin: '/admin/dashboard' };
      router.push(redirects[user.role] || '/');
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.response?.data?.error || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2.5 font-extrabold text-xl text-brand-700 mb-8">
          <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center shadow-sm">
            <Ticket className="w-5 h-5 text-white" />
          </div>
          EventNest
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1.5">Create your account</h1>
          <p className="text-gray-500 text-sm mb-6">Join thousands discovering local events</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Role Selection */}
            <div>
              <label className="label">I want to…</label>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setValue('role', r.value)}
                    className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                      selectedRole === r.value
                        ? 'border-brand-500 bg-brand-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1.5">{r.icon}</div>
                    <div className="font-semibold text-sm text-gray-900">{r.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{r.desc}</div>
                  </button>
                ))}
              </div>
              {errors.role && <p className="mt-1 text-xs text-red-600">{errors.role.message}</p>}
            </div>

            <Input
              label="Full Name"
              placeholder="John Doe"
              autoComplete="name"
              {...register('name')}
              error={errors.name?.message}
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...register('email')}
              error={errors.email?.message}
            />

            <div className="w-full">
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  className={`input-field pr-10 ${errors.password ? 'border-red-400' : ''}`}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
            </div>

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Re-enter password"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                {...register('terms')}
              />
              <span className="text-sm text-gray-600">
                I agree to the{' '}
                <Link href="#" className="text-brand-600 hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link href="#" className="text-brand-600 hover:underline">Privacy Policy</Link>
              </span>
            </label>
            {errors.terms && <p className="text-xs text-red-600 -mt-2">{errors.terms.message}</p>}

            <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
              Create Account
            </Button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-5">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-brand-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
