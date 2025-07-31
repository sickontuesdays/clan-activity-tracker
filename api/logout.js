// api/logout.js
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

    try {
        // Clear the session cookie
        res.setHeader('Set-Cookie', [
            'session=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/'
        ]);

        console.log('User logged out successfully');

        res.status(200).json({ 
            success: true,
            message: 'Logged out successfully'
        });
        
    } catch (error) {
        console.error('Logout failed:', error);
        res.status(500).json({ 
            error: 'Failed to logout',
            details: error.message 
        });
    }
};