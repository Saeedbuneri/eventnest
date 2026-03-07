'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user: authUser, loading: authLoading } = useAuth();
  const router = useRouter();

  const [profile, setProfile]     = useState({ name: '', email: '' });
  const [passwords, setPasswords] = useState({ current: '', newPw: '', confirm: '' });
  const [saving, setSaving]       = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!authLoading && !authUser) {
      router.replace('/auth/login?redirect=/profile');
      return;
    }
    if (authUser) {
      api.get('/auth/me')
        .then((res) => setProfile({ name: res.data.user.name, email: res.data.user.email }))
        .catch(() => toast.error('Failed to load profile'))
        .finally(() => setLoadingProfile(false));
    }
  }, [authUser, authLoading]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/auth/me', { name: profile.name, email: profile.email });
      setProfile({ name: res.data.user.name, email: res.data.user.email });
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passwords.newPw !== passwords.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwords.newPw.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    setSaving(true);
    try {
      await api.put('/auth/me', { currentPassword: passwords.current, newPassword: passwords.newPw });
      setPasswords({ current: '', newPw: '', confirm: '' });
      toast.success('Password changed!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loadingProfile) {
    return (
      <div className="min-h-screen bg-[#07070e]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07070e]">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-10">
        <Link href="/events" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-brand-400 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to events
        </Link>

        <h1 className="text-2xl font-extrabold text-white mb-8">My Profile</h1>

        {/* Profile Info */}
        <div className="bg-[#111118] rounded-2xl border border-white/[.08] p-6 mb-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
              <User className="w-5 h-5 text-brand-400" />
            </div>
            <h2 className="font-bold text-white">Personal Information</h2>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
              <Input
                value={profile.name}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                placeholder="Your full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
              <Input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                placeholder="your@email.com"
                required
              />
            </div>
            <Button type="submit" disabled={saving}>
              <Save className="w-4 h-4" />
              {saving ? 'Saving…' : 'Save Changes'}
            </Button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-[#111118] rounded-2xl border border-white/[.08] p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
              <Lock className="w-5 h-5 text-brand-400" />
            </div>
            <h2 className="font-bold text-white">Change Password</h2>
          </div>

          <form onSubmit={handlePasswordSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Current Password</label>
              <Input
                type="password"
                value={passwords.current}
                onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                placeholder="Enter current password"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
              <Input
                type="password"
                value={passwords.newPw}
                onChange={(e) => setPasswords((p) => ({ ...p, newPw: e.target.value }))}
                placeholder="At least 6 characters"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Confirm New Password</label>
              <Input
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                placeholder="Repeat new password"
                required
              />
            </div>
            <Button type="submit" disabled={saving}>
              <Lock className="w-4 h-4" />
              {saving ? 'Saving…' : 'Update Password'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
