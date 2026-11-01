# da-ve-video-editor build roadmap

Every core phase requires typecheck, workflow-chain tests, Android bundle, and a real Android emulator/device smoke test before its runtime milestone is checked off or an APK is sent. Current source is remote main 14d66c8 at time of inspection. No Android emulator/device is available in this workspace, so device runtime remains pending.

Product constraints: core editing and story creation must remain free to use. Do not add paid APIs or cloud services that incur charges. Use local processing and free tiers where available, and disclose quotas/rate limits. Monetization is optional future revenue, never a dependency for core features.

## Phase 1: startup, Studio, import, preview, agent, export
- [x] Root ConfigContext provider mounted around app screen tree, fixing root provider mismatch.
- [x] Studio video picker, timeline preview, clip preview navigation and timestamps.
- [x] Android launch/import/preview/export source-chain tests (static integration assertions only, not device runtime).
- [x] Android content:// media URI copy-to-cache normalization before native export.
- [ ] Gallery selection and preview playback on a real Android device, including Redmi 15 Android 16.
- [ ] AI planner request, review, apply, autosave/reopen, export and playback verified end-to-end.
- [ ] Export merge/compress/save-to-gallery verified on Android. Current exporter merges and compresses; gallery saving is not implemented.
- [ ] Runtime milestone and APK gate, blocked until actual Android runtime/device testing.

## Phase 2: CapCut-inspired editor
- [ ] Proportional timeline strips, seek/playhead and trim handles.
- [ ] Split, reorder, volume, delete, overlays and background music.
- [ ] Export mixed timeline and save output to gallery.
- [ ] Full functional chain tests and Android device runtime pass.

## Phase 3: Calliope-inspired creation pipeline, separate from editor UI
- [ ] Script/prompt intake to structured storyboard and narration.
- [ ] Per-scene image prompts and consistent character/style controls.
- [ ] Scene-by-scene review, approval and locking before animation.
- [ ] Fixed channel voices, local/free TTS options and explicit free-tier quotas.
- [ ] Lip sync/drawing animation and music with local/free tools.
- [ ] Assemble approved scenes, audio and captions into editor timeline, then export.
- [ ] End-to-end chain tests and Android device runtime pass.

## Phase 4: reliability and optional monetization
- [ ] No exposed hardcoded provider keys; user-provided keys securely stored locally or free proxy only if it incurs no charge.
- [ ] CI typecheck, tests, Android bundle, native build, 16 KB alignment verification and artifacts.
- [ ] Runtime crash tracing across supported Android profiles.
- [ ] Optional monetization only after the core remains fully usable for free.

## Verified in this workspace
- Audited checkout: remote main at 14d66c85c599b5e099945d34062fe98c031948ea. Working tree has pre-existing edits; no commit or push made.
- `npm test`: 8/8 pass. These are source/layout assertions, including a static check of launch/import/preview wiring, agent action application and autosave wiring, and export URI/error handling. They do not run the React Native UI or invoke native media/AI services.
- `npm run typecheck`: passes after the current exporter changes. The Expo FileSystem import resolves from `expo-file-system`; paths are awaited before merge/compress.
- `npx expo export --platform android`: succeeds, Metro bundles 714 modules and writes the Android bundle.
- Native build blocked: `./android/gradlew -p android assembleDebug` cannot run because Java/JAVA_HOME is unavailable. `adb` and `emulator` are also absent. No Android install, UI chain, native export, or device runtime was tested; no APK produced or claimed tested.
- Next gate: provide an Android SDK/emulator runner with JDK, then build/install and exercise the full launch → Studio → import → preview → agent plan/review/apply → export/playback flow, including permission, planner, and export failure UI. Keep these runtime checkboxes open until observed.
