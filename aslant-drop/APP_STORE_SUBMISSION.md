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

**Support URL**: your email or a simple site (e.g. GitHub repo or personal page)

**Privacy Policy URL**: host `docs/privacy-policy.html` (see Step 2) on GitHub Pages, Vercel, or any public URL

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

Apple requires screenshots for **6.7"** (iPhone 15 Pro Max) at minimum. Easiest approach:

1. Run the app on your iPhone
2. Take screenshots during menu, gameplay (mid-score), and game over
3. Upload in App Store Connect → your app → **App Store** tab → **Screenshots**

Tip: use **Window → Organizer** in Xcode or the iOS screenshot shortcut. You need at least 3 screenshots; 5–8 is better.

Optional: Xcode Simulator → **File → New Screen Shot** for exact pixel sizes.

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
