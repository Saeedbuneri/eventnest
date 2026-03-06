import axios from 'axios';
import Cookies from 'js-cookie';
import { mockApi } from '@/lib/mockApi';

// ─── Config ───────────────────────────────────────────────────────────────────
// When NEXT_PUBLIC_API_URL is not set (e.g. Vercel deploy without a backend),
// automatically use mock mode — no HTTP requests are made, zero CORS errors.
const CONFIGURED_URL = process.env.NEXT_PUBLIC_API_URL;
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true' || !CONFIGURED_URL;
const BASE_URL = CONFIGURED_URL || 'http://localhost:5000/api';

// ─── Custom adapter: completely bypasses the network when mock mode is active ─
// This means NO loopback/CORS errors on Vercel — data comes directly from
// mockApi.js without any HTTP request ever leaving the browser.
async function mockAdapter(config) {
  let path = config.url || '';
  if (path.startsWith(BASE_URL)) path = path.slice(BASE_URL.length);
  if (!path.startsWith('/')) path = '/' + path;

  const method = (config.method || 'get').toLowerCase();
  let body = {};
  if (config.data) {
    try { body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data; } catch {}
  }

  let result;
  switch (method) {
    case 'get':    result = await mockApi.get(path, { params: config.params || {} }); break;
    case 'post':   result = await mockApi.post(path, body);   break;
    case 'put':    result = await mockApi.put(path, body);    break;
    case 'patch':  result = await mockApi.patch(path, body);  break;
    case 'delete': result = await mockApi.delete(path);       break;
    default: throw new Error(`mockAdapter: unsupported method ${method}`);
  }

  return { data: result.data, status: result.status || 200, statusText: 'OK', headers: {}, config, request: {} };
}

// ─── Axios instance ───────────────────────────────────────────────────────────
export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: USE_MOCK ? undefined : 15000,
  // Plug in mock adapter when no backend is configured — avoids any network call
  ...(USE_MOCK ? { adapter: mockAdapter } : {}),
});

// Attach JWT token to every real request
api.interceptors.request.use((config) => {
  const token = Cookies.get('en_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 from a real backend (mock mode never reaches here)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      Cookies.remove('en_token');
      localStorage.removeItem('en_user');
      if (typeof window !== 'undefined') window.location.href = '/auth/login';
    }
    return Promise.reject(err);
  }
);
