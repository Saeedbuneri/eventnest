import axios from 'axios';
import Cookies from 'js-cookie';
import { mockApi } from '@/lib/mockApi';

// In the separate frontend/backend setup, point to the Express backend.
// Set NEXT_PUBLIC_API_URL in frontend/.env.local to your backend URL.
// Set NEXT_PUBLIC_USE_MOCK=true to always use mock data (no backend required).
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = Cookies.get('en_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  // Short-circuit to mock immediately if mock mode is forced
  if (USE_MOCK) config.__useMock = true;
  return config;
});

// Serve mock data when backend is unavailable (network error) or forced via env var
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const config = err.config || {};
    const isNetworkError = !err.response;  // backend offline / CORS / timeout
    const isMockForced   = config.__useMock;

    if (isNetworkError || isMockForced) {
      // Normalise path: strip the baseURL prefix if present
      let path = config.url || '';
      if (path.startsWith(BASE_URL)) path = path.slice(BASE_URL.length);
      if (!path.startsWith('/')) path = '/' + path;

      const method = (config.method || 'get').toLowerCase();
      try {
        let params = config.params || {};
        if (config.data) {
          try { params = typeof config.data === 'string' ? JSON.parse(config.data) : config.data; } catch {}
        }

        switch (method) {
          case 'get':    return await mockApi.get(path, { params: config.params || {} });
          case 'post':   return await mockApi.post(path, typeof config.data === 'string' ? JSON.parse(config.data || '{}') : (config.data || {}));
          case 'put':    return await mockApi.put(path,   typeof config.data === 'string' ? JSON.parse(config.data || '{}') : (config.data || {}));
          case 'patch':  return await mockApi.patch(path, typeof config.data === 'string' ? JSON.parse(config.data || '{}') : (config.data || {}));
          case 'delete': return await mockApi.delete(path);
        }
      } catch (mockErr) {
        // Mock threw a real error (e.g. 401 / 404) — pass it on
        return Promise.reject(mockErr);
      }
    }

    // Real backend error — handle 401 globally
    if (err.response?.status === 401) {
      Cookies.remove('en_token');
      localStorage.removeItem('en_user');
      if (typeof window !== 'undefined') window.location.href = '/auth/login';
    }
    return Promise.reject(err);
  }
);
