# ASLANT: Drop — Google Play Submission Guide

Use this checklist to publish v1 on Google Play.

## App identity

| Field | Value |
|---|---|
| **App name** | ASLANT: Drop |
| **Package name** | `com.dhineshkumar.aslantdrop` |
| **Version name** | 1.0 |
| **Version code** | 1 (increment for each upload) |
| **Category** | Games → Arcade |
| **Price** | Free |

## Prerequisites

- [ ] **Google Play Developer account** ($25 one-time) at [play.google.com/console](https://play.google.com/console)
- [ ] App runs on Android emulator/device (done ✓)
- [ ] Privacy policy URL live: `https://dhineshkumar24.github.io/Aslant/privacy-policy.html`
- [ ] Support URL live: `https://dhineshkumar24.github.io/Aslant/support.html`

---

## Step 1 — Create the app in Play Console

1. Open [Google Play Console](https://play.google.com/console)
2. **Create app**
3. App name: **ASLANT: Drop**
4. Default language: **English (United States)**
5. App or game: **Game**
6. Free or paid: **Free**
7. Accept declarations → **Create app**

Complete the **Dashboard** setup tasks (Play Console walks you through each).

---

## Step 2 — Store listing

**Grow → Store presence → Main store listing**

| Field | Value |
|---|---|
| **Short description** (80 chars) | Survive the fall. One touch. Hold the light, dodge the dark. |
| **Full description** | Copy from `APP_STORE_SUBMISSION.md` description block |
| **App icon** | 512×512 PNG — use `assets/icon-only.png` resized to 512×512 |
| **Feature graphic** | 1024×500 PNG (optional for v1; can add later) |
| **Phone screenshots** | Min 2, upload from `app-store-screenshots/` (1284×2778 PNGs) |
| **7-inch / 10-inch tablet** | Optional — use `app-store-screenshots/ipad-13-inch/` if prompted |

**Privacy policy URL:**
```
https://dhineshkumar24.github.io/Aslant/privacy-policy.html
```

---

## Step 3 — Content rating

**Policy → App content → Content rating**

1. Start questionnaire
2. Email: your contact email
3. Category: **Game**
4. Answer honestly — expect **Everyone / PEGI 3 / similar**
   - No violence, no user content, no gambling, no ads
5. Submit → apply rating to app

---

## Step 4 — Data safety

**Policy → App content → Data safety**

| Question | Answer |
|---|---|
| Does your app collect or share user data? | **No** |
| Personal best score on device | **Not collected** (stored locally only, never transmitted) |

Align with your privacy policy: no data collected or shared.

---

## Step 5 — Target audience

**Policy → App content → Target audience**

- Target age: **13+** or **All ages** (game has no restricted content; 4+ style game)
- Not designed for children under 13 (unless you want Designed for Families — skip for v1)

---

## Step 6 — Create upload keystore (one-time)

Run in terminal. **Save the passwords somewhere safe** — you cannot recover a lost keystore.

```bash
cd aslant-drop/android
keytool -genkey -v -keystore aslant-drop-release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias aslant-drop
```

Suggested answers:
- Password: choose a strong password (you'll need it forever for updates)
- Name: Dhineshkumar Murugesan
- Organization: optional
- City/State/Country: your location

Create `android/keystore.properties` (never commit to git):

```bash
cp keystore.properties.example keystore.properties
```

Edit `keystore.properties`:

```properties
storeFile=aslant-drop-release.jks
storePassword=YOUR_KEYSTORE_PASSWORD
keyAlias=aslant-drop
keyPassword=YOUR_KEY_PASSWORD
```

**Back up** `aslant-drop-release.jks` to a secure location (1Password, encrypted drive). Losing it means you cannot update the app on Play Store.

---

## Step 7 — Build signed release bundle (AAB)

Google Play requires an **Android App Bundle** (.aab), not APK.

```bash
cd aslant-drop
npm run android:bundle
```

Output file:
```
android/app/build/outputs/bundle/release/app-release.aab
```

### For each new upload

- Increment `versionCode` in `android/app/build.gradle` (2, 3, …)
- Update `versionName` if shipping a new feature release (e.g. `1.1`)

---

## Step 8 — Upload to Play Console

**Release → Production** (or **Internal testing** first)

1. **Create new release**
2. **Upload** `app-release.aab`
3. Release name: `1.0 (1)`
4. Release notes:
   ```
   Initial release of ASLANT: Drop — a dark one-tap avoider. Survive as long as you can.
   ```

### Recommended: Internal testing first

1. **Release → Testing → Internal testing → Create release**
2. Upload the same AAB
3. Add yourself as tester → install via Play Store link
4. Verify on a real device, then promote to **Production**

---

## Step 9 — Submit for review

Dashboard should show all green checkmarks:

- [ ] Store listing
- [ ] Content rating
- [ ] Data safety
- [ ] Target audience
- [ ] Privacy policy
- [ ] App bundle uploaded
- [ ] Countries/regions selected (**Pricing and distribution**)

Click **Send for review** (or **Publish** depending on console UI).

Review typically takes **a few hours to 3 days** for new apps.

---

## Metadata to paste

**Short description:**
```
Survive the fall. One touch. Hold the light, dodge the dark.
```

**Full description:**
```
ASLANT: Drop is a one-tap avoider with a dark, moody atmosphere.

You are a glowing lantern — the only warm light in a cold void. Cold shards fall from above. Hold and move to dodge them. Survive as long as you can. The longer you last, the harder it gets.

• One-touch controls — pick it up in seconds
• Atmospheric sound and visuals
• Rising difficulty — chase your personal best
• No accounts, no ads, no distractions

A small game built to be finished and enjoyed. How long can you hold the light?
```

---

## App icon for Play Store (512×512)

Resize the generated icon:

```bash
cd aslant-drop
sips -z 512 512 assets/icon-only.png --out play-store-icon-512.png
```

Upload `play-store-icon-512.png` in Store listing → App icon.

---

## Common rejection fixes

| Issue | Fix |
|---|---|
| Missing privacy policy | Use GitHub Pages URL above |
| Data safety mismatch | Declare **no data collected** |
| Wrong package name | Must be `com.dhineshkumar.aslantdrop` |
| Unsigned bundle | Create keystore + `keystore.properties` before `npm run android:bundle` |
| Version code reused | Increment `versionCode` in `build.gradle` |

---

## What v1 does NOT include

- Global leaderboard / Game Center
- User accounts
- In-app purchases
- Ads

Same scope as iOS v1.
