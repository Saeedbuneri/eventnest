import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { withAuth } from '@/middleware/withAuth';

async function getHandler(request, ctx, user) {
  try {
    await connectDB();
    const found = await User.findById(user.id).select('-password').lean();
    if (!found) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json({ user: found });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

async function putHandler(request, ctx, user) {
  try {
    await connectDB();
    const { name, email, currentPassword, newPassword } = await request.json();

    const found = await User.findById(user.id);
    if (!found) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (name)  found.name  = name.trim();
    if (email) found.email = email.trim().toLowerCase();

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Current password is required to set a new password' }, { status: 400 });
      }
      const match = await bcrypt.compare(currentPassword, found.password);
      if (!match) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
      found.password = await bcrypt.hash(newPassword, 12);
    }

    await found.save();
    const updated = found.toObject();
    delete updated.password;
    return NextResponse.json({ user: updated });
  } catch (err) {
    if (err.code === 11000) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const GET = withAuth(getHandler);
export const PUT = withAuth(putHandler);
