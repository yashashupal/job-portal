@echo off
title JobPortal Django Backend
echo ====================================================
echo Starting JobPortal Django REST Backend...
echo ====================================================
cd /d "%~dp0"

IF NOT EXIST "venv\Scripts\activate.bat" (
    echo [INFO] Creating Python virtual environment...
    python -m venv venv
    call venv\Scripts\activate.bat
    pip install -r backend\requirements.txt
) ELSE (
    call venv\Scripts\activate.bat
)

cd backend
echo [INFO] Applying database migrations...
python manage.py migrate

echo ====================================================
echo Backend running on http://127.0.0.1:8000/
echo API Endpoints: http://127.0.0.1:8000/api/
echo Admin Panel:   http://127.0.0.1:8000/admin/
echo ====================================================
python manage.py runserver 127.0.0.1:8000
pause
