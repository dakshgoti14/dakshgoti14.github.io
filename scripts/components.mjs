// HTML components for the static site generator. Each function returns a string.
// Text from content/site.mjs is always passed through `esc`.
import { readFileSync } from 'node:fs';
import { techVisual } from '../content/tech.mjs';

// Self-hosted fonts (npm run fonts) — inlined as @font-face so text never waits on a third party.
const FONTS = JSON.parse(readFileSync(new URL('../assets/fonts/fonts.json', import.meta.url), 'utf8'));

// Per-page render context. `base` leads back to the site root: "" on the homepage, "../" one directory
// down, and "/" on the 404 (which can be served at any depth). `page` is the key of the current menu item.
export const ctx = { base: '', page: 'home' };
// A root-relative path ("about/", "assets/…") as seen from the current page.
const href = (path) => `${ctx.base}${path}`;
// The same, for page links: the homepage seen from itself is "./", not an empty href.
const pageLink = (path) => href(path) || './';

export const esc = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const join = (items, fn) => items.map(fn).join('');
const pad2 = (n) => String(n).padStart(2, '0');
// "https://www.linkedin.com/in/dakshgoti" -> "linkedin.com/in/dakshgoti"
const bareUrl = (url) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
// "Orion Technolab" -> "orion-technolab" (anchor ids on the experience page)
const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const NEW_TAB = '<span class="sr-only"> (opens in a new tab)</span>';

// Emphasize figures (14%, 200K+, <200ms, 1M+) inside already-escaped text.
const highlight = (text) =>
  esc(text).replace(/(−?\d+(?:\.\d+)?%|\d+K\+|\d+M\+|&lt;\d+ms)/g, '<span class="hl">$1</span>');

// ---------------------------------------------------------------------------
// Icons — Lucide-style strokes, inlined so there is no icon font to download.
// ---------------------------------------------------------------------------
const ICONS = {
  arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  arrowLeft: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
  arrowUpRight: '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
  arrowDown: '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
  alert: '<circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
  lock: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  arrowUp: '<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
  github:
    '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
  linkedin:
    '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>',
  mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/>',
  menu: '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>',
  close: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  briefcase: '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>',
  cap: '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
  layers: '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
  sparkles: '<path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.13-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0L14.06 8.5a2 2 0 0 0 1.44 1.44l6.14 1.58a.5.5 0 0 1 0 .96l-6.14 1.58a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z"/>',
  server: '<rect width="20" height="8" x="2" y="2" rx="2"/><rect width="20" height="8" x="2" y="14" rx="2"/><path d="M6 6h.01"/><path d="M6 18h.01"/>',
  network: '<rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/>',
  cloud: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>',
  code: '<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>',
  monitor: '<rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/>',
  trending: '<path d="M22 7 13.5 15.5l-5-5L2 17"/><path d="M16 7h6v6"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  gauge: '<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  award: '<path d="m15.48 12.89 1.51 8.53a.5.5 0 0 1-.81.47l-3.58-2.69a1 1 0 0 0-1.2 0l-3.59 2.69a.5.5 0 0 1-.81-.47l1.51-8.53"/><circle cx="12" cy="8" r="6"/>',
  arrows: '<path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/>',
  zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
  scan: '<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="3"/><path d="m16 16-1.9-1.9"/>',
  blocks: '<rect width="7" height="7" x="14" y="3" rx="1"/><path d="M10 21V8a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H3"/>',
  workflow: '<rect width="8" height="8" x="3" y="3" rx="2"/><path d="M7 11v4a2 2 0 0 0 2 2h4"/><rect width="8" height="8" x="13" y="13" rx="2"/>',
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  radio: '<path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  copy: '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  hash: '<path d="M4 9h16"/><path d="M4 15h16"/><path d="M10 3 8 21"/><path d="M16 3l-2 18"/>',
  eye: '<path d="M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0"/><circle cx="12" cy="12" r="3"/>',
};

