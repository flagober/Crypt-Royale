# MC-0004 Data Mouse Master Promotion Report

## Changed Files
- `art-source/approved-masters/cr_mc-0004_data-mouse_master_v001.png` (created)
- `art-source/approved-masters/cr_mc-0004_data-mouse_master_v001.json` (created)

## Evidence
- **Source Hash (SHA-256):** `78D9D9B4C2A9C88119584F6A9C35FC3A39B7160EDC056449B9D0C3E4C12F5BA2`
- **Destination Hash (SHA-256):** `78D9D9B4C2A9C88119584F6A9C35FC3A39B7160EDC056449B9D0C3E4C12F5BA2`
- **Byte Comparison:** Exact match (byte-identical copy).
- **Dimensions / Mode:** 2048x2048, Format32bppArgb (RGBA).

## Commands Used
```powershell
Copy-Item "E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\exploration\cr_mc-0004_data-mouse_master-candidate_v001.png" -Destination "E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\approved-masters\cr_mc-0004_data-mouse_master_v001.png" -Force

(Get-FileHash -Algorithm SHA256 "E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\exploration\cr_mc-0004_data-mouse_master-candidate_v001.png").Hash

(Get-FileHash -Algorithm SHA256 "E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\approved-masters\cr_mc-0004_data-mouse_master_v001.png").Hash

Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\approved-masters\cr_mc-0004_data-mouse_master_v001.png")
Write-Output "Width: $($img.Width), Height: $($img.Height), PixelFormat: $($img.PixelFormat)"
$img.Dispose()
```

## Unresolved Risks
- None. The candidate matched all criteria constraints for promotion exactly.
