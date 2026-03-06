import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { withAuth } from '@/middleware/withAuth';

const ALLOWED_ROLES = ['attendee', 'organizer', 'staff', 'admin'];

async function handler(request, { params }, _callerUser) {
  try {
    await connectDB();
    const { id } = params;
    const { role } = await request.json();

    if (!ALLOWED_ROLES.includes(role)) {
      return NextResponse.json({ error: `Invalid role. Must be one of: ${ALLOWED_ROLES.join(', ')}` }, { status: 400 });
    }

    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const PUT = withAuth(handler, { roles: ['admin'] });
