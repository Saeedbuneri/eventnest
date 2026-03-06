import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { hashPassword, signToken } from '@/lib/auth';

export async function POST(request) {
  try {
    await connectDB();
    const { name, email, password, role } = await request.json();

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const allowedRoles = ['attendee', 'organizer'];
    const userRole = allowedRoles.includes(role) ? role : 'attendee';

    const hashed = await hashPassword(password);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashed,
      role: userRole,
    });

    const token = signToken({ id: user._id, email: user.email, role: user.role, name: user.name });

    return NextResponse.json(
      { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
