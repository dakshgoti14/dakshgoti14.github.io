// Static checks for the generated pages. Zero dependencies; exits non-zero on any error.
//   - local links/assets exist, and #anchors exist on the page they point to
//   - ids are unique, images have alt text, external new-tab links use rel="noopener"
//   - exactly one <h1>, and heading levels never skip (h2 -> h4)
//   - personal details removed from the public site do not reappear
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, normalize, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { projects } from '../content/site.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pages = ['index.html', ...projects.map((p) => `projects/${p.slug}.html`)];

const PRIVATE = [/05 June 2002/i, /Garford/i, /Unit 079/i, /562-386-4548/, /student\.csulb\.edu/i, /90815/];

const errors = [];
const fail = (page, msg) => errors.push(`${page}: ${msg}`);

const idCache = new Map();
const idsOf = (file) => {
  if (!idCache.has(file)) {
    const html = readFileSync(file, 'utf8');
    idCache.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  }
  return idCache.get(file);
};

for (const page of pages) {
  const file = join(root, page);
  if (!existsSync(file)) { fail(page, 'page missing — run `npm run build`'); continue; }
  const html = readFileSync(file, 'utf8');
  // Ignore the inline JSON-LD and scripts when scanning markup.
  const markup = html.replace(/<script\b[\s\S]*?<\/script>/g, '');

  // Unique ids
  const seen = new Set();
  for (const [, id] of markup.matchAll(/\sid="([^"]+)"/g)) {
    if (seen.has(id)) fail(page, `duplicate id "${id}"`);
    seen.add(id);
  }

  // Local links and assets
  for (const [, attr, url] of html.matchAll(/\s(href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:|tel:|data:)|^\/\//.test(url)) continue;
    const [path, hash] = url.split('#');
    const target = path ? normalize(join(dirname(file), path.split('?')[0])) : file;
    if (!target.startsWith(root)) { fail(page, `${attr} escapes the site: ${url}`); continue; }
    if (!existsSync(target)) { fail(page, `broken ${attr}: ${url}`); continue; }
    if (hash && target.endsWith('.html') && !idsOf(target).has(hash)) {
      fail(page, `missing anchor #${hash} in ${relative(root, target)}`);
    }
  }

  // Images need alt text
  for (const [tag] of markup.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt="[^"]*"/.test(tag)) fail(page, `img without alt: ${tag.slice(0, 80)}`);
  }

  // New-tab links must not expose window.opener
  for (const [tag] of markup.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
    if (!/rel="[^"]*noopener/.test(tag)) fail(page, `target=_blank without rel=noopener: ${tag.slice(0, 80)}`);
  }

  // Buttons need an accessible name
  for (const [, inner] of markup.matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/g)) {
    const text = inner.replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]+>/g, '').trim();
    if (!text) fail(page, 'button without an accessible name');
  }

  // Headings
  const levels = [...markup.matchAll(/<h([1-6])\b/g)].map((m) => Number(m[1]));
  const h1s = levels.filter((l) => l === 1).length;
  if (h1s !== 1) fail(page, `expected exactly one <h1>, found ${h1s}`);
  levels.reduce((prev, level) => {
    if (level > prev + 1) fail(page, `heading level skips from h${prev} to h${level}`);
    return level;
  }, 1);

  // Metadata
  for (const re of [/<title>[^<]{10,}<\/title>/, /<meta name="description" content="[^"]{50,}"/, /<meta property="og:image" content="https:\/\//, /<html lang="en"/]) {
    if (!re.test(html)) fail(page, `missing metadata: ${re.source}`);
  }

  // Privacy
  for (const re of PRIVATE) if (re.test(html)) fail(page, `contains private detail matching ${re}`);
}

if (errors.length) {
  console.error(`✗ ${errors.length} problem(s):\n  ${errors.join('\n  ')}`);
  process.exit(1);
}
console.log(`✓ ${pages.length} pages passed: links, anchors, ids, alt text, rel=noopener, headings, metadata, privacy`);
