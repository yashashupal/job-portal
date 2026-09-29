@echo off
title JobPortal Launcher
echo ====================================================
echo Starting Full Stack JobPortal (Django + React)...
echo ====================================================

start "JobPortal Django Backend" cmd /c "%~dp0run_backend.bat"
timeout /t 3 /nobreak >nul

start "JobPortal React Frontend" cmd /c "%~dp0run_frontend.bat"
timeout /t 3 /nobreak >nul

echo ====================================================
echo Opening browser to http://localhost:5173
echo ====================================================
start http://localhost:5173
