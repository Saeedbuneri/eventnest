/**
 * api.js — fully static, zero-network mock client.
 *
 * All requests are handled in-memory by mockApi.js.
 * No axios, no XMLHttpRequest, no CORS issues — works on Vercel with zero config.
 */
import { mockApi } from '@/lib/mockApi';

// Drop-in replacement for an axios instance.
// Responses match axios format: { data, status }
export const api = {
  get:    (path, config = {}) => mockApi.get(path, config),
  post:   (path, data = {})   => mockApi.post(path, data),
  put:    (path, data = {})   => mockApi.put(path, data),
  patch:  (path, data = {})   => mockApi.patch(path, data),
  delete: (path)              => mockApi.delete(path),
};
