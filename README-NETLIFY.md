# Mailer API - Netlify Functions Deployment

## ⚠️ Important Notes

This project has been converted from a traditional Express.js server to work with **Netlify Functions**. This conversion comes with some limitations:

### Limitations:
- **No persistent SMTP connections** - Each function call creates a new connection
- **Execution time limits** - Functions have timeout limits (10 seconds for free tier)
- **Cold starts** - Functions may take time to warm up
- **Stateless** - No shared state between function calls

### Benefits:
- **Serverless** - No server management needed
- **Auto-scaling** - Handles traffic spikes automatically
- **Global CDN** - Fast response times worldwide
- **Free tier** - Generous free usage limits

## 🚀 Deployment to Netlify

### Prerequisites
1. **Netlify Account** - Sign up at [netlify.com](https://netlify.com)
2. **Git Repository** - Your code should be in a Git repo (GitHub, GitLab, etc.)
3. **Environment Variables** - SMTP credentials configured

### Method 1: Deploy via Netlify UI (Recommended for beginners)

1. **Push your code to Git repository**
2. **Go to [app.netlify.com](https://app.netlify.com)**
3. **Click "New site from Git"**
4. **Choose your repository**
5. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `public`
   - Functions directory: `netlify/functions`
6. **Set environment variables:**
   - `SMTP_HOST` - Your SMTP server host
   - `SMTP_PORT` - SMTP port (usually 587 or 465)
   - `SMTP_USERNAME` - Your SMTP username
   - `SMTP_PASSWORD` - Your SMTP password
7. **Click "Deploy site"**

### Method 2: Deploy via Netlify CLI

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Initialize and deploy:**
   ```bash
   netlify init
   netlify deploy --prod
   ```

4. **Set environment variables:**
   ```bash
   netlify env:set SMTP_HOST your-smtp-host
   netlify env:set SMTP_PORT 587
   netlify env:set SMTP_USERNAME your-username
   netlify env:set SMTP_PASSWORD your-password
   ```

## 🔧 Local Development

### Install dependencies:
```bash
npm install
```

### Run locally with Netlify Functions:
```bash
npm run netlify:dev
```

This will start a local development server that mimics Netlify's environment.

### Test your functions:
- Health check: `http://localhost:8888/.netlify/functions/health-check`
- Send email: `http://localhost:8888/.netlify/functions/send-email`

## 📡 API Endpoints

### Health Check
```
GET /.netlify/functions/health-check
```
Tests SMTP connection and returns status.

### Send Email
```
POST /.netlify/functions/send-email
```
**Request Body:**
```json
{
  "to": "recipient@example.com",
  "subject": "Email Subject",
  "htmlContent": "<h1>Hello</h1><p>Content</p>",
  "from": "sender@example.com" // optional
}
```

## 🌐 Environment Variables

Set these in your Netlify dashboard:

| Variable | Description | Example |
|----------|-------------|---------|
| `SMTP_HOST` | SMTP server hostname | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port number | `587` |
| `SMTP_USERNAME` | SMTP username/email | `your-email@gmail.com` |
| `SMTP_PASSWORD` | SMTP password/app password | `your-app-password` |

## 📁 Project Structure

```
mailer-api/
├── netlify/
│   ├── functions/
│   │   ├── send-email.js      # Email sending function
│   │   └── health-check.js    # Health check function
│   └── netlify.toml          # Netlify configuration
├── public/
│   └── index.html            # Test interface
├── services/
│   └── mailService.js        # Email service logic
├── config.js                 # Configuration
├── package.json              # Dependencies
└── README-NETLIFY.md         # This file
```

## 🧪 Testing

1. **Deploy to Netlify**
2. **Visit your site URL**
3. **Use the web interface to test:**
   - Click "Check API Health" to verify SMTP connection
   - Fill out the email form to send test emails

## 🔍 Troubleshooting

### Common Issues:

1. **SMTP Connection Failed**
   - Check environment variables are set correctly
   - Verify SMTP credentials
   - Check if your SMTP provider allows external connections

2. **Function Timeout**
   - SMTP operations might take longer than expected
   - Consider using a faster SMTP provider
   - Check function execution time in Netlify logs

3. **CORS Issues**
   - Functions include CORS headers
   - If testing from different domain, check CORS settings

### Check Logs:
- Go to your Netlify dashboard
- Click on your site
- Go to "Functions" tab
- Check function execution logs

## 📊 Monitoring

- **Function invocations** - Track in Netlify dashboard
- **Execution times** - Monitor performance
- **Error rates** - Check for issues
- **SMTP success rate** - Monitor email delivery

## 🔒 Security Considerations

- **Environment variables** are encrypted in Netlify
- **CORS** is configured for the functions
- **Input validation** is implemented
- **Rate limiting** may be needed for production use

## 📈 Scaling

- **Free tier**: 125,000 function invocations/month
- **Pro tier**: 1,000,000 function invocations/month
- **Business tier**: Custom limits

## 🆘 Support

If you encounter issues:
1. Check Netlify function logs
2. Verify environment variables
3. Test SMTP connection locally
4. Check Netlify status page
5. Review function timeout settings

---

**Note**: This conversion maintains the core functionality of your email API while adapting it to Netlify's serverless architecture. The main trade-off is that each email send operation will create a new SMTP connection, which may add some latency but provides better scalability and cost-effectiveness.