export const icon = (name, cls = 'icon') =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[name]}</svg>`;

// Brand mark for a technology name, or a concept icon, or nothing.
const techMark = (name, { eager = false } = {}) => {
  const v = techVisual(name);
  if (v?.logo) {
    return `<img class="mark" src="${href(`assets/img/tech/${v.logo}.svg`)}" alt="" width="16" height="16"${eager ? '' : ' loading="lazy"'} decoding="async">`;
  }
  if (v?.icon) return icon(v.icon, 'icon mark mark--icon');
  return '';
};

// External links always open safely in a new tab and say so to screen readers.
// A `label` must start with the link's visible text, so speech users can say what they see.
export const extLink = (url, inner, { cls = '', label, attrs = '' } = {}) =>
  `<a href="${esc(url)}"${cls ? ` class="${cls}"` : ''} target="_blank" rel="noopener noreferrer"${
    label ? ` aria-label="${esc(label)} (opens in a new tab)"` : ''
  }${attrs ? ` ${attrs}` : ''}>${inner}</a>`;

// Technology chips with brand marks.
const chipItems = (items, opts) => join(items, (t) => `<li>${techMark(t, opts)}<span>${esc(t)}</span></li>`);
export const chips = (items, cls = '', opts = {}) => `<ul class="chips${cls ? ` ${cls}` : ''}">${chipItems(items, opts)}</ul>`;

// Icon tile: solid accent, or `soft` (quieter) for dense grids.
const tile = (name, soft = false) => `<span class="tile${soft ? ' tile--soft' : ''}">${icon(name)}</span>`;

// Text roll (adapted from 21st.dev "Flip Links"): on hover each letter rolls up and out while its copy rolls in
// from below, one letter after another. The copies are CSS-generated, so the page text (and what search engines and
// assistive tech read) stays a single, plain copy of the label. Letters are inline-blocks, which accessible-name
// computation would read one by one, so every element that uses roll() carries an aria-label of the same text.
const roll = (text) =>
  `<span class="roll">${[...text].map((ch, i) => (ch === ' ' ? ' ' : `<span data-l="${esc(ch)}" style="--i:${i}">${esc(ch)}</span>`)).join('')}</span>`;

// A headline in lines that rise out of a mask on load. The trailing space keeps the words apart in the
// accessible name, since each line is its own block.
const lines = (parts) => join(parts, (t) => `<span class="line-mask"><span>${esc(t)} </span></span>`);

// Section heading: an uppercase label ("/ About me"), the title, and an optional lead and/or action link.
// `split` sets the lead and action beside the title on wide screens.
export const sectionHeading = (id, title, { label, lead, action, split = false } = {}) => `
        <header class="section-head${split ? ' section-head--split' : ''} reveal">
          <div class="section-title">
            ${label ? `<p class="section-label">${esc(label)}</p>` : ''}
            <h2 id="${id}">${esc(title)}</h2>
          </div>
          ${lead || action ? `<div class="section-aside">${lead ? `<p class="lead">${esc(lead)}</p>` : ''}${action || ''}</div>` : ''}
        </header>`;

// A date range that never breaks across lines; screen readers hear "to" instead of the dash.
const dates = (start, end) => `<span class="date-range">${esc(start)} <span aria-hidden="true">—</span><span class="sr-only"> to </span> ${esc(end)}</span>`;
// "Feb 2025 — Present / California": each part is its own flex item, so it keeps its inner spacing.
const metaLine = (...parts) => parts.filter(Boolean).map((p) => `<span>${p}</span>`).join('<span class="meta-sep" aria-hidden="true">/</span>');

// "−18%" -> "−<span data-num>18</span><span class="unit">%</span>": the count-up (site.js) animates only the number.
const countable = (value) => {
  const m = /^(\D*)(\d+(?:\.\d+)?)(.*)$/.exec(value);
  return m ? `${esc(m[1])}<span data-num>${m[2]}</span>${m[3] ? `<span class="unit">${esc(m[3])}</span>` : ''}` : esc(value);
};

const stats = (items, cls = '') =>
  `<dl class="stats${cls ? ` ${cls}` : ''}">${join(items, (st) => `<div class="stat"><dt>${esc(st.label)}</dt><dd data-count>${countable(st.value)}</dd></div>`)}</dl>`;

// Intrinsic size of a WebP file (VP8X, VP8L, or VP8 bitstream), so width/height attributes always match the image.
const webpSize = (path) => {
  const b = readFileSync(new URL(`../${path}`, import.meta.url));
  const chunk = b.toString('ascii', 12, 16);
  if (chunk === 'VP8X') return { width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) };
  if (chunk === 'VP8L') {
    const bits = b.readUInt32LE(21);
    return { width: 1 + (bits & 0x3fff), height: 1 + ((bits >> 14) & 0x3fff) };
  }
  return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
};
// A srcset from a { width: path } map.
const srcset = (set) => Object.entries(set).map(([w, src]) => `${href(src)} ${w}w`).join(', ');

// The hero portrait: a cut-out with a transparent background (scripts/cutout.swift).
const PORTRAIT_SIZES = '(max-width: 480px) calc(100vw - 32px), (max-width: 899px) 440px, 46vw';
// Preload hint for the homepage, so the portrait (the largest image) starts downloading with the HTML.
export const portraitPreload = (profile) => ({ href: href(profile.cutout[780]), srcset: srcset(profile.cutout), sizes: PORTRAIT_SIZES });

// ---------------------------------------------------------------------------
// Document shell
// ---------------------------------------------------------------------------
export const head = ({ title, description, canonical, ogImage, jsonLd, preload, noindex = false }) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="author" content="Daksh Goti">${noindex ? '\n  <meta name="robots" content="noindex">' : ''}
  <meta name="theme-color" content="#16191e">
  <meta name="color-scheme" content="dark">
  <link rel="canonical" href="${esc(canonical)}">

  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Daksh Goti">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${esc(canonical)}">
  <meta property="og:image" content="${esc(ogImage)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${esc(ogImage)}">

  <link rel="icon" href="${href('favicon.svg')}" type="image/svg+xml">
  <link rel="icon" href="${href('favicon.png')}" type="image/png" sizes="64x64">
  <link rel="apple-touch-icon" href="${href('assets/img/apple-touch-icon.png')}">

${FONTS.map((f) => `  <link rel="preload" href="${href(`assets/fonts/${f.file}`)}" as="font" type="font/woff2" crossorigin>`).join('\n')}${
  preload ? `\n  <link rel="preload" as="image" href="${esc(preload.href)}" imagesrcset="${esc(preload.srcset)}" imagesizes="${esc(preload.sizes)}" fetchpriority="high">` : ''
}
  <style>${FONTS.map((f) => `@font-face{font-family:'${f.family}';font-style:normal;font-weight:${f.weights};font-display:swap;src:url(${href(`assets/fonts/${f.file}`)}) format('woff2');unicode-range:${f.unicodeRange}}`).join('')}</style>
  <link rel="stylesheet" href="${href('assets/css/site.css')}">
  <script>
    // Enables reveal-on-scroll styles; falls back to fully visible content if site.js never runs.
    document.documentElement.classList.add('js');
    setTimeout(function () { if (!window.__siteReady) document.documentElement.classList.remove('js'); }, 2500);
  </script>
  <script defer src="${href('assets/js/site.js')}"></script>
  <script defer src="${href('assets/js/vendor/gsap.min.js')}"></script>
  <script defer src="${href('assets/js/vendor/ScrollTrigger.min.js')}"></script>
  <script defer src="${href('assets/js/vendor/SplitText.min.js')}"></script>
  <script defer src="${href('assets/js/vendor/ScrambleTextPlugin.min.js')}"></script>
  <script defer src="${href('assets/js/motion.js')}"></script>
${jsonLd ? `  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n` : ''}
  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-5BB8W2X');</script>
  <!-- End Google Tag Manager -->
</head>`;

export const bodyOpen = () => `<body>
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5BB8W2X" height="0" width="0" style="display:none;visibility:hidden" title="Google Tag Manager"></iframe></noscript>
  <a class="skip-link" href="#main">Skip to content</a>`;

export const navbar = ({ profile, pages }) => `
  <header class="site-nav" data-nav>
    <div class="container nav-inner">
      <a class="brand" href="${ctx.page === 'home' ? '#top' : pageLink('')}">
        <span class="brand-mark" aria-hidden="true">DG</span>
        <span class="brand-name">${esc(profile.name)}</span><span class="sr-only"> — home</span>
      </a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-menu" data-nav-toggle>
        <span class="sr-only">Menu</span>
        ${icon('menu', 'icon icon-open')}${icon('close', 'icon icon-close')}
      </button>
      <nav class="nav-menu" id="nav-menu" aria-label="Primary">
        <ul>
          ${join(pages, (p) => `<li><a href="${pageLink(p.path)}" aria-label="${esc(p.label)}"${p.key === ctx.page ? ' aria-current="page"' : ''}>${roll(p.label)}</a></li>`)}
        </ul>
        <button class="cmdk-trigger" type="button" data-cmdk-open aria-haspopup="dialog" aria-label="Search and quick actions">
          ${icon('search')}<span class="cmdk-trigger-text">Search</span><kbd data-cmdk-key>⌘K</kbd>
        </button>
        ${extLink(profile.resume, `${icon('file')}${roll('Resume')}`, { cls: 'btn btn-primary btn-sm nav-resume', label: 'Resume', attrs: 'data-magnetic' })}
        <div class="nav-menu-foot">
          <div class="nav-socials">
            ${extLink(profile.github, `${icon('github')}GitHub`, { cls: 'btn btn-outline', label: 'GitHub' })}
            ${extLink(profile.linkedin, `${icon('linkedin')}LinkedIn`, { cls: 'btn btn-outline', label: 'LinkedIn' })}
            <a class="btn btn-outline" href="mailto:${esc(profile.email)}">${icon('mail')}Email</a>
          </div>
        </div>
      </nav>
    </div>
  </header>`;

