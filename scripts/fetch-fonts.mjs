// Self-hosts the Space Grotesk and Geist Mono variable fonts (latin subset) from Google Fonts, so pages
// don't block on third-party font requests. Writes assets/fonts/*.woff2 and assets/fonts/fonts.json
// (unicode ranges + weight ranges), which scripts/components.mjs inlines as @font-face rules.
// Run with `npm run fonts`. Fonts: SIL Open Font License 1.1.
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'assets/fonts');
const FAMILIES = [
  { family: 'Space Grotesk', file: 'space-grotesk-latin.woff2', weights: '400 700' },
  { family: 'Geist Mono', file: 'geist-mono-latin.woff2', weights: '400 500' },
];
const query = 'family=Space+Grotesk:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap';
// A modern user agent makes Google serve woff2.
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';

const css = await (await fetch(`https://fonts.googleapis.com/css2?${query}`, { headers: { 'User-Agent': UA } })).text();
const blocks = [...css.matchAll(/\/\* latin \*\/\s*@font-face\s*{([^}]*)}/g)].map((m) => m[1]);
await mkdir(out, { recursive: true });

const manifest = [];
for (const f of FAMILIES) {
  const block = blocks.find((b) => new RegExp(`font-family:\\s*'${f.family}'`).test(b));
  if (!block) throw new Error(`no latin block for ${f.family}`);
  const url = block.match(/url\(([^)]+)\)/)[1];
  const range = block.match(/unicode-range:\s*([^;]+);/)[1].trim();
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${f.family}: HTTP ${res.status}`);
  await writeFile(join(out, f.file), Buffer.from(await res.arrayBuffer()));
  manifest.push({ family: f.family, file: f.file, weights: f.weights, unicodeRange: range });
}
await writeFile(join(out, 'fonts.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`wrote ${manifest.map((m) => m.file).join(', ')}`);
