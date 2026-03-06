import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectDB();

    const state = mongoose.connection.readyState;
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    const stateLabel = ['disconnected', 'connected', 'connecting', 'disconnecting'][state] ?? 'unknown';

    return NextResponse.json({
      ok: state === 1,
      database: stateLabel,
      host: mongoose.connection.host,
      dbName: mongoose.connection.name,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}