export const footer = ({ profile, year, pages, experience }) => `
  <footer class="site-footer">
    <div class="container footer-top">
      <div class="footer-id">
        <div class="footer-person">
          <img class="footer-avatar" src="${href('assets/img/avatar-160.webp')}" alt="" width="72" height="72" loading="lazy" decoding="async">
          <div>
            <p class="footer-name">${esc(profile.name)}</p>
            <p class="footer-role">${esc(experience[0].role)} at ${esc(experience[0].company)}</p>
          </div>
        </div>
        <ul class="footer-socials">
          <li>${extLink(profile.github, icon('github'), { label: 'GitHub', attrs: 'data-magnetic' })}</li>
          <li>${extLink(profile.linkedin, icon('linkedin'), { label: 'LinkedIn', attrs: 'data-magnetic' })}</li>
          <li><a href="mailto:${esc(profile.email)}" aria-label="Email ${esc(profile.email)}" data-magnetic>${icon('mail')}</a></li>
        </ul>
      </div>
      <div class="footer-contact">
        <a class="footer-cta" href="${pageLink('contact/')}"><span class="footer-cta-text">Get in touch</span> ${icon('arrowRight')}</a>
        <dl class="footer-reach">
          <div><dt>Email me</dt><dd><a class="text-link text-link--sm" href="mailto:${esc(profile.email)}">${esc(profile.email)} ${icon('arrowRight')}</a></dd></div>
          <div><dt>Résumé</dt><dd>${extLink(profile.resume, `View résumé ${icon('arrowUpRight')}`, { cls: 'text-link text-link--sm', label: 'View résumé' })}</dd></div>
        </dl>
      </div>
    </div>
    <div class="container footer-base">
      <nav aria-label="Footer">
        <ul class="footer-nav">${join(pages, (p) => `<li><a href="${pageLink(p.path)}" aria-label="${esc(p.label)}">${roll(p.label)}</a></li>`)}</ul>
      </nav>
      <p class="footer-copy">© ${year} ${esc(profile.name)} <span aria-hidden="true">·</span> ${esc(profile.location)}</p>
      <a class="to-top" href="#main">Back to top ${icon('arrowUp')}</a>
    </div>
  </footer>`;

// 404: served for any unknown path, so every URL in it is root-absolute (ctx.base = '/').
export const notFound = ({ projects }) => `
  <main id="main" class="nf">
    <div class="container nf-inner">
      <p class="section-label">Error 404</p>
      <h1 class="nf-title">This route isn’t in the architecture.</h1>
      <p class="lead">The page you asked for doesn’t exist — it may have moved when the site was redesigned.</p>
      <div class="nf-trace" aria-hidden="true">
        <span class="nf-node">Client</span><span class="nf-link"></span><span class="nf-node">Router</span><span class="nf-link nf-link--broken"></span><span class="nf-node nf-node--missing">404</span>
      </div>
      <div class="nf-cta">
        <a class="btn btn-primary" href="${pageLink('')}">${icon('arrowLeft')}Back home</a>
        <a class="btn btn-outline" href="${pageLink('projects/')}">See projects</a>
        <button class="btn btn-outline" type="button" data-cmdk-open>${icon('search')}Search <kbd data-cmdk-key>⌘K</kbd></button>
      </div>
      <p class="nf-hint">Case studies: ${projects.map((p) => `<a href="${href(`projects/${p.slug}.html`)}">${esc(p.name)}</a>`).join(' · ')}</p>
    </div>
  </main>`;

// Command palette (⌘K / Ctrl+K / "/"). A native <dialog>, so focus trapping, Esc, and
// an inert background come from the browser.
export const commandPalette = ({ profile, pages, projects }) => {
  const item = ({ label, hint, href: url, external, action, value, iconName }) =>
    `<li role="option" class="cmdk-item" aria-selected="false" data-label="${esc(label.toLowerCase())}"${url ? ` data-href="${esc(url)}"` : ''}${external ? ' data-external' : ''}${action ? ` data-action="${action}"` : ''}${value ? ` data-value="${esc(value)}"` : ''}>${icon(iconName)}<span class="cmdk-label">${esc(label)}</span>${hint ? `<span class="cmdk-hint">${esc(hint)}</span>` : ''}</li>`;
  const group = (title, items) => `<li role="presentation" class="cmdk-group"><p class="kicker" aria-hidden="true">${esc(title)}</p><ul role="group" aria-label="${esc(title)}">${items.join('')}</ul></li>`;
  return `
  <dialog class="cmdk" data-cmdk aria-label="Search and quick actions">
    <div class="cmdk-panel">
      <div class="cmdk-search">
        ${icon('search')}
        <input class="cmdk-input" type="text" placeholder="Jump to a page, project, or action…" autocomplete="off" spellcheck="false"
          role="combobox" aria-expanded="true" aria-controls="cmdk-list" aria-autocomplete="list" aria-label="Search" data-cmdk-input>
        <kbd>esc</kbd>
      </div>
      <!-- [html-validate-disable-next prefer-native-element -- filterable combobox listbox (WAI-ARIA APG pattern); a native select cannot filter] -->
      <ul class="cmdk-list" id="cmdk-list" role="listbox" aria-label="Results" data-cmdk-list>
        ${group('Pages', pages.map((p) => item({ label: p.label, href: pageLink(p.path), iconName: 'hash' })))}
        ${group('Case studies', projects.map((p) => item({ label: p.name, hint: p.tagline, href: href(`projects/${p.slug}.html`), iconName: 'layers' })))}
        ${group('Links', [
          item({ label: 'Resume', hint: 'Google Drive', href: profile.resume, external: true, iconName: 'file' }),
          item({ label: 'GitHub', hint: 'dakshgoti14', href: profile.github, external: true, iconName: 'github' }),
          item({ label: 'LinkedIn', hint: 'dakshgoti', href: profile.linkedin, external: true, iconName: 'linkedin' }),
        ])}
        ${group('Actions', [
          item({ label: 'Copy email address', hint: profile.email, action: 'copy', value: profile.email, iconName: 'copy' }),
          item({ label: 'Send an email', hint: profile.email, href: `mailto:${profile.email}`, iconName: 'mail' }),
        ])}
      </ul>
      <p class="cmdk-empty" data-cmdk-empty hidden>No matches.</p>
      <div class="cmdk-foot" aria-hidden="true"><span><kbd>↑</kbd><kbd>↓</kbd> navigate</span><span><kbd>↵</kbd> open</span><span><kbd>esc</kbd> close</span></div>
    </div>
  </dialog>
  <div class="toast" role="status" aria-live="polite" data-toast></div>`;
};

