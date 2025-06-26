
import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  const { sessionCookie } = await request.json();

  if (!sessionCookie) {
    return NextResponse.json({ isValid: false }, { status: 400 });
  }

  try {
    await auth.verifySessionCookie(sessionCookie, true /** checkRevoked */);
    return NextResponse.json({ isValid: true });
  } catch (error) {
    // Session cookie is invalid or expired.
    return NextResponse.json({ isValid: false }, { status: 200 });
  }
}
