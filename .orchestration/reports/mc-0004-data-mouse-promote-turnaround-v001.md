# MC-0004 Data Mouse Turnaround Promotion to V001

## 1. Action Summary
Promoted explicitly human-approved MC-0004 Data Mouse turnaround candidate V003 to the official turnaround V001, preserving the PNG byte-for-byte and recording full lineage.

## 2. Changed Files
- **Created**: `art-source/turnarounds/cr_mc-0004_data-mouse_turnaround_v001.png`
- **Created**: `art-source/turnarounds/cr_mc-0004_data-mouse_turnaround_v001.json`
- **Created**: `art-source/turnarounds/cr_mc-0004_data-mouse_turnaround_v001_qa_white.png`
- **Created**: `art-source/turnarounds/cr_mc-0004_data-mouse_turnaround_v001_qa_magenta.png`
- **Created**: `art-source/turnarounds/cr_mc-0004_data-mouse_turnaround_v001_qa_dark.png`
- **Modified**: `art-source/approved-masters/cr_mc-0004_data-mouse_master_v001.json` (Added `turnaround` reference)

## 3. Commands Executed
```powershell
Copy-Item "art-source\turnarounds\cr_mc-0004_data-mouse_turnaround_candidate_v003.png" -Destination "art-source\turnarounds\cr_mc-0004_data-mouse_turnaround_v001.png"
Copy-Item "art-source\turnarounds\cr_mc-0004_data-mouse_turnaround_candidate_v003_qa_white.png" -Destination "art-source\turnarounds\cr_mc-0004_data-mouse_turnaround_v001_qa_white.png"
Copy-Item "art-source\turnarounds\cr_mc-0004_data-mouse_turnaround_candidate_v003_qa_magenta.png" -Destination "art-source\turnarounds\cr_mc-0004_data-mouse_turnaround_v001_qa_magenta.png"
Copy-Item "art-source\turnarounds\cr_mc-0004_data-mouse_turnaround_candidate_v003_qa_dark.png" -Destination "art-source\turnarounds\cr_mc-0004_data-mouse_turnaround_v001_qa_dark.png"

$hash1 = (Get-FileHash "art-source\turnarounds\cr_mc-0004_data-mouse_turnaround_candidate_v003.png" -Algorithm SHA256).Hash
$hash2 = (Get-FileHash "art-source\turnarounds\cr_mc-0004_data-mouse_turnaround_v001.png" -Algorithm SHA256).Hash
Write-Output "Candidate V003 SHA256: $hash1"
Write-Output "Official V001 SHA256: $hash2"
Write-Output "Hashes match: $($hash1 -eq $hash2)"
Write-Output "Matches expected: $($hash1 -eq '8A3B9B3D540411EF09DA41749C683ABFAD46FB7EC1DBE8C14D01AA56CF9D75A4')"
```

## 4. Hash Verification & Byte Comparison
- **Source Hash (Candidate V003)**: `8A3B9B3D540411EF09DA41749C683ABFAD46FB7EC1DBE8C14D01AA56CF9D75A4`
- **Destination Hash (Official V001)**: `8A3B9B3D540411EF09DA41749C683ABFAD46FB7EC1DBE8C14D01AA56CF9D75A4`
- **Matches Expected Target**: Yes
- **Byte-for-byte Match (Source/Destination)**: True

## 5. PNG Properties Validation
- **Dimensions**: 2048 x 1024
- **Color Mode**: RGBA
- **Alpha Counts**:
  - `alpha_0`: 1760605
  - `alpha_255`: 330907
  - `alpha_intermediate`: 5640
- **View Order**: front, right, left, back
- **Cell Size**: 512 x 1024 per view
- **Baseline Y**: 850

## 6. Anatomy Counts Validated (per view)
- **Legs**: 4
- **Receiver Ears**: 2
- **Connector Tail**: 1
- **Back Face Elements**: 0

## 7. Unresolved Risks
- No unresolved risks identified. The promotion passed all validation criteria.
