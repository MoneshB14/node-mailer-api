const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const multer = require('multer');
const config = require('./config');
const mailService = require('./services/mailService');

const app = express();

// Configure multer for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit per file
        files: 10 // Maximum 10 files
    },
    fileFilter: (req, file, cb) => {
        // Allow all file types for now, you can add restrictions here
        cb(null, true);
    }
});

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

app.post('/send-email-with-attachments', async (req, res) => {
    try {
        const { to, subject, htmlContent, attachments, from } = req.body;

        if (!to || !subject || !htmlContent || !attachments) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: to, subject, htmlContent, and attachments are required'
            });
        }

        if (!Array.isArray(attachments) || attachments.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Attachments must be a non-empty array'
            });
        }

        const result = await mailService.sendEmailWithAttachments(to, subject, htmlContent, attachments, from);

        if (result.success) {
            res.json({
                success: true,
                message: result.message,
                messageId: result.messageId,
                attachmentsCount: result.attachmentsCount
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error
            });
        }
    } catch (error) {
        console.error('Error in send-email-with-attachments endpoint:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

app.post('/send-email-with-files', upload.array('files', 10), async (req, res) => {
    try {
        const { to, subject, htmlContent, from } = req.body;
        const files = req.files;

        if (!to || !subject || !htmlContent) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: to, subject, and htmlContent are required'
            });
        }

        if (!files || files.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'At least one file is required'
            });
        }

        const result = await mailService.sendEmailWithFileUploads(to, subject, htmlContent, files, from);

        if (result.success) {
            res.json({
                success: true,
                message: result.message,
                messageId: result.messageId,
                filesCount: result.filesCount,
                filesInfo: result.filesInfo
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error
            });
        }
    } catch (error) {
        console.error('Error in send-email-with-files endpoint:', error);
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

const PORT = config.server.port;
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

module.exports = app;
