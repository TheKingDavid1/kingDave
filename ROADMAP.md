# da-ve-video-editor — build roadmap

Every phase ends with: typecheck green, full workflow-chain test in CI (install → build → artifact), and a smoke-test APK sent to Shafiu before the box gets checked.

## Phase 1 — Editor core (capcut-style, android)
- [x] Preview fix: single-clip player screen with timestamps + play/pause
- [x] Full-timeline preview: clips play back-to-back, tap a block to jump
- [ ] CapCut-style timeline strip: proportional clip blocks, timestamps, playhead, drag handles (in/out trim)
- [ ] Clip actions: split at playhead, reorder drag, mute/volume per clip, delete
- [ ] Text/title overlays on timeline track
- [ ] Audio track: per-clip volume + background music import, mixed at export
- [ ] Export pipeline v2: merge → compress → save to gallery, with progress UI

## Phase 2 — AI brain (reliable, free, multi-key)
- [x] Gemini 2.0-flash planner on current v1beta endpoint (404 fixed)
- [x] Multi-key rotation (round-robin) for Gemini + Groq fallback so rate limits never block
- [x] Keys stored encrypted-at-rest in app storage, never plain text in code
- [ ] Cloudflare Worker key proxy (free tier) so the APK carries no key at all
- [ ] Agent actions expanded: split, reorder, volume, music, text overlay — everything the editor can do
- [ ] Offline queue: agent requests retry with backoff, no silent failures

## Phase 3 — Story pipeline (Calliope-style YouTube automation)
- [ ] Script intake: paste prompt/script → agent produces story board (scenes, narration, duration)
- [ ] Per-scene image prompts auto-generated from the storyboard (consistent characters/style)
- [ ] Scene-by-scene approval flow: agent presents a scene, user animates/approves, agent locks it, moves on
- [ ] Locked brand voices: 2–3 pinned TTS voices (Edge-TTS free tier), voice per character persisted
- [ ] Lip-sync + drawing animation for selected scenes (the v2 animator), kept offline
- [ ] Background music picker: bundled CC0 tracks, auto ducking under narration
- [ ] One-tap assembly: approved scenes + voices + music + captions → timeline → export (quality-first, long-form)

## Phase 4 — Monetization
- [ ] Free tier: watermark on exports, all core tools usable
- [ ] Premium unlock (one-time): no watermark, extra voices, longer exports
- [ ] AdMob ads on free tier (rewarded ad = temporary premium feature use)
- [ ] Play Billing wiring + receipt check

## Phase 5 — Reliability
- [ ] CI test chain: typecheck → build → 16kb alignment verify → artifact on every push
- [ ] Crash reporting (free tier, e.g. Sentry) so bugs surface on their own
- [ ] Release checklist: version bump, signed APK, zip backup to Drive, changelog
