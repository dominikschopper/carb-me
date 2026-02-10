# Publishing carb-me on Free App Stores

## Overview

carb-me is a PWA hosted on GitHub Pages. To publish on Android app stores, we wrap it as a **TWA (Trusted Web Activity)** using **Bubblewrap**, which generates a thin Android shell that opens the PWA in Chrome without browser UI.

---

## Recommended Stores

| Store | Effort | Reach | Notes |
|-------|--------|-------|-------|
| **GitHub Releases** | Trivial | Dev-savvy users | Attach APK to release, done |
| **Aptoide** | Easy | 200M+ users | Free, upload APK, no FOSS requirement |
| **APKPure / Uptodown** | Easy | Large | Free, similar to Aptoide |
| **F-Droid (custom repo)** | Medium | Privacy-focused | Self-hosted repo, no approval needed |
| **F-Droid (main repo)** | Hard | FOSS audience | TWA wrappers are controversial there, skip for now |

**Start with:** Aptoide + GitHub Releases.

---

## Phase 1: Prepare the PWA

### 1.1 Fix `start_url` in manifest

The VitePWA-generated manifest uses `/` as `start_url`. For TWA, this must match your deployed URL. If hosted at `https://username.github.io/carb-me/`, set `start_url: '/carb-me/'` in `vite.config.ts`.

### 1.2 Verify PWA readiness

Lighthouse removed the `pwa` category in v12. Use Chrome DevTools instead:

1. Open your deployed URL in Chrome
2. DevTools → **Application** tab → **Manifest** section: verify manifest loads correctly
3. **Application** → **Service Workers**: verify SW is registered and active
4. **Application** → **Storage**: verify offline capability works
5. Run `npx lighthouse https://<your-url>` (general audit) — check for installability warnings

---

## Phase 2: Generate the Android App

### 2.1 Install Bubblewrap

```bash
npm install -g @bubblewrap/cli
```

No Android Studio needed. Bubblewrap downloads SDK/build tools automatically.

### 2.2 Initialize project

```bash
bubblewrap init --manifest https://<your-github-pages-url>/manifest.json
```

Bubblewrap prompts for:
- **Package name**: e.g. `com.github.yourusername.carbme`
- **Launcher name**: `carb-me`
- **Theme/background colors**: pulled from manifest
- **Signing keystore**: generates one if none exists

### 2.3 Build

```bash
bubblewrap build
```

Output: `app-release-signed.apk` and `app-release-bundle.aab`

### 2.4 Test

```bash
bubblewrap install   # installs on connected device/emulator
```

---

## Phase 3: Digital Asset Links

Required so Chrome hides the address bar (proves you own both the website and the app).

### 3.1 Get SHA-256 fingerprint

```bash
keytool -list -v -keystore android.keystore -alias android
# Copy the SHA256 line
```

### 3.2 Create `static/.well-known/assetlinks.json`

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.github.yourusername.carbme",
      "sha256_cert_fingerprints": [
        "AA:BB:CC:DD:...:your fingerprint"
      ]
    }
  }
]
```

SvelteKit's static adapter copies `static/.well-known/` to `build/.well-known/` automatically.

### 3.3 Deploy & verify

```bash
curl https://<your-url>/.well-known/assetlinks.json
```

Must return JSON. Then re-test the APK — address bar should be gone.

---

## Phase 4: Publish

### GitHub Releases

1. Create a release tag (e.g. `v1.12.0`)
2. Attach the signed APK as a release asset
3. Done

### Aptoide

1. Register at [connect.aptoide.com](https://connect.aptoide.com/) (free)
2. Upload signed APK
3. Fill in metadata:
   - Category: Health & Fitness
   - Title: `carb-me - BE & KHE Rechner`
   - Description: German + English
   - Screenshots: at least 2 phone-sized
   - Icon: 512x512 (already have `icons/icon-512.png`)
4. Submit for review

### F-Droid Custom Repo (optional)

```bash
pip install fdroidserver
mkdir fdroid-repo && cd fdroid-repo
fdroid init
# Copy APK to repo/
fdroid update
# Host on GitHub Pages (separate repo or branch)
```

Users add your repo URL to their F-Droid client.

---

## Phase 5: Automate with GitHub Actions (optional)

Create `.github/workflows/android-build.yml` that runs on release tags:

```yaml
on:
  push:
    tags: ['v*']

jobs:
  build-apk:
    runs-on: ubuntu-latest
    steps:
      - uses: nicolo-ribaudo/setup-bubblewrap@v1
      - run: bubblewrap build
        env:
          SIGNING_KEY_ALIAS: ${{ secrets.SIGNING_KEY_ALIAS }}
          SIGNING_KEY_PASSWORD: ${{ secrets.SIGNING_KEY_PASSWORD }}
          SIGNING_STORE_PASSWORD: ${{ secrets.SIGNING_STORE_PASSWORD }}
      - uses: softprops/action-gh-release@v1
        with:
          files: app-release-signed.apk
```

Store keystore as a base64-encoded GitHub Secret.

---

## Security Notes

- **Never commit the keystore** (`.jks` / `.keystore`) to the repo
- Add to `.gitignore`: `*.keystore`, `*.jks`
- Back up keystore + passwords in a password manager — losing them means you can never update the app
- The SHA-256 fingerprint in `assetlinks.json` is public and safe to commit

---

## Checklist

- [ ] PWA readiness verified in Chrome DevTools (manifest, SW, offline)
- [ ] `start_url` is correct for deployed URL
- [ ] Bubblewrap installed
- [ ] Keystore generated and backed up securely
- [ ] APK builds and runs on a test device
- [ ] `assetlinks.json` deployed and verified
- [ ] APK re-tested (no address bar)
- [ ] Screenshots taken for store listing
- [ ] Aptoide account created
- [ ] APK uploaded to Aptoide
- [ ] APK attached to GitHub Release
