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

class SimpleCDP {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const cb = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) cb.reject(new Error(msg.error.message));
          else cb.resolve(msg.result);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = this.id++;
      this.callbacks.set(msgId, { resolve, reject });
      this.ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function waitForChromePort(port, retries = 20) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.ok) return await res.json();
    } catch {
      await new Promise((r) => setTimeout(r, 250));
    }
  }
  throw new Error(`Chrome failed to start on port ${port}`);
}

async function main() {
  const port = 9333;
  console.log(`Starting headless Chrome on remote debugging port ${port}...`);

  const chromeProc = spawn(
    CHROME_PATH,
    [
      '--headless=new',
      `--remote-debugging-port=${port}`,
      '--disable-gpu',
      '--no-sandbox',
      '--hide-scrollbars',
      '--disable-extensions'
    ],
    { stdio: 'ignore' }
  );

  try {
    const versionInfo = await waitForChromePort(port);
    console.log(`Connected to Chrome: ${versionInfo.Browser}`);

    // Create a new target page
    const newTabRes = await fetch(`http://127.0.0.1:${port}/json/new?http://localhost:3000/`, { method: 'PUT' });
    const target = await newTabRes.json();
    const cdp = new SimpleCDP(target.webSocketDebuggerUrl);
    await cdp.connect();

    await cdp.send('Page.enable');
    await cdp.send('DOM.enable');
    await cdp.send('Runtime.enable');

    console.log(`\nStarting high-speed visual & DOM audit across ${PAGES.length} pages and ${VIEWPORTS.length} viewports...`);
    const findings = [];

    for (const p of PAGES) {
      const pageUrl = `http://localhost:3000${p.path}`;
      console.log(`\n➡️ Navigating to [${p.id}] -> ${pageUrl}`);

      await cdp.send('Page.navigate', { url: pageUrl });
      // Allow Next.js page hydration
      await new Promise((r) => setTimeout(r, 1200));

      for (const vp of VIEWPORTS) {
        // Set viewport metrics
        await cdp.send('Emulation.setDeviceMetricsOverride', {
          width: vp.width,
          height: vp.height,
          deviceScaleFactor: 1,
          mobile: vp.width < 768
        });

        // Small wait for responsive reflow
        await new Promise((r) => setTimeout(r, 100));

        // Evaluate DOM for UI/UX defects
        const evalRes = await cdp.send('Runtime.evaluate', {
          expression: `(() => {
            const docWidth = document.documentElement.scrollWidth;
            const winWidth = window.innerWidth;
            const overflow = docWidth > winWidth;
            const images = Array.from(document.querySelectorAll('img'));
            const brokenImages = images.filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src);
            const buttons = Array.from(document.querySelectorAll('button, a'));
            const tinyTargets = buttons.filter(b => {
              const r = b.getBoundingClientRect();
              return r.width > 0 && r.height > 0 && (r.width < 28 || r.height < 28);
            }).length;

            return {
              overflow,
              docWidth,
              winWidth,
              brokenImagesCount: brokenImages.length,
              brokenImages: brokenImages.slice(0, 3),
              tinyTargets
            };
          })()`,
          returnByValue: true
        });

        const domStats = evalRes.result.value || {};

        // Capture Screenshot
        const screenshotRes = await cdp.send('Page.captureScreenshot', { format: 'png' });
        const fileName = `${p.id}-${vp.name}.png`;
        const filePath = path.join(OUTPUT_DIR, fileName);
        fs.writeFileSync(filePath, Buffer.from(screenshotRes.data, 'base64'));

        const stats = fs.statSync(filePath);
        console.log(`  ✓ ${vp.name.padEnd(7)} | ${stats.size} bytes | Overflow: ${domStats.overflow ? '🚨 YES' : 'NO'} | BrokenImgs: ${domStats.brokenImagesCount} | TinyTargets: ${domStats.tinyTargets}`);

        findings.push({
          page: p.id,
          path: p.path,
          viewport: vp.name,
          width: vp.width,
          height: vp.height,
          screenshot: fileName,
          fileSize: stats.size,
          overflow: domStats.overflow,
          docWidth: domStats.docWidth,
          winWidth: domStats.winWidth,
          brokenImagesCount: domStats.brokenImagesCount,
          brokenImages: domStats.brokenImages,
          tinyTargets: domStats.tinyTargets
        });
      }
    }

    const reportPath = path.join(OUTPUT_DIR, 'cdp-audit-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(findings, null, 2));
    console.log(`\n🎉 Visual audit complete! ${findings.length} screenshots and DOM analyses saved to ${reportPath}`);

    cdp.close();
  } finally {
    chromeProc.kill();
  }
}

main().catch((err) => {
  console.error('Fatal CDP error:', err);
  process.exit(1);
});

