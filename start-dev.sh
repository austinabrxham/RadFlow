#!/bin/bash

# RadFlow Compass Development Startup Script

echo "🚀 Starting RadFlow Compass Development Environment"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "backend" ]; then
    echo "❌ Please run this script from the radflow-compass root directory"
    exit 1
fi

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

if ! command_exists mysql; then
    echo "❌ MySQL is not installed or not in PATH. Please install MySQL."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Check if backend dependencies are installed
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend
    npm install
    cd ..
fi

# Check if frontend dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Check if .env files exist
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Backend .env file not found. Creating from example..."
    if [ -f "backend/.env.example" ]; then
        cp backend/.env.example backend/.env
        echo "📝 Please edit backend/.env with your MySQL credentials"
    else
        echo "❌ No .env.example found. Please create backend/.env manually"
        exit 1
    fi
fi

if [ ! -f ".env" ]; then
    echo "⚠️  Frontend .env file not found. Creating..."
    echo "VITE_API_URL=http://localhost:5000/api" > .env
fi

# Test backend setup
echo "🧪 Testing backend setup..."
cd backend
node test-setup.js
if [ $? -ne 0 ]; then
    echo "❌ Backend setup test failed. Please fix the issues and try again."
    exit 1
fi
cd ..

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "To start the development servers:"
echo "1. Backend: cd backend && npm run dev"
echo "2. Frontend: npm run dev"
echo ""
echo "Or run both in separate terminals:"
echo "Terminal 1: cd backend && npm run dev"
echo "Terminal 2: npm run dev"
echo ""
echo "Demo users:"
echo "- consultant / demo123 (Consultant)"
echo "- resident / demo123 (Resident)"
echo "- physicist / demo123 (Physicist)"
echo "- radiographer / demo123 (Radiographer)"
