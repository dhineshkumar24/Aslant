# ASLANT: Drop

A one-tap avoider with a dark, moody atmosphere. Built with Phaser 3 + Vite, wrapped for iOS with Capacitor.

## Try it right now (no setup)

Double-click **`aslant-drop-prototype.html`** to play in your browser. This is the v1 target — the full game running from a single file. Use it as your reference spec while you rebuild it as a proper project below.

## The real project structure (Phase 1)

When you scaffold the Vite project in Cursor, organize it like this:

```
aslant-drop/
├── index.html              # entry point, loads main.js
├── package.json
├── vite.config.js
├── src/
│   ├── main.js             # boots Phaser.Game with the config
│   ├── config.js           # the CONFIG constants (tunable feel values)
│   └── scenes/
│       ├── MenuScene.js    # title + tap to start
│       ├── PlayScene.js    # the core game loop
│       └── GameOverScene.js
└── public/
    └── audio/              # ambient drone + hit sounds (add in Phase 5)
```

The prototype HTML file already contains all three scenes' logic inline — when you build the real project, you'll split each `class XxxScene` into its own file under `src/scenes/` and `import` them in `main.js`. Cursor can do this split for you: *"split this single-file Phaser game into separate scene modules using ES imports."*

## Setup commands (run in Cursor's terminal — Phase 1)

```bash
# scaffold a vanilla Vite project
npm create vite@latest aslant-drop -- --template vanilla

cd aslant-drop
npm install
npm install phaser

# start the dev server with hot-reload
npm run dev
```

Then open the local URL it prints. Edit files in Cursor; the browser updates instantly.

## Build for iOS (Phase 6)

```bash
npm run build                      # produces dist/
npm install @capacitor/core @capacitor/cli @capacitor/ios
npx cap init
npx cap add ios
npx cap copy
npx cap open ios                   # opens Xcode — sign & run on your iPhone
```

## Tuning the feel

All the values that control how the game *feels* live in `CONFIG` (player speed, hazard speed, spawn rate, difficulty ramp, palette). Change those first before touching game logic — most of the "juice" is in tuning.

## Credits / assets

- Engine: [Phaser 3](https://phaser.io)
- Sounds (Phase 5): grab CC0 ambient + impact sounds from [freesound.org](https://freesound.org)
