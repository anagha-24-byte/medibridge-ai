@echo off
setlocal
title MediBridge AI - Healthcare Accessibility Assistant
echo ==============================================================================
echo             MediBridge AI - Healthcare Accessibility Assistant
echo ==============================================================================
echo.
echo Starting MediBridge AI native server and backend services...
echo (Port: 8080, User Data: data\medibridge.json)
echo.

where powershell >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo Launching native Windows backend server via PowerShell...
    powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-server.ps1"
    if %ERRORLEVEL% neq 0 (
        echo.
        echo [Notice] Server stopped or encountered an issue.
        echo Opening frontend directly in default browser...
        start "" "%~dp0index.html"
    )
) else (
    echo PowerShell not found in PATH. Opening frontend directly in default browser...
    start "" "%~dp0index.html"
)

echo.
echo MediBridge AI session closed.
pause
