#!/usr/bin/env node

/**
 * Generate PWA icons from SVG
 *
 * Usage:
 *   pnpm add -D sharp
 *   node scripts/generate-icons.js
 */

import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, '../static/icons');

// Ensure icons directory exists
mkdirSync(iconsDir, { recursive: true });

// Icon sizes needed for PWA
const sizes = [16, 32, 192, 512];

// SVG content for the icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <circle cx="256" cy="256" r="256" fill="#3b82f6"/>
  <text x="256" y="320" font-family="Arial, sans-serif" font-size="280" font-weight="bold" fill="white" text-anchor="middle">C</text>
</svg>`;

async function generateIcons() {
  console.log('Generating PWA icons...');

  for (const size of sizes) {
    const outputPath = join(iconsDir, `icon-${size}.png`);

    await sharp(Buffer.from(svgContent))
      .resize(size, size)
      .png()
      .toFile(outputPath);

    console.log(`  Created: icon-${size}.png`);
  }

  console.log('Done! Icons generated in static/icons/');
}

generateIcons().catch(console.error);
