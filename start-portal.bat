@echo off
SETLOCAL EnableDelayedExpansion

:: Ayato Studio Portal - Local Server Launcher
:: Copyright (C) 2026 Ayato Studio <https://ayato-studio.ai>

echo ===================================================
echo   AYATO STUDIO PORTAL - STARTUP SEQUENCER
echo ===================================================
echo.

:: Check for node_modules
if not exist "node_modules\" (
    echo [INFO] node_modules not found. Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo [ERROR] npm install failed.
        exit /b 1
    )
)

:: Start the Next.js development server
echo [INFO] Starting Next.js development server at http://localhost:3000...
echo.
call npm run dev
if errorlevel 1 (
    echo [ERROR] npm run dev failed.
    exit /b 1
)

pause
