'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Ticket, Zap } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

const schema = z.object({
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const DEMO_ACCOUNTS = [
  { label: 'Admin',     email: 'admin@demo.com',     role: 'admin',     color: 'bg-purple-500/10 text-purple-300 border border-purple-500/25 hover:bg-purple-500/20' },
  { label: 'Organizer', email: 'organizer@demo.com', role: 'organizer', color: 'bg-blue-500/10 text-blue-300 border border-blue-500/25 hover:bg-blue-500/20' },
  { label: 'Attendee',  email: 'attendee@demo.com',  role: 'attendee',  color: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 hover:bg-emerald-500/20' },
  { label: 'Staff',     email: 'staff@demo.com',     role: 'staff',     color: 'bg-amber-500/10 text-amber-300 border border-amber-500/25 hover:bg-amber-500/20' },
];

export default function LoginPage() {
  const [showPw, setShowPw] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: 'admin@demo.com', password: 'demo1234' },
  });

  const onSubmit = async (data) => {
    try {
      const user = await login(data.email, data.password);
      toast.success(`Welcome back, ${user.name}!`);
      const redirect = new URLSearchParams(window.location.search).get('redirect');
      if (redirect && redirect.startsWith('/')) { router.push(redirect); return; }
      const roleRedirects = { organizer: '/organizer/dashboard', admin: '/admin/dashboard', staff: '/staff/scan' };
      router.push(roleRedirects[user.role] || '/');
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.response?.data?.error || 'Invalid email or password');
    }
  };

  const loginAs = (account) => {
    setValue('email', account.email);
    setValue('password', 'demo1234');
    handleSubmit(onSubmit)();
  };

  return (
    <div className="min-h-screen bg-[#07070e] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2.5 font-extrabold text-xl text-white mb-8">
          <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center shadow-[0_0_16px_rgba(225,29,72,.4)]">
            <Ticket className="w-5 h-5 text-white" />
          </div>
          EventNest
        </Link>

        {/* Demo quick-login panel */}
        <div className="bg-amber-500/[.07] border border-amber-500/20 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <p className="text-xs font-bold text-amber-400 uppercase tracking-widest">Demo mode  click to sign in instantly</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => loginAs(acc)}
                disabled={isSubmitting}
                className={`flex flex-col items-start px-3 py-2.5 rounded-xl text-left transition-all disabled:opacity-50 ${acc.color}`}
              >
                <span className="font-bold text-sm">{acc.label}</span>
                <span className="text-[11px] opacity-60 font-mono">{acc.email}</span>
              </button>
            ))}
          </div>
          <p className="text-[11px] text-amber-500/70 mt-2.5 text-center">
            All passwords: <span className="font-mono font-bold text-amber-400">demo1234</span>
          </p>
        </div>

        <div className="bg-[#111118] rounded-2xl border border-white/[.08] p-7 sm:p-8">
          <h1 className="text-2xl font-extrabold text-white mb-1.5">Welcome back</h1>
          <p className="text-gray-500 text-sm mb-6">Sign in to your EventNest account</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                  placeholder=""
                  autoComplete="current-password"
                  className={`input-field pr-10 ${errors.password ? 'border-red-500/60' : ''}`}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
              <div className="flex justify-end mt-1.5">
                <Link href="#" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">Forgot password?</Link>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
              Sign In
            </Button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-5">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-brand-400 font-semibold hover:text-brand-300 transition-colors">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}