// ---------------------------------------------------------------------------
// Architecture diagram (HTML/CSS — reflows on small screens, no dependency)
// Nodes pick up brand marks for any technology named in their `meta`.
// ---------------------------------------------------------------------------
const nodeMarks = (meta, eager) => {
  const marks = [...new Set(meta.split(' · ').map((t) => techMark(t.trim(), { eager })).filter(Boolean))].slice(0, 3);
  return marks.length ? `<span class="arch-marks" aria-hidden="true">${marks.join('')}</span>` : '';
};

const archNode = (n, eager) =>
  `<div class="arch-node${n.accent ? ' arch-node--accent' : ''}">${nodeMarks(n.meta, eager)}<span class="arch-label">${esc(n.label)}</span><span class="arch-meta">${esc(n.meta)}</span></div>`;

const archTiers = (tiers, eager = false) => `
    <ol class="arch-tiers">
      ${join(
        tiers,
        (tier, i) => `
      <li class="arch-tier${tier.length > 1 ? ' arch-tier--fan' : ''}" style="--n:${tier.length}">
        ${i ? '<span class="arch-trunk" aria-hidden="true"><span class="arch-pulse"></span></span>' : ''}
        ${tier.length > 1 ? `<ul class="arch-row">${join(tier, (n) => `<li>${archNode(n, eager)}</li>`)}</ul>` : archNode(tier[0], eager)}
      </li>`
      )}
    </ol>`;

export const archDiagram = (project, { compact = false } = {}) => {
  const { tiers, pipeline, external } = project.architecture;
  return `
  <figure class="arch${compact ? ' arch--compact' : ''}" aria-label="${esc(project.name)} architecture, top to bottom">
    ${archTiers(tiers)}
    ${
      pipeline
        ? `<div class="arch-pipeline"><p class="arch-aside-label kicker">${esc(pipeline.label)}</p><ol>${join(pipeline.steps, (s) => `<li>${esc(s)}</li>`)}</ol></div>`
        : ''
    }
    ${external ? `<div class="arch-external"><p class="arch-aside-label kicker">Integrates with</p>${archNode(external)}</div>` : ''}
    ${compact ? '' : '<figcaption>Simplified architecture, drawn from the project’s components.</figcaption>'}
  </figure>`;
};


// ---------------------------------------------------------------------------
// Shared blocks
// ---------------------------------------------------------------------------
// Inner-page header: the rule, a headline that rises in by line, a lead, and optional extras and aside.
// Variants: "split" (aside on the right), "panel" (aside on a band that runs to the window's edge), "center".
const pageHero = ({ title, lead, extra = '', aside = '', variant = '' }) => `
    <header class="page-hero${variant ? ` page-hero--${variant}` : ''}">
      <div class="container page-hero-layout">
        <div class="page-hero-copy">
          <span class="hero-rule" aria-hidden="true"></span>
          <h1 class="page-title">${lines(title)}</h1>
          ${lead ? `<p class="page-lead">${esc(lead)}</p>` : ''}
          ${extra}
        </div>
        ${aside}
      </div>
    </header>`;

const metricList = (metrics, cls = 'metrics') =>
  !metrics?.length ? '' : `<dl class="${cls}">${join(metrics, (m) => `<div><dt>${esc(m.label)}</dt><dd data-count>${countable(m.value)}</dd></div>`)}</dl>`;

const repoLink = (project, profile, cls = 'text-link text-link--quiet') =>
  extLink(project.repo || profile.github, `GitHub ${icon('arrowUpRight')}`, {
    cls,
    label: project.repo ? `GitHub: ${project.name} source` : `GitHub profile (${project.name} has no public repository)`,
  });

// "MedInsight" -> "MI", "VectorForgeDB" -> "VF"
const initials = (name) => (name.match(/[A-Z]/g) || []).slice(0, 2).join('') || name.slice(0, 2).toUpperCase();

export const projectCard = (project, { profile }) => `
        <article class="project reveal" data-glow data-card-href="${href(`projects/${project.slug}.html`)}" aria-labelledby="p-${project.slug}">
          <div class="project-top">
            <p class="project-mark"><span class="project-mono" aria-hidden="true">${esc(initials(project.name))}</span><span class="project-name" style="view-transition-name: title-${project.slug}">${esc(project.name)}</span></p>
            <ul class="project-pills">${join(project.cardStack.slice(0, 3), (t) => `<li>${esc(t)}</li>`)}</ul>
          </div>
          <h3 class="project-title" id="p-${project.slug}"><span class="sr-only">${esc(project.name)}: </span>${esc(project.tagline)}</h3>
          ${metricList(project.metrics)}
          <div class="project-links">
            <a class="text-link project-cta" href="${href(`projects/${project.slug}.html`)}">Read case study ${icon('arrowRight')}<span class="sr-only">: ${esc(project.name)}</span></a>
            ${repoLink(project, profile)}
          </div>
          <div class="project-visual">${archDiagram(project, { compact: true })}</div>
        </article>`;

const contactList = (profile) => `
        <ul class="contact-list">
          <li>
            <span class="contact-key">Email</span>
            <span class="contact-val">
              <a href="mailto:${esc(profile.email)}">${esc(profile.email)}</a>
              <button class="copy-btn" type="button" data-copy="${esc(profile.email)}" aria-label="Copy email address">${icon('copy', 'icon icon-copy')}${icon('check', 'icon icon-done')}<span>Copy</span></button>
            </span>
          </li>
          <li><span class="contact-key">LinkedIn</span><span class="contact-val">${extLink(profile.linkedin, `${esc(bareUrl(profile.linkedin))}${NEW_TAB}${icon('arrowUpRight')}`)}</span></li>
          <li><span class="contact-key">GitHub</span><span class="contact-val">${extLink(profile.github, `${esc(bareUrl(profile.github))}${NEW_TAB}${icon('arrowUpRight')}`)}</span></li>
          <li><span class="contact-key">Based in</span><span class="contact-val">${esc(profile.location)}</span></li>
        </ul>`;

// Experience entries in the editorial list style: dates and place, "Role at Company", then details.
const jobMeta = (job) => metaLine(`${job.end === 'Present' ? '<span class="status-dot"></span>' : ''}${dates(job.start, job.end)}`, esc(job.location));

