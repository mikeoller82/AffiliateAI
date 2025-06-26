
import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    const options = { name: '__session', value: '', maxAge: -1, path: '/' };
    cookies().set(options);
    return NextResponse.json({ success: true }, { status: 200 });
}
