@echo off
REM ================================================================
REM Smart City Complaint Portal - Windows Setup Script
REM ================================================================
REM This batch script automates the setup process for Windows users
REM Author: Smart City Development Team
REM Version: 1.0
REM Date: April 2024

echo.
echo ================================================================
echo Smart City Complaint Portal - Windows Setup Script
echo ================================================================
echo Description: Automated setup for Windows users
echo ================================================================
echo.

REM Check if Python is installed
echo Step 1: Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8 or higher from https://python.org
    pause
    exit /b 1
)
echo Python is available!

REM Check if Node.js is installed
echo Step 2: Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 16 or higher from https://nodejs.org
    pause
    exit /b 1
)
echo Node.js is available!

REM Check if npm is installed
echo Step 3: Checking npm installation...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed or not in PATH
    echo npm should be installed with Node.js
    pause
    exit /b 1
)
echo npm is available!

REM Install dependencies
echo.
echo Step 4: Installing Node.js dependencies...
echo This may take a few minutes...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo Dependencies installed successfully!

REM Create environment file if it doesn't exist
echo.
echo Step 5: Setting up environment variables...
if not exist ".env.local" (
    echo Creating .env.local file...
    (
        echo # Smart City Complaint Portal - Environment Configuration
        echo # ===============================================================
        echo.
        echo # Supabase Configuration ^(Required^)
        echo NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
        echo NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
        echo SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
        echo.
        echo # Application Configuration
        echo NEXT_PUBLIC_APP_URL=http://localhost:3000
        echo NEXT_PUBLIC_APP_NAME=Smart City Complaint Portal
        echo.
        echo # Development Configuration
        echo NODE_ENV=development
        echo PORT=3000
    ) > .env.local
    echo .env.local file created!
    echo IMPORTANT: Please update the Supabase configuration in .env.local
) else (
    echo .env.local file already exists!
)

REM Test build
echo.
echo Step 6: Testing build...
npm run build
if %errorlevel% neq 0 (
    echo WARNING: Build test failed, but you can still run the development server
) else (
    echo Build test passed!
)

echo.
echo ================================================================
echo Setup completed successfully!
echo ================================================================
echo.
echo Next steps:
echo 1. Update .env.local with your Supabase credentials
echo 2. Set up your Supabase database using the SQL scripts in scripts/
echo 3. Start the development server with: npm run dev
echo 4. Access your application at: http://localhost:3000
echo.
echo To start the development server now, press Y
echo To exit, press any other key
choice /c YN /n /m "Start development server? (Y/N)"
if %errorlevel% equ 1 (
    echo.
    echo Starting development server...
    echo Press Ctrl+C to stop the server
    echo.
    npm run dev
) else (
    echo.
    echo Setup completed. Run 'npm run dev' to start the development server.
)

pause
