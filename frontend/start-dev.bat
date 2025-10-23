@echo off
echo 🚀 Starting RadFlow Compass Development Environment
echo ==================================================

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Please run this script from the radflow-compass root directory
    pause
    exit /b 1
)

if not exist "backend" (
    echo ❌ Backend directory not found
    pause
    exit /b 1
)

REM Check prerequisites
echo 📋 Checking prerequisites...

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v16 or higher.
    pause
    exit /b 1
)

where mysql >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ MySQL is not installed or not in PATH. Please install MySQL.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Check if backend dependencies are installed
if not exist "backend\node_modules" (
    echo 📦 Installing backend dependencies...
    cd backend
    call npm install
    cd ..
)

REM Check if frontend dependencies are installed
if not exist "node_modules" (
    echo 📦 Installing frontend dependencies...
    call npm install
)

REM Check if .env files exist
if not exist "backend\.env" (
    echo ⚠️  Backend .env file not found. Please create it manually.
    echo 📝 Required content:
    echo DB_HOST=localhost
    echo DB_PORT=3306
    echo DB_USER=root
    echo DB_PASSWORD=your_mysql_password
    echo DB_NAME=radflow_compass
    echo PORT=5000
    echo NODE_ENV=development
    echo JWT_SECRET=radflow_compass_super_secret_jwt_key_2025
    echo JWT_EXPIRES_IN=24h
    echo FRONTEND_URL=http://localhost:5173
    echo.
    echo Please create backend\.env with your MySQL credentials
    pause
    exit /b 1
)

if not exist ".env" (
    echo ⚠️  Frontend .env file not found. Creating...
    echo VITE_API_URL=http://localhost:5000/api > .env
)

echo.
echo 🎉 Setup completed successfully!
echo.
echo To start the development servers:
echo 1. Backend: cd backend ^&^& npm run dev
echo 2. Frontend: npm run dev
echo.
echo Or run both in separate command prompts:
echo Command Prompt 1: cd backend ^&^& npm run dev
echo Command Prompt 2: npm run dev
echo.
echo Demo users:
echo - consultant / demo123 (Consultant)
echo - resident / demo123 (Resident)
echo - physicist / demo123 (Physicist)
echo - radiographer / demo123 (Radiographer)
echo.
pause
