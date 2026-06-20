# ASLANT: Drop — Build Plan (Phaser + Cursor → iOS)

*A one-tap avoider with a dark, moody atmosphere. Your first finishable 2D game, built almost entirely in Cursor.*

---

## The Game in One Line

A glowing figure — the only warm light in a cold dark — drifts at the bottom of the screen. Cold shards fall from above. Hold and move to avoid them. Survive as long as you can. That's the whole game, and that's the point: small enough to actually finish and ship.

---

## The Stack (and why each piece earns its place)

| Tool | Role | Why |
|---|---|---|
| **Phaser 3** | 2D game engine (JavaScript) | Lightweight, browser-based, no heavy install like Unity. Mature, huge docs. |
| **Vite** | Dev server + bundler | Instant hot-reload — edit in Cursor, see it change live in the browser. |
| **Cursor** | Your whole build environment | Write code, run the dev server, test — all here. ~95% of your time. |
| **Capacitor** | Web → native iOS wrapper | Turns the finished game into an App Store app. Touched only at the end. |
| **Xcode** | Final build + submit | One mechanical step at the very end. Unavoidable for *any* App Store app. |

The plan deliberately keeps you in Cursor until the very last phase. You won't open Xcode until you have a finished, polished game worth shipping.

---

## Phase-by-Phase Plan

Each phase ends with something *running*. Commit to Git at every success check. Don't start a phase until the previous one works.

### Phase 0 — Play the prototype first (½ hour)
Before any setup, open the included `aslant-drop-prototype.html` in your browser (just double-click it). Play it. This is the target for v1 — the actual game running. Everything below is about rebuilding this cleanly in a real project structure you can grow and ship.
- **Success check:** you've played it on your machine and (optionally) on your phone's browser.

### Phase 1 — Project setup in Cursor (½ day)
1. Install **Node.js** (LTS) if you don't have it.
2. In Cursor's terminal: scaffold a Vite vanilla-JS project, then add Phaser (`npm install phaser`).
3. Drop in the project structure (see README in this folder).
4. Run `npm run dev` — game opens in browser with hot-reload.
- **Success check:** a blank dark Phaser canvas runs locally and updates when you edit a file.
- **Cursor prompt to use:** *"Set up a Phaser 3 game with Vite, with an index.html, a main.js that boots a Phaser.Game, and an empty MenuScene with a dark background. Explain where each file goes."*

### Phase 2 — Player movement (2–3 days)
1. Create the glowing player figure (circle + glow layers).
2. Track pointer: hold and move → figure follows horizontally.
3. Clamp to the lower portion of the screen.
- **Success check:** you can move the lantern smoothly with mouse/touch.

### Phase 3 — Falling hazards + collision (3–4 days)
1. Spawn shards at the top on a timer; give them downward velocity.
2. Add overlap detection between player and shards.
3. On hit → flash, shake, game over.
4. Destroy off-screen shards (memory hygiene).
- **Success check:** dodging works; getting hit ends the run. **This is the core loop — once it feels good, you have a game.**

### Phase 4 — Score + difficulty ramp (1–2 days)
1. Score = survival time.
2. Gradually increase spawn rate over time.
3. Game Over scene showing score + best (kept in memory).
- **Success check:** runs get harder; score and best display correctly.

### Phase 5 — Mood pass (3–5 days)
1. Dark palette, one warm accent (the lantern). Pulsing glow.
2. Ambient drifting specks; fog vignette.
3. Sound: low ambient drone + soft hit sound (freesound.org for free assets).
4. Gentle scene fades.
- **Success check:** it *feels* like Aslant — atmospheric, not a grey prototype. (The prototype already shows the target.)

### Phase 6 — Wrap for iOS with Capacitor (1–2 days)
1. `npm run build` to produce the web build.
2. Add Capacitor, add the iOS platform, copy the build in.
3. Open the generated project in **Xcode**, sign with a free Apple account, run on your iPhone.
- **Success check:** Aslant: Drop runs as a native app on your phone. **This is the milestone that matters.**
- **Cursor prompt to use:** *"Walk me through adding Capacitor to an existing Vite+Phaser project and generating an iOS project, step by step, explaining each command."*

**Realistic timeline:** ~3–5 weeks of evenings/weekends. Phases 2–3 hold the real learning; budget patience there.

---

## Working With Cursor (your stated workflow)

- **One mechanic per prompt.** "Add pointer-follow movement to the player in PlayScene" beats "build my game."
- **Ask it to explain.** After it generates code: *"explain each part and where this file goes."* You're learning, not just pasting.
- **Run constantly.** With `npm run dev` live, every change shows instantly — tight feedback loop.
- **Commit before big changes** so a bad suggestion can't sink you.
- **Reference the prototype.** Tell Cursor *"match the behavior in aslant-drop-prototype.html"* — it's your working spec.

---

## Scope Guardrails (what v1 does NOT have)

❌ No power-ups, levels, or menus beyond start/play/gameover
❌ No accounts, leaderboards, ads, or purchases
❌ No multiplayer (that's a later project)
❌ No custom art beyond shapes + glow (the mood comes from light and motion, not assets)

Ship the small thing. Then grow it.

---

## Definition of Done (v1)

- [x] Playable start → play → game over loop
- [x] Smooth movement, fair collisions, rising difficulty
- [x] Dark atmospheric look + sound
- [x] Running as a native app on your own iPhone
- [x] Submitted to the App Store (waiting for review)
- [ ] A friend can pick it up and "get it" in five seconds (post-launch playtest)
- [ ] Android build verified on device

---

*Open the prototype first. Then rebuild it in phases, committing as you go. Don't add anything not in this doc until it's on your phone.*
