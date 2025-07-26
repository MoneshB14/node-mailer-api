require('dotenv').config({ path: '.env' });

const config = {
    smtp: {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: false,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD
        }
    },
    server: {
        port: process.env.PORT,
        nodeEnv: process.env.NODE_ENV
    }
};

module.exports = config; 