#!/usr/bin/env node

/**
 * Pad the base icon artwork into the maskable safe zone.
 * Source art (static/icons/base-icon.png) draws edge-to-edge, so a plain
 * resize would get clipped under circular/squircle install-icon masks.
 *
 * Usage: node scripts/generate-maskable-icons.js
 */

import sharp from 'sharp';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, '../static/icons');
const sourcePath = join(iconsDir, 'base-icon.png');

const BACKGROUND = '#ffffff'; // matches manifest background_color
const SAFE_ZONE_SCALE = 0.6; // artwork occupies 60% of canvas, centered

const targets = [192, 512];

async function generateMaskableIcon(size) {
  const artworkSize = Math.round(size * SAFE_ZONE_SCALE);

  const artwork = await sharp(sourcePath)
    .resize(artworkSize, artworkSize)
    .toBuffer();

  const outputPath = join(iconsDir, `icon-${size}-maskable.png`);

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: BACKGROUND
    }
  })
    .composite([{ input: artwork, gravity: 'center' }])
    .png()
    .toFile(outputPath);

  console.log(`  Created: icon-${size}-maskable.png`);
}

async function main() {
  console.log('Generating maskable PWA icons...');
  for (const size of targets) {
    await generateMaskableIcon(size);
  }
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
