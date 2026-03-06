'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { api } from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('en_token');
    if (!token) { setLoading(false); return; }

    // Hydrate from localStorage immediately so UI doesn't flash
    const saved = localStorage.getItem('en_user');
    if (saved) { try { setUser(JSON.parse(saved)); } catch {} }

    // Then fetch fresh user from DB — picks up any role changes made by admin
    api.get('/auth/me')
      .then(({ data }) => {
        localStorage.setItem('en_user', JSON.stringify(data.user));
        setUser(data.user);
      })
      .catch(() => {
        // Token invalid / expired — clear everything
        Cookies.remove('en_token');
        localStorage.removeItem('en_user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    Cookies.set('en_token', data.token, { expires: 7, sameSite: 'strict' });
    localStorage.setItem('en_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const signup = async (payload) => {
    const { data } = await api.post('/auth/signup', payload);
    Cookies.set('en_token', data.token, { expires: 7, sameSite: 'strict' });
    localStorage.setItem('en_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    Cookies.remove('en_token');
    localStorage.removeItem('en_user');
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    localStorage.setItem('en_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
