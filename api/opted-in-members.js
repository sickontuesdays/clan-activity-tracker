// api/opted-in-members.js
const jwt = require('jsonwebtoken');

// In a real implementation, this would be stored in a database
// For now, we'll use a simple in-memory store that gets reset on deployment
let optedInMembers = new Set();

module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    
    if (!JWT_SECRET) {
        res.status(500).json({ error: 'JWT secret not configured' });
        return;
    }

    if (req.method === 'GET') {
        // Return list of opted-in member IDs
        try {
            res.status(200).json({
                memberIds: Array.from(optedInMembers),
                count: optedInMembers.size
            });
        } catch (error) {
            console.error('Failed to get opted-in members:', error);
            res.status(500).json({ error: 'Failed to get opted-in members' });
        }
        return;
    }

    if (req.method === 'POST') {
        // Add current user to opted-in members
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

            // Add user's Destiny membership IDs to opted-in set
            if (decoded.destinyMemberships && decoded.destinyMemberships.length > 0) {
                decoded.destinyMemberships.forEach(membership => {
                    optedInMembers.add(membership.membershipId);
                });
                
                console.log(`User ${decoded.displayName} opted in with ${decoded.destinyMemberships.length} memberships`);
                
                res.status(200).json({
                    success: true,
                    message: 'Successfully opted in to data sharing',
                    membershipIds: decoded.destinyMemberships.map(m => m.membershipId)
                });
            } else {
                res.status(400).json({ error: 'No Destiny memberships found for user' });
            }
            
        } catch (error) {
            console.error('Failed to opt in user:', error);
            
            if (error.name === 'JsonWebTokenError') {
                res.status(401).json({ error: 'Invalid session' });
            } else {
                res.status(500).json({ error: 'Failed to opt in to data sharing' });
            }
        }
        return;
    }

    res.status(405).json({ error: 'Method not allowed' });
};