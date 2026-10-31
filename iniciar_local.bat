@echo off
setlocal
chcp 65001 >nul
title Crypt Royale - Ambiente Local
if exist "C:\Program Files\nodejs" (
    set "PATH=C:\Program Files\nodejs;%PATH%"
)

PowerShell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0iniciar_local.ps1"
set "CRYPT_ROYALE_EXIT=%ERRORLEVEL%"

if not "%CRYPT_ROYALE_EXIT%"=="0" (
    echo.
    echo O Crypt Royale encerrou com erro. Confira a mensagem acima.
    pause
)

exit /b %CRYPT_ROYALE_EXIT%
