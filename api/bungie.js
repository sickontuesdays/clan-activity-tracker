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
        console.log('Making request to Bungie API:', `https://www.bungie.net/Platform${endpoint}`);
        
        const response = await fetch(`https://www.bungie.net/Platform${endpoint}`, {
            headers: {
                'X-API-Key': API_KEY,
                'Content-Type': 'application/json'
            }
        });

        console.log('Bungie API response status:', response.status);

        // Get response data
        const data = await response.json();
        
        // Log detailed response info for debugging
        if (data.ErrorCode !== 1) {
            console.log('Bungie API error response:', {
                ErrorCode: data.ErrorCode,
                ErrorStatus: data.ErrorStatus,
                Message: data.Message,
                endpoint: endpoint
            });
        } else {
            console.log('Bungie API success:', {
                endpoint: endpoint,
                hasResponse: !!data.Response,
                responseType: typeof data.Response
            });
        }

        // Always return the Bungie response - let client handle errors
        // This allows the client to properly handle different types of responses
        res.status(200).json(data);
        
    } catch (error) {
        console.error('API request failed:', error);
        console.error('Error details:', {
            message: error.message,
            endpoint: endpoint,
            stack: error.stack
        });
        
        res.status(500).json({ 
            error: 'Failed to fetch data from Bungie API',
            details: error.message,
            endpoint: endpoint
        });
    }
};