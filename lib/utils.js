import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, isPast } from 'date-fns';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  return format(new Date(date), 'EEE, MMM d, yyyy');
}

export function formatDateTime(date) {
  return format(new Date(date), 'EEE, MMM d, yyyy · h:mm a');
}

export function formatTime(date) {
  return format(new Date(date), 'h:mm a');
}

export function formatCurrency(amount, currency = 'USD') {
  if (amount === 0) return 'Free';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

export function formatTimeAgo(date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function isEventPast(endTime) {
  return isPast(new Date(endTime));
}

export function truncate(str, n) {
  return str?.length > n ? str.slice(0, n - 1) + '…' : str;
}

export function generateInitials(name) {
  return (name || '')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function getMinTicketPrice(ticketTypes = []) {
  if (!ticketTypes.length) return 0;
  return Math.min(...ticketTypes.map((t) => t.price));
}

export function getAvailableTickets(ticketType) {
  return ticketType.quantity - (ticketType.sold || 0);
}

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
}
