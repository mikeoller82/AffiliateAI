
import { NextResponse, type NextRequest } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { adminApp } from '@/lib/firebase-admin';
import { nanoid } from 'nanoid';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    // Environment variable validation
    const { TWITTER_CLIENT_ID, TWITTER_CLIENT_SECRET, NEXT_PUBLIC_BASE_URL, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;
    if (!TWITTER_CLIENT_ID || !TWITTER_CLIENT_SECRET || !NEXT_PUBLIC_BASE_URL || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
        console.error("Missing required environment variables for Twitter OAuth or Firebase Admin.");
        // Redirect with a more specific error for the user to understand
        return NextResponse.redirect(new URL('/dashboard/settings?tab=social&error=server_configuration_error', request.url));
    }

    const db = getFirestore(adminApp);
    const auth = getAuth(adminApp);
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    const oauthState = request.cookies.get('twitter_oauth_state')?.value;
    const codeVerifier = request.cookies.get('twitter_code_verifier')?.value;
    
    if (!oauthState || !codeVerifier || state !== oauthState) {
        return NextResponse.redirect(new URL('/dashboard/settings?tab=social&error=invalid_state', request.url));
    }
    
    if (!code) {
        return NextResponse.redirect(new URL('/dashboard/settings?tab=social&error=missing_code', request.url));
    }

    try {
        // Exchange authorization code for access token
        const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(`${TWITTER_CLIENT_ID}:${TWITTER_CLIENT_SECRET}`).toString('base64')}`
            },
            body: new URLSearchParams({
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: `${NEXT_PUBLIC_BASE_URL}/api/oauth/twitter/callback`,
                code_verifier: codeVerifier,
            }),
        });

        const tokens = await tokenResponse.json();
        if (!tokens.access_token) {
            console.error('Failed to get access token from Twitter:', tokens);
            throw new Error('Failed to get access token from Twitter.');
        }
        
        // Fetch user info from Twitter
        const userResponse = await fetch('https://api.twitter.com/2/users/me', {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`,
            },
        });
        
        const twitterUser = await userResponse.json();
        if (!twitterUser.data) {
             throw new Error('Failed to fetch user data from Twitter.');
        }

        const { id: twitterId, name, username } = twitterUser.data;

        // This requires a session cookie or another way to get the logged-in user's UID.
        // For now, this is a placeholder. In a real app, you would get this from a secure session.
        // NOTE: This part will fail without a proper session management strategy.
        // This is a complex part of a full-stack app that is outside the scope of simple API routes without auth context.
        // We will assume a placeholder UID for now.
        const userId = 'placeholder_user_id'; // IMPORTANT: Replace with real user session logic.

        // Save profile to Firestore
        const profileId = `twitter_${twitterId}`;
        const profileRef = db.collection('users').doc(userId).collection('social_profiles').doc(profileId);

        const newProfile = {
            id: profileId,
            platform: 'Twitter',
            platformIcon: 'Twitter',
            name: `${name} (@${username})`,
            credentials: {
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token,
                expiresAt: Date.now() + tokens.expires_in * 1000,
            }
        };

        await profileRef.set(newProfile, { merge: true });

        const response = NextResponse.redirect(new URL('/dashboard/settings?tab=social&success=true', request.url));
        response.cookies.delete('twitter_oauth_state');
        response.cookies.delete('twitter_code_verifier');
        
        return response;

    } catch (error) {
        console.error("Twitter OAuth callback error:", error);
        return NextResponse.redirect(new URL('/dashboard/settings?tab=social&error=oauth_failed', request.url));
    }
}
