[CmdletBinding()]
param([switch]$Listar)

$ErrorActionPreference = 'Stop'

function Test-RoyaleCommandPath {
    param([string]$CommandLine, [string]$ExpectedPath)
    if (-not $CommandLine -or -not $ExpectedPath) { return $false }
    $pattern = '(?i)(?:^|[\s"''])' + [regex]::Escape($ExpectedPath) + '(?=$|[\s"''])'
    return $CommandLine -match $pattern
}

function Get-RoyaleRuntimeKind {
    param($Process, [string[]]$ProjectRoots, [string]$ProductName)
    if (-not $Process.ExecutablePath) { return $null }
    $exe = [string]$Process.ExecutablePath
    $name = [string]$Process.Name
    if ($name -ieq 'Crypt Royale.exe' -and
        [IO.Path]::GetFileName($exe) -ieq 'Crypt Royale.exe' -and
        $ProductName -ceq 'Crypt Royale') { return 'Jogo instalado' }
    foreach ($root in $ProjectRoots) {
        if ($name -ieq 'electron.exe' -and
            $exe -ieq (Join-Path $root 'node_modules\electron\dist\electron.exe')) {
            return 'Jogo em desenvolvimento'
        }
        if ($name -ieq 'node.exe') {
            foreach ($relative in @('node_modules\vite\bin\vite.js', 'node_modules\electron\cli.js')) {
                if (Test-RoyaleCommandPath $Process.CommandLine (Join-Path $root $relative)) {
                    return 'Servidor/jogo em desenvolvimento'
                }
            }
        }
    }
    return $null
}

function Get-RoyaleRuntimeProcesses {
    param([string[]]$ProjectRoots)
    $processes = @(Get-CimInstance Win32_Process -Filter "Name='Crypt Royale.exe' OR Name='electron.exe' OR Name='node.exe'")
    foreach ($process in $processes) {
        if ($process.ProcessId -eq $PID) { continue }
        $product = ''
        if ($process.Name -ieq 'Crypt Royale.exe' -and $process.ExecutablePath) {
            try { $product = [Diagnostics.FileVersionInfo]::GetVersionInfo($process.ExecutablePath).ProductName }
            catch { continue }
        }
        $kind = Get-RoyaleRuntimeKind $process $ProjectRoots $product
        if ($kind) {
            [pscustomobject]@{ ProcessId=$process.ProcessId; CreationDate=$process.CreationDate;
                ExecutablePath=$process.ExecutablePath; CommandLine=$process.CommandLine; Tipo=$kind }
        }
    }
}

function Invoke-CloseRoyale {
    param([switch]$ListOnly)
    $roots = @('C:\MonsterCrypt_Ecosystem_V1.0\Crypt-Royale', 'G:\Meu Drive\MonsterCrypt_Ecosystem_V1.0\Crypt-Royale')
    $ownRoot = Split-Path -Parent $PSScriptRoot
    if ($roots -notcontains $ownRoot) { $roots += $ownRoot }
    $targets = @(Get-RoyaleRuntimeProcesses $roots)
    if (-not $targets.Count) { Write-Host 'Nenhum processo do Crypt Royale encontrado.'; return 0 }
    $targets | Select-Object ProcessId,Tipo,ExecutablePath | Format-Table -AutoSize | Out-Host
    if ($ListOnly) { Write-Host 'Somente consulta: nenhum processo foi encerrado.'; return 0 }
    $failed = 0
    foreach ($target in $targets) {
        try {
            # Recheck identity immediately before stopping: Windows can reuse a PID.
            $current = Get-CimInstance Win32_Process -Filter "ProcessId=$($target.ProcessId)" -ErrorAction Stop
            if (-not $current) { continue }
            if ($current.CreationDate -ne $target.CreationDate -or
                $current.ExecutablePath -ine $target.ExecutablePath -or
                $current.CommandLine -cne $target.CommandLine) {
                Write-Warning "Processo $($target.ProcessId) mudou de identidade; preservado."
                $failed++
                continue
            }
            Stop-Process -Id $target.ProcessId -Force -ErrorAction Stop
            Write-Host "Encerrado: $($target.Tipo) (PID $($target.ProcessId))."
        } catch {
            if (Get-Process -Id $target.ProcessId -ErrorAction SilentlyContinue) {
                $failed++
                Write-Warning "Nao foi possivel encerrar PID $($target.ProcessId): $($_.Exception.Message)"
            }
        }
    }
    $remaining = @(Get-RoyaleRuntimeProcesses $roots)
    if ($remaining.Count) { Write-Warning 'Ainda ha processos do Crypt Royale ativos. Confira as permissoes do Windows.'; return 1 }
    if ($failed) { return 1 }
    Write-Host 'Crypt Royale fechado. Outros aplicativos e arquivos foram preservados.'
    return 0
}

if ($MyInvocation.InvocationName -ne '.') {
    try { exit (Invoke-CloseRoyale -ListOnly:$Listar) }
    catch { Write-Error $_; exit 1 }
}
