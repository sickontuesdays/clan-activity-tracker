// api/check-session.js
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

    const JWT_SECRET = process.env.JWT_SECRET;
    
    if (!JWT_SECRET) {
        res.status(500).json({ error: 'JWT secret not configured' });
        return;
    }

    try {
        // Get session cookie
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

        // Verify JWT token
        const decoded = jwt.verify(sessionToken, JWT_SECRET);

        // Check if token is expired
        if (decoded.tokenExpiry && Date.now() > decoded.tokenExpiry) {
            res.status(401).json({ error: 'Session expired' });
            return;
        }

        // Return user session data
        res.status(200).json({
            userId: decoded.userId,
            displayName: decoded.displayName,
            destinyMemberships: decoded.destinyMemberships,
            createdAt: decoded.createdAt
        });
        
    } catch (error) {
        console.error('Session check failed:', error);
        res.status(401).json({ error: 'Invalid session' });
    }
};