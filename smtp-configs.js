// Alternative SMTP configurations for different environments
const smtpConfigs = {
    // Gmail configuration optimized for cloud environments
    gmail: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD
        },
        // Enhanced settings for cloud deployment
        connectionTimeout: 120000,
        greetingTimeout: 60000,
        socketTimeout: 120000,
        pool: true,
        maxConnections: 5,
        maxMessages: 100,
        rateDelta: 20000,
        rateLimit: 5,
        tls: {
            rejectUnauthorized: false,
            ciphers: 'SSLv3'
        },
        debug: process.env.NODE_ENV === 'development',
        logger: process.env.NODE_ENV === 'development'
    },

    // Alternative Gmail configuration with different port
    gmailAlt: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD
        },
        connectionTimeout: 120000,
        greetingTimeout: 60000,
        socketTimeout: 120000,
        pool: true,
        maxConnections: 3,
        maxMessages: 50,
        tls: {
            rejectUnauthorized: false
        }
    },

    // SendGrid configuration (if you want to use SendGrid as fallback)
    sendgrid: {
        host: 'smtp.sendgrid.net',
        port: 587,
        secure: false,
        auth: {
            user: 'apikey',
            pass: process.env.SENDGRID_API_KEY
        },
        connectionTimeout: 120000,
        greetingTimeout: 60000,
        socketTimeout: 120000
    },

    // Mailgun configuration (if you want to use Mailgun as fallback)
    mailgun: {
        host: 'smtp.mailgun.org',
        port: 587,
        secure: false,
        auth: {
            user: process.env.MAILGUN_SMTP_USERNAME,
            pass: process.env.MAILGUN_SMTP_PASSWORD
        },
        connectionTimeout: 120000,
        greetingTimeout: 60000,
        socketTimeout: 120000
    }
};

// Function to get the best available SMTP configuration
function getBestSMTPConfig() {
    const primaryConfig = smtpConfigs.gmail;
    
    // Check if we have required environment variables
    if (!process.env.SMTP_USERNAME || !process.env.SMTP_PASSWORD) {
        throw new Error('SMTP_USERNAME and SMTP_PASSWORD environment variables are required');
    }

    return primaryConfig;
}

// Function to get fallback configurations
function getFallbackConfigs() {
    const fallbacks = [];
    
    // Add Gmail alternative if credentials are available
    if (process.env.SMTP_USERNAME && process.env.SMTP_PASSWORD) {
        fallbacks.push(smtpConfigs.gmailAlt);
    }
    
    // Add SendGrid if API key is available
    if (process.env.SENDGRID_API_KEY) {
        fallbacks.push(smtpConfigs.sendgrid);
    }
    
    // Add Mailgun if credentials are available
    if (process.env.MAILGUN_SMTP_USERNAME && process.env.MAILGUN_SMTP_PASSWORD) {
        fallbacks.push(smtpConfigs.mailgun);
    }
    
    return fallbacks;
}

module.exports = {
    smtpConfigs,
    getBestSMTPConfig,
    getFallbackConfigs
};
