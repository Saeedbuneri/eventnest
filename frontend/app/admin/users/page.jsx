'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, UserCheck, Ban, ShieldCheck } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

const statusMap = {
  active:    { variant: 'success', label: 'Active'    },
  pending:   { variant: 'warning', label: 'Pending'   },
  suspended: { variant: 'danger',  label: 'Suspended' },
};

const ROLE_OPTIONS = ['attendee', 'organizer', 'staff', 'admin'];

const roleVariant = {
  admin:     'danger',
  staff:     'warning',
  organizer: 'brand',
  attendee:  'default',
};

const FILTER_OPTIONS = [
  { value: '',          label: 'All'        },
  { value: 'organizer', label: 'Organizers' },
  { value: 'attendee',  label: 'Attendees'  },
  { value: 'staff',     label: 'Staff'      },
  { value: 'pending',   label: 'Pending'    },
  { value: 'suspended', label: 'Suspended'  },
];

export default function AdminUsersPage() {
  const [users,   setUsers]   = useState([]);
  const [total,   setTotal]   = useState(0);
  const [query,   setQuery]   = useState('');
  const [filter,  setFilter]  = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback((q = '', f = '') => {
    setLoading(true);
    const params = { limit: 50 };
    if (q) params.q = q;
    // role or status filter
    if (f === 'pending' || f === 'suspended') params.status = f;
    else if (f) params.role = f;
    api.get('/admin/users', { params })
      .then((res) => { setUsers(res.data.users || []); setTotal(res.data.total || 0); })
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchUsers('', filter); }, [filter, fetchUsers]);

  useEffect(() => {
    const t = setTimeout(() => fetchUsers(query, filter), 350);
    return () => clearTimeout(t);
  }, [query, filter, fetchUsers]);

  const updateStatus = async (id, action) => {
    try {
      await api.put(`/admin/users/${id}/${action}`);
      setUsers((prev) => prev.map((u) =>
        u._id === id ? { ...u, status: action === 'suspend' ? 'suspended' : 'active' } : u
      ));
      toast.success(action === 'suspend' ? 'User suspended' : 'User activated');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Action failed');
    }
  };

  const changeRole = async (id, role) => {
    try {
      await api.put(`/admin/users/${id}/role`, { role });
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, role } : u));
      toast.success(`Role changed to ${role}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to change role');
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-white">User Management</h1>
        <p className="text-sm text-gray-400 mt-0.5">{total} total users</p>
      </div>

      <div className="flex gap-2 flex-wrap mb-4">
        {FILTER_OPTIONS.map((t) => (
          <button
            key={t.value}
            onClick={() => setFilter(t.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === t.value ? 'bg-brand-600 text-white' : 'bg-white/[.05] border border-white/[.10] text-gray-400 hover:bg-white/[.08] hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Search users..." value={query} onChange={(e) => setQuery(e.target.value)} className="input-field pl-10" />
      </div>

      <div className="bg-[#111118] rounded-2xl border border-white/[.08] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Spinner size="lg" /></div>
        ) : users.length === 0 ? (
          <div className="text-center py-16"><p className="text-gray-400">No users found.</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/[.04] border-b border-white/[.07]">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">User</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Email</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Role</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[.05]">
                {users.map((u) => {
                  const s = statusMap[u.status] || statusMap.active;
                  return (
                    <tr key={u._id} className="hover:bg-white/[.03] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 bg-brand-500/10 rounded-full flex items-center justify-center text-brand-400 font-bold text-sm shrink-0">
                            {u.name?.[0] || '?'}
                          </div>
                          <span className="font-medium text-gray-200">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-400 hidden sm:table-cell">{u.email}</td>
                      <td className="py-3.5 px-4">
                        <select
                          value={u.role}
                          onChange={(e) => changeRole(u._id, e.target.value)}
                          className="text-xs border border-white/[.10] rounded-lg px-2 py-1 bg-[#14141f] text-gray-300 focus:outline-none focus:ring-1 focus:ring-brand-400 capitalize cursor-pointer"
                        >
                          {ROLE_OPTIONS.map((r) => (
                            <option key={r} value={r} className="capitalize">{r}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3.5 px-4"><Badge variant={s.variant} dot>{s.label}</Badge></td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-end gap-1.5">
                          {u.status !== 'suspended' ? (
                            <button onClick={() => updateStatus(u._id, 'suspend')} className="p-1.5 text-gray-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors" title="Suspend">
                              <Ban className="w-4 h-4" />
                            </button>
                          ) : (
                            <button onClick={() => updateStatus(u._id, 'activate')} className="p-1.5 text-gray-400 hover:text-green-400 rounded-lg hover:bg-green-500/10 transition-colors" title="Activate">
                              <UserCheck className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}