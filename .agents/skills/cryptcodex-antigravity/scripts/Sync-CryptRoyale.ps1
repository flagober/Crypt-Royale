[CmdletBinding()]
param([Parameter(Mandatory)][string[]]$Paths, [switch]$CheckOnly)
. "$PSScriptRoot\Common.ps1"
if (-not (Test-Path -LiteralPath $script:MirrorRoot -PathType Container)) { throw "Espelho indisponível: $script:MirrorRoot. Os arquivos permanecem no C:." }
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss-fff'
$results = @()
foreach ($relative in ($Paths | Sort-Object -Unique)) {
    if ([IO.Path]::IsPathRooted($relative) -or $relative -match '(^|[\\/])\.\.([\\/]|$)') { throw "Caminho relativo inválido: $relative" }
    if (Test-ExcludedPath $relative) { throw "Arquivo excluído do espelhamento: $relative" }
    $source = [IO.Path]::GetFullPath((Join-Path $script:ProjectRoot $relative))
    $target = [IO.Path]::GetFullPath((Join-Path $script:MirrorRoot $relative))
    if (-not $source.StartsWith($script:ProjectRoot + '\', [StringComparison]::OrdinalIgnoreCase) -or
        -not $target.StartsWith($script:MirrorRoot + '\', [StringComparison]::OrdinalIgnoreCase)) { throw 'Caminho fora das raízes autorizadas.' }
    if (-not (Test-Path -LiteralPath $source -PathType Leaf)) { throw "Arquivo fonte ausente: $relative. Nenhuma exclusão automática no G:." }
    # Não siga junctions/symlinks em nenhum componente da origem ou destino.
    foreach ($candidate in @($source, $target)) {
        $cursor = $candidate
        while ($cursor -and $cursor -ne $script:ProjectRoot -and $cursor -ne $script:MirrorRoot) {
            if (Test-Path -LiteralPath $cursor) {
                if ((Get-Item -LiteralPath $cursor -Force).Attributes -band [IO.FileAttributes]::ReparsePoint) { throw "Link não permitido: $cursor" }
            }
            $cursor = Split-Path -Parent $cursor
        }
    }
    $hash = (Get-FileHash -LiteralPath $source -Algorithm SHA256).Hash
    $exists = Test-Path -LiteralPath $target -PathType Leaf
    if ($exists -and (Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash -eq $hash) {
        $results += [pscustomobject]@{ path=$relative; status='unchanged'; sha256=$hash }; continue
    }
    if ($CheckOnly) { $results += [pscustomobject]@{ path=$relative; status='would-copy'; sha256=$hash }; continue }
    if ($exists) {
        $backup = Join-Path $script:ProjectRoot ('.orchestration\mirror-backups\' + $stamp + '\' + $relative)
        New-Item -ItemType Directory -Path (Split-Path -Parent $backup) -Force | Out-Null
        Copy-Item -LiteralPath $target -Destination $backup
    }
    New-Item -ItemType Directory -Path (Split-Path -Parent $target) -Force | Out-Null
    Copy-Item -LiteralPath $source -Destination $target -Force
    if ((Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash -ne $hash) { throw "Falha na verificação: $relative" }
    $results += [pscustomobject]@{ path=$relative; status='copied-verified'; sha256=$hash }
}
$results
