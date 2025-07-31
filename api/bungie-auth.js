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
        let decoded;
        
        try {
            decoded = jwt.verify(sessionToken, JWT_SECRET);
        } catch (jwtError) {
            console.error('JWT verification failed:', jwtError.message);
            res.status(401).json({ error: 'Invalid session' });
            return;
        }

        // Check if token is expired
        if (decoded.tokenExpiry && Date.now() > decoded.tokenExpiry) {
            console.log('Session expired for user:', decoded.displayName);
            res.status(401).json({ error: 'Session expired' });
            return;
        }

        // Check if access token exists
        if (!decoded.accessToken) {
            console.error('No access token found in session for user:', decoded.displayName);
            res.status(401).json({ error: 'No access token available' });
            return;
        }

        console.log('Making authenticated request to Bungie API:', `https://www.bungie.net/Platform${endpoint}`);
        console.log('User:', decoded.displayName, 'Token expires:', new Date(decoded.tokenExpiry));
        
        // Make authenticated request to Bungie API
        const response = await fetch(`https://www.bungie.net/Platform${endpoint}`, {
            headers: {
                'X-API-Key': API_KEY,
                'Authorization': `Bearer ${decoded.accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Bungie API authenticated response status:', response.status);

        // Get response data
        const data = await response.json();

        // Log detailed response info for debugging
        if (data.ErrorCode !== 1) {
            console.log('Bungie API authenticated error response:', {
                ErrorCode: data.ErrorCode,
                ErrorStatus: data.ErrorStatus,
                Message: data.Message,
                endpoint: endpoint,
                user: decoded.displayName
            });
            
            // Check for token expiration errors
            if (data.ErrorCode === 99 || data.ErrorStatus === 'WebAuthRequired' || 
                data.Message?.includes('token') || data.Message?.includes('authorization')) {
                console.log('Access token appears to be expired for user:', decoded.displayName);
                res.status(401).json({ 
                    error: 'Access token expired',
                    message: 'Please log in again'
                });
                return;
            }
        } else {
            console.log('Bungie API authenticated success:', {
                endpoint: endpoint,
                user: decoded.displayName,
                hasResponse: !!data.Response,
                responseType: typeof data.Response
            });
        }

        // Return the response data
        res.status(200).json(data);
        
    } catch (error) {
        console.error('Authenticated API request failed:', error);
        console.error('Error details:', {
            message: error.message,
            endpoint: endpoint,
            stack: error.stack
        });
        
        if (error.name === 'JsonWebTokenError') {
            res.status(401).json({ error: 'Invalid session' });
        } else if (error.name === 'TokenExpiredError') {
            res.status(401).json({ error: 'Session expired' });
        } else {
            res.status(500).json({ 
                error: 'Failed to fetch data from Bungie API',
                details: error.message,
                endpoint: endpoint
            });
        }
    }
};