// ---------------------------------------------------------------------------
// Home
// ---------------------------------------------------------------------------
export const hero = ({ profile, hero: h }) => `
    <section class="hero" id="top" aria-labelledby="hero-title">
      <div class="container hero-layout">
        <div class="hero-copy">
          <span class="hero-rule" aria-hidden="true"></span>
          <h1 id="hero-title" class="hero-title">${lines([`I’m ${profile.name},`, `a ${profile.role}`])}</h1>
          <p class="hero-lead">${esc(h.lead)}</p>
          <div class="hero-cta">
            <a class="round-cta" href="#work"><span class="round-cta-icon" aria-hidden="true">${icon('arrowDown')}</span><span>View projects</span></a>
            ${extLink(profile.resume, `Resume ${icon('arrowUpRight')}`, { cls: 'text-link', label: 'Resume' })}
          </div>
        </div>
        <div class="hero-portrait">
          <img src="${href(profile.cutout[780])}" srcset="${srcset(profile.cutout)}" sizes="${PORTRAIT_SIZES}" alt="Portrait of ${esc(profile.name)}" width="${webpSize(profile.cutout[780]).width}" height="${webpSize(profile.cutout[780]).height}" fetchpriority="high" decoding="async">
        </div>
        <aside class="hero-side" aria-label="Introduction">
          ${join(
            h.side,
            (b) => `
          <div class="side-block">
            <p class="side-label">${esc(b.label)}</p>
            <p class="side-body">${esc(b.body)}</p>
            <a class="text-link text-link--caps" href="${pageLink(b.link.href)}" aria-label="${esc(b.link.text)}">${roll(b.link.text)} ${icon('arrowRight')}</a>
          </div>`
          )}
          <div class="side-block">
            <p class="side-label">Find me</p>
            <ul class="side-socials">
              <li>${extLink(profile.github, icon('github'), { label: 'GitHub', attrs: 'data-magnetic' })}</li>
              <li>${extLink(profile.linkedin, icon('linkedin'), { label: 'LinkedIn', attrs: 'data-magnetic' })}</li>
              <li><a href="mailto:${esc(profile.email)}" aria-label="Email ${esc(profile.email)}" data-magnetic>${icon('mail')}</a></li>
            </ul>
          </div>
        </aside>
      </div>
    </section>`;

// The tool strip under the hero: two copies of the list make the loop seamless (the copy is hidden from assistive tech).
export const toolStrip = ({ toolbelt }) => `
    <section class="marquee" aria-label="Technologies I work with">
      <div class="marquee-track">
        <ul class="marquee-list">${chipItems(toolbelt)}</ul>
        <ul class="marquee-list" aria-hidden="true">${chipItems(toolbelt)}</ul>
      </div>
    </section>`;

export const aboutTeaser = ({ about, aboutIntro }) => `
    <section class="section section--band" id="about" aria-labelledby="about-title">
      <div class="container about-grid">
        <div class="about-main">
          ${sectionHeading('about-title', aboutIntro.headline, { label: 'About me' })}
          <div class="prose reveal">
            ${join(about.slice(0, 2), (p) => `<p>${esc(p)}</p>`)}
          </div>
        </div>
        <div class="about-aside reveal">
          ${stats(aboutIntro.stats)}
          ${join(about.slice(2), (p) => `<p class="about-note">${esc(p)}</p>`)}
          <a class="text-link" href="${pageLink('about/')}">More about me ${icon('arrowRight')}</a>
        </div>
      </div>
    </section>`;

export const capabilitiesSection = ({ capabilities }) => `
    <section class="section" id="what-i-build" aria-labelledby="build-title">
      <div class="container">
        ${sectionHeading('build-title', 'What I build', { label: 'What I do', lead: 'The kinds of systems I design and build, and the tools I reach for in each.', split: true })}
        <ol class="cap-grid">
          ${join(
            capabilities,
            (c, i) => `
          <li class="card cap-card reveal" data-glow style="--d:${i}">
            <div class="cap-top">${tile(c.icon)}<span class="cap-num" aria-hidden="true">${pad2(i + 1)}</span></div>
            <h3>${esc(c.title)}</h3>
            <p>${esc(c.body)}</p>
            <span class="card-rule" aria-hidden="true"></span>
            ${chips(c.tech, 'chips--sm')}
          </li>`
          )}
        </ol>
      </div>
    </section>`;

const HOME_PROJECTS = 4;
export const featuredWork = ({ projects, moreProjects, profile }) => {
  const shown = projects.filter((p) => p.featured !== false).slice(0, HOME_PROJECTS);
  const moreCases = projects.length - shown.length;
  return `
    <section class="section section--band" id="work" aria-labelledby="work-title">
      <div class="container">
        ${sectionHeading('work-title', 'Selected work', {
          label: 'Projects',
          lead: 'Systems I’ve designed and built, each with a case study covering the problem, architecture, and engineering decisions.',
          action: `<a class="text-link" href="${pageLink('projects/')}">Browse all projects ${icon('arrowRight')}</a>`,
          split: true,
        })}
        <div class="projects">
          ${join(shown, (p) => projectCard(p, { profile }))}
        </div>
        <div class="work-more reveal">
          <p>${moreCases} more case ${moreCases === 1 ? 'study' : 'studies'} and ${moreProjects.length} earlier builds are on the projects page.</p>
          <a class="btn btn-outline" href="${pageLink('projects/')}" aria-label="See all projects" data-magnetic>${roll('See all projects')} ${icon('arrowRight')}</a>
        </div>
      </div>
    </section>`;
};

export const experienceTeaser = ({ experience }) => `
    <section class="section" id="experience" aria-labelledby="experience-title">
      <div class="container split-layout">
        <div class="split-head reveal">
          <p class="section-label">Experience</p>
          <h2 id="experience-title">Where I’ve worked</h2>
          <a class="text-link" href="${pageLink('experience/')}">View full experience ${icon('arrowRight')}</a>
        </div>
        <ol class="entries">
          ${join(
            experience,
            (job) => `
          <li class="entry reveal">
            <p class="entry-meta">${jobMeta(job)}</p>
            <h3 class="entry-title"><a href="${pageLink('experience/')}#${slugify(job.company)}">${esc(job.role)} at ${esc(job.company)}</a></h3>
            <p class="entry-body">${esc(job.summary)}</p>
          </li>`
          )}
        </ol>
      </div>
    </section>`;

export const ctaBand = ({ profile }) => `
    <section class="section section--band cta" aria-labelledby="cta-title">
      <div class="container cta-layout">
        ${sectionHeading('cta-title', 'Let’s build something useful.', { label: 'Contact', lead: 'I’m always interested in hard engineering problems, AI applications, and opportunities to build products at scale.' })}
        <div class="cta-actions reveal">
          <a class="btn btn-primary" href="mailto:${esc(profile.email)}" aria-label="Email me" data-magnetic>${icon('mail')}${roll('Email me')}</a>
          <a class="btn btn-outline" href="${pageLink('contact/')}" aria-label="Contact details" data-magnetic>${roll('Contact details')} ${icon('arrowRight')}</a>
        </div>
      </div>
    </section>`;

