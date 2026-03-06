import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { withAuth } from '@/middleware/withAuth';

async function handler(request, { params }) {
  try {
    await connectDB();
    const user = await User.findByIdAndUpdate(
      params.id,
      { status: 'active' },
      { new: true }
    ).select('-password');
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const PUT = withAuth(handler, { roles: ['admin'] });
