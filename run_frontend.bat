@echo off
title JobPortal React Frontend
echo ====================================================
echo Starting JobPortal React Frontend...
echo ====================================================
cd /d "%~dp0\frontend"

IF NOT EXIST "node_modules" (
    echo [INFO] Installing frontend packages...
    call npm install
)

echo ====================================================
echo Frontend dev server running on http://localhost:5173
echo ====================================================
call npm run dev
pause
