
import { NextResponse } from 'next/server';

export async function GET() {
    const crypto = await import('crypto');
    const OAuth = (await import('oauth-1.0a')).default;

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
    
    const requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
    const callbackUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/social-scheduler/twitter-callback`;
    
    const authHeader = oauth.toHeader(oauth.authorize({ 
        url: requestTokenUrl, 
        method: 'POST', 
        data: { oauth_callback: callbackUrl }
    }));

    try {
        const response = await fetch(requestTokenUrl, {
            method: 'POST',
            headers: { ...authHeader }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to get request token: ${response.status} ${errorText}`);
        }

        const responseText = await response.text();
        const params = new URLSearchParams(responseText);
        const oauth_token = params.get('oauth_token');

        if (!oauth_token) {
            throw new Error('OAuth token not found in response');
        }

        const authorizationUrl = `https://api.twitter.com/oauth/authenticate?oauth_token=${oauth_token}`;
        return NextResponse.json({ authorizationUrl });

    } catch (error) {
        console.error('Error in Twitter OAuth request token route:', error);
        const message = error instanceof Error ? error.message : 'Failed to initiate Twitter authentication';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
