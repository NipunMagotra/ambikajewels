import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

function getFaviconSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <!-- Background Velvet Gradient -->
    <radialGradient id="ambikaBg" cx="35%" cy="30%" r="85%" fx="25%" fy="20%">
      <stop offset="0%" stop-color="#4C111B" />
      <stop offset="50%" stop-color="#2D080F" />
      <stop offset="100%" stop-color="#140205" />
    </radialGradient>

    <!-- 22K Royal Gold Metallic Gradient for Monogram -->
    <linearGradient id="gold22k" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF8D6" />
      <stop offset="20%" stop-color="#F7D373" />
      <stop offset="50%" stop-color="#D49E28" />
      <stop offset="80%" stop-color="#A87413" />
      <stop offset="100%" stop-color="#E9C35A" />
    </linearGradient>

    <!-- Brilliant Star Gradient -->
    <radialGradient id="starShine" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="35%" stop-color="#FFF4B8" />
      <stop offset="70%" stop-color="#E2B13C" />
      <stop offset="100%" stop-color="#9E6E0F" />
    </radialGradient>

    <!-- Filigree Border Gold Gradient -->
    <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE8A0" stop-opacity="0.95" />
      <stop offset="50%" stop-color="#C59324" stop-opacity="0.65" />
      <stop offset="100%" stop-color="#F7D575" stop-opacity="0.9" />
    </linearGradient>

    <!-- Drop Shadow for Monogram Depth -->
    <filter id="royalShadow" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="0" dy="7" stdDeviation="9" flood-color="#000000" flood-opacity="0.7" />
    </filter>
  </defs>

  <!-- 1. Squircle Base (Deep Imperial Burgundy) -->
  <rect x="16" y="16" width="480" height="480" rx="112" fill="url(#ambikaBg)" />

  <!-- 2. Outer Delicate Filigree Border -->
  <rect x="24" y="24" width="464" height="464" rx="104" fill="none" stroke="url(#borderGrad)" stroke-width="3.5" />

  <!-- 3. Inner Concentric Jewelry Wire Frame -->
  <rect x="38" y="38" width="436" height="436" rx="90" fill="none" stroke="url(#borderGrad)" stroke-width="1.2" stroke-opacity="0.45" stroke-dasharray="6 3" />

  <!-- 4. Four Corner Accent Gems -->
  <g fill="url(#gold22k)" opacity="0.85">
    <polygon points="68,60 74,68 68,76 62,68" />
    <polygon points="444,60 450,68 444,76 438,68" />
    <polygon points="68,436 74,444 68,452 62,444" />
    <polygon points="444,436 450,444 444,452 438,444" />
  </g>

  <!-- 5. Central Royal Monogram & Crown Star -->
  <g filter="url(#royalShadow)">
    
    <!-- Crown: Dogra 8-Pointed Royal Star at Apex -->
    <g transform="translate(256, 114)">
      <!-- Cardinal Rays (Diamond Aura) -->
      <path d="M 0 -38 Q 0 0 38 0 Q 0 0 0 38 Q 0 0 -38 0 Q 0 0 0 -38 Z" fill="url(#starShine)" />
      <!-- Diagonal Rays -->
      <polygon points="0,-24 7,-7 24,0 7,7 0,24 -7,7 -24,0 -7,-7" fill="#FFFDF0" opacity="0.95" />
      <!-- Center Brilliant Solitaire Core -->
      <circle cx="0" cy="0" r="4.5" fill="#FFFFFF" />
    </g>

    <!-- Classical Serif Monogram "A" -->
    <text
      x="256"
      y="392"
      font-family="Georgia, 'Times New Roman', 'Didot', 'Playfair Display', serif"
      font-size="285"
      font-weight="bold"
      text-anchor="middle"
      fill="url(#gold22k)"
      letter-spacing="-2"
    >A</text>
  </g>