// ---------------------------------------------------------------------------
// About
// ---------------------------------------------------------------------------
export const aboutHero = ({ profile, aboutPage, about, aboutIntro }) =>
  pageHero({
    variant: 'split',
    title: aboutPage.title,
    lead: about[0],
    extra: stats(aboutIntro.stats, 'stats--hero'),
    aside: `
        <div class="round-photo">
          <img src="${href(profile.round[720])}" srcset="${srcset(profile.round)}" sizes="(max-width: 899px) 80vw, 36vw" alt="Portrait of ${esc(profile.name)} at sunset" width="720" height="720" fetchpriority="high" decoding="async">
        </div>`,
  });

export const storySection = ({ about, aboutPage, projects }) => {
  const shown = projects.find((p) => p.slug === 'contextflow') || projects[0];
  return `
    <section class="section section--band" aria-labelledby="story-title">
      <div class="container story">
        <div class="story-visual reveal">
          ${archDiagram(shown, { compact: true })}
          <p class="story-caption">One of the systems I’ve built: <a href="${href(`projects/${shown.slug}.html`)}">${esc(shown.name)}, ${esc(shown.tagline.charAt(0).toLowerCase() + shown.tagline.slice(1))}</a>.</p>
        </div>
        <div class="story-copy reveal">
          <p class="section-label">${esc(aboutPage.storyLabel)}</p>
          <h2 id="story-title">${esc(aboutPage.storyTitle)}</h2>
          <div class="prose">${join(about.slice(1), (p) => `<p>${esc(p)}</p>`)}</div>
          <a class="text-link" href="${pageLink('experience/')}">See my experience ${icon('arrowRight')}</a>
        </div>
      </div>
    </section>`;
};

export const glanceSection = ({ aboutPage, certifications, experience }) => `
    <section class="section" aria-labelledby="glance-title">
      <div class="container">
        ${sectionHeading('glance-title', aboutPage.glanceTitle, { label: 'At a glance', action: `<a class="text-link" href="${pageLink('contact/')}">Get in touch ${icon('arrowRight')}</a>`, split: true })}
        <div class="glance reveal">
          <div class="glance-col">
            <h3 class="kicker">Core stack</h3>
            <ul class="glance-list glance-list--2">${join(aboutPage.coreStack, (t) => `<li>${esc(t)}</li>`)}</ul>
          </div>
          <div class="glance-col">
            <h3 class="kicker">Certifications</h3>
            <ul class="glance-list">${join(certifications, (c) => `<li>${esc(c.name)}</li>`)}</ul>
          </div>
          <div class="glance-col">
            <h3 class="kicker">Companies</h3>
            <ul class="glance-list">${join(experience, (j) => `<li>${esc(j.company)}</li>`)}</ul>
          </div>
        </div>
      </div>
    </section>`;

export const principlesSection = ({ principles, projects }) => `
    <section class="section section--band" id="engineering" aria-labelledby="engineering-title">
      <div class="container principles-layout">
        ${sectionHeading('engineering-title', 'How I think about engineering', { label: 'How I work', lead: 'Four principles, each paired with a decision from one of my projects.' })}
        <ol class="principles">
          ${join(principles, (pr, i) => {
            const ref = projects.find((p) => p.slug === pr.ref);
            return `
          <li class="principle reveal">
            <h3 class="principle-title"><span class="principle-num" aria-hidden="true">${pad2(i + 1)}</span>${esc(pr.title)}</h3>
            <p class="principle-body">${esc(pr.body)}</p>
            <p class="principle-example">${esc(pr.example)}</p>
            ${ref ? `<a class="text-link text-link--sm" href="${href(`projects/${ref.slug}.html`)}">${esc(ref.name)} case study ${icon('arrowRight')}</a>` : ''}
          </li>`;
          })}
        </ol>
      </div>
    </section>`;

export const skillsSection = ({ skills }) => `
    <section class="section" id="skills" aria-labelledby="skills-title">
      <div class="container">
        ${sectionHeading('skills-title', 'Skills & tools', { label: 'Toolbox', lead: 'What I use, grouped by where it fits in a system.', split: true })}
        <div class="skill-grid">
          ${join(
            skills,
            (g) => `
          <div class="card skill-group reveal" data-glow>
            <h3>${tile(g.icon, true)}<span>${esc(g.group)}</span></h3>
            ${chips(g.items)}
          </div>`
          )}
        </div>
      </div>
    </section>`;

// ---------------------------------------------------------------------------
// Experience
// ---------------------------------------------------------------------------
export const experienceHero = ({ experience, experiencePage, profile }) =>
  pageHero({
    variant: 'panel',
    title: ['Experience'],
    lead: experiencePage.lead,
    extra: `
          <ol class="hero-entries">
            ${join(
              experience,
              (job) => `
            <li><a class="hero-entry" href="#${slugify(job.company)}"><span class="entry-meta">${jobMeta(job)}</span><span class="hero-entry-title">${esc(job.role)} at ${esc(job.company)}</span>${icon('arrowRight', 'icon hero-entry-go')}</a></li>`
            )}
          </ol>`,
    aside: `
        <aside class="hero-panel" aria-labelledby="resume-title">
          <p class="section-label">Résumé</p>
          <h2 id="resume-title" class="hero-panel-title">Prefer a document?</h2>
          <p>My résumé is on Google Drive — open it in a new tab, or save a copy for later.</p>
          ${extLink(profile.resume, `${icon('file')}${roll('Open résumé')} ${icon('arrowUpRight')}`, { cls: 'btn btn-primary', label: 'Open résumé', attrs: 'data-magnetic' })}
        </aside>`,
  });

export const workHistory = ({ experience }) => `
    <section class="section section--band" aria-labelledby="history-title">
      <div class="container split-layout">
        <div class="split-head reveal">
          <p class="section-label">Work history</p>
          <h2 id="history-title">Where I’ve worked</h2>
          <ul class="split-nav">${join(experience, (job) => `<li><a href="#${slugify(job.company)}">${esc(job.company)} ${icon('arrowRight')}</a></li>`)}</ul>
        </div>
        <ol class="entries">
          ${join(
            experience,
            (job) => `
          <li class="entry entry--job reveal" id="${slugify(job.company)}">
            <p class="entry-meta">${jobMeta(job)}</p>
            <h3 class="entry-title">${esc(job.role)} at ${extLink(job.url, esc(job.company), { cls: 'entry-company', label: job.company })}</h3>
            <p class="entry-lead">${esc(job.summary)}</p>
            <ul class="bullets">
              ${join(job.highlights, (h) => `<li>${highlight(h)}</li>`)}
            </ul>
            ${chips(job.tech, 'chips--sm')}
          </li>`
          )}
        </ol>
      </div>
    </section>`;

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------
export const projectsHero = ({ projectsPage }) => pageHero({ variant: 'center', title: ['Projects'], lead: projectsPage.lead });

