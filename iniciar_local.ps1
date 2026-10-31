[CmdletBinding()]
param(
    [switch]$CheckOnly
)

$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$preferredPort = 5179
$lastPort = 5199

function Get-ListenerProcess {
    param([int]$Port)

    $connection = Get-NetTCPConnection -State Listen -LocalPort $Port -ErrorAction SilentlyContinue |
        Select-Object -First 1
    if (-not $connection) {
        return $null
    }

    Get-CimInstance Win32_Process -Filter "ProcessId = $($connection.OwningProcess)" -ErrorAction SilentlyContinue
}

function Test-IsThisProjectVite {
    param($Process)

    if (-not $Process -or -not $Process.CommandLine) {
        return $false
    }

    $normalizedRoot = $projectRoot.ToLowerInvariant()
    $commandLine = $Process.CommandLine.ToLowerInvariant()
    return $commandLine.Contains($normalizedRoot) -and $commandLine.Contains('vite')
}

Write-Host '==============================================' -ForegroundColor Cyan
Write-Host 'INICIANDO AMBIENTE LOCAL (CRYPT ROYALE)' -ForegroundColor Cyan
Write-Host '==============================================' -ForegroundColor Cyan
Write-Host ''
Write-Host "Fonte de trabalho: $projectRoot"
Write-Host 'As alterações são espelhadas no Google Drive após cada lote, com integridade verificada.'

Set-Location -LiteralPath $projectRoot

if (-not (Get-Command npm.cmd -ErrorAction SilentlyContinue)) {
    if (Test-Path 'C:\Program Files\nodejs') {
        $env:PATH = "C:\Program Files\nodejs;$env:PATH"
    }
}

if (-not (Get-Command npm.cmd -ErrorAction SilentlyContinue)) {
    throw 'Node.js/npm não foi encontrado no PATH.'
}

$vitePackage = Join-Path $projectRoot 'node_modules\vite\package.json'
$installLock = Join-Path $projectRoot 'node_modules\.package-lock.json'
$sourceLock = Join-Path $projectRoot 'package-lock.json'
$needsInstall = -not (Test-Path -LiteralPath $vitePackage)

if (-not $needsInstall -and (Test-Path -LiteralPath $sourceLock)) {
    $needsInstall = -not (Test-Path -LiteralPath $installLock) -or
        (Get-Item -LiteralPath $sourceLock).LastWriteTimeUtc -gt (Get-Item -LiteralPath $installLock).LastWriteTimeUtc
}

if ($needsInstall) {
    Write-Host ''
    Write-Host 'Preparando dependências locais...' -ForegroundColor Yellow
    & npm.cmd install
    if ($LASTEXITCODE -ne 0) {
        throw 'Falha ao instalar as dependências do projeto.'
    }
}

$port = $preferredPort
$listener = Get-ListenerProcess -Port $port

if (Test-IsThisProjectVite -Process $listener) {
    $url = "http://localhost:$port/"
    Write-Host ''
    Write-Host "O Crypt Royale já está ativo em $url" -ForegroundColor Green
    if (-not $CheckOnly) {
        Start-Process $url
    }
    exit 0
}

while ($listener -and $port -lt $lastPort) {
    $port++
    $listener = Get-ListenerProcess -Port $port
}

if ($listener) {
    throw "As portas $preferredPort a $lastPort estão ocupadas."
}

$url = "http://localhost:$port/"
if ($port -ne $preferredPort) {
    Write-Host ''
    Write-Host "A porta $preferredPort pertence a outro processo. Usando a porta livre $port." -ForegroundColor Yellow
}

Write-Host ''
Write-Host "Servidor: $url" -ForegroundColor Green
Write-Host 'Para encerrar, pressione Ctrl+C.'

if ($CheckOnly) {
    exit 0
}

& npm.cmd run dev -- --host 0.0.0.0 --port $port --strictPort
exit $LASTEXITCODE
