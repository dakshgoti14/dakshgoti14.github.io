// Renders raster assets with a local headless Chrome:
//   assets/img/og-image.png (1200x630), favicon.png (64), assets/img/apple-touch-icon.png (180)
// Run with `npm run assets`. Set CHROME=/path/to/chrome if Chrome is not in the default macOS location.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const chrome = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const tmp = mkdtempSync(join(tmpdir(), 'portfolio-assets-'));

const shoot = (url, out, [w, h]) => {
  execFileSync(chrome, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
    '--virtual-time-budget=4000', `--window-size=${w},${h}`, `--screenshot=${join(root, out)}`, url,
  ], { stdio: 'ignore' });
  console.log(`wrote ${out}`);
};

shoot(pathToFileURL(join(root, 'scripts/og.html')).href, 'assets/img/og-image.png', [1200, 630]);

const svg = readFileSync(join(root, 'favicon.svg'), 'utf8');
for (const [size, out] of [[64, 'favicon.png'], [180, 'assets/img/apple-touch-icon.png']]) {
  const page = join(tmp, `icon-${size}.html`);
  writeFileSync(page, `<!DOCTYPE html><style>*{margin:0}html,body{width:${size}px;height:${size}px;background:#0b0b0d}svg{width:${size}px;height:${size}px}</style>${svg}`);
  shoot(pathToFileURL(page).href, out, [size, size]);
}
