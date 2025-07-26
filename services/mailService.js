const nodemailer = require('nodemailer');
const config = require('../config');

class MailService {
    constructor() {
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

            const result = await this.transporter.sendMail(mailOptions);

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
            await this.transporter.verify();
            return true;
        } catch (error) {
            console.error('SMTP connection verification failed:', error);
            return false;
        }
    }
}

module.exports = new MailService(); 