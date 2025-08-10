const mailService = require('../../services/mailService');

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
    };

    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // Only allow GET requests
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Method not allowed'
            })
        };
    }

    try {
        const isConnected = await mailService.verifyConnection();
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Health check completed',
                smtp: {
                    connected: isConnected,
                    timestamp: new Date().toISOString()
                }
            })
        };
    } catch (error) {
        console.error('Error in health check:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Health check failed',
                details: error.message
            })
        };
    }
};
