[CmdletBinding()]
param(
    [ValidateSet('Status','Select','Login','Confirm')][string]$Action='Status',
    [ValidateRange(1,3)][int]$Account=1,
    [string]$ObservedEmail
)
. "$PSScriptRoot\Common.ps1"
$config = Get-Content -LiteralPath $script:AccountsFile -Raw | ConvertFrom-Json
$selected = $config.accounts | Where-Object id -EQ $Account
if ($Action -eq 'Status') {
    $config | Select-Object accounts,selectedAccount,confirmedEmail,confirmedAt,confirmationSource,preferredModel
    return
}
if ($Action -eq 'Select' -or $Action -eq 'Login') {
    # Uma nova seleção exige nova evidência, mesmo quando usa o mesmo e-mail.
    $config.selectedAccount = $Account
    $config.confirmedEmail = $null
    $config.confirmedAt = $null
    $config.confirmationSource = $null
} elseif ($Action -eq 'Confirm') {
    if ($config.selectedAccount -ne $Account -or $ObservedEmail -ne $selected.email) { throw 'O e-mail observado e a seleção precisam corresponder à conta solicitada.' }
    $models = & agy models 2>&1 | Out-String
    if ($LASTEXITCODE -ne 0) { throw 'O CLI ainda não está autenticado. Conclua o Google OAuth antes de confirmar.' }
    $config.confirmedEmail = $selected.email
    $config.confirmedAt = (Get-Date).ToString('o')
    $config.confirmationSource = 'E-mail observado no CLI ou confirmado explicitamente pelo usuário; agy models funcional.'
}
$config | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $script:AccountsFile -Encoding utf8
& "$PSScriptRoot\Sync-CryptRoyale.ps1" -Paths '.orchestration\config\accounts.json' | Out-Null
Write-Output "Conta solicitada: $($selected.email). Confirmada: $($config.confirmedEmail)"
if ($Action -eq 'Login') {
    Write-Output 'Se houver outra sessão, use /logout, reinicie agy e escolha o e-mail solicitado no Google OAuth. Ao concluir, confira o cabeçalho antes de usar Confirm.'
    Push-Location -LiteralPath $script:ProjectRoot
    try { & agy } finally { Pop-Location }
}
