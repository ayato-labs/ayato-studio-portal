@echo off
setlocal
cd /d "%~dp0"

echo [Ayato Intelligence HQ] Starting Local Admin Dashboard...
echo [Ayato Intelligence HQ] Access at: http://localhost:3000

:: Check if node_modules exists, if not, suggest npm install
if not exist "node_modules\" (
    echo [WARNING] node_modules not found. Running npm install...
    call npm install
)

:: Start the Next.js development server
call npm run dev

pause
