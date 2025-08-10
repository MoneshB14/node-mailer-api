const mailService = require('../../services/mailService');

exports.handler = async (event, context) => {
    // Enable CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
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
        const { to, subject, htmlContent, from } = JSON.parse(event.body);

        if (!to || !subject || !htmlContent) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Missing required fields: to, subject, and htmlContent are required'
                })
            };
        }

        const result = await mailService.sendEmail(to, subject, htmlContent, from);

        if (result.success) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    message: result.message,
                    messageId: result.messageId
                })
            };
        } else {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: result.error
                })
            };
        }
    } catch (error) {
        console.error('Error in send-email function:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Internal server error'
            })
        };
    }
};
