# Da-Ve video editor roadmap

Product constraints: core editing and story creation remain free to use. Do not add paid APIs or required paid services. Optional future monetization must not gate core creation.

## Phase 1: App foundation
- [ ] Launch, project list, project persistence, gallery import and preview on Redmi 15 / Android 16.
- [ ] AI edit/apply, autosave and export complete workflow on-device.
- [ ] Free tooling/build route validated on public CI and phone runtime.

## Phase 2: CapCut-inspired editor
- [ ] Proportional timeline strips, seek/playhead and trim handles.
- [ ] Split, reorder, volume, delete, overlays and background music.
  - [x] Studio clip reorder controls call the timeline reorder function; 21 upstream feature tests noted in the Phase 2 source receipt. Local combined suite, typecheck and Android JS export pass.
  - [x] Timeline volume setter clamps values to 0..1 and safely ignores invalid values; tests pass.
- [ ] Volume control wired to Studio UI and preview playback.
- [ ] Mixed timeline export and save output to gallery.
- [ ] Full functional chain and emulator/device runtime pass.

## Phase 3: YouTube story-to-video workflow
- [ ] Storyboard generated with free/local or user-supplied tools only.
- [ ] Per-scene approval before adding to the edit.
- [ ] Locked TTS voice choices and free voice pipeline.
- [ ] End-to-end story creation and export runtime validation.

## Free CI and delivery route
- [ ] GitHub Actions public Linux runners: tests, typecheck, Android bundle, Gradle debug build and emulator smoke.
- [ ] Source ZIP restore point for every verified phase.
- [ ] Never call an APK working until runtime chain passes on target phone.
