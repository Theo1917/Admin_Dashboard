#!/bin/bash

echo "🚀 Building Fitflix Admin Dashboard for production..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build for production
echo "🔨 Building for production..."
npm run build

# Check if build was successful
if [ -d "dist" ]; then
    echo "✅ Build successful!"
    echo "📁 Build output: dist/"
    echo "🌐 You can now deploy the contents of the dist/ folder"
else
    echo "❌ Build failed!"
    exit 1
fi
