
'use server';

import crypto from 'crypto';
import OAuth from 'oauth-1.0a';

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

export async function getTwitterRequestToken() {
    const requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
    
    const authHeader = oauth.toHeader(oauth.authorize({ 
        url: requestTokenUrl, 
        method: 'POST', 
        data: { oauth_callback: process.env.TWITTER_CALLBACK_URL! }
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
        return { authorizationUrl };

    } catch (error) {
        console.error('Error in Twitter OAuth request token:', error);
        const message = error instanceof Error ? error.message : 'Failed to initiate Twitter authentication';
        return { error: message };
    }
}
