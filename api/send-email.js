const config = require('../config');
const mailService = require('../services/mailService');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed. Only POST requests are supported.'
        });
    }

    try {
        const { to, subject, htmlContent, from } = req.body;

        if (!to || !subject || !htmlContent) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: to, subject, and htmlContent are required'
            });
        }

        const result = await mailService.sendEmail(to, subject, htmlContent, from);

        if (result.success) {
            res.json({
                success: true,
                message: result.message,
                messageId: result.messageId
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error
            });
        }
    } catch (error) {
        console.error('Error in send-email endpoint:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}; 