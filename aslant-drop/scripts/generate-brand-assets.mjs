import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const assetsDir = join(root, 'assets');

const BG = '#0a0a0f';
const PLAYER = '#ff9d3c';
const PLAYER_GLOW = '#ffb968';
const TEXT = '#d8d6e0';
const TEXT_MUTED = '#8a8894';

function iconSvg(size) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.14;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${BG}"/>
  <circle cx="${cx}" cy="${cy}" r="${r * 2.4}" fill="${PLAYER_GLOW}" opacity="0.12"/>
  <circle cx="${cx}" cy="${cy}" r="${r * 1.6}" fill="${PLAYER_GLOW}" opacity="0.22"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="${PLAYER}"/>
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
  await sharp(Buffer.from(svg)).png().toFile(path);
  console.log(`wrote ${path} (${size}x${size})`);
}

await mkdir(assetsDir, { recursive: true });
await writePng(iconSvg(1024), 1024, join(assetsDir, 'icon-only.png'));
await writePng(splashSvg(2732), 2732, join(assetsDir, 'splash.png'));
