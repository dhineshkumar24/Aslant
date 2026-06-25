import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const assetsDir = join(root, 'assets');

const BG = '#0a0a0f';
const BG_TOP = '#15151f';
const PLAYER = '#ff9d3c';
const PLAYER_CORE = '#ffd9a0';
const PLAYER_GLOW = '#ffb968';
const HAZARD = '#2e2e3e';
const HAZARD_EDGE = '#4a4a63';
const TEXT = '#d8d6e0';
const TEXT_MUTED = '#8a8894';

/**
 * App icon: the game in one frame — cold shards falling from the dark toward
 * the warm lantern (the only light). Radial glow + bg gradient so it reads as
 * a finished, designed mark, not a flat placeholder dot.
 */
function iconSvg(size) {
  const cx = size / 2;
  const lanternY = size * 0.62;
  const core = size * 0.085;
  const glowR = size * 0.3;

  // Falling shards (the hazards), kept inside the ~10% safe margin.
  const shard = (x, y, s, rot, fill, stroke, op) =>
    `<rect x="${x - s / 2}" y="${y - s / 2}" width="${s}" height="${s}" rx="${s * 0.12}" `
    + `fill="${fill}" fill-opacity="${op}" stroke="${stroke}" stroke-width="${size * 0.004}" `
    + `stroke-opacity="${op}" transform="rotate(${rot} ${x} ${y})"/>`;

  const shards = [
    shard(size * 0.30, size * 0.20, size * 0.105, 28, HAZARD, HAZARD_EDGE, 1),
    shard(size * 0.66, size * 0.27, size * 0.085, -22, HAZARD, HAZARD_EDGE, 1),
    shard(size * 0.74, size * 0.46, size * 0.07, 40, HAZARD, HAZARD_EDGE, 0.7),
    shard(size * 0.24, size * 0.42, size * 0.055, 15, HAZARD, HAZARD_EDGE, 0.55),
  ].join('\n  ');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <radialGradient id="bg" cx="50%" cy="60%" r="78%">
      <stop offset="0%" stop-color="${BG_TOP}"/>
      <stop offset="100%" stop-color="${BG}"/>
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${PLAYER_CORE}"/>
      <stop offset="20%" stop-color="${PLAYER}"/>
      <stop offset="42%" stop-color="${PLAYER}" stop-opacity="0.45"/>
      <stop offset="70%" stop-color="${PLAYER_GLOW}" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="${PLAYER_GLOW}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="coreGrad" cx="50%" cy="42%" r="60%">
      <stop offset="0%" stop-color="#fff3df"/>
      <stop offset="60%" stop-color="${PLAYER_CORE}"/>
      <stop offset="100%" stop-color="${PLAYER}"/>
    </radialGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#bg)"/>
  ${shards}
  <circle cx="${cx}" cy="${lanternY}" r="${glowR}" fill="url(#glow)"/>
  <circle cx="${cx}" cy="${lanternY}" r="${core}" fill="url(#coreGrad)"/>
</svg>`;
}

function splashSvg(size) {
  const cx = size / 2;
  const titleY = size * 0.46;
  const subtitleY = size * 0.505;
  const lanternY = size * 0.62;
  const r = size * 0.045;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${BG}"/>
  <text x="${cx}" y="${titleY}" text-anchor="middle" fill="${PLAYER}" font-family="Georgia, 'Times New Roman', serif" font-size="${size * 0.09}" font-weight="700" letter-spacing="6">ASLANT</text>
  <text x="${cx}" y="${subtitleY}" text-anchor="middle" fill="${TEXT_MUTED}" font-family="Georgia, 'Times New Roman', serif" font-size="${size * 0.05}" letter-spacing="4">drop</text>
  <circle cx="${cx}" cy="${lanternY}" r="${r * 2.2}" fill="${PLAYER_GLOW}" opacity="0.14"/>
  <circle cx="${cx}" cy="${lanternY}" r="${r * 1.45}" fill="${PLAYER_GLOW}" opacity="0.24"/>
  <circle cx="${cx}" cy="${lanternY}" r="${r}" fill="${PLAYER}"/>
  <text x="${cx}" y="${size * 0.74}" text-anchor="middle" fill="${TEXT}" opacity="0.55" font-family="system-ui, sans-serif" font-size="${size * 0.022}">tap and hold to move</text>
</svg>`;
}

async function writePng(svg, size, path) {
  // Flatten onto the bg color so the PNG has no alpha channel — Apple rejects
  // App Store icons that contain transparency.
  await sharp(Buffer.from(svg)).flatten({ background: BG }).png().toFile(path);
  console.log(`wrote ${path} (${size}x${size})`);
}

await mkdir(assetsDir, { recursive: true });
await writePng(iconSvg(1024), 1024, join(assetsDir, 'icon-only.png'));
await writePng(splashSvg(2732), 2732, join(assetsDir, 'splash.png'));
