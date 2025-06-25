
import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { createHash } from 'crypto';

export const dynamic = 'force-dynamic';

function base64URLEncode(str: Buffer) {
    return str.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

function sha256(buffer: string) {
    return createHash('sha256').update(buffer).digest();
}

export async function GET() {
    const state = nanoid();
    const codeVerifier = nanoid(128);

    const codeChallenge = base64URLEncode(sha256(codeVerifier));
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

    const response = NextResponse.redirect(authUrl.toString());
    
    // Store state and verifier in secure, httpOnly cookies
    response.cookies.set('twitter_oauth_state', state, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 60 * 15, // 15 minutes
        path: '/',
    });
    response.cookies.set('twitter_code_verifier', codeVerifier, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 60 * 15, // 15 minutes
        path: '/',
    });

    return response;
}
