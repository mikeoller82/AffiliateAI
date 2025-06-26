
'use server';

import crypto from 'crypto';
import OAuth from 'oauth-1.0a';
import { db, auth } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';

const oauth = new OAuth({
    consumer: {
        key: process.env.TWITTER_CONSUMER_KEY!,
        secret: process.env.TWITTER_CONSUMER_SECRET!,
    },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
        return crypto.createHmac('sha1', key).update(base_string).digest('base64');
    },
});

async function getUserIdFromSession(): Promise<string | null> {
    const sessionCookie = cookies().get('__session')?.value;
    if (!sessionCookie) return null;
    try {
        const decodedToken = await auth.verifySessionCookie(sessionCookie, true);
        return decodedToken.uid;
    } catch (error) {
        console.error('Failed to verify session cookie', error);
        return null;
    }
}

interface AccessTokenInput {
    oauth_token: string;
    oauth_verifier: string;
}

export async function getTwitterAccessToken(input: AccessTokenInput) {
    const { oauth_token, oauth_verifier } = input;
    const userId = await getUserIdFromSession();

    if (!userId) {
        return { error: 'User not authenticated' };
    }

    const accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
    const authHeader = oauth.toHeader(oauth.authorize({ url: accessTokenUrl, method: 'POST' }));

    try {
        const response = await fetch(accessTokenUrl, {
            method: 'POST',
            headers: {
                ...authHeader,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `oauth_token=${oauth_token}&oauth_verifier=${oauth_verifier}`,
        });

        if (!response.ok) {
            throw new Error(`Failed to get access token: ${response.status}`);
        }

        const responseText = await response.text();
        const params = new URLSearchParams(responseText);
        
        const accessToken = params.get('oauth_token');
        const accessSecret = params.get('oauth_token_secret');
        const screenName = params.get('screen_name');
        const twitterUserId = params.get('user_id');

        if (!accessToken || !accessSecret || !screenName || !twitterUserId) {
            throw new Error('Incomplete access token response');
        }

        await db.collection('users').doc(userId).collection('connections').doc('twitter').set({
            accessToken,
            accessSecret,
            screenName,
            twitterUserId,
            connectedAt: new Date(),
        });

        return { success: true, screenName };

    } catch (error) {
        console.error('Error in Twitter OAuth access token:', error);
        return { error: 'Failed to finalize Twitter authentication' };
    }
}
