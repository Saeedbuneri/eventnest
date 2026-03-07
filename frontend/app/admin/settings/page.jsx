'use client';

import { useState } from 'react';
import { Settings, ShieldCheck, Bell, Globe, Palette, Save } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import toast from 'react-hot-toast';

const SECTIONS = [
  { id: 'general',   label: 'General',       icon: Settings    },
  { id: 'security',  label: 'Security',      icon: ShieldCheck },
  { id: 'notifications', label: 'Notifications', icon: Bell    },
  { id: 'platform',  label: 'Platform',      icon: Globe       },
  { id: 'appearance',label: 'Appearance',    icon: Palette     },
];

function SettingRow({ label, description, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 border-b border-white/[.06] last:border-0">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-200">{label}</p>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-brand-600' : 'bg-white/10'}`}
    >
      <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : ''}`} />
    </button>
  );
}

export default function AdminSettingsPage() {
  const [active, setActive] = useState('general');

  // General settings state
  const [siteName,      setSiteName]      = useState('EventNest');
  const [supportEmail,  setSupportEmail]  = useState('support@eventnest.com');
  const [maxTickets,    setMaxTickets]    = useState('10');

  // Security settings state
  const [require2FA,    setRequire2FA]    = useState(false);
  const [emailVerify,   setEmailVerify]   = useState(true);
  const [sessionHours,  setSessionHours]  = useState('24');

  // Notifications state
  const [emailNewUser,  setEmailNewUser]  = useState(true);
  const [emailBooking,  setEmailBooking]  = useState(true);
  const [emailRefund,   setEmailRefund]   = useState(true);

  // Platform state
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [allowRegistration, setAllowRegistration] = useState(true);
  const [currency,        setCurrency]        = useState('PKR');

  const handleSave = () => toast.success('Settings saved successfully');

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Settings</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage platform configuration</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Sidebar nav */}
        <div className="lg:w-52 shrink-0">
          <nav className="bg-[#111118] rounded-2xl border border-white/[.08] p-2 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible no-scrollbar">
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                  active === id
                    ? 'bg-brand-600 text-white'
                    : 'text-gray-400 hover:bg-white/[.05] hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content panel */}
        <div className="flex-1 bg-[#111118] rounded-2xl border border-white/[.08] p-6">

          {/* General */}
          {active === 'general' && (
            <div>
              <h2 className="text-lg font-bold text-white mb-4">General Settings</h2>
              <SettingRow label="Site Name" description="The name shown across the platform.">
                <input
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="input-field w-48 text-sm"
                />
              </SettingRow>
              <SettingRow label="Support Email" description="Contact email shown to users.">
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="input-field w-48 text-sm"
                />
              </SettingRow>
              <SettingRow label="Max Tickets per Booking" description="Maximum tickets a user can book per event.">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={maxTickets}
                  onChange={(e) => setMaxTickets(e.target.value)}
                  className="input-field w-24 text-sm"
                />
              </SettingRow>
            </div>
          )}

          {/* Security */}
          {active === 'security' && (
            <div>
              <h2 className="text-lg font-bold text-white mb-4">Security Settings</h2>
              <SettingRow label="Require Two-Factor Authentication" description="Force all admin accounts to use 2FA.">
                <Toggle checked={require2FA} onChange={setRequire2FA} />
              </SettingRow>
              <SettingRow label="Email Verification" description="Require users to verify their email on signup.">
                <Toggle checked={emailVerify} onChange={setEmailVerify} />
              </SettingRow>
              <SettingRow label="Session Duration (hours)" description="How long before users are automatically logged out.">
                <input
                  type="number"
                  min="1"
                  max="720"
                  value={sessionHours}
                  onChange={(e) => setSessionHours(e.target.value)}
                  className="input-field w-24 text-sm"
                />
              </SettingRow>
            </div>
          )}

          {/* Notifications */}
          {active === 'notifications' && (
            <div>
              <h2 className="text-lg font-bold text-white mb-4">Notification Settings</h2>
              <SettingRow label="New User Registered" description="Send admin email when a new user signs up.">
                <Toggle checked={emailNewUser} onChange={setEmailNewUser} />
              </SettingRow>
              <SettingRow label="New Booking" description="Send admin email on each successful booking.">
                <Toggle checked={emailBooking} onChange={setEmailBooking} />
              </SettingRow>
              <SettingRow label="Refund Requested" description="Send admin email whenever a refund is requested.">
                <Toggle checked={emailRefund} onChange={setEmailRefund} />
              </SettingRow>
            </div>
          )}

          {/* Platform */}
          {active === 'platform' && (
            <div>
              <h2 className="text-lg font-bold text-white mb-4">Platform Settings</h2>
              <SettingRow label="Maintenance Mode" description="Take the platform offline for all users except admins.">
                <Toggle checked={maintenanceMode} onChange={setMaintenanceMode} />
              </SettingRow>
              <SettingRow label="Allow New Registrations" description="Enable or disable new user sign-ups.">
                <Toggle checked={allowRegistration} onChange={setAllowRegistration} />
              </SettingRow>
              <SettingRow label="Default Currency" description="Currency used for all ticket prices.">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="text-sm border border-white/[.10] rounded-lg px-3 py-1.5 bg-[#14141f] text-gray-300 focus:outline-none focus:ring-1 focus:ring-brand-400"
                >
                  {['PKR', 'USD', 'EUR', 'GBP'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </SettingRow>
            </div>
          )}

          {/* Appearance */}
          {active === 'appearance' && (
            <div>
              <h2 className="text-lg font-bold text-white mb-4">Appearance Settings</h2>
              <SettingRow label="Theme" description="Platform colour theme (dark mode always active).">
                <span className="text-xs bg-white/[.06] border border-white/[.10] text-gray-300 px-3 py-1.5 rounded-lg">
                  Dark (default)
                </span>
              </SettingRow>
              <SettingRow label="Brand Colour" description="Primary accent colour used across the UI.">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-500 border border-white/20" />
                  <span className="text-sm text-gray-400">#e11d48</span>
                </div>
              </SettingRow>
              <SettingRow label="Logo" description="Upload a custom logo for the nav bar.">
                <button className="text-xs bg-white/[.06] border border-white/[.10] text-gray-300 hover:bg-white/[.10] px-3 py-1.5 rounded-lg transition-colors">
                  Upload Logo
                </button>
              </SettingRow>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
