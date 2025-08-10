#!/bin/bash

echo "🚀 Deploying Mailer API to Netlify..."

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI not found. Installing..."
    npm install -g netlify-cli
fi

# Check if user is logged in
if ! netlify status &> /dev/null; then
    echo "🔐 Please login to Netlify..."
    netlify login
fi

# Build the project
echo "🔨 Building project..."
npm run build

# Deploy to Netlify
echo "📤 Deploying to Netlify..."
netlify deploy --prod

echo "✅ Deployment complete!"
echo "🌐 Your site is now live!"
echo ""
echo "📝 Next steps:"
echo "1. Set environment variables in Netlify dashboard:"
echo "   - SMTP_HOST"
echo "   - SMTP_PORT" 
echo "   - SMTP_USERNAME"
echo "   - SMTP_PASSWORD"
echo "2. Test your API endpoints"
echo "3. Monitor function logs in Netlify dashboard"