export const caseStudiesSection = ({ projects, profile }) => `
    <section class="section section--flush" aria-labelledby="cases-title">
      <div class="container">
        ${sectionHeading('cases-title', 'Case studies', { label: `${projects.length} systems` })}
        <div class="projects">
          ${join(projects, (p) => projectCard(p, { profile }))}
        </div>
      </div>
    </section>`;

export const workSection = ({ experience }) => `
    <section class="section section--band" aria-labelledby="pro-title">
      <div class="container">
        ${sectionHeading('pro-title', 'Professional work', {
          label: 'At work',
          lead: 'Production systems I’ve built in industry roles. The full details are on the experience page.',
          action: `<a class="text-link" href="${pageLink('experience/')}">Full experience ${icon('arrowRight')}</a>`,
          split: true,
        })}
        <div class="work-grid">
          ${join(
            experience,
            (job) => `
          <article class="card work-card reveal" data-glow data-card-href="${pageLink('experience/')}#${slugify(job.company)}" aria-labelledby="w-${slugify(job.company)}">
            <p class="entry-meta">${jobMeta(job)}</p>
            <h3 class="work-title" id="w-${slugify(job.company)}">${esc(job.role)} <span>at ${esc(job.company)}</span></h3>
            <p class="work-summary">${esc(job.summary)}</p>
            ${chips(job.tech.slice(0, 6), 'chips--sm')}
            <a class="text-link text-link--sm" href="${pageLink('experience/')}#${slugify(job.company)}">Read more<span class="sr-only"> about my work at ${esc(job.company)}</span> ${icon('arrowRight')}</a>
          </article>`
          )}
        </div>
      </div>
    </section>`;

const LANG_COLORS = { Python: '#3572a5', TypeScript: '#3178c6', JavaScript: '#f1e05a', Java: '#b07219' };
const monthYear = (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });

export const githubSection = ({ profile, openSource, github }) => `
    <section class="section" id="github" aria-labelledby="github-title">
      <div class="container">
        <div class="os-head">
          ${sectionHeading('github-title', 'Building in public', { label: 'Open source', lead: 'I enjoy turning ideas into production-style systems, experimenting with new technologies, and sharing what I build.' })}
          ${extLink(profile.github, `${icon('github')}${roll('View GitHub')} ${icon('arrowUpRight')}`, { cls: 'btn btn-outline', label: 'View GitHub', attrs: 'data-magnetic' })}
        </div>
        <ul class="repo-grid">
          ${join(openSource, (r, i) => {
            const meta = github.repos?.[r.repo] || {};
            const url = meta.url || `${profile.github}/${r.repo}`;
            return `
          <li class="card repo-card reveal" data-glow data-card-href="${esc(url)}" data-card-external style="--d:${i}">
            <p class="repo-path">${icon('github')}<span>${esc(new URL(profile.github).pathname.slice(1))}/<b>${esc(r.repo)}</b></span></p>
            <h3 class="repo-name">${extLink(url, `${esc(r.name)}`, { cls: 'repo-link', label: `${r.name} repository on GitHub` })}</h3>
            <p class="repo-summary">${esc(r.summary)}</p>
            ${r.stat ? `<p class="repo-stat">${esc(r.stat)}</p>` : ''}
            ${chips(r.stack, 'chips--sm')}
            <p class="repo-foot">
              ${meta.language ? `<span class="repo-lang"><span class="lang-dot" style="--lang:${LANG_COLORS[meta.language] || 'var(--text-3)'}"></span>${esc(meta.language)}</span>` : ''}
              ${meta.pushedAt ? `<span>Updated ${esc(monthYear(meta.pushedAt))}</span>` : ''}
              <span class="repo-go" aria-hidden="true">${icon('arrowUpRight')}</span>
            </p>
          </li>`;
          })}
        </ul>
      </div>
    </section>`;

// Earlier builds as compact cards: what each one does, what it was built with, and where the code lives.
export const archiveSection = ({ moreProjects }) => `
    <section class="section section--band" id="archive" aria-labelledby="archive-title">
      <div class="container">
        ${sectionHeading('archive-title', 'More projects', { label: 'Archive', lead: `${moreProjects.length} earlier academic and experimental builds: what each one does, what it was built with, and where to find the code.`, split: true })}
        <ul class="archive-grid">
          ${join(
            moreProjects,
            (p, i) => `
          <li class="card archive-card reveal" data-glow${p.repo ? ` data-card-href="${esc(p.repo)}" data-card-external` : ''} style="--d:${i % 3}">
            <h3 class="archive-name">${esc(p.name)}</h3>
            <p class="archive-summary">${esc(p.summary)}</p>
            ${chips(p.stack, 'chips--sm')}
            <p class="archive-foot">${
              p.repo
                ? extLink(p.repo, `${icon('github')}Source ${icon('arrowUpRight')}`, { cls: 'text-link text-link--sm', label: `Source: ${p.name}` })
                : `<span class="archive-private">${icon('lock')}Code not public</span>`
            }</p>
          </li>`
          )}
        </ul>
      </div>
    </section>`;

// ---------------------------------------------------------------------------
// Education
// ---------------------------------------------------------------------------
export const educationHero = ({ educationPage }) => pageHero({ title: educationPage.title, lead: educationPage.lead });

export const degreesSection = ({ education }) => `
    <section class="section section--band" aria-labelledby="degrees-title">
      <div class="container">
        ${sectionHeading('degrees-title', 'Degrees', { label: 'Education' })}
        <ol class="degree-grid">
          ${join(
            education,
            (e) => `
          <li class="degree reveal">
            <p class="entry-meta">${metaLine(esc(e.school), dates(e.start, e.end))}</p>
            <h3 class="degree-title">${esc(e.degree)}</h3>
            <p class="degree-course"><span class="kicker">Coursework</span> ${esc(e.coursework.join(' · '))}</p>
          </li>`
          )}
        </ol>
      </div>
    </section>`;