</svg>`;
}

function createIcoFromPngs(items) {
  const count = items.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // icon type
  header.writeUInt16LE(count, 4); // count of images

  let currentOffset = 6 + count * 16;
  const dirEntries = [];

  for (const item of items) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(item.size === 256 ? 0 : item.size, 0); // width
    entry.writeUInt8(item.size === 256 ? 0 : item.size, 1); // height
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(item.buffer.length, 8); // size of image data
    entry.writeUInt32LE(currentOffset, 12); // offset of image data
    dirEntries.push(entry);
    currentOffset += item.buffer.length;
  }

  return Buffer.concat([header, ...dirEntries, ...items.map(i => i.buffer)]);
}

async function main() {
  const svg = getFaviconSvg();
  const svgBuffer = Buffer.from(svg);

  // 1. Write SVG to src/app/icon.svg and public/icon.svg
  fs.writeFileSync(path.join('src', 'app', 'icon.svg'), svg, 'utf8');
  fs.writeFileSync(path.join('public', 'icon.svg'), svg, 'utf8');
  console.log('✓ Wrote src/app/icon.svg and public/icon.svg');

  // 2. Generate PNGs at various resolutions
  const sharpSvg = sharp(svgBuffer);

  const png16 = await sharpSvg.clone().resize(16, 16).png().toBuffer();
  const png32 = await sharpSvg.clone().resize(32, 32).png().toBuffer();
  const png48 = await sharpSvg.clone().resize(48, 48).png().toBuffer();
  const png180 = await sharpSvg.clone().resize(180, 180).png().toBuffer();
  const png192 = await sharpSvg.clone().resize(192, 192).png().toBuffer();
  const png512 = await sharpSvg.clone().resize(512, 512).png().toBuffer();

  // 3. Apple Touch Icons
  fs.writeFileSync(path.join('src', 'app', 'apple-icon.png'), png180);
  fs.writeFileSync(path.join('public', 'apple-touch-icon.png'), png180);
  console.log('✓ Wrote src/app/apple-icon.png and public/apple-touch-icon.png (180x180)');

  // 4. Android / PWA Icons
  fs.writeFileSync(path.join('public', 'icon-192.png'), png192);
  fs.writeFileSync(path.join('public', 'icon-512.png'), png512);
  console.log('✓ Wrote public/icon-192.png and public/icon-512.png');

  // 5. Multi-resolution ICO (16, 32, 48)
  const icoBuffer = createIcoFromPngs([
    { size: 16, buffer: png16 },
    { size: 32, buffer: png32 },
    { size: 48, buffer: png48 }
  ]);

  fs.writeFileSync(path.join('src', 'app', 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join('public', 'favicon.ico'), icoBuffer);
  console.log('✓ Wrote src/app/favicon.ico and public/favicon.ico (multi-resolution 16/32/48)');

  // 6. Clean up temporary test files in scripts
  const tempFiles = [
    'scripts/test-favicon.svg',
    'scripts/test-favicon.ico',
    'scripts/test-16.png',
    'scripts/test-32.png',
    'scripts/test-48.png',
    'scripts/test-180.png',
    'scripts/test-512.png',
    'scripts/test-text.png',
    'scripts/test-font-180.png',
    'scripts/test-font-32.png',
    'scripts/preview-ambika.svg',
    'scripts/preview-16.png',
    'scripts/preview-32.png',
    'scripts/preview-48.png',
    'scripts/preview-180.png',
    'scripts/preview-512.png',
    'scripts/preview-32-v2.png',
    'scripts/preview-180-v2.png',
    'scripts/test-favicon.mjs',
    'scripts/test-font.mjs',
    'scripts/test-v2.mjs',
    'scripts/build-favicons.mjs'
  ];

  for (const f of tempFiles) {
    if (fs.existsSync(f)) {
      try {
        fs.unlinkSync(f);
      } catch {}
    }
  }
  console.log('✓ Cleaned up scratch scripts');
  console.log('All Ambika Jewels favicons generated successfully!');
}

main().catch(console.error);
