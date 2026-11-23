// 使い方:
//   node render.mjs <chapter> <full|digest>                 → out/<chapter>-<version>.mp4
//   node render.mjs <chapter> <full|digest> --stills 3,10.5 → out/stills/<chapter>-<version>-<t>.png
//   --fps 30（既定）
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const ROOT = path.dirname(fileURLToPath(import.meta.url));

const [chapter, version = 'full', ...rest] = process.argv.slice(2);
if (!chapter) { console.error('usage: node render.mjs <chapter> <full|digest> [--stills t,t] [--fps n]'); process.exit(1); }
const opt = (name) => { const i = rest.indexOf(name); return i >= 0 ? rest[i + 1] : null; };
const fps = Number(opt('--fps') || 30);
const stills = opt('--stills');

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.png': 'image/png', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
});
await new Promise((r) => server.listen(0, r));
const port = server.address().port;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
page.on('pageerror', (e) => { console.error('page error:', e.message); process.exitCode = 1; });
await page.goto(`http://localhost:${port}/player.html?chapter=${chapter}&version=${version}&render=1`);
await page.waitForFunction(() => window.__ready === true, null, { timeout: 30000 });
const duration = await page.evaluate(() => window.__duration);
const scenes = await page.evaluate(() => window.__scenes);
console.log(`${chapter}/${version}: ${duration.toFixed(1)}s, ${scenes.length} scenes`);

const outDir = path.join(ROOT, 'out');
fs.mkdirSync(path.join(outDir, 'stills'), { recursive: true });

if (stills) {
  for (const t of stills.split(',').map(Number)) {
    await page.evaluate((t) => window.__seek(t), t);
    const file = path.join(outDir, 'stills', `${chapter}-${version}-${t}.png`);
    await page.screenshot({ path: file });
    console.log(file);
  }
} else {
  const file = path.join(outDir, `${chapter}-${version}.mp4`);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(fps), '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', file], { stdio: ['pipe', 'inherit', 'inherit'] });
  const frames = Math.round(duration * fps);
  const t0 = Date.now();
  for (let f = 0; f < frames; f++) {
    await page.evaluate((t) => window.__seek(t), f / fps);
    const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    if (f % (fps * 10) === 0) console.log(`  ${(f / fps).toFixed(0)}s / ${duration.toFixed(0)}s  (${((Date.now() - t0) / 1000).toFixed(0)}s elapsed)`);
  }
  ff.stdin.end();
  await new Promise((r) => ff.on('close', r));
  console.log(file);
}

await browser.close();
server.close();
