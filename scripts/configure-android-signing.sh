#!/usr/bin/env bash
set -euo pipefail
: "${ANDROID_KEYSTORE_BASE64:?ANDROID_KEYSTORE_BASE64 secret is required}"
: "${ANDROID_KEYSTORE_PASSWORD:?ANDROID_KEYSTORE_PASSWORD secret is required}"
: "${ANDROID_KEY_ALIAS:?ANDROID_KEY_ALIAS secret is required}"
: "${ANDROID_KEY_PASSWORD:?ANDROID_KEY_PASSWORD secret is required}"
mkdir -p android/app
printf '%s' "$ANDROID_KEYSTORE_BASE64" | base64 --decode > android/app/release.keystore
cat > android/keystore.properties <<EOF
storeFile=release.keystore
storePassword=$ANDROID_KEYSTORE_PASSWORD
keyAlias=$ANDROID_KEY_ALIAS
keyPassword=$ANDROID_KEY_PASSWORD
EOF
chmod 600 android/app/release.keystore android/keystore.properties
