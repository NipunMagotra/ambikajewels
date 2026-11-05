import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve('docs/audit/screenshots');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: '320px', width: 320, height: 640 },
  { name: '360px', width: 360, height: 740 },
  { name: '375px', width: 375, height: 667 },
  { name: '390px', width: 390, height: 844 },
  { name: '430px', width: 430, height: 932 },
  { name: '768px', width: 768, height: 1024 },
  { name: '1024px', width: 1024, height: 768 },
  { name: '1280px', width: 1280, height: 800 },
  { name: '1440px', width: 1440, height: 900 },
  { name: '1920px', width: 1920, height: 1080 }
];

const PAGES = [
  { id: 'homepage', path: '/' },
  { id: 'category', path: '/collections?category=Dogra%20Heritage%20Collection' },
  { id: 'product_listing', path: '/collections' },
  { id: 'product_detail', path: '/collections/authentic-22k-dogri-jhumki' },
  { id: 'cart', path: '/cart' },
  { id: 'checkout', path: '/checkout' },
  { id: 'login', path: '/admin/login' },
  { id: 'track', path: '/track' },
  { id: 'admin', path: '/admin' }
];

function capture(url, width, height, outputFile) {
  return new Promise((resolve, reject) => {
    const args = [
      '--headless=new',
      `--screenshot=${outputFile}`,
      `--window-size=${width},${height}`,
      '--hide-scrollbars',
      '--virtual-time-budget=2000',
      '--disable-gpu',
      '--no-sandbox',
      url
    ];

    const proc = spawn(CHROME_PATH, args, { stdio: 'pipe' });
    proc.on('close', (code) => {
      if (fs.existsSync(outputFile)) {
        const stats = fs.statSync(outputFile);
        resolve({ code, size: stats.size });
      } else {
        reject(new Error(`Screenshot failed to generate: ${outputFile}, code: ${code}`));
      }
    });
    proc.on('error', reject);
  });
}

async function run() {
  console.log(`Starting automated visual viewport capture for ${PAGES.length} pages across ${VIEWPORTS.length} viewports...`);
  const summary = [];

  // Key primary viewports for all pages, and deep matrix for core shopping pages
  const coreViewports = VIEWPORTS;

  for (const p of PAGES) {
    const url = `http://localhost:3000${p.path}`;
    console.log(`\n📸 Capturing Page: ${p.id} (${url})`);

    for (const vp of coreViewports) {
      const fileName = `${p.id}-${vp.name}.png`;
      const outPath = path.join(OUTPUT_DIR, fileName);
      try {
        const res = await capture(url, vp.width, vp.height, outPath);
        console.log(`  ✓ ${vp.name} (${vp.width}x${vp.height}): ${res.size} bytes -> ${fileName}`);
        summary.push({ page: p.id, viewport: vp.name, status: 'PASS', size: res.size, file: fileName });
      } catch (err) {
        console.error(`  ✖ ${vp.name} failed:`, err.message);
        summary.push({ page: p.id, viewport: vp.name, status: 'FAIL', error: err.message });
      }
    }
  }

  const manifestPath = path.join(OUTPUT_DIR, 'screenshot-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(summary, null, 2));
  console.log(`\nDone! All screenshots captured and indexed in ${manifestPath}`);
}

run().catch((err) => {
  console.error('Fatal capture error:', err);
  process.exit(1);
});
