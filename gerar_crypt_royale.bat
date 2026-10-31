@echo off
setlocal EnableExtensions
chcp 65001 >nul
cd /d "C:\MonsterCrypt_Ecosystem_V1.0\Crypt-Royale"
title Crypt Royale - Gerador unico Windows, APK e AAB beta
node scripts\gerar-pacote.cjs %*
set "RESULTADO=%ERRORLEVEL%"
if not defined CI pause
exit /b %RESULTADO%
