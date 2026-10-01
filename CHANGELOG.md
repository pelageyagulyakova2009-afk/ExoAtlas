# Changelog

All notable changes to ExoForge are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.1.0] - 2026-10-01

### Added

- Cube-sphere LOD with skirts, ported terrain, atmosphere, clouds, water, and NASA Earth maps. `b6cb6db`
- Density-wave galaxy with 100k stars, dust, H II, and named presets. `b0c41e8`
- Dark instrument UI: presets, accordions, working next/submit, FPS, fullscreen, PNG. `afb3eb4`

## [1.0.0] - 2026-10-01

### Added

- Procedural planet route with cube-sphere LOD, atmosphere and cloud shells. Shader math is `TODO(manual)`. `4872102`
- Procedural galaxy route with 50k points. Density-wave math is `TODO(manual)`. `1153f7f`
- Supabase migration, RLS, and label APIs with an in-memory fallback. `b8d39a8`
- Annotation panel, attention checks, and a Realtime subscription when Supabase keys exist. `d9f0bb8`
- FastAPI encoder and acquisition interfaces. Strategy formulas are `TODO(manual)`. `6ac3696`
- Closed loop: queue, train every 32 labels, impact dashboard. `b7a9c64`
- Rare-tag seed feedback under a 5% share. `2aeea9f`
- README, GitHub Actions, and a parquet export script.

## [0.0.1] - 2026-10-01

### Added

- pnpm workspaces and Turborepo scaffold. `80eaab6`
- ESLint, Prettier, Husky, Vitest, and pytest.
- `PROJECT.md` product specification.
