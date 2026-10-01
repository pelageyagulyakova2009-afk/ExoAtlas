# ExoForge — Procedural Universe + Citizen Science

Browser platform where people explore procedurally generated planets and galaxies, annotate features, and a model updates from those labels and influences later generation.

Closed loop: generate → annotate → active learning → better model → better generation.

## Audience

- Admissions committees (wow + depth).
- Citizen-science community.
- Open-source contributors.

## MVP features

1. WebGL planet generator: noise → heightmap → biomes → atmosphere (shader math is manual).
2. WebGL galaxy generator: density wave + noise → spiral arms + dust (shader math is manual).
3. Annotation UI: rings, atmosphere, clouds, spiral, bar, elliptical, dust_lane.
4. Active learning plugin: entropy / BALD / core-set (strategies manual).
5. On-the-fly head training: linear probe on a frozen encoder; LoRA later.
6. Impact dashboard: precision/recall vs label count, agreement kappa.
7. Feedback loop: rare classes bias later seeds.

## Out of scope

- Realtime multiplayer.
- VR/AR.
- Full retraining of large models.
- Mobile app.

## Architecture

- Frontend: Next.js 14 App Router, TypeScript, React Three Fiber, Zustand, Tailwind, shadcn/ui.
- Shaders: raw GLSL strings. Noise, fBm, domain warp, raymarching, density wave, Rayleigh/Mie are `TODO(manual)`.
- Backend: Supabase (Postgres, Auth, Realtime). Tables `objects`, `labels`, `models`, `events`.
- ML: FastAPI, PyTorch MPS, frozen CLIP ViT-B/32, linear probe. DINOv2 is scaffold only.

## Success metrics

- Shaders: 60 FPS on M1 Air at 1080p after manual shader math.
- Model: +10% F1 over the first 500 labels (requires a trained head and real labels).
- UX: first annotation in under 30 seconds from open.
- Openness: repo plus a Hugging Face dataset export script.

## Ownership

Cursor writes boilerplate, API routes, tests, CI, and docs.
A person writes GLSL math, acquisition formulas, encoder upgrades beyond CLIP, reward shaping details, and scientific reading of metrics.

## Constraints

- macOS Apple Silicon. No CUDA. No proprietary model APIs in the core.
