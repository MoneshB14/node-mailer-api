const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config');
const mailService = require('./services/mailService');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.post('/send-email', async (req, res) => {
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
});

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

// For Vercel deployment, export the app directly
// For local development, start the server
if (process.env.NODE_ENV !== 'production') {
    const PORT = config.server.port || 3000;
    app.listen(PORT, () => {
        console.log(`Mailer API server running on port ${PORT}`);
        mailService.verifyConnection()
            .then(isConnected => {
                if (isConnected) {
                    console.log('SMTP connection verified successfully');
                } else {
                    console.log('SMTP connection failed');
                }
            })
            .catch(error => {
                console.log('Error verifying SMTP connection:', error.message);
            });
    });
}

module.exports = app;
