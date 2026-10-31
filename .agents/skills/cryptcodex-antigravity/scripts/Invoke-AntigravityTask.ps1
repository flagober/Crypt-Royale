[CmdletBinding()]
param(
    [Parameter(Mandatory)][string]$RequestFile,
    [ValidateSet('plan','accept-edits')][string]$Mode='plan',
    [string]$Model='gemini-3.1-pro-high',
    [ValidateSet('low','medium','high','max')][string]$Effort='high',
    [ValidateRange(30,3600)][int]$TimeoutSeconds=600,
    [switch]$CheckOnly,
    [switch]$TextOnly
)
. "$PSScriptRoot\Common.ps1"
$request = (Resolve-Path -LiteralPath $RequestFile).Path
if (-not $request.StartsWith($script:ProjectRoot + '\', [StringComparison]::OrdinalIgnoreCase)) { throw 'O pedido deve estar dentro do projeto local.' }
$prompt = Get-Content -LiteralPath $request -Raw
if ([string]::IsNullOrWhiteSpace($prompt)) { throw 'Pedido vazio.' }
if ($TextOnly -and $Mode -ne 'plan') { throw 'TextOnly exige modo plan, sem edições nem ferramentas.' }
if ($TextOnly) { $prompt = "TAREFA EXCLUSIVAMENTE TEXTUAL: nao use ferramentas, comandos ou arquivos. Responda apenas com texto nesta saida. Nenhuma edicao esta autorizada.`n`n" + $prompt }
$config = Get-Content -LiteralPath $script:AccountsFile -Raw | ConvertFrom-Json
$account = $config.accounts | Where-Object id -EQ $config.selectedAccount
if ($CheckOnly) {
    [pscustomobject]@{request=$request; model=$Model; mode=$Mode; requestedEmail=$account.email; confirmedEmail=$config.confirmedEmail; mirror=$script:MirrorRoot}
    return
}
if ($config.confirmedEmail -ne $account.email) { throw 'Conta não confirmada. Use Manage-AntigravityAccount.ps1 após o login.' }
$models = & agy models 2>&1 | Out-String
if ($LASTEXITCODE -ne 0) { throw 'Login do Antigravity indisponível. Nenhuma tarefa foi enviada.' }
if ($models -notmatch [regex]::Escape($Model)) { throw "Modelo $Model indisponível. Nenhuma tarefa enviada; não há substituição automática." }
$lockFile = Join-Path $script:ProjectRoot '.orchestration\config\runner.lock'
$lock = $null
try {
    $lock = [IO.File]::Open($lockFile,[IO.FileMode]::OpenOrCreate,[IO.FileAccess]::ReadWrite,[IO.FileShare]::None)
} catch { throw 'Outro runner está ativo; não execute tarefas simultâneas neste projeto.' }
try {
    $before = if ($TextOnly) { @{} } else { Get-ProjectSnapshot }
    $backupScript = 'C:\Users\flavi\.codex\skills\flavio-golden-rules\scripts\Backup-Files.ps1'
    if (-not (Test-Path -LiteralPath $backupScript -PathType Leaf)) { throw 'Regra de ouro: mecanismo de backup obrigatório indisponível; nenhuma tarefa enviada.' }
    $backupPaths = if ($TextOnly) { @($request) } else { @($before.Keys | ForEach-Object { Join-Path $script:ProjectRoot $_ }) }
    $preTaskBackup = & $backupScript -Paths $backupPaths -Label antigravity-before-task
    $runId = (Get-Date -Format 'yyyyMMdd-HHmmss-fff') + '-' + [IO.Path]::GetFileNameWithoutExtension($request)
    $runDir = Join-Path $script:ProjectRoot ('.orchestration\runs\' + $runId)
    New-Item -ItemType Directory -Path $runDir | Out-Null
    Copy-Item -LiteralPath $request -Destination (Join-Path $runDir 'request.md')
    $metadata = [ordered]@{ startedAt=(Get-Date).ToString('o'); completedAt=$null; exitCode=$null; resultStatus=$null; backupRoot=$preTaskBackup.backupRoot; account=$account.email; accountConfirmedAt=$config.confirmedAt; model=$Model; effort=$Effort; mode=$Mode; textOnly=[bool]$TextOnly; project=$script:ProjectRoot; promptSource=$request; mirrorStatus='pending'; error=$null; deletedPaths=@() }
    $metadataPath = Join-Path $runDir 'metadata.json'
    $metadata | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $metadataPath -Encoding utf8
    Push-Location -LiteralPath $script:ProjectRoot
    try {
        $cliArgs = @('--print', $prompt, '--model', $Model, '--mode', $Mode, '--output-format', 'json', '--print-timeout', ($TimeoutSeconds.ToString() + 's'))
        if ($Model -notlike 'claude-*') { $cliArgs += @('--effort', $Effort) }
        & agy @cliArgs 1> (Join-Path $runDir 'result.json') 2> (Join-Path $runDir 'stderr.log')
        $metadata.exitCode = $LASTEXITCODE
        if ($metadata.exitCode -eq 0) {
            $result = Get-Content -LiteralPath (Join-Path $runDir 'result.json') -Raw | ConvertFrom-Json
            $metadata.resultStatus = $result.status
            if ($result.status -ne 'SUCCESS') { throw 'O CLI retornou resultado sem status SUCCESS.' }
        }
    } catch { $metadata.error=$_.Exception.Message; $metadata.exitCode=-1 }
    finally { Pop-Location; $metadata.completedAt=(Get-Date).ToString('o') }
    $metadata | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $metadataPath -Encoding utf8
    $after = if ($TextOnly) { @{} } else { Get-ProjectSnapshot }
    $changed = @($after.Keys | Where-Object { -not $before.ContainsKey($_) -or $after[$_] -ne $before[$_] })
    $metadata.deletedPaths = @($before.Keys | Where-Object { -not $after.ContainsKey($_) })
    try {
        if ($changed.Count -gt 0) { & "$PSScriptRoot\Sync-CryptRoyale.ps1" -Paths $changed | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $runDir 'mirror.json') -Encoding utf8 }
        $metadata.mirrorStatus='verified'
    } catch { $metadata.mirrorStatus='failed'; $metadata.error=([string]$metadata.error + ' Mirror: ' + $_.Exception.Message) }
    $metadata | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $metadataPath -Encoding utf8
    try {
        $runRelative = [IO.Path]::GetRelativePath($script:ProjectRoot,$runDir)
        $finalFiles = @(Get-ChildItem -LiteralPath $runDir -File | ForEach-Object { Join-Path $runRelative $_.Name })
        & "$PSScriptRoot\Sync-CryptRoyale.ps1" -Paths $finalFiles | Out-Null
    } catch { $metadata.mirrorStatus='failed'; $metadata.error=([string]$metadata.error + ' Final mirror: ' + $_.Exception.Message); $metadata | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $metadataPath -Encoding utf8 }
    [pscustomobject]$metadata
    if ($metadata.exitCode -ne 0 -or $metadata.mirrorStatus -eq 'failed') { throw "Execução ou espelhamento incompleto. Inspecione $runDir antes de repetir." }
} finally { if ($lock) { $lock.Dispose() } }

