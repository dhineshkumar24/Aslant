# Aslant

A dark-themed illusion puzzler for iOS. **Monument Valley's mechanic, INSIDE's mood.**

> You guide a small, lantern-lit figure through impossible architecture in a world of shadow — rotating and shifting structures so that paths which *look* connected actually become connected, escaping deeper into a silent, unsettling place.

**Status:** Phase 0 in progress — Unity project scaffolded; open in Unity Hub to verify Play mode  
**Engine:** Unity 6.3 LTS (`6000.3.x`)  
**Repository:** [github.com/dhineshkumar24/Aslant](https://github.com/dhineshkumar24/Aslant) (private)  
**Default branch:** `master`

For the full design document and step-by-step build plan, see [`Aslant_game_design_and_build_plan.md`](./Aslant_game_design_and_build_plan.md).

---

## Design Pillars

Every feature is checked against these three rules. If it doesn't serve a pillar, cut it.

1. **The Illusion Is the Game** — The core joy is the "aha" moment when an impossible path resolves into a real one.
2. **Mood Through Restraint** — Dark, quiet, atmospheric. No text, no UI clutter, no word-based tutorials. Dread and beauty come from art, light, sound, and silence.
3. **Buildable by One Person** — Fixed isometric camera and grid-based mechanics only. No physics engine, no character animation rig, no twitch timing.

---

## Core Mechanic

**Impossible geometry on a fixed orthographic isometric camera.**

When the camera is locked to one angle, two points far apart in 3D space can appear touching on screen. Let the player walk along that visual connection, and you create a path that "can't exist."

| Mechanic | Player action | v1 scope |
|---|---|---|
| **Walk** | Tap a destination; figure walks along valid tiles | ✅ Ship |
| **Rotate** | Drag to rotate a structure in 90° snaps; new visual connections form | ✅ Ship |
| **Slide** | Drag a platform along a track to bridge a gap | Stretch goal |
| **Perspective lock** | Path is only "real" when two pieces align on screen | Stretch goal |

---

## Out of Scope (v1)

- Real-time physics
- Character death / respawn / timing hazards
- Procedural / AI-generated levels
- Multiplayer (planned as a follow-up project after v1 ships)
- Story cutscenes, voice, dialogue
- In-app purchases, ads, accounts, leaderboards

---

## Aesthetic Direction

- **Palette:** Near-black backgrounds, deep indigos and charcoals, one warm accent — the figure's lantern (amber/orange)
- **Geometry:** Clean, low-poly, monolithic — brutalist ruins
- **Light:** Pools of light and long shadows; the figure carries the only reliable light source
- **Sound:** Low ambient drone, sparse interaction notes, deliberate silence
- **UI:** None during play — no score, timer, or on-screen buttons

---

## Levels (Vertical Slice)

Five hand-authored levels. Ship these before adding anything else.

| # | Name | Teaches |
|---|---|---|
| 1 | **Descent** | Tap-to-move, isometric look; gentle rotation hook at the end |
| 2 | **The Turn** | Rotate — one structure, one rotation, one obvious solution |
| 3 | **Two Hands** | Two rotatable pieces that must align — first real "aha" |
| 4 | **Misdirection** | Obvious path is wrong; real path requires ignoring the obvious |
| 5 | **The Threshold** | Combines everything; figure steps into darkness — sequel hook |

---

## Tech Stack

| Layer | Choice |
|---|---|
| Engine | Unity 6.3 LTS (`6000.3.x`), C# |
| Editor | Cursor (scripts) + Unity Editor (scenes) |
| Target | iOS via Xcode build/sign |
| Source control | Git + GitHub |
| Art | Unity primitives first, then free low-poly asset packs |

Unity was chosen over SwiftUI/SceneKit for its mature isometric 3D workflow, asset store, and tutorial ecosystem.

---

## Build Plan

Each phase ends with something running. Do not start a phase until the previous one works and is committed.

| Phase | Focus | Est. time |
|---|---|---|
| **0** | Environment — Unity Hub, LTS + iOS module, Git, empty 3D project | ½ day |
| **1** | Isometric look — orthographic camera, tile floor, placeholder figure | 1–2 days |
| **2** | Walk — grid graph, tap-to-move, A* pathfinding | 3–5 days |
| **3** | Rotate & illusion — 90° snap rotation, screen-space graph connection | 5–7 days |
| **4** | Five levels + fade transitions | 1–2 weeks |
| **5** | Mood pass — palette, lantern light, audio, fog/vignette | 3–5 days |
| **6** | iOS build — Xcode, sign, install on device | 1–2 days |

**Realistic timeline:** ~6–8 weeks of evenings/weekends. Phases 2 and 3 are where the real learning lives.

---

## Technical Recommendations

Notes from design review — decisions to make early to avoid rework.

### Pathfinding: use grid + A*, not NavMesh

Walkable topology changes when structures rotate. A dynamic tile graph that merges/splits at visual seams is easier to manage with hand-rolled grid pathfinding than NavMesh rebaking on every rotation.

### Phase 3 is the critical system — prototype it first

The core challenge is **connecting tile graphs when two pieces align on screen**. Before polishing levels, spike this in greybox:

- Screen-space overlap checks (2D bounds/projections of walkable edges)
- 90° snap rotations only (simplifies "aligned" detection)
- Explicit connection points on structures that link when aligned

### iOS touch input

Define tap vs. drag rules early to avoid conflicts between Walk (tap) and Rotate (drag):

- Tap vs. drag threshold
- Separate rotation handles from walk targets
- Behavior when tapping near a rotatable edge

### Movement feel without a rig

No animation rig needed, but budget for cheap polish: lerp between tiles, slight bob, lantern sway, simple shadow.

### Soft undo

No death state, but players may rotate into dead ends. Consider a no-UI undo (e.g. double-tap to revert last rotation).

---

## Definition of Done (v1)

- [ ] 5 levels playable start-to-finish on a real iPhone
- [ ] Walk + Rotate mechanics feel smooth and the illusion reads clearly
- [ ] Dark atmospheric look and sound in place
- [ ] No words needed to understand how to play
- [ ] A friend can pick it up and have an "aha" moment

---

## Open Questions

Resolve before Phase 4 (level building):

1. **Figure design** — Abstract silhouette + lantern (recommended: hooded shape or simple blockout; no rig cost)
2. **Stretch mechanic** — Slide recommended over Perspective-lock (more teachable without words)

---

## Working With Cursor

- Give context: *"Unity C# project, isometric orthographic camera, no physics"*
- Ask one mechanic at a time, not "build my game"
- After generated code, ask for explanations — learning beats copy-paste
- Commit before big changes
- When stuck on illusion logic, describe the visual outcome you want, not the code

---

## Project Structure

```
.
├── README.md
├── Aslant_game_design_and_build_plan.md
├── .gitignore
├── Assets/
│   └── Scenes/
│       └── Main.unity          # Phase 0 scene — camera, light, cube
├── Packages/
│   └── manifest.json
└── ProjectSettings/
```

---

## Phase 0 — Local Setup

Complete these steps on your machine (Unity + iOS builds require macOS for device deploy):

1. Install [Unity Hub](https://unity.com/download) and add **Unity 6.3 LTS** (`6000.3.x`) with **iOS Build Support**.
2. Clone this repo and open the project folder in Unity Hub (**Add → Add project from disk**).
3. Open `Assets/Scenes/Main.unity`, press **Play** — you should see a cube in the default 3D scene.
4. Open the same folder in Cursor for script editing.

---

## License

Private repository. License TBD.
