# MC-0004 Data Mouse — Turnaround Candidate V003

## Status

`pending_human_review`. Nothing was promoted to the final turnaround filename and no sprite sheet was started.

## Production history

- V001 was rejected by Codex visual QA because it fabricated viewpoints by mirroring the 3/4 master, leaving non-orthographic profiles, artificial center seams, and two tails in the back view.
- V002 is an invalid placeholder generated after Antigravity reported `429 QUOTA_EXHAUSTED` from its image model. Its metadata is marked accordingly.
- V003 uses OpenAI built-in image generation as the documented fallback. Front, strict right profile, and true back were generated separately from the approved master. The left profile is a deterministic horizontal mirror of the right profile.

## Canonical inputs

- Approved master: `art-source/approved-masters/cr_mc-0004_data-mouse_master_v001.png`
- Master SHA-256: `78D9D9B4C2A9C88119584F6A9C35FC3A39B7160EDC056449B9D0C3E4C12F5BA2`

## Output

- Candidate: `art-source/turnarounds/cr_mc-0004_data-mouse_turnaround_candidate_v003.png`
- Metadata: `art-source/turnarounds/cr_mc-0004_data-mouse_turnaround_candidate_v003.json`
- Dimensions: 2048 × 1024 RGBA
- Grid: four cells of 512 × 1024
- Order: front, right, left, back
- Common baseline: y=850
- Candidate SHA-256: `8A3B9B3D540411EF09DA41749C683ABFAD46FB7EC1DBE8C14D01AA56CF9D75A4`
- Alpha: 1,760,605 transparent; 330,907 opaque; 5,640 intermediate.

## Deterministic processing

The assembly script copied the three generated sources into the project, neutralized hidden RGB, mapped alpha values ≤20 to transparent and ≥200 to opaque while retaining intermediate edge coverage, cropped visible bounds, applied one common scale factor, created the left profile by exact horizontal mirroring, centered each view in a 512 × 1024 cell, aligned all views to y=850, and generated solid-background/gameplay-size QA previews.

Script: `.orchestration/tools/assemble_data_mouse_turnaround_v003.py`

## Visual QA

- Exactly four legs are readable in every view.
- Exactly two receiver ears and one connector tail appear in every view.
- Front: two eyes under one amber visor, centered chest emitter, one left-curving tail.
- Right/left: true opposite profiles, two near legs and two far legs, one visible near visor lens.
- Back: no eyes, visor lenses, muzzle, whiskers, or chest emitter; one center-rear tail.
- No cropping, character overlap, text, frames, floor, shadows, or background-color fringe was observed.
- Gameplay-size QA remains readable at 128 px per view.

## Required human decision

Approve or request corrections to V003. Do not promote it until explicit human approval.
