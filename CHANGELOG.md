# Changelog

## v2.0 · 2026-11-24

- Renamed from PS-CVSS to PRTF Severity Score (PRTF-S), to pair with the Physical Red Team Framework and to avoid confusion with CVSS.
- New formula. v1.1 averaged all six metrics, so effort counted for two thirds of the score and impact for one third. An unlocked supply closet could score HIGH, and a finding that could physically hurt someone could score LOW. In v2.0 impact sets the ceiling, and CI:X is always at least HIGH.
- Same six metrics, same letters, same 1 to 4 values. v1.1 vectors still load and are rescored with v2.0.
- Released as an open resource under CC BY 4.0, with an interactive calculator, vector strings, JSON data and a reference implementation.
- Corrected two example notes from v1.1 whose arithmetic did not match the v1.1 formula.

## v1.1 · 2026-03-24 (as PS-CVSS)

- Two-page PDF reference. Score = sum of the six metrics / 6. Kept in [`legacy/`](legacy/) for reference.
