// api/oauth-config.js
module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const CLIENT_ID = process.env.BUNGIE_CLIENT_ID;
    
    if (!CLIENT_ID) {
        res.status(500).json({ error: 'OAuth client ID not configured' });
        return;
    }

    try {
        // Return only the client ID - client secrets stay private
        res.status(200).json({
            clientId: CLIENT_ID,
            redirectUri: `${req.headers.origin || 'https://' + req.headers.host}/oauth-callback.html`,
            authUrl: 'https://www.bungie.net/en/OAuth/Authorize',
            scope: 'ReadUserData,ReadDestinyInventoryAndVault'
        });
        
    } catch (error) {
        console.error('Failed to get OAuth config:', error);
        res.status(500).json({ 
            error: 'Failed to get OAuth configuration',
            details: error.message 
        });
    }
};