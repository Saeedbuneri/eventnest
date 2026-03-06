import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Event from '@/models/Event';
import { withAuth } from '@/middleware/withAuth';
import { getUserFromRequest } from '@/lib/auth';

// ── GET /api/events/[id] ─────────────────────────────────────────────────────
export async function GET(request, { params }) {
  try {
    await connectDB();
    const event = await Event.findById(params.id)
      .populate('organizer', 'name email avatar')
      .lean();
    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    return NextResponse.json({ event });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ── PUT /api/events/[id] ─────────────────────────────────────────────────────
async function updateEvent(request, { params }, user) {
  try {
    await connectDB();
    const event = await Event.findById(params.id);
    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    if (event.organizer.toString() !== user.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const body = await request.json();
    Object.assign(event, body);
    await event.save();
    return NextResponse.json({ event });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ── DELETE /api/events/[id] ──────────────────────────────────────────────────
async function deleteEvent(request, { params }, user) {
  try {
    await connectDB();
    const event = await Event.findById(params.id);
    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    if (event.organizer.toString() !== user.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    await event.deleteOne();
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const PUT    = withAuth(updateEvent, { roles: ['organizer', 'admin'] });
export const DELETE = withAuth(deleteEvent, { roles: ['organizer', 'admin'] });
