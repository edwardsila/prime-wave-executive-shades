@echo off
REM Prime Wave Executive Shades - Installation Script for Windows

setlocal enabledelayedexpansion

echo.
echo ================================
echo Prime Wave Executive Shades
echo Installation Script
echo ================================
echo.

REM Check if Node.js is installed
echo Checking prerequisites...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed. Please install from https://nodejs.org/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js found: %NODE_VERSION%

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo npm is not installed. Please install npm.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo [OK] npm found: %NPM_VERSION%
echo.

REM Install Backend Dependencies
echo Installing Backend Dependencies...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Failed to install backend dependencies
    pause
    exit /b 1
)
echo [OK] Backend dependencies installed
echo.

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file...
    copy .env.example .env
    echo [OK] .env file created. Please edit it with your MongoDB URI
    echo.
) else (
    echo [!] .env file already exists
    echo.
)

cd ..

REM Install Frontend Dependencies
echo Installing Frontend Dependencies...
cd frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Failed to install frontend dependencies
    pause
    exit /b 1
)
echo [OK] Frontend dependencies installed
echo.

cd ..

REM Summary
echo ================================
echo Installation Complete!
echo ================================
echo.
echo Next Steps:
echo 1. Edit backend\.env with your MongoDB URI
echo 2. Start backend: cd backend ^& npm run dev
echo 3. In another terminal, start frontend: cd frontend ^& npm start
echo 4. Visit http://localhost:3000 in your browser
echo.
echo For detailed setup instructions, see SETUP_GUIDE.md
echo.
pause
