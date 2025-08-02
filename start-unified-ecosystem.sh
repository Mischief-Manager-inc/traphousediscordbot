#!/bin/bash

# TiltCheck Unified Ecosystem Deployment Script
# Starts the complete integrated ecosystem server

echo "🚀 ================================="
echo "🎯 TiltCheck Ecosystem Deployment"
echo "🚀 ================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are available"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install express cors path
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

# Check if unified server file exists
if [ ! -f "unified-ecosystem-server.js" ]; then
    echo "❌ unified-ecosystem-server.js not found!"
    echo "Please ensure the unified server file is present."
    exit 1
fi

# Check if public directory and landing pages exist
if [ ! -d "public" ]; then
    echo "⚠️ Warning: public directory not found"
    echo "Creating public directory..."
    mkdir -p public
fi

if [ ! -f "public/compliance.html" ]; then
    echo "⚠️ Warning: compliance.html not found in public directory"
fi

if [ ! -f "public/portfolio.html" ]; then
    echo "⚠️ Warning: portfolio.html not found in public directory"
fi

if [ ! -f "public/support.html" ]; then
    echo "⚠️ Warning: support.html not found in public directory"
fi

echo "🚀 ================================="
echo "🌐 Starting TiltCheck Unified Ecosystem Server"
echo "🚀 ================================="

# Set environment variables
export PORT=4001
export NODE_ENV=production

# Function to handle graceful shutdown
cleanup() {
    echo ""
    echo "🛑 Shutting down TiltCheck Ecosystem Server..."
    exit 0
}

# Trap SIGINT and SIGTERM
trap cleanup SIGINT SIGTERM

echo "📍 Server will be available at:"
echo "   🌐 Main Site: http://localhost:4001"
echo "   📊 Health Check: http://localhost:4001/api/health"
echo "   🏠 Ecosystem: http://localhost:4001/ecosystem"
echo "   📋 Compliance: http://localhost:4001/compliance"
echo "   💼 Portfolio: http://localhost:4001/portfolio"
echo "   🆘 Support: http://localhost:4001/support"
echo ""
echo "🚀 ================================="
echo "🎮 Live Applications:"
echo "   🏠 Main Hub: https://tiltcheckecosystem.created.app"
echo "   🎮 Degens Bot: https://tiltcheckecosystem.created.app/degens-bot"
echo "   💰 JustTheTip: https://tiltcheckecosystem.created.app/justthetip"
echo "   ⏰ CollectClock: https://jmenichole.github.io/CollectClock/"
echo ""
echo "💬 Community: https://discord.gg/K3Md6aZx"
echo "👤 Developer: jmenichole - Mischief Manager"
echo "🚀 ================================="
echo ""
echo "🎯 Starting server... (Press Ctrl+C to stop)"
echo ""

# Start the unified ecosystem server
node unified-ecosystem-server.js
