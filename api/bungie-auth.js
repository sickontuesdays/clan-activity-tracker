// api/bungie-auth.js
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const { endpoint } = req.query;

    if (!endpoint) {
        res.status(400).json({ error: 'Endpoint parameter is required' });
        return;
    }

    const API_KEY = process.env.BUNGIE_API_KEY;
    const JWT_SECRET = process.env.JWT_SECRET;
    
    if (!API_KEY || !JWT_SECRET) {
        res.status(500).json({ error: 'Server configuration error' });
        return;
    }

    try {
        // Get and verify session
        const cookies = req.headers.cookie;
        if (!cookies) {
            res.status(401).json({ error: 'No session found' });
            return;
        }

        const sessionCookie = cookies.split(';')
            .find(cookie => cookie.trim().startsWith('session='));
        
        if (!sessionCookie) {
            res.status(401).json({ error: 'No session cookie found' });
            return;
        }

        const sessionToken = sessionCookie.split('=')[1];
        const decoded = jwt.verify(sessionToken, JWT_SECRET);

        // Check if token is expired
        if (decoded.tokenExpiry && Date.now() > decoded.tokenExpiry) {
            res.status(401).json({ error: 'Session expired' });
            return;
        }

        console.log('Making authenticated request to Bungie API:', `https://www.bungie.net/Platform${endpoint}`);
        
        // Make authenticated request to Bungie API
        const response = await fetch(`https://www.bungie.net/Platform${endpoint}`, {
            headers: {
                'X-API-Key': API_KEY,
                'Authorization': `Bearer ${decoded.accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Bungie API response status:', response.status);

        const data = await response.json();
        console.log('Bungie API response:', JSON.stringify(data, null, 2));

        // Return the response data
        res.status(200).json(data);
        
    } catch (error) {
        console.error('Authenticated API request failed:', error);
        
        if (error.name === 'JsonWebTokenError') {
            res.status(401).json({ error: 'Invalid session' });
        } else {
            res.status(500).json({ 
                error: 'Failed to fetch data from Bungie API',
                details: error.message,
                endpoint: endpoint
            });
        }
    }
};