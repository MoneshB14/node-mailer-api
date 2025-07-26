# Mailer API

A well-structured Node.js mail sending service using Nodemailer with Express.js.

## Features

- ✅ Send emails with HTML content
- ✅ SMTP configuration with Gmail
- ✅ Environment variable support
- ✅ Input validation
- ✅ Error handling
- ✅ Health check endpoint
- ✅ SMTP connection testing
- ✅ Security headers with Helmet
- ✅ CORS support

## Project Structure

```
mailer-api/
├── api-nodemailer.js      # Main API server
├── config.js             # Configuration and environment variables
├── services/
│   └── mailService.js    # Mail service with Nodemailer
├── package.json          # Dependencies and scripts
├── .env                  # Environment variables (create this)
└── README.md            # This file
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Environment File

Create a `.env` file in the root directory with the following content:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=venkateshwaramotors.trl@gmail.com
SMTP_PASSWORD=bgjugfwfijtdvgjd

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 3. Start the Server

```bash
# Production
npm start

# Development (with auto-restart)
npm run dev
```

The server will start on port 3000 (or the port specified in your .env file).

## API Endpoints

### 1. Health Check
- **GET** `/health`
- Returns server status

### 2. Test SMTP Connection
- **GET** `/test-connection`
- Tests the SMTP connection

### 3. Send Email
- **POST** `/send-email`
- Sends an email with HTML content

#### Request Body:
```json
{
  "to": "recipient@example.com",
  "subject": "Email Subject",
  "htmlContent": "<h1>Hello World</h1><p>This is an HTML email.</p>",
  "from": "sender@example.com"  // Optional, defaults to configured SMTP user
}
```

#### Response:
```json
{
  "success": true,
  "message": "Email sent successfully",
  "messageId": "<message-id>"
}
```

## Example Usage

### Using cURL

```bash
curl -X POST http://localhost:3000/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "recipient@example.com",
    "subject": "Test Email",
    "htmlContent": "<h1>Hello!</h1><p>This is a test email sent from the Mailer API.</p>"
  }'
```

### Using JavaScript/Fetch

```javascript
const response = await fetch('http://localhost:3000/send-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    to: 'recipient@example.com',
    subject: 'Test Email',
    htmlContent: '<h1>Hello!</h1><p>This is a test email.</p>'
  })
});

const result = await response.json();
console.log(result);
```

## Security Notes

1. **Environment Variables**: Never commit your `.env` file to version control
2. **Gmail App Passwords**: For Gmail, you may need to use an App Password instead of your regular password
3. **Rate Limiting**: Consider implementing rate limiting for production use
4. **Input Validation**: The API validates email formats and required fields

## Troubleshooting

### Gmail Authentication Issues
If you encounter authentication issues with Gmail:

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password in your `.env` file

### Common Errors
- **535 Authentication failed**: Check your username and password
- **Connection timeout**: Verify your SMTP host and port
- **Invalid email format**: Ensure the recipient email is properly formatted

## Dependencies

- `express`: Web framework
- `nodemailer`: Email sending library
- `dotenv`: Environment variable management
- `cors`: Cross-origin resource sharing
- `helmet`: Security headers

## License

MIT 