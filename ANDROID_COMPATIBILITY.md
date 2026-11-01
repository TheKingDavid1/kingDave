# Android compatibility and app-start checks

The Android app keeps `minSdkVersion` 24 and targets Android 16 with target SDK 36. Expo's build-properties plugin supplies compile and target SDK values to the generated native project, so keep `app.json` and the committed Gradle project in sync after changing them.

## App entry and editor surfaces

- `index.ts` is the Expo entry point and must resolve through Expo's virtual Metro entry.
- `src/App.tsx` mounts `TimelineScreen` with the default UI config.
- `StudioScreen` uses a window-aware 16:9 preview frame, while the import gallery uses square thumbnail cells sized from the available width.
- Gallery access goes through `permissions-manager`, which uses the media-library permission API and requests only the requested media kind.

## Validation

Run `npm test` for preview layout cases, `npm run typecheck`, `npx expo export --platform android` to validate Metro startup/bundling, and `cd android && ./gradlew assembleDebug` on an Android SDK-equipped runner to validate native startup compilation. A release build or CI artifact is not a device smoke test. Do not send an APK unless it has been launched and smoke-tested on an emulator or device.

The app's minimum supported Android API is 24. Target SDK 36 is used for current Android policy and Android 16 compatibility. SDK values may be overridden by the Expo build-properties config, so verify the generated manifest/Gradle values when upgrading Expo.
