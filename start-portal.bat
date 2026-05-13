@echo off
SETLOCAL
TITLE Ayato Studio Portal - Local Server

echo.
echo ============================================================
echo   Ayato Studio Portal - Development Environment
echo ============================================================
echo.

:: Check if node_modules exists
if not exist "node_modules\" (
    echo [INFO] node_modules not found. Installing dependencies...
    call npm install
)

:: Start the Next.js development server
echo [INFO] Starting Next.js development server at http://localhost:3000...
echo.
call npm run dev

echo.
pause
ENDLOCAL
