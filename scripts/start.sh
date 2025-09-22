#!/bin/bash

# Agent Frontend - Development Server Start Script
# This script starts the development server for the Agent Frontend application

set -e  # Exit on any error

echo "🚀 Starting Agent Frontend Development Server..."
echo "======================================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root directory."
    exit 1
fi

# Check if portal directory exists
if [ ! -d "portal" ]; then
    echo "❌ Error: portal directory not found. This script must be run from the project root."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed. Please install Node.js 18+ and try again."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v)
echo "✅ Node.js version: $NODE_VERSION"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed. Please install npm and try again."
    exit 1
fi

# Check npm version
NPM_VERSION=$(npm -v)
echo "✅ npm version: $NPM_VERSION"

# Check if portal dependencies are installed
if [ ! -d "portal/node_modules" ]; then
    echo "📦 Installing portal dependencies..."
    cd portal
    npm install
    cd ..
    echo "✅ Dependencies installed successfully"
else
    echo "✅ Portal dependencies already installed"
fi

# Check if server is already running on port 5173
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null; then
    echo "⚠️  Warning: Port 5173 is already in use. The development server may already be running."
    echo "   If you want to restart the server, please run ./scripts/stop.sh first."
    echo ""
    echo "   Current process using port 5173:"
    lsof -Pi :5173 -sTCP:LISTEN
    echo ""
    read -p "   Do you want to continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Cancelled by user"
        exit 1
    fi
fi

echo ""
echo "🔧 Starting development server..."
echo "   URL: http://localhost:5173"
echo "   Press Ctrl+C to stop the server"
echo ""

# Change to portal directory and start the development server
cd portal

# Create a trap to handle cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping development server..."
    # Kill any remaining processes
    if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null; then
        echo "   Terminating processes on port 5173..."
        lsof -ti:5173 | xargs kill -9 2>/dev/null || true
    fi
    echo "✅ Server stopped successfully"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start the development server
npm run dev

# If we get here, the server has stopped
cleanup