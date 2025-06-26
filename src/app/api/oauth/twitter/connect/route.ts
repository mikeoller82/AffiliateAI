
import { NextResponse, type NextRequest } from 'next/server';
import { nanoid } from 'nanoid';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    let adminApp;
    try {
        adminApp = getAdminApp();
    } catch (error) {
        console.error("Firebase Admin initialization error:", error);
        return NextResponse.json({ error: "Server configuration error. Firebase Admin not initialized." }, { status: 500 });
    }

    const { token } = await request.json();

    if (!token) {
        return NextResponse.json({ error: "Authorization token is missing." }, { status: 400 });
    }
    
    function base64URLEncode(str: Buffer) {
        return str.toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    }

    const { createHash } = await import('crypto');
    const sha256 = (buffer: string) => createHash('sha256').update(buffer).digest();

    const auth = getAuth(adminApp);
    const db = getFirestore(adminApp);

    try {
        const decodedToken = await auth.verifyIdToken(token);
        const uid = decodedToken.uid;

        const state = nanoid();
        const codeVerifier = nanoid(128);
        const codeChallenge = base64URLEncode(sha256(codeVerifier));

        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + 15);
        const stateRef = db.collection('oauth_states').doc(state);
        await stateRef.set({
            uid,
            codeVerifier,
            expires,
        });
        
        const clientId = process.env.TWITTER_CLIENT_ID;
        const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/oauth/twitter/callback`;

        if (!clientId) {
            throw new Error("TWITTER_CLIENT_ID is not defined in .env");
        }

        const authUrl = new URL('https://twitter.com/i/oauth2/authorize');
        authUrl.searchParams.set('response_type', 'code');
        authUrl.searchParams.set('client_id', clientId);
        authUrl.searchParams.set('redirect_uri', redirectUri);
        authUrl.searchParams.set('scope', 'users.read tweet.read offline.access');
        authUrl.searchParams.set('state', state);
        authUrl.searchParams.set('code_challenge', codeChallenge);
        authUrl.searchParams.set('code_challenge_method', 'S256');

        return NextResponse.json({ authUrl: authUrl.toString() });

    } catch (error) {
        console.error("Error initiating Twitter OAuth:", error);
        return NextResponse.json({ error: "Authentication failed. Could not verify user." }, { status: 401 });
    }
}
