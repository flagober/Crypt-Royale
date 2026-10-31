[CmdletBinding()]
param([Parameter(Mandatory)][string]$Source,[Parameter(Mandatory)][string]$RelativePath)
$ErrorActionPreference='Stop'
$root='C:\MonsterCrypt_Ecosystem_V1.0\Crypt-Royale'
$mirror='G:\Meu Drive\MonsterCrypt_Ecosystem_V1.0\Crypt-Royale'
$generated='C:\Users\flavi\.codex\generated_images\'
$sourcePath=[IO.Path]::GetFullPath($Source)
$target=[IO.Path]::GetFullPath((Join-Path $root $RelativePath))
if(-not $sourcePath.StartsWith($generated,[StringComparison]::OrdinalIgnoreCase) -or [IO.Path]::GetExtension($sourcePath) -ne '.png'){throw 'Fonte não pertence às imagens geradas.'}
if(-not $target.StartsWith($root+'\art-source\',[StringComparison]::OrdinalIgnoreCase) -or [IO.Path]::GetExtension($target) -ne '.png'){throw 'Destino fora do escopo de arte.'}
$env:PSModulePath=Join-Path $env:SystemRoot 'System32\WindowsPowerShell\v1.0\Modules'
& 'C:\Users\flavi\.codex\skills\flavio-golden-rules\scripts\Backup-Files.ps1' -Paths @($target) -Label 'royale-generated-art-before-copy' | Out-Null
New-Item -ItemType Directory -Force -Path (Split-Path $target) | Out-Null
Copy-Item -LiteralPath $sourcePath -Destination $target
if((Get-FileHash -LiteralPath $sourcePath).Hash -ne (Get-FileHash -LiteralPath $target).Hash){throw 'Cópia de arte divergente.'}
& 'C:\Users\flavi\.codex\skills\flavio-golden-rules\scripts\Mirror-Files.ps1' -SourceRoot $root -MirrorRoot $mirror -Paths @($RelativePath) | ConvertTo-Json -Depth 2
