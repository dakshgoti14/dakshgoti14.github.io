// Renders raster assets with a local headless Chrome:
//   assets/img/og-image.png (1200x630), favicon.png (64), assets/img/apple-touch-icon.png (180),
//   assets/img/og/<slug>.png — one social preview per case study.
// Run with `npm run assets`. Set CHROME=/path/to/chrome if Chrome is not in the default macOS location.
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { projects, profile } from '../content/site.mjs';
import { techVisual } from '../content/tech.mjs';

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
  writeFileSync(page, `<!DOCTYPE html><style>*{margin:0}html,body{width:${size}px;height:${size}px;background:#16191e}svg{width:${size}px;height:${size}px}</style>${svg}`);
  shoot(pathToFileURL(page).href, out, [size, size]);
}

// ---- Case-study previews ------------------------------------------------------------------
const esc = (v) => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const file = (p) => pathToFileURL(join(root, p)).href;
const fontFaces = `
  @font-face { font-family: 'Space Grotesk'; font-weight: 400 700; src: url(${file('assets/fonts/space-grotesk-latin.woff2')}) format('woff2'); }
  @font-face { font-family: 'Geist Mono'; font-weight: 400 500; src: url(${file('assets/fonts/geist-mono-latin.woff2')}) format('woff2'); }`;
const chip = (name) => {
  const v = techVisual(name);
  const mark = v?.logo ? `<img src="${file(`assets/img/tech/${v.logo}.svg`)}" alt="">` : '';
  return `<span class="chip">${mark}${esc(name)}</span>`;
};
mkdirSync(join(root, 'assets/img/og'), { recursive: true });
for (const [i, p] of projects.entries()) {
  const html = `<!DOCTYPE html><meta charset="utf-8"><style>${fontFaces}
  * { margin: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; }
  body { background: #16191e; color: #f3f5f8; font-family: 'Space Grotesk', sans-serif; padding: 56px 72px 60px; display: flex; flex-direction: column; }
  .top { display: flex; align-items: center; gap: 16px; font-size: 26px; font-weight: 700; letter-spacing: -.015em; }
  .mark { width: 48px; height: 48px; border-radius: 12px; display: grid; place-items: center; font-size: 18px; letter-spacing: 0; color: #fff; background: #2563eb; }
  .label { margin-left: auto; font-size: 20px; letter-spacing: .08em; text-transform: uppercase; }
  .label b { color: #6ea0ff; margin-right: 10px; }
  .rule { display: block; width: 104px; height: 7px; background: #f3f5f8; margin-top: 56px; }
  h1 { margin-top: 26px; font-size: 96px; font-weight: 700; letter-spacing: -.045em; line-height: 1; }
  .tag { margin-top: 16px; font-size: 32px; font-weight: 500; letter-spacing: -.015em; color: #c2c9d3; }
  .metrics { margin-top: auto; display: flex; gap: 16px; }
  .m { flex: 1; padding: 20px 24px; border-radius: 18px; background: #232831; }
  .m b { display: block; font-size: 44px; font-weight: 700; letter-spacing: -.04em; line-height: 1.05; }
  .m span { display: block; margin-top: 6px; font-size: 19px; color: #8f99a8; }
  .chips { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px; }
  .chip { display: inline-flex; align-items: center; gap: 10px; padding: 8px 16px 8px 12px; border-radius: 10px; font-size: 19px; color: #c2c9d3; background: #2b313b; }
  .chip img { width: 22px; height: 22px; }
  </style>
  <div class="top"><span class="mark">DG</span>${esc(profile.name)}<span class="label"><b>/</b>Case study ${String(i + 1).padStart(2, '0')}</span></div>
  <span class="rule"></span>
  <h1>${esc(p.name)}</h1>
  <p class="tag">${esc(p.tagline)}</p>
  <div class="metrics">${p.metrics.map((m) => `<div class="m"><b>${esc(m.value)}</b><span>${esc(m.label)}</span></div>`).join('')}</div>
  <div class="chips">${p.cardStack.map(chip).join('')}</div>`;
  const page = join(tmp, `og-${p.slug}.html`);
  writeFileSync(page, html);
  shoot(pathToFileURL(page).href, `assets/img/og/${p.slug}.png`, [1200, 630]);
}
