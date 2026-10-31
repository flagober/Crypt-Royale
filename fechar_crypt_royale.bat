@echo off
setlocal
chcp 65001 >nul
title Fechar Crypt Royale
echo Fechamento forcado do Crypt Royale.
echo Uma partida ou alteracao ainda nao salva pode ser perdida.
echo.
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\fechar-crypt-royale.ps1" %*
set "CRYPT_CLOSE_RESULT=%ERRORLEVEL%"
echo.
pause
exit /b %CRYPT_CLOSE_RESULT%
