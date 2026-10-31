$ErrorActionPreference = 'Stop'
$script:ProjectRoot = 'C:\MonsterCrypt_Ecosystem_V1.0\Crypt-Royale'
$script:MirrorRoot = 'G:\Meu Drive\MonsterCrypt_Ecosystem_V1.0\Crypt-Royale'
$script:AccountsFile = Join-Path $script:ProjectRoot '.orchestration\config\accounts.json'

function Test-ExcludedPath([string]$RelativePath) {
    # Private Oracle/card documents remain only on the local machine.
    if (($RelativePath -replace '\\','/') -match '^docs/oracle(?:/|$)') { return $true }
    $parts = $RelativePath -split '[\\/]'
    foreach ($part in $parts) {
        if ($part -match '^(node_modules.*|\.git|\.cache|\.keystores|mirror-backups|\.gradle|build|dist|dist-apk|dist-electron|dist-pacote|\.keys|Signing)$') { return $true }
    }
    $name = $parts[-1]
    return $name -match '(?i)^(runner\.lock|local\.properties|\.env.*|auth.*\.json|credentials.*|.*oauth.*|.*token.*|.*\.(pem|key|pfx|p12|keystore|jks))$'
}

function Get-ProjectSnapshot {
    $snapshot = @{}
    $queue = [System.Collections.Generic.Stack[string]]::new()
    $queue.Push($script:ProjectRoot)
    while ($queue.Count -gt 0) {
        foreach ($item in Get-ChildItem -LiteralPath $queue.Pop() -Force) {
            $relative = [System.IO.Path]::GetRelativePath($script:ProjectRoot, $item.FullName)
            if ((Test-ExcludedPath $relative) -or ($item.Attributes -band [IO.FileAttributes]::ReparsePoint)) { continue }
            if ($item.PSIsContainer) { $queue.Push($item.FullName) }
            else { $snapshot[$relative] = (Get-FileHash -LiteralPath $item.FullName -Algorithm SHA256).Hash }
        }
    }
    return $snapshot
}

