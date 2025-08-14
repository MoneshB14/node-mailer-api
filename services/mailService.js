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
            const result = await this.transporter.sendMail(mailOptions);

            console.log('Email sent successfully, messageId:', result.messageId);
            return {
                success: true,
                messageId: result.messageId,
                message: 'Email sent successfully'
            };
        } catch (error) {
            console.error('Error sending email:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async verifyConnection() {
        try {
            console.log('Verifying SMTP connection to:', config.smtp.host + ':' + config.smtp.port);
            await this.transporter.verify();
            console.log('SMTP connection verified successfully');
            return true;
        } catch (error) {
            console.error('SMTP connection verification failed:', error);
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