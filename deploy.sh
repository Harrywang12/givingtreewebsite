#!/bin/bash

# 🚀 Giving Tree Website - Vercel Deployment Script
# This script helps you deploy your website to Vercel

echo "🌳 The Giving Tree Website - Vercel Deployment"
echo "=============================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing now..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please log in to Vercel..."
    vercel login
fi

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "🎉 Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Set up your environment variables in Vercel dashboard"
echo "2. Configure your database connection"
echo "3. Set up Redis for production"
echo "4. Test your deployed application"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
