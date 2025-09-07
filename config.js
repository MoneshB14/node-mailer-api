require('dotenv').config({ path: '.env' });
const { getBestSMTPConfig, getFallbackConfigs } = require('./smtp-configs');

// Validate required environment variables
const requiredEnvVars = ['SMTP_USERNAME', 'SMTP_PASSWORD'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars.join(', '));
    console.error('Please set these variables in your Railway environment or .env file');
    process.exit(1);
}

// Get the best SMTP configuration
let smtpConfig;
try {
    smtpConfig = getBestSMTPConfig();
    console.log('Using primary SMTP configuration');
} catch (error) {
    console.error('Failed to get primary SMTP configuration:', error.message);
    process.exit(1);
}

const config = {
    smtp: smtpConfig,
    fallbackConfigs: getFallbackConfigs(),
    server: {
        port: process.env.PORT || 3000,
        nodeEnv: process.env.NODE_ENV || 'development'
    }
};

module.exports = config; 