export const certificationsSection = ({ certifications }) => `
    <section class="section" aria-labelledby="certs-title">
      <div class="container">
        ${sectionHeading('certs-title', 'Certifications', { label: 'Credentials' })}
        <ul class="cert-grid">
          ${join(
            certifications,
            (c, i) => `
          <li class="card cert reveal" data-glow data-card-href="${esc(c.url)}" data-card-external style="--d:${i}">
            ${tile('award', true)}
            <h3 class="cert-name">${esc(c.name)}</h3>
            <p class="cert-meta">${c.issuer ? `${esc(c.issuer)} · ` : ''}${esc(c.kind)}</p>
            ${extLink(c.url, `View ${esc(c.kind.toLowerCase())} ${icon('arrowUpRight')}`, { cls: 'text-link text-link--sm', label: `View ${c.kind.toLowerCase()}: ${c.name}` })}
          </li>`
          )}
        </ul>
      </div>
    </section>`;

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------
export const contactHero = ({ profile, contactPage }) =>
  pageHero({
    variant: 'split',
    title: contactPage.title,
    lead: contactPage.lead,
    extra: `
          <div class="page-cta">
            <a class="btn btn-primary" href="mailto:${esc(profile.email)}" aria-label="Email me" data-magnetic>${icon('mail')}${roll('Email me')}</a>
            ${extLink(profile.resume, `${icon('file')}${roll('Résumé')}`, { cls: 'btn btn-outline', label: 'Résumé', attrs: 'data-magnetic' })}
          </div>`,
    aside: contactList(profile),
  });

// No backend: the form composes an email in the visitor's own mail app (site.js), and a plain
// mailto form submission is the fallback without JavaScript. Nothing is stored or sent by the site.
export const messageSection = ({ profile }) => `
    <section class="section section--band" aria-labelledby="message-title">
      <div class="container message-layout">
        ${sectionHeading('message-title', 'Send a message', { label: 'Write to me', lead: 'Fill this in and your email app opens with the message ready to send. Nothing is stored on this site.' })}
        <form class="message-form reveal" action="mailto:${esc(profile.email)}" method="post" enctype="text/plain" data-mailto="${esc(profile.email)}">
          <div class="field">
            <label for="msg-name">Your name</label>
            <input id="msg-name" name="name" type="text" autocomplete="name" required>
            <p class="field-error" id="msg-name-error" hidden>${icon('alert')}Please add your name.</p>
          </div>
          <div class="field">
            <label for="msg-subject">Subject</label>
            <input id="msg-subject" name="subject" type="text" autocomplete="off">
          </div>
          <div class="field field--wide">
            <label for="msg-body">Message</label>
            <textarea id="msg-body" name="message" rows="5" required></textarea>
            <p class="field-error" id="msg-body-error" hidden>${icon('alert')}Please write a message.</p>
          </div>
          <div class="field--wide form-actions">
            <button class="btn btn-primary" type="submit" aria-label="Open in email app" data-magnetic>${icon('mail')}${roll('Open in email app')}</button>
          </div>
        </form>
      </div>
    </section>`;

// ---------------------------------------------------------------------------
// Case study page body
// ---------------------------------------------------------------------------
export const caseStudy = ({ project, index, next, profile }) => `
  <main id="main" class="case">
    <div class="case-hero">
      <div class="container case-container">
        <a class="back-link" href="${pageLink('projects/')}">${icon('arrowLeft')}All projects</a>
        <header class="case-header">
          <p class="section-label">Case study ${pad2(index + 1)}</p>
          <h1 style="view-transition-name: title-${project.slug}">${esc(project.name)}</h1>
          <p class="case-tagline">${esc(project.tagline)}</p>
          <p class="case-summary">${esc(project.summary)}</p>
          ${chips(project.cardStack, 'chips--sm case-stack')}
          <div class="case-links">
            ${extLink(project.repo || profile.github, `${icon('github')}${project.repo ? 'View source' : 'GitHub profile'} ${icon('arrowUpRight')}`, {
              cls: 'btn btn-outline',
              label: project.repo ? `View source: ${project.name} on GitHub` : 'GitHub profile',
            })}
          </div>
        </header>
      </div>
    </div>

    <div class="container case-container">
      <div class="case-layout">
      <aside class="case-toc" aria-label="On this page">
        <p class="kicker">On this page</p>
        <ol>
          ${join([['results', 'Results'], ['problem', 'Problem'], ['solution', 'Solution'], ['architecture', 'Architecture'], ['implementation', 'Implementation'], ['challenges', 'Challenges'], ['technology', 'Technology']], ([id, label]) => `<li><a href="#${id}" data-toc>${label}</a></li>`)}
        </ol>
      </aside>
      <div class="case-main">
      <section class="case-section" aria-labelledby="results">
        <h2 id="results" class="case-h2">Results</h2>
        ${metricList(project.metrics, 'metrics metrics--lg')}
      </section>

      <div class="case-two">
        <section class="card case-panel" aria-labelledby="problem">
          <h2 id="problem" class="case-h2">Problem</h2>
          <p>${esc(project.problem)}</p>
        </section>
        <section class="card case-panel" aria-labelledby="solution">
          <h2 id="solution" class="case-h2">Solution</h2>
          <p>${esc(project.solution)}</p>
        </section>
      </div>

      <section class="case-section" aria-labelledby="architecture">
        <h2 id="architecture" class="case-h2">Architecture</h2>
        <div class="case-arch">${archDiagram(project)}</div>
      </section>

      <section class="case-section" aria-labelledby="implementation">
        <h2 id="implementation" class="case-h2">Technical implementation</h2>
        <dl class="impl-grid">
          ${join(project.implementation, (it, i) => `<div class="card"><span class="impl-num" aria-hidden="true">${pad2(i + 1)}</span><dt>${esc(it.title)}</dt><dd>${highlight(it.body)}</dd></div>`)}
        </dl>
      </section>

      <section class="case-section" aria-labelledby="challenges">
        <h2 id="challenges" class="case-h2">Engineering challenges</h2>
        <ol class="challenges">
          ${join(
            project.challenges,
            (ch) => `
          <li class="card challenge">
            <h3>${esc(ch.title)}</h3>
            <dl>
              <div><dt class="kicker">Approach</dt><dd>${esc(ch.approach)}</dd></div>
              <div class="challenge-result"><dt class="kicker">Result</dt><dd>${highlight(ch.result)}</dd></div>
            </dl>
          </li>`
          )}
        </ol>
      </section>

      <section class="case-section" aria-labelledby="technology">
        <h2 id="technology" class="case-h2">Technology</h2>
        ${chips(project.stack)}
      </section>

      </div>
      </div>

      <nav class="next-project" aria-label="Next project">
        <a class="card next-card" data-glow href="${href(`projects/${next.slug}.html`)}">
          <span class="section-label">Next project</span>
          <span class="next-name">${esc(next.name)}</span>
          <span class="next-tagline">${esc(next.tagline)}</span>
          ${icon('arrowRight', 'icon next-arrow')}
        </a>
      </nav>
    </div>
  </main>`;
