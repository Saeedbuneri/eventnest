'use client';

import { useQuery } from '@tanstack/react-query';
import { MOCK_EVENTS, MOCK_MY_TICKETS } from '@/lib/constants';
import api from '@/lib/api';

/**
 * Fetch all events with optional filtering params.
 * Falls back to client-side filtered MOCK_EVENTS when API is unavailable.
 */
export function useEvents(params = {}) {
  return useQuery({
    queryKey: ['events', params],
    queryFn: async () => {
      try {
        const { data } = await api.get('/events', { params });
        return data;
      } catch {
        // Offline / demo mode — filter mock data
        let results = [...MOCK_EVENTS];
        const { q, category, city, price, sort } = params;

        if (q) {
          const lower = q.toLowerCase();
          results = results.filter(
            (e) =>
              e.title.toLowerCase().includes(lower) ||
              e.description.toLowerCase().includes(lower)
          );
        }
        if (category) {
          results = results.filter((e) => e.category === category);
        }
        if (city) {
          results = results.filter((e) =>
            e.location?.city?.toLowerCase().includes(city.toLowerCase())
          );
        }
        if (price === 'free') {
          results = results.filter((e) =>
            e.ticketTypes?.some((t) => t.price === 0)
          );
        }
        if (price === 'paid') {
          results = results.filter((e) =>
            e.ticketTypes?.every((t) => t.price > 0)
          );
        }
        if (price === 'under25') {
          results = results.filter((e) =>
            e.ticketTypes?.some((t) => t.price > 0 && t.price < 25)
          );
        }

        switch (sort) {
          case 'date_asc':
            results.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
            break;
          case 'price_asc':
            results.sort((a, b) => {
              const minA = Math.min(...(a.ticketTypes?.map((t) => t.price) ?? [0]));
              const minB = Math.min(...(b.ticketTypes?.map((t) => t.price) ?? [0]));
              return minA - minB;
            });
            break;
          case 'price_desc':
            results.sort((a, b) => {
              const minA = Math.min(...(a.ticketTypes?.map((t) => t.price) ?? [0]));
              const minB = Math.min(...(b.ticketTypes?.map((t) => t.price) ?? [0]));
              return minB - minA;
            });
            break;
          case 'popular':
          default:
            results.sort((a, b) => (b.attendeesCount ?? 0) - (a.attendeesCount ?? 0));
        }

        return { events: results, total: results.length };
      }
    },
    staleTime: 60_000,
  });
}

/**
 * Fetch a single event by ID.
 * Falls back to MOCK_EVENTS when API is unavailable.
 */
export function useEvent(id) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      if (!id) return null;
      try {
        const { data } = await api.get(`/events/${id}`);
        return data;
      } catch {
        return MOCK_EVENTS.find((e) => String(e.id) === String(id)) ?? null;
      }
    },
    enabled: !!id,
    staleTime: 60_000,
  });
}

/**
 * Fetch the logged-in user's tickets.
 * Falls back to MOCK_MY_TICKETS when API is unavailable.
 */
export function useMyTickets() {
  return useQuery({
    queryKey: ['my-tickets'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/my-tickets');
        return data;
      } catch {
        return MOCK_MY_TICKETS;
      }
    },
    staleTime: 30_000,
  });
}
