#!/bin/bash

# Production Build Script for Fitflix Admin Dashboard
set -e

echo "🚀 Starting production build for Fitflix Admin Dashboard..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist
rm -rf node_modules

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Set production environment
export NODE_ENV=production
export VITE_API_BASE_URL=https://fitflix-backend-api.onrender.com
export VITE_ADMIN_DASHBOARD_URL=https://fitflix-admin-dashboard.onrender.com
export VITE_WEBSITE_URL=https://fitflix-website.onrender.com
export VITE_ENABLE_ANALYTICS=true
export VITE_ENABLE_ERROR_TRACKING=true
export VITE_ENABLE_REAL_TIME_UPDATES=true

# Build the application
echo "🔨 Building application..."
npm run build:prod

# Verify build output
if [ ! -d "dist" ]; then
    echo "❌ Error: Build failed - dist directory not found"
    exit 1
fi

# Check build size
BUILD_SIZE=$(du -sh dist | cut -f1)
echo "📊 Build size: $BUILD_SIZE"

# List build contents
echo "📁 Build contents:"
ls -la dist/

# Run build validation
echo "✅ Build validation..."
if [ -f "dist/index.html" ]; then
    echo "✅ index.html found"
else
    echo "❌ index.html missing"
    exit 1
fi

if [ -f "dist/assets" ]; then
    echo "✅ assets directory found"
else
    echo "❌ assets directory missing"
    exit 1
fi

echo "🎉 Production build completed successfully!"
echo "📁 Build output: dist/"
echo "🌐 Ready for deployment to Render or other hosting platforms"
