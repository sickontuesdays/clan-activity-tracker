// api/bungie.js
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
    
    if (!API_KEY) {
        res.status(500).json({ error: 'API key not configured' });
        return;
    }

    try {
        const response = await fetch(`https://www.bungie.net/Platform${endpoint}`, {
            headers: {
                'X-API-Key': API_KEY,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        res.status(200).json(data);
        
    } catch (error) {
        console.error('API request failed:', error);
        res.status(500).json({ 
            error: 'Failed to fetch data from Bungie API',
            details: error.message 
        });
    }
};