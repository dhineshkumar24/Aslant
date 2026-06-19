# Aslant — Game Design Doc & First-Build Plan

*A dark-themed illusion puzzler for iOS. Monument Valley's mechanic, INSIDE's mood.*

---

## 1. The One-Sentence Pitch

You guide a small, lantern-lit figure through impossible architecture in a world of shadow — rotating and shifting structures so that paths which *look* connected actually become connected, escaping deeper into a silent, unsettling place.

---

## 2. Design Pillars

These are the three rules every decision is checked against. If a feature doesn't serve a pillar, cut it.

1. **The Illusion Is the Game.** The core joy is the "aha" moment when an impossible path resolves into a real one. Everything serves that moment.
2. **Mood Through Restraint.** Dark, quiet, atmospheric. No text, no UI clutter, no tutorials-with-words. The dread and beauty come from art, light, sound, and silence — the way INSIDE tells its whole story without a single line of dialogue.
3. **Buildable by One Person.** Every mechanic must be achievable on a fixed isometric camera and a grid. No physics engine, no character animation rig, no twitch timing. If it needs those, it's out of scope for v1.

---

## 3. What We Are NOT Building (Scope Guardrails)

Writing these down is as important as the features. For your first build, explicitly **out of scope**:

- ❌ Real-time physics (this is what makes INSIDE hard — we avoid it entirely)
- ❌ Character death / respawn / hazards with timing
- ❌ Procedural / AI-generated levels (puzzles are hand-authored — that's where the quality lives)
- ❌ Multiplayer (that's the *second* project, after this ships)
- ❌ Story cutscenes, voice, dialogue
- ❌ In-app purchases, ads, accounts, leaderboards

Keep this list visible. Scope creep is the #1 killer of first projects.

---

## 4. Core Mechanic (The Heart)

**Impossible geometry on a fixed isometric camera.**

The trick that powers Monument Valley: when the camera is locked to one angle (isometric / no perspective), two points that are *far apart in 3D space* can appear *touching on screen*. If you let the player walk along that visual connection, you create a path that "can't exist."

Your puzzles are built from a few interaction types, introduced one at a time:

| Mechanic | What the player does | Why it's beginner-safe |
|---|---|---|
| **Walk** | Tap a destination; figure walks along valid tiles | Pure pathfinding on a grid |
| **Rotate** | Drag to rotate a structure/ring; new visual connections form | Rotating a transform — no physics |
| **Slide** | Drag a platform along a track to bridge a gap | Lerping a position |
| **Perspective lock** | A path is only "real" when two pieces align on screen | A screen-space overlap check |

v1 ships with **Walk + Rotate** only. Slide and Perspective-lock are stretch goals once the first two feel great.

---

## 5. Aesthetic Direction

- **Palette:** Near-black backgrounds, deep indigos and charcoals, with ONE warm accent — the figure's lantern (amber/orange). Light is precious and scarce. This single warm point against the dark does enormous emotional work.
- **Geometry:** Clean, low-poly, monolithic. Big simple shapes, like brutalist ruins.
- **Light:** Pools of light and long shadows. The figure carries the only reliable light source.
- **Sound:** This is half the mood. Low ambient drone, sparse echoing notes on interaction, distant unidentifiable sounds. Silence used deliberately. (Free starting assets: freesound.org, or Unity Asset Store ambient packs.)
- **No UI:** No score, no timer, no buttons during play. Maybe a single subtle "settings" dot in a corner.

---

## 6. Level Progression (Vertical Slice = 5 Levels)

Each level teaches one idea, then combines. This is classic, proven puzzle pacing.

1. **"Descent"** — Walk only. Teaches tap-to-move and the isometric look. One gentle rotation reveal at the end as a hook.
2. **"The Turn"** — Introduces Rotate. One structure, one rotation, one obvious solution.
3. **"Two Hands"** — Two rotatable pieces that must align. The first real "aha."
4. **"Misdirection"** — A path that looks right but isn't; the real path requires ignoring the obvious. Introduces unease.
5. **"The Threshold"** — Combines everything. A small climax. The figure steps through into darkness — sequel hook.

Ship these 5 before adding anything. A polished 5-level slice beats a janky 20-level game every time.

---

## 7. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| **Engine** | **Unity 6.3 LTS (6000.3.x), C#** | The right tool for 3D illusion geometry. Huge tutorial base, asset store, handles the isometric 3D pipeline you'd fight in SwiftUI. |
| **Editor** | **Cursor** | Writes and explains C# well. You'll edit scripts in Cursor, design scenes in the Unity editor. |
| **Target** | iOS (build via Xcode at the end) | Unity exports an Xcode project; you only touch Xcode to build/sign. |
| **Source control** | Git + GitHub | Commit after every working step. Non-negotiable for a beginner — it's your undo button. |
| **Art** | Unity primitives first, then free low-poly asset packs | Don't model anything custom in v1. Cubes and ramps get you surprisingly far. |

**Why Unity over SwiftUI/SceneKit:** SceneKit *can* do this, but you'd spend your learning budget fighting an immature tooling path. Unity's isometric-3D workflow, free assets, and the sheer volume of beginner tutorials make it the pragmatic choice. Cursor handles Unity C# fine.

---

## 8. First-Build Plan (Step by Step for a Beginner)

Each phase ends with something *running*. Do not start a phase until the previous one works and is committed to Git.

### Phase 0 — Environment (½ day)
1. Install **Unity Hub** + **Unity 6.3 LTS** (`6000.3.x`), with iOS Build Support module.
2. Install **Cursor**. Open your Unity project folder in Cursor.
3. Install **Git**, create a GitHub repo, add Unity's standard `.gitignore`.
4. Create an empty 3D project. Make one cube. Press Play. Commit.
   - **Success check:** a cube appears in Play mode and your repo has its first commit.

### Phase 1 — The Isometric Look (1–2 days)
1. Add a camera, set projection to **Orthographic** (this is the illusion-enabling step).
2. Angle it to a fixed isometric view (~30° / 45°). Lock it — it never moves in v1.
3. Build a small floor of tiles. Drop a placeholder figure (a capsule).
   - **Success check:** the scene reads as flat/isometric, and you can see the "impossible geometry" potential when you eyeball overlapping shapes.

### Phase 2 — Walk (3–5 days)
1. Make tiles into walkable nodes (a simple graph: each tile knows its neighbors).
2. On tap, find the tapped tile, compute a path, move the figure tile-to-tile.
3. Use a hand-rolled grid pathfinder (ask Cursor to generate A* on a grid — good learning moment). Avoid NavMesh; walkable topology changes when structures rotate.
   - **Success check:** tap anywhere reachable, figure walks there smoothly. **This is Level 1.**

### Phase 3 — Rotate & The Illusion (5–7 days)
1. Group part of the structure under a rotatable parent object.
2. On drag, rotate that parent in 90° snaps.
3. The key logic: **when rotation aligns two pieces on screen, connect their tile graphs** so the figure can walk across the visual seam.
   - **Success check:** rotating makes a previously impossible path walkable. **This is the core of the whole game.** When this feels magical, you have a game.

### Phase 4 — Build the 5 Levels (1–2 weeks)
1. Turn your working mechanics into 5 hand-designed levels (Section 6).
2. Add a minimal scene-to-scene transition (fade to black).
   - **Success check:** you can play start to finish without touching the editor.

### Phase 5 — Mood Pass (3–5 days)
1. Dark palette, one warm lantern light on the figure.
2. Ambient sound loop + interaction sounds.
3. Fog/vignette for atmosphere.
   - **Success check:** it *feels* like the mood board, not like a grey prototype.

### Phase 6 — Get It On Your Phone (1–2 days)
1. Build to Xcode, sign with a **free Apple developer account** (works for personal-device testing).
2. Install on your own iPhone.
   - **Success check:** you're playing your game on your phone. Show a friend. **This is the milestone that matters.**

**Realistic timeline:** ~6–8 weeks of evenings/weekends for a motivated beginner. Phases 2 and 3 are where the real learning (and struggle) lives — budget patience there.

---

## 9. How to Work With Cursor on This

- **Give it context:** tell Cursor "this is a Unity C# project, isometric orthographic camera, no physics." It tailors answers.
- **Ask one mechanic at a time:** "Write a grid-based A* pathfinder for tile movement in Unity C#" beats "build my game."
- **Make it explain:** as a beginner, after Cursor generates code, ask "explain what each part does and where this file goes in Unity." Learning > copy-paste.
- **Commit before big changes** so Cursor's suggestions can't break anything unrecoverably.
- **When stuck on the illusion logic** (Phase 3), describe the *visual* outcome you want, not the code — Cursor reasons better from the goal.

---

## 10. Definition of Done (v1)

You're finished with v1 — and ready to think about the multiplayer sequel — when:

- [ ] 5 levels playable start-to-finish on a real iPhone
- [ ] Walk + Rotate mechanics feel smooth and the illusion "reads"
- [ ] Dark atmospheric look + sound in place
- [ ] No words needed to understand how to play
- [ ] A friend can pick it up and have an "aha" moment

Ship that. Then we design the multiplayer follow-up on a foundation you actually understand.

---

## 11. Open Questions to Resolve Before Phase 4

1. **Figure design** — abstract shape, silhouette, or simple character? (Affects art effort.)
2. **One stretch mechanic** — if Walk + Rotate go well, do you want Slide or Perspective-lock next?

---

*End of doc. Build Phase 0 → 1 → 2 in order, commit at every success check, and don't add anything not in this doc until v1 ships.*
