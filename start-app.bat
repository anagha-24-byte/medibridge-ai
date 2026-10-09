@echo off
title Launching MediBridge AI...
echo ========================================================
echo               MediBridge AI - Launching
echo       Healthcare Accessibility & Literacy Assistant
echo ========================================================
echo.
echo Opening MediBridge AI in your default web browser...
start "" "%~dp0index.html"
echo.
echo App launched successfully! You can keep this window closed.
timeout /t 3 >nul
exit
