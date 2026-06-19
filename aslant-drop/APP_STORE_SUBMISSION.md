# ASLANT: Drop — App Store Submission Guide

Use this checklist to ship v1 on iOS. Android can follow later.

## App identity

| Field | Value |
|---|---|
| **App name** | ASLANT: Drop |
| **Bundle ID** | `com.dhineshkumar.aslantdrop` |
| **Version** | 1.0 |
| **Build** | 1 (increment for each upload) |
| **SKU** | `aslant-drop-ios` (any unique string in App Store Connect) |
| **Primary category** | Games → Arcade |
| **Secondary category** | Games → Casual |
| **Price** | Free |

## Prerequisites

- [ ] **Apple Developer Program** enrolled ($99/year) at [developer.apple.com](https://developer.apple.com)
- [ ] Xcode signed in with the same Apple ID
- [ ] App runs on your iPhone (already done ✓)
- [ ] Portrait lock works (already done ✓)

## Step 1 — App Store Connect listing

1. Open [App Store Connect](https://appstoreconnect.apple.com) → **Apps** → **+** → **New App**
2. Platform: **iOS**
3. Name: **ASLANT: Drop**
4. Bundle ID: select `com.dhineshkumar.aslantdrop`
5. SKU: `aslant-drop-ios`
6. User Access: Full Access

### Metadata to paste

**Subtitle** (30 chars max):
```
Survive the falling dark
```

**Promotional text** (optional):
```
Guide the last warm light through a cold, endless fall. One touch. No tutorials. Just survive.
```

**Description**:
```
ASLANT: Drop is a one-tap avoider with a dark, moody atmosphere.

You are a glowing lantern — the only warm light in a cold void. Cold shards fall from above. Hold and move to dodge them. Survive as long as you can. The longer you last, the harder it gets.

• One-touch controls — pick it up in seconds
• Atmospheric sound and visuals
• Rising difficulty — chase your personal best
• No accounts, no ads, no distractions

A small game built to be finished and enjoyed. How long can you hold the light?
```

**Keywords** (100 chars max, comma-separated):
```
avoider,arcade,survival,one tap,dark,atmospheric,indie,casual,score,endless
```

**Support URL**:
```
https://dhineshkumar24.github.io/Aslant/support.html
```

**Privacy Policy URL**:
```
https://dhineshkumar24.github.io/Aslant/privacy-policy.html
```

**Copyright**: `© 2026 Dhineshkumar Murugesan`

### App Privacy (nutrition labels)

Answer **Data Not Collected** for all categories.

The app only stores a personal best score on-device via WebView local storage. Nothing is sent to a server.

### Age Rating

Complete the questionnaire. Expected result: **4+** (no realistic violence, no user-generated content, no gambling).

## Step 2 — Privacy policy

Host the file at `docs/privacy-policy.html` at a public URL (see **GitHub Pages** section below).

Quick options:
- **GitHub Pages** on this repo (recommended) → `https://dhineshkumar24.github.io/Aslant/privacy-policy.html`
- Vercel / Netlify drop deploy

Paste that URL into App Store Connect → App Privacy → Privacy Policy URL.

### GitHub Pages setup

1. Push the repo-root `docs/` folder to `master` on GitHub
2. Repo → **Settings** → **Pages**
3. **Build and deployment** → Source: **Deploy from a branch**
4. Branch: **master** → Folder: **/docs** → **Save**
5. Wait 1–2 minutes; GitHub shows the live URL at the top of the Pages settings page
6. Verify: open `https://dhineshkumar24.github.io/Aslant/privacy-policy.html`

**Important:** App Store requires a **publicly accessible** URL. On GitHub Free, Pages works for **public** repos. Your `Aslant` repo is currently **private** — either make the repo public (Settings → Danger zone → Change visibility) or use GitHub Pro to publish Pages from a private repo.

## Step 3 — Screenshots

Apple requires screenshots for **6.5" Display** (iPhone 11 Pro Max / XS Max class) at **exact** pixel sizes:

| Orientation | Accepted sizes |
|---|---|
| Portrait | **1284 × 2778** or **1242 × 2688** |
| Landscape | 2778 × 1284 or 2688 × 1242 |

iPhone screenshots taken via AirDrop or chat are often downscaled (~472 × 1024) and will be **rejected**.

### Ready-to-upload screenshots

Pre-sized screenshots live in:

```
aslant-drop/app-store-screenshots/
├── 01-menu.png
├── 02-gameplay-score-30.png
├── 03-gameplay-score-53.png
├── 04-gameplay-score-64.png
└── 05-gameplay-score-81.png
```

All are **1284 × 2778** portrait PNGs. Upload these to App Store Connect → **iPhone 6.5" Display**.

### Capture at full resolution next time

1. Take screenshots on iPhone (**Side button + Volume Up**)
2. **AirDrop** or sync via **Photos** — avoid WhatsApp/iMessage (they compress)
3. On Mac, confirm size in Preview → Tools → Show Inspector (should be ~1284×2778 or similar)

Optional: Xcode Simulator → **File → New Screen Shot** for exact pixel sizes.

Tip: use **Window → Organizer** in Xcode or the iOS screenshot shortcut. You need at least 3 screenshots; 5 is better.

## Fix “Unable to Add for Review” blockers

If App Store Connect shows these errors, fix them in order:

### 1. Support URL (on this page)

Under **App Information** or the version page → **English (U.S.)**:

| Field | Value |
|---|---|
| Support URL | `https://dhineshkumar24.github.io/Aslant/support.html` |
| Privacy Policy URL | `https://dhineshkumar24.github.io/Aslant/privacy-policy.html` |

Push `docs/support.html` to GitHub if not live yet:

```bash
cd /path/to/Aslant
git add docs/support.html docs/privacy-policy.html
git commit -m "docs: add support page for App Store"
git push origin master
```

### 2. Primary category

**App Store Connect** → **ASLANT Drop** → left sidebar **App Information** → **Category**:

- **Primary:** Games → **Arcade**
- **Secondary (optional):** Games → **Casual**

Click **Save**.

### 3. Price tier

Left sidebar → **Pricing and Availability**:

- **Price:** **Free** (or $0.00)
- **Availability:** all countries (or your choice)

Click **Save**.

### 4. Choose a build (requires Xcode upload)

You must upload a build before **Add for Review** works:

1. `cd aslant-drop && npm run cap:sync:ios && npm run cap:ios`
2. Xcode → destination **Any iOS Device (arm64)**
3. **Product → Archive** → **Distribute App** → **App Store Connect** → **Upload**
4. Wait 5–30 minutes for processing
5. Return to **1.0 Prepare for Submission** → **Build** section → **+** → select build **1**

## Step 4 — Build and upload from Xcode

From the project root:

```bash
cd aslant-drop
npm run cap:sync:ios
npm run cap:ios
```

In Xcode:

1. Select target **App** → **Signing & Capabilities**
   - Team: your Apple Developer team (`DPV8LS2YAQ`)
   - Bundle Identifier: `com.dhineshkumar.aslantdrop`
   - Automatically manage signing: **on**

2. Set scheme to **App** and destination to **Any iOS Device (arm64)** — not a simulator

3. **Product → Archive**

4. When the Organizer opens → **Distribute App**
   - **App Store Connect** → **Upload**
   - Follow prompts (include bitcode/symbols as offered; defaults are fine)
   - Export compliance: **No** for proprietary encryption (already set in Info.plist)

5. Wait for processing in App Store Connect (usually 5–30 minutes)

### iPad upload error (code 90474)

If upload fails with *"need to include all orientations to support iPad multitasking"*, the app has `UIRequiresFullScreen` set to `true` in `Info.plist`. This opts out of Split View/Slide Over and allows portrait-only on iPad. Re-archive with an incremented **Build** number and upload again.

### For each new upload

- Increment **Build** number in Xcode (Target → General → Build: `2`, `3`, …)
- Keep **Version** at `1.0` until you ship a feature update

## Step 5 — TestFlight (recommended)

Before public release:

1. App Store Connect → your app → **TestFlight**
2. Add yourself as an internal tester
3. Install via TestFlight app on iPhone
4. Sanity-check one more time on a clean install

## Step 6 — Submit for review

1. App Store Connect → **App Store** tab → **+ Version** → `1.0`
2. Select the uploaded build
3. Fill in screenshots, description, privacy, age rating
4. **App Review Information**
   - Contact: your name, phone, email
   - Notes: `No login required. Tap anywhere to start. Audio unlocks on first tap.`
5. **Submit for Review**

Review typically takes 24–48 hours.

## Common rejection fixes

| Issue | Fix |
|---|---|
| Missing privacy policy URL | Host `docs/privacy-policy.html` |
| Export compliance prompt | `ITSAppUsesNonExemptEncryption` is already `false` in Info.plist |
| App incomplete / placeholder | Ensure screenshots show real gameplay |
| Metadata mismatch | Subtitle/description must match actual gameplay |
| Crash on launch | Test release build via TestFlight, not only debug |

## What we are NOT shipping in v1

- Global leaderboard
- User accounts
- In-app purchases
- Ads
- Android (separate release later)

## After approval

- App goes live automatically if you chose automatic release, or manually click **Release**
- Share the App Store link
- Android: finish emulator/SDK setup, then repeat for Google Play
