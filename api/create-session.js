// api/create-session.js
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

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const { tokenData, userInfo } = req.body;

    if (!tokenData || !userInfo) {
        res.status(400).json({ error: 'Missing token data or user info' });
        return;
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    
    if (!JWT_SECRET) {
        res.status(500).json({ error: 'JWT secret not configured' });
        return;
    }

    try {
        console.log('Creating user session...');
        
        // Create session payload
        const sessionPayload = {
            userId: userInfo.bungieNetUser.membershipId,
            displayName: userInfo.bungieNetUser.displayName,
            destinyMemberships: userInfo.destinyMemberships,
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token,
            tokenExpiry: Date.now() + (tokenData.expires_in * 1000),
            createdAt: Date.now()
        };

        // Sign JWT token
        const sessionToken = jwt.sign(sessionPayload, JWT_SECRET, { 
            expiresIn: '7d' // Session expires in 7 days
        });

        // Set secure HTTP-only cookie
        res.setHeader('Set-Cookie', [
            `session=${sessionToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}; Path=/`
        ]);

        console.log('Session created successfully for user:', userInfo.bungieNetUser.displayName);

        res.status(200).json({ 
            success: true,
            user: {
                displayName: userInfo.bungieNetUser.displayName,
                membershipId: userInfo.bungieNetUser.membershipId,
                destinyMemberships: userInfo.destinyMemberships
            }
        });
        
    } catch (error) {
        console.error('Failed to create session:', error);
        res.status(500).json({ 
            error: 'Failed to create session',
            details: error.message 
        });
    }
};