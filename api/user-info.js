// api/user-info.js
module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Missing or invalid authorization header' });
        return;
    }

    const accessToken = authHeader.substring(7); // Remove 'Bearer ' prefix
    const API_KEY = process.env.BUNGIE_API_KEY;
    
    if (!API_KEY) {
        res.status(500).json({ error: 'API key not configured' });
        return;
    }

    try {
        console.log('Getting user info from Bungie API...');
        
        // Get current user's membership data
        const membershipResponse = await fetch('https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/', {
            headers: {
                'X-API-Key': API_KEY,
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!membershipResponse.ok) {
            const errorText = await membershipResponse.text();
            console.error('Membership response error:', membershipResponse.status, errorText);
            throw new Error(`Failed to get membership data: ${membershipResponse.status} - ${errorText}`);
        }

        const membershipData = await membershipResponse.json();
        
        if (membershipData.ErrorCode !== 1) {
            throw new Error(`Bungie API Error: ${membershipData.Message}`);
        }

        console.log('User info retrieved successfully');

        // Extract useful information
        const userInfo = {
            bungieNetUser: membershipData.Response.bungieNetUser,
            destinyMemberships: membershipData.Response.destinyMemberships,
            primaryMembershipId: membershipData.Response.primaryMembershipId,
            timestamp: new Date().toISOString()
        };

        res.status(200).json(userInfo);
        
    } catch (error) {
        console.error('Failed to get user info:', error);
        res.status(500).json({ 
            error: 'Failed to get user information',
            details: error.message 
        });
    }
};