// api/oauth-token.js
module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const { code, redirect_uri } = req.body;

    if (!code || !redirect_uri) {
        res.status(400).json({ error: 'Missing required parameters' });
        return;
    }

    const CLIENT_ID = process.env.BUNGIE_CLIENT_ID;
    const CLIENT_SECRET = process.env.BUNGIE_CLIENT_SECRET;
    
    if (!CLIENT_ID || !CLIENT_SECRET) {
        res.status(500).json({ error: 'OAuth credentials not configured' });
        return;
    }

    try {
        console.log('Exchanging OAuth code for token...');
        
        // Exchange authorization code for access token
        const tokenResponse = await fetch('https://www.bungie.net/Platform/App/OAuth/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: redirect_uri,
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET
            })
        });

        if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text();
            console.error('Token exchange failed:', tokenResponse.status, errorText);
            throw new Error(`Token exchange failed: ${tokenResponse.status}`);
        }

        const tokenData = await tokenResponse.json();
        console.log('Token exchange successful');

        // Return the token data (access_token, refresh_token, etc.)
        res.status(200).json(tokenData);
        
    } catch (error) {
        console.error('OAuth token exchange failed:', error);
        res.status(500).json({ 
            error: 'Failed to exchange authorization code',
            details: error.message 
        });
    }
};