
import { NextResponse, type NextRequest } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { adminApp } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    if (!adminApp) {
        console.error("Firebase Admin not initialized. Check server environment variables.");
        return NextResponse.redirect(new URL('/dashboard/settings?tab=social&error=server_configuration_error', request.url));
    }

    const { TWITTER_CLIENT_ID, TWITTER_CLIENT_SECRET, NEXT_PUBLIC_BASE_URL } = process.env;
    if (!TWITTER_CLIENT_ID || !TWITTER_CLIENT_SECRET || !NEXT_PUBLIC_BASE_URL) {
        console.error("Missing required environment variables for Twitter OAuth.");
        return NextResponse.redirect(new URL('/dashboard/settings?tab=social&error=server_configuration_error', request.url));
    }

    const db = getFirestore(adminApp);
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code || !state) {
        return NextResponse.redirect(new URL('/dashboard/settings?tab=social&error=missing_code_or_state', request.url));
    }

    const stateRef = db.collection('oauth_states').doc(state);

    try {
        const stateDoc = await stateRef.get();
        if (!stateDoc.exists) {
            console.error("Invalid or expired state parameter.");
            return NextResponse.redirect(new URL('/dashboard/settings?tab=social&error=invalid_state', request.url));
        }

        const { uid: userId, codeVerifier } = stateDoc.data() as { uid: string, codeVerifier: string };
        
        // State has been used, delete it to prevent reuse
        await stateRef.delete();

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
                client_id: TWITTER_CLIENT_ID,
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

        // Save profile to Firestore under the correct user's subcollection
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

        // Redirect user to settings page with success message
        return NextResponse.redirect(new URL('/dashboard/settings?tab=social&success=true', request.url));

    } catch (error) {
        console.error("Twitter OAuth callback error:", error);
        // Attempt to clean up state doc on error if it exists
        const stateDoc = await stateRef.get();
        if (stateDoc.exists) {
            await stateRef.delete();
        }
        return NextResponse.redirect(new URL('/dashboard/settings?tab=social&error=oauth_failed', request.url));
    }
}
