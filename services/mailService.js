const nodemailer = require('nodemailer');
const config = require('../config');

class MailService {
    constructor() {
        console.log('Initializing SMTP transporter with config:', {
            host: config.smtp.host,
            port: config.smtp.port,
            secure: config.smtp.secure,
            user: config.smtp.auth.user
        });
        
        this.transporter = nodemailer.createTransport(config.smtp);
        this.fallbackConfigs = config.fallbackConfigs || [];
        this.currentConfigIndex = 0;
        this.maxRetries = 3;
        this.retryDelay = 5000; // 5 seconds
    }

    // Method to switch to fallback configuration
    switchToFallback() {
        if (this.currentConfigIndex < this.fallbackConfigs.length) {
            const fallbackConfig = this.fallbackConfigs[this.currentConfigIndex];
            console.log('Switching to fallback SMTP configuration:', {
                host: fallbackConfig.host,
                port: fallbackConfig.port,
                secure: fallbackConfig.secure,
                user: fallbackConfig.auth.user
            });
            
            this.transporter = nodemailer.createTransport(fallbackConfig);
            this.currentConfigIndex++;
            return true;
        }
        return false;
    }

    // Retry mechanism for failed operations with fallback support
    async retryOperation(operation, maxRetries = this.maxRetries) {
        let lastError;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await operation();
            } catch (error) {
                lastError = error;
                console.log(`Attempt ${attempt}/${maxRetries} failed:`, error.message);
                
                // If this is a connection timeout or similar error, try switching to fallback
                if (error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
                    if (this.switchToFallback()) {
                        console.log('Switched to fallback configuration, retrying...');
                        continue; // Retry immediately with new configuration
                    }
                }
                
                if (attempt === maxRetries) {
                    break;
                }
                
                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
            }
        }
        
        throw lastError;
    }

    // Enhanced connection verification with retry
    async verifyConnectionWithRetry() {
        return this.retryOperation(async () => {
            console.log('Verifying SMTP connection to:', config.smtp.host + ':' + config.smtp.port);
            await this.transporter.verify();
            console.log('SMTP connection verified successfully');
            return true;
        });
    }

    async sendEmail(to, subject, htmlContent, from = null) {
        try {
            if (!to || !subject || !htmlContent) {
                throw new Error('Missing required parameters: to, subject, and htmlContent are required');
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(to)) {
                throw new Error('Invalid email address format');
            }

            const mailOptions = {
                from: from || config.smtp.auth.user,
                to: to,
                subject: subject,
                html: htmlContent
            };

            console.log('Attempting to send email to:', to);

            // Use retry mechanism for sending email
            const result = await this.retryOperation(async () => {
                return await this.transporter.sendMail(mailOptions);
            });

            console.log('Email sent successfully, messageId:', result.messageId);
            return {
                success: true,
                messageId: result.messageId,
                message: 'Email sent successfully'
            };
        } catch (error) {
            console.error('Error sending email after retries:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async sendEmailWithAttachments(to, subject, htmlContent, attachments, from = null) {
        try {
            if (!to || !subject || !htmlContent) {
                throw new Error('Missing required parameters: to, subject, and htmlContent are required');
            }

            if (!attachments || !Array.isArray(attachments) || attachments.length === 0) {
                throw new Error('Attachments array is required and must not be empty');
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(to)) {
                throw new Error('Invalid email address format');
            }

            // Validate attachments structure
            for (let i = 0; i < attachments.length; i++) {
                const attachment = attachments[i];
                if (!attachment.filename || !attachment.content) {
                    throw new Error(`Invalid attachment at index ${i}: filename and content are required`);
                }
            }

            const mailOptions = {
                from: from || config.smtp.auth.user,
                to: to,
                subject: subject,
                html: htmlContent,
                attachments: attachments
            };

            console.log('Attempting to send email with attachments to:', to);
            console.log('Number of attachments:', attachments.length);
            const result = await this.transporter.sendMail(mailOptions);

            console.log('Email with attachments sent successfully, messageId:', result.messageId);
            return {
                success: true,
                messageId: result.messageId,
                message: 'Email with attachments sent successfully',
                attachmentsCount: attachments.length
            };
        } catch (error) {
            console.error('Error sending email with attachments:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async sendEmailWithFileUploads(to, subject, htmlContent, files, from = null) {
        try {
            if (!to || !subject || !htmlContent) {
                throw new Error('Missing required parameters: to, subject, and htmlContent are required');
            }

            if (!files || !Array.isArray(files) || files.length === 0) {
                throw new Error('Files array is required and must not be empty');
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(to)) {
                throw new Error('Invalid email address format');
            }

            // Process uploaded files for nodemailer
            const attachments = files.map((file, index) => {
                if (!file.originalname || !file.buffer) {
                    throw new Error(`Invalid file at index ${index}: originalname and buffer are required`);
                }

                return {
                    filename: file.originalname,
                    content: file.buffer,
                    contentType: file.mimetype || 'application/octet-stream'
                };
            });

            const mailOptions = {
                from: from || config.smtp.auth.user,
                to: to,
                subject: subject,
                html: htmlContent,
                attachments: attachments
            };

            console.log('Attempting to send email with file uploads to:', to);
            console.log('Number of files:', files.length);
            console.log('Files:', files.map(f => ({ name: f.originalname, size: f.size, type: f.mimetype })));

            const result = await this.transporter.sendMail(mailOptions);

            console.log('Email with file uploads sent successfully, messageId:', result.messageId);
            return {
                success: true,
                messageId: result.messageId,
                message: 'Email with file uploads sent successfully',
                filesCount: files.length,
                filesInfo: files.map(f => ({ name: f.originalname, size: f.size, type: f.mimetype }))
            };
        } catch (error) {
            console.error('Error sending email with file uploads:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async verifyConnection() {
        try {
            return await this.verifyConnectionWithRetry();
        } catch (error) {
            console.error('SMTP connection verification failed after retries:', error);
            console.error('SMTP Config:', {
                host: config.smtp.host,
                port: config.smtp.port,
                secure: config.smtp.secure,
                user: config.smtp.auth.user
            });
            return false;
        }
    }
}

module.exports = new MailService(); 