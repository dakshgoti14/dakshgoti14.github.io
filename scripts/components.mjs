// HTML components for the static site generator. Each function returns a string.
// Text from content/site.mjs is always passed through `esc`.
import { techVisual } from '../content/tech.mjs';

// Per-page render context. `base` is "" on the homepage and "../" on case-study pages.
export const ctx = { base: '' };

export const esc = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const join = (items, fn) => items.map(fn).join('');
const pad2 = (n) => String(n).padStart(2, '0');

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
    return `<img class="mark" src="${ctx.base}assets/img/tech/${v.logo}.svg" alt="" width="16" height="16"${eager ? '' : ' loading="lazy"'} decoding="async">`;
  }
  if (v?.icon) return icon(v.icon, 'icon mark mark--icon');
  return '';
};

// External links always open safely in a new tab and say so to screen readers.
export const extLink = (href, inner, { cls = '', label } = {}) =>
  `<a href="${esc(href)}"${cls ? ` class="${cls}"` : ''} target="_blank" rel="noopener noreferrer"${
    label ? ` aria-label="${esc(label)} (opens in a new tab)"` : ''
  }>${inner}</a>`;

// Technology chips with brand marks.
const chipItems = (items, opts) => join(items, (t) => `<li>${techMark(t, opts)}<span>${esc(t)}</span></li>`);
export const chips = (items, cls = '', opts = {}) => `<ul class="chips${cls ? ` ${cls}` : ''}">${chipItems(items, opts)}</ul>`;

// Small animated illustrations for the "What I build" cards (decorative, drawn in currentColor).
const range = (n) => Array.from({ length: n }, (_, i) => i);
const CAP_ART = {
  sparkles: () => {
    const layers = [[18, [22, 48, 74]], [80, [14, 38, 62, 86]], [142, [34, 62]]];
    const lines = [];
    for (let l = 0; l < layers.length - 1; l++)
      for (const y1 of layers[l][1]) for (const y2 of layers[l + 1][1])
        lines.push(`<path d="M${layers[l][0]} ${y1} L${layers[l + 1][0]} ${y2}"/>`);
    const nodes = layers.flatMap(([x, ys], l) => ys.map((y, i) => `<circle class="art-pulse" cx="${x}" cy="${y}" r="4.5" style="--d:${(l * 0.45 + i * 0.12).toFixed(2)}s"/>`));
    return `<g class="art-lines">${lines.join('')}</g><g class="art-flow-lines">${lines.filter((_, i) => i % 3 === 0).map((l, i) => l.replace('<path', `<path pathLength="100" style="--d:${(i * 0.3).toFixed(1)}s"`)).join('')}</g><g>${nodes.join('')}</g>`;
  },
  server: () =>
    range(3)
      .map((k) => {
        const y = 10 + k * 28;
        return `<rect class="art-rack" x="20" y="${y}" width="120" height="20" rx="5"/>
          <circle class="art-led" cx="33" cy="${y + 10}" r="2.6" style="--d:${k * 0.5}s"/><circle class="art-led" cx="42" cy="${y + 10}" r="2.6" style="--d:${k * 0.5 + 0.8}s"/>
          <rect class="art-slot" x="78" y="${y + 8}" width="48" height="4" rx="2"/><rect class="art-bar" x="78" y="${y + 8}" width="48" height="4" rx="2" style="--d:${k * 0.6}s"/>`;
      })
      .join(''),
  network: () => {
    const cx = 80, cy = 48;
    const pts = range(6).map((k) => [cx + 58 * Math.cos((Math.PI / 3) * k - Math.PI / 2), cy + 36 * Math.sin((Math.PI / 3) * k - Math.PI / 2)].map((v) => +v.toFixed(1)));
    const ring = `M${pts.map((p) => p.join(' ')).join(' L')} Z`;
    return `<g class="art-lines">${pts.map(([x, y]) => `<path d="M${cx} ${cy} L${x} ${y}"/>`).join('')}<path d="${ring}"/></g>
      <path class="art-packet" d="${ring}" pathLength="100"/>
      ${pts.map(([x, y], i) => `<path class="art-packet art-packet--spoke" d="M${cx} ${cy} L${x} ${y}" pathLength="100" style="--d:${(i * 0.5).toFixed(1)}s"/>`).join('')}
      ${pts.map(([x, y], i) => `<circle class="art-pulse" cx="${x}" cy="${y}" r="4" style="--d:${(i * 0.3).toFixed(1)}s"/>`).join('')}
      <circle class="art-core" cx="${cx}" cy="${cy}" r="7"/>`;
  },
  cloud: () =>
    `<path class="art-cloud" d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" transform="translate(56 -2) scale(2)"/>
     <path class="art-packet art-packet--drop" d="M80 38 V50" pathLength="100"/>
     ${range(2).map((r) => range(5).map((c) => `<rect class="art-box" x="${30 + c * 21}" y="${54 + r * 20}" width="15" height="15" rx="3.5" style="--d:${((r * 5 + c) * 0.18).toFixed(2)}s"/>`).join('')).join('')}`,
};
const capArt = (kind) => (CAP_ART[kind] ? `<svg class="cap-art" viewBox="0 0 160 96" fill="none" aria-hidden="true" focusable="false">${CAP_ART[kind]()}</svg>` : '');

// Coloured icon tile; `hue` tints it (defaults to the accent).
const tile = (name, hue) => `<span class="tile"${hue ? ` style="--hue:${hue}"` : ''}>${icon(name)}</span>`;

export const sectionHeading = (id, title, { lead, num, cls = '' } = {}) => `
        <header class="section-head reveal">
          ${num ? `<p class="section-num" aria-hidden="true"><span>${pad2(num)}</span></p>` : ''}
          <h2 id="${id}"${cls ? ` class="${cls}"` : ''}>${esc(title)}</h2>
          ${lead ? `<p class="lead">${esc(lead)}</p>` : ''}
        </header>`;

const dates = (start, end) => `${esc(start)} <span aria-hidden="true">—</span><span class="sr-only"> to </span> ${esc(end)}`;

// ---------------------------------------------------------------------------
// Document shell
// ---------------------------------------------------------------------------
export const head = ({ title, description, canonical, ogImage, jsonLd, aurora = false }) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="author" content="Daksh Goti">
  <meta name="theme-color" content="#060a12">
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

  <link rel="icon" href="${ctx.base}favicon.svg" type="image/svg+xml">
  <link rel="icon" href="${ctx.base}favicon.png" type="image/png" sizes="64x64">
  <link rel="apple-touch-icon" href="${ctx.base}assets/img/apple-touch-icon.png">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800&family=Geist+Mono:wght@400;500&display=swap">
  <link rel="stylesheet" href="${ctx.base}assets/css/site.css">
  <script>
    // 'js' enables reveal styles; 'motion' hides intro elements until motion.js animates them in.
    // Both fall back to fully visible content if their scripts never run.
    (function (cl) {
      cl.add('js');
      if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) cl.add('motion');
      setTimeout(function () {
        if (!window.__siteReady) cl.remove('js');
        if (!window.__motionReady) cl.remove('motion');
      }, 2500);
    })(document.documentElement.classList);
  </script>
  <script defer src="${ctx.base}assets/js/site.js"></script>
  <script defer src="${ctx.base}assets/js/vendor/gsap.min.js"></script>
  <script defer src="${ctx.base}assets/js/vendor/ScrollTrigger.min.js"></script>
  <script defer src="${ctx.base}assets/js/vendor/SplitText.min.js"></script>
  <script defer src="${ctx.base}assets/js/motion.js"></script>${aurora ? `
  <script defer src="${ctx.base}assets/js/aurora.js"></script>` : ''}
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

// `home` is "" on the homepage and "../index.html" on case-study pages.
export const navbar = ({ profile, nav, home }) => `
  <header class="site-nav" data-nav>
    <div class="container nav-inner">
      <a class="brand" href="${home || '#top'}" aria-label="Daksh Goti — home">
        <span class="brand-mark" aria-hidden="true">DG</span>
        <span class="brand-name">${esc(profile.name)}</span>
      </a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-menu" data-nav-toggle>
        <span class="sr-only">Menu</span>
        ${icon('menu', 'icon icon-open')}${icon('close', 'icon icon-close')}
      </button>
      <nav class="nav-menu" id="nav-menu" aria-label="Primary">
        <ul>
          ${join(nav, (n) => `<li><a href="${home}#${n.id}" data-nav-link="${n.id}">${esc(n.label)}</a></li>`)}
        </ul>
        <button class="cmdk-trigger" type="button" data-cmdk-open aria-haspopup="dialog" aria-label="Search and quick actions">
          ${icon('search')}<span class="cmdk-trigger-text">Search</span><kbd data-cmdk-key>⌘K</kbd>
        </button>
        ${extLink(profile.resume, `${icon('file')}<span>Resume</span>`, { cls: 'btn btn-glow btn-sm nav-resume', label: 'Resume' })}
      </nav>
    </div>
  </header>`;

export const footer = ({ profile, year }) => `
  <footer class="site-footer">
    <div class="container footer-inner">
      <div class="footer-id">
        <span class="brand-mark" aria-hidden="true">DG</span>
        <div>
          <p class="footer-name">${esc(profile.name)}</p>
          <p class="footer-role">Software Engineer <span aria-hidden="true">·</span> AI <span aria-hidden="true">·</span> Backend <span aria-hidden="true">·</span> Full Stack</p>
        </div>
      </div>
      <ul class="footer-links">
        <li>${extLink(profile.github, `${icon('github')}<span>GitHub</span>`, { label: 'GitHub' })}</li>
        <li>${extLink(profile.linkedin, `${icon('linkedin')}<span>LinkedIn</span>`, { label: 'LinkedIn' })}</li>
        <li><a href="mailto:${esc(profile.email)}">${icon('mail')}<span>Email</span></a></li>
      </ul>
    </div>
    <div class="container footer-base">
      <p>© ${year} ${esc(profile.name)}</p>
      <p>Built with plain HTML, CSS, and a little JavaScript.</p>
    </div>
  </footer>`;

// Command palette (⌘K / Ctrl+K / "/"). A native <dialog>, so focus trapping, Esc, and
// an inert background come from the browser. `home` is "" or "../index.html".
export const commandPalette = ({ profile, sections, projects, home, caseBase }) => {
  const item = ({ label, hint, href, external, action, value, iconName }) =>
    `<li role="option" class="cmdk-item" aria-selected="false" data-label="${esc(label.toLowerCase())}"${href ? ` data-href="${esc(href)}"` : ''}${external ? ' data-external' : ''}${action ? ` data-action="${action}"` : ''}${value ? ` data-value="${esc(value)}"` : ''}>${icon(iconName)}<span class="cmdk-label">${esc(label)}</span>${hint ? `<span class="cmdk-hint">${esc(hint)}</span>` : ''}</li>`;
  const group = (title, items) => `<li role="presentation" class="cmdk-group"><p class="kicker" aria-hidden="true">${esc(title)}</p><ul role="group" aria-label="${esc(title)}">${items.join('')}</ul></li>`;
  return `
  <dialog class="cmdk" data-cmdk aria-label="Search and quick actions">
    <div class="cmdk-panel">
      <div class="cmdk-search">
        ${icon('search')}
        <input class="cmdk-input" type="text" placeholder="Jump to a section, project, or action…" autocomplete="off" spellcheck="false"
          role="combobox" aria-expanded="true" aria-controls="cmdk-list" aria-autocomplete="list" aria-label="Search" data-cmdk-input>
        <kbd>esc</kbd>
      </div>
      <!-- [html-validate-disable-next prefer-native-element -- filterable combobox listbox (WAI-ARIA APG pattern); a native select cannot filter] -->
      <ul class="cmdk-list" id="cmdk-list" role="listbox" aria-label="Results" data-cmdk-list>
        ${group('Navigate', sections.map((s) => item({ label: s.label, href: `${home}#${s.id}`, iconName: 'hash' })))}
        ${group('Case studies', projects.map((p) => item({ label: p.name, hint: p.tagline, href: `${caseBase}${p.slug}.html`, iconName: 'layers' })))}
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
// Hero
// ---------------------------------------------------------------------------
const heroVisual = ({ system, badges }) => `
        <div class="hero-visual">
          <figure class="window border-beam" aria-label="Diagram of a typical system I build: a client calls an API, which routes to services backed by a database, a cache, a message queue, and an AI layer.">
            <div class="window-bar" aria-hidden="true">
              <span class="status-dot"></span><span class="kicker">system overview</span>
              <span class="window-pill">healthy</span>
            </div>
            <div class="arch arch--hero">${archTiers(system, true)}</div>
          </figure>
          <ul class="hero-badges">
            ${join(
              badges,
              (b, i) => `
            <li class="badge badge--${i ? 'b' : 'a'}">
              <span class="badge-value" data-count>${esc(b.value)}</span>
              <span class="badge-label">${esc(b.label)}<span class="badge-note">at ${esc(b.note)}</span></span>
            </li>`
            )}
          </ul>
        </div>`;

export const hero = ({ profile, hero: h }) => `
    <section class="hero" id="top" aria-labelledby="hero-title">
      <div class="hero-bg" aria-hidden="true"><span class="aurora aurora--a"></span><span class="aurora aurora--b"></span><canvas class="aurora-gl" data-aurora></canvas><span class="hero-grid-lines"></span></div>
      <div class="container hero-layout">
        <div class="hero-copy">
          <p class="eyebrow"><span class="eyebrow-dot" aria-hidden="true"></span>${join(profile.eyebrow, (e, i) => `${i ? '<span class="eyebrow-sep" aria-hidden="true">•</span>' : ''}<span>${esc(e)}</span>`)}</p>
          <h1 id="hero-title">
            <span class="line-mask"><span class="hero-greet">Hi, I'm</span></span>
            <span class="line-mask"><span class="hero-hi gradient-text">${esc(profile.name)}.</span></span>
            <span class="line-mask"><span class="hero-line">I build <em>scalable systems</em> and <em>AI-powered products.</em></span></span>
          </h1>
          <p class="hero-summary">${esc(profile.summary)}</p>
          <div class="hero-cta">
            <a class="btn btn-primary" href="#projects">View projects ${icon('arrowRight')}</a>
            ${extLink(profile.resume, `${icon('file')}Resume`, { cls: 'btn btn-secondary', label: 'Download resume' })}
            <div class="hero-social">
              ${extLink(profile.github, icon('github'), { cls: 'btn btn-icon', label: 'GitHub' })}
              ${extLink(profile.linkedin, icon('linkedin'), { cls: 'btn btn-icon', label: 'LinkedIn' })}
            </div>
          </div>
          <ul class="signals">
            ${join(profile.signals, (s) => `<li>${esc(s)}</li>`)}
          </ul>
        </div>
        ${heroVisual(h)}
      </div>
    </section>
    <section class="marquee" aria-label="Technologies I work with">
      <div class="marquee-track">
        ${chips(h.marquee, 'marquee-list', { eager: true })}
        <ul class="chips marquee-list" aria-hidden="true">${chipItems(h.marquee, { eager: true })}</ul>
      </div>
    </section>`;

// ---------------------------------------------------------------------------
// About + What I build
// ---------------------------------------------------------------------------
export const aboutSection = ({ profile, about, aboutFacts, experience }) => `
    <section class="section" id="about" aria-labelledby="about-title">
      <div class="container about-grid">
        <div class="about-photo reveal">
          <div class="photo-frame">
            <img src="${profile.photo}" srcset="${profile.photoSmall} 360w, ${profile.photo} 600w" sizes="(max-width: 760px) 240px, 320px" alt="Portrait of ${esc(profile.name)}" width="600" height="800" loading="lazy" decoding="async">
          </div>
          <p class="photo-badge"><span class="status-dot"></span>${esc(experience[0].role)} at ${esc(experience[0].company)}</p>
        </div>
        <div class="about-copy">
          ${sectionHeading('about-title', 'About', { num: 1 })}
          <div class="prose reveal">
            ${join(about, (p) => `<p>${esc(p)}</p>`)}
          </div>
          <ul class="facts reveal">
            ${join(aboutFacts, (f) => `<li class="fact">${tile(f.icon)}<div><p class="fact-label">${esc(f.label)}</p><p class="fact-value">${esc(f.value)}</p></div></li>`)}
          </ul>
        </div>
      </div>
    </section>`;

export const capabilitiesSection = ({ capabilities }) => `
    <section class="section" id="what-i-build" data-nav-group="about" aria-labelledby="build-title">
      <div class="container">
        ${sectionHeading('build-title', 'What I build', { num: 2 })}
        <ol class="cap-grid">
          ${join(
            capabilities,
            (c, i) => `
          <li class="card cap-card glow-card reveal" data-spotlight style="--d:${i};--hue:${c.hue}">
            <div class="cap-top"><div class="cap-id">${tile(c.icon, c.hue)}<span class="index">${pad2(i + 1)}</span></div>${capArt(c.icon)}</div>
            <h3>${esc(c.title)}</h3>
            <p>${esc(c.body)}</p>
            ${chips(c.tech, 'chips--sm')}
          </li>`
          )}
        </ol>
      </div>
    </section>`;

// ---------------------------------------------------------------------------
// Experience
// ---------------------------------------------------------------------------
export const experienceSection = ({ experience }) => `
    <section class="section" id="experience" aria-labelledby="experience-title">
      <div class="container">
        ${sectionHeading('experience-title', 'Experience', { num: 3 })}
        <ol class="timeline">
          ${join(
            experience,
            (job, i) => `
          <li class="timeline-item reveal">
            <div class="timeline-meta">
              <p class="date-pill${job.end === 'Present' ? ' date-pill--live' : ''}">${job.end === 'Present' ? '<span class="status-dot"></span>' : ''}${dates(job.start, job.end)}</p>
              <h3 class="timeline-company">${extLink(job.url, esc(job.company), { label: job.company })}</h3>
              <p class="timeline-role">${esc(job.role)}</p>
              <p class="timeline-location">${icon('pin')}${esc(job.location)}</p>
            </div>
            <div class="card timeline-card${i ? '' : ' timeline-card--current border-beam'}">
              <p class="timeline-summary">${esc(job.summary)}</p>
              <ul class="bullets">
                ${join(job.highlights, (h) => `<li>${highlight(h)}</li>`)}
              </ul>
              ${chips(job.tech, 'chips--sm')}
            </div>
          </li>`
          )}
        </ol>
      </div>
    </section>`;

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------
const metricList = (metrics, cls = 'metrics') =>
  !metrics?.length ? '' : `<dl class="${cls}">${join(metrics, (m) => `<div><dt>${esc(m.label)}</dt><dd data-count>${esc(m.value)}</dd></div>`)}</dl>`;

const repoLink = (project, profile, cls = 'link-arrow') =>
  extLink(project.repo || profile.github, `GitHub ${icon('arrowUpRight')}`, {
    cls,
    label: project.repo ? `${project.name} on GitHub` : `${project.name} — GitHub profile`,
  });

const themeStyle = (p) => `--theme:${p.theme}`;

export const projectCard = (project, i, { profile }) => `
        <article class="project reveal" data-spotlight data-card-href="projects/${project.slug}.html" style="${themeStyle(project)}" aria-labelledby="p-${project.slug}">
          <div class="project-visual">
            <div class="visual-bar" aria-hidden="true"><span class="kicker">${esc(project.slug)} / architecture</span></div>
            ${archDiagram(project, { compact: true })}
          </div>
          <div class="project-body">
            <div class="project-head">
              <p class="project-index">${pad2(i + 1)}<span>Featured</span></p>
              <h3 class="project-title" id="p-${project.slug}" style="view-transition-name: title-${project.slug}">${esc(project.name)}</h3>
              <p class="project-tagline">${esc(project.tagline)}</p>
            </div>
            <p class="project-summary">${esc(project.summary)}</p>
            ${metricList(project.metrics)}
            ${chips(project.cardStack, 'chips--sm')}
            <div class="project-links">
              <a class="link-arrow project-cta" href="projects/${project.slug}.html">Read case study ${icon('arrowRight')}<span class="sr-only">: ${esc(project.name)}</span></a>
              ${repoLink(project, profile)}
            </div>
          </div>
        </article>`;

export const projectsSection = ({ projects, moreProjects, profile }) => {
  const featured = projects.filter((p) => p.featured !== false);
  // Case studies that are not featured lead the "More projects" list, linking to their page.
  const more = [
    ...projects.filter((p) => p.featured === false).map((p) => ({ name: p.name, image: p.image, stack: p.cardStack, caseStudy: `projects/${p.slug}.html` })),
    ...moreProjects,
  ];
  return `
    <section class="section section--glow" id="projects" aria-labelledby="projects-title">
      <div class="container">
        ${sectionHeading('projects-title', 'Projects', { num: 4, lead: 'Selected systems, each with a case study covering the problem, architecture, and engineering decisions.' })}
        <div class="projects">
          ${join(featured, (p, i) => projectCard(p, i, { profile }))}
        </div>
        ${
          more.length
            ? `<details class="more-projects reveal">
          <summary><span>More projects</span><span class="more-count">${more.length} more builds, including earlier academic &amp; experimental work</span>${icon('chevronDown', 'icon chevron')}</summary>
          <ul class="more-grid">
            ${join(
              more,
              (p) => `
            <li class="card more-card">
              ${p.image ? `<img class="more-thumb" src="${p.image}" alt="" width="640" height="420" loading="lazy" decoding="async">` : ''}
              <div class="more-body">
                <h3>${esc(p.name)}</h3>
                ${chips(p.stack, 'chips--sm')}
                ${
                  p.caseStudy
                    ? `<a class="link-arrow" href="${p.caseStudy}">Case study ${icon('arrowRight')}<span class="sr-only">: ${esc(p.name)}</span></a>`
                    : p.repo
                      ? extLink(p.repo, `Source ${icon('arrowUpRight')}`, { cls: 'link-arrow', label: `${p.name} source code` })
                      : ''
                }
              </div>
            </li>`
            )}
          </ul>
        </details>`
            : ''
        }
      </div>
    </section>`;
};

// ---------------------------------------------------------------------------
// Principles, skills, education, GitHub, contact
// ---------------------------------------------------------------------------
export const principlesSection = ({ principles }) => `
    <section class="section" id="engineering" data-nav-group="projects" aria-labelledby="engineering-title">
      <div class="container">
        ${sectionHeading('engineering-title', 'How I think about engineering', { num: 5 })}
        <ul class="principles">
          ${join(
            principles,
            (p, i) => `
          <li class="card glow-card reveal" data-spotlight style="--d:${i}">
            ${tile(p.icon)}
            <h3>${esc(p.title)}</h3>
            <p>${esc(p.body)}</p>
          </li>`
          )}
        </ul>
      </div>
    </section>`;

// Decorative orbit of tech logos beside the Skills heading (CSS-animated, hidden on small screens).
const ORBIT = [
  { r: 78, dur: 40, items: ['Python', 'Java', 'TypeScript', 'React', 'AWS'] },
  { r: 132, dur: 64, items: ['FastAPI', 'Spring Boot', 'PostgreSQL', 'Redis', 'Apache Kafka', 'Docker', 'Kubernetes', 'OpenAI API'] },
];
const orbit = () => `
        <div class="orbit" aria-hidden="true">
          ${join(
            ORBIT,
            (ring, k) => `<div class="orbit-ring orbit-ring--${k + 1}" style="--r:${ring.r}px;--n:${ring.items.length};--dur:${ring.dur}s">${join(
              ring.items,
              (t, i) => `<div class="orbit-item" style="--i:${i}"><span>${techMark(t)}</span></div>`
            )}</div>`
          )}
          <span class="orbit-core">DG</span>
        </div>`;

export const skillsSection = ({ skills }) => `
    <section class="section" id="skills" aria-labelledby="skills-title">
      <div class="container">
        <div class="skills-head">
          ${sectionHeading('skills-title', 'Skills', { num: 6, lead: 'What I use, grouped by where it fits in a system.' })}
          ${orbit()}
        </div>
        <div class="skill-grid">
          ${join(
            skills,
            (g) => `
          <div class="card skill-group glow-card reveal" data-spotlight>
            <h3>${tile(g.icon)}<span>${esc(g.group)}</span></h3>
            ${chips(g.items)}
          </div>`
          )}
        </div>
      </div>
    </section>`;

export const educationSection = ({ education, certifications }) => `
    <section class="section" id="education" data-nav-group="skills" aria-labelledby="education-title">
      <div class="container">
        ${sectionHeading('education-title', 'Education & certifications', { num: 7 })}
        <div class="edu-grid">
          <ul class="edu-list">
            ${join(
              education,
              (e) => `
            <li class="card edu-item reveal">
              ${tile('cap')}
              <div>
                <div class="edu-top">
                  <h3>${esc(e.degree)}</h3>
                  <p class="edu-dates">${dates(e.start, e.end)}</p>
                </div>
                <p class="edu-school">${esc(e.school)}</p>
                <p class="edu-course"><span class="kicker">Coursework</span> ${esc(e.coursework.join(' · '))}</p>
              </div>
            </li>`
            )}
          </ul>
          <div class="card cert-card reveal">
            <h3 class="cert-title">${tile('award')}<span>Certifications</span></h3>
            <ul class="cert-list">
              ${join(
                certifications,
                (c) => `
              <li>
                ${extLink(
                  c.url,
                  `<span class="cert-name">${esc(c.name)}</span><span class="cert-meta">${c.issuer ? `${esc(c.issuer)} · ` : ''}${esc(c.kind)}</span>${icon('arrowUpRight')}`,
                  { cls: 'cert-link', label: `${c.name} ${c.kind.toLowerCase()}` }
                )}
              </li>`
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>`;

const LANG_COLORS = { Python: '#3572a5', TypeScript: '#3178c6', JavaScript: '#f1e05a', Java: '#b07219' };
const monthYear = (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });

export const githubSection = ({ profile, openSource, github }) => `
    <section class="section" id="github" data-nav-group="skills" aria-labelledby="github-title">
      <div class="container">
        <div class="os-head reveal">
          ${sectionHeading('github-title', 'Building in public', { num: 8, lead: 'I enjoy turning ideas into production-style systems, experimenting with new technologies, and sharing what I build.' })}
          ${extLink(profile.github, `${icon('github')}View GitHub ${icon('arrowUpRight')}`, { cls: 'btn btn-secondary', label: 'View GitHub' })}
        </div>
        <ul class="repo-grid">
          ${join(openSource, (r, i) => {
            const meta = github.repos?.[r.repo] || {};
            const url = meta.url || `${profile.github}/${r.repo}`;
            return `
          <li class="card repo-card glow-card reveal" data-spotlight data-card-href="${esc(url)}" data-card-external style="--d:${i};--hue:${r.hue}">
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

export const contactSection = ({ profile }) => `
    <section class="section contact" id="contact" aria-labelledby="contact-title">
      <div class="container">
        <div class="contact-panel border-beam reveal">
          <div class="contact-glow" aria-hidden="true"></div>
          <p class="eyebrow eyebrow--center"><span class="eyebrow-dot" aria-hidden="true"></span><span>Contact</span></p>
          <h2 id="contact-title" class="contact-title">Let's build something <span class="gradient-text">useful.</span></h2>
          <p class="lead">I'm always interested in hard engineering problems, AI applications, and opportunities to build products at scale.</p>
          <div class="contact-cta">
            <a class="btn btn-primary" href="mailto:${esc(profile.email)}">${icon('mail')}Email me</a>
            ${extLink(profile.linkedin, `${icon('linkedin')}LinkedIn`, { cls: 'btn btn-secondary', label: 'LinkedIn' })}
            ${extLink(profile.github, `${icon('github')}GitHub`, { cls: 'btn btn-secondary', label: 'GitHub' })}
          </div>
          <p class="contact-meta">
            <a href="mailto:${esc(profile.email)}">${esc(profile.email)}</a>
            <button class="copy-btn" type="button" data-copy="${esc(profile.email)}" aria-label="Copy email address">${icon('copy', 'icon icon-copy')}${icon('check', 'icon icon-done')}<span>Copy</span></button>
            <span aria-hidden="true">·</span><span>${esc(profile.location)}</span>
          </p>
        </div>
      </div>
    </section>`;

// ---------------------------------------------------------------------------
// Case study page body
// ---------------------------------------------------------------------------
export const caseStudy = ({ project, index, next, profile }) => `
  <main id="main" class="case" style="${themeStyle(project)}">
    <div class="case-hero-bg" aria-hidden="true"></div>
    <div class="container case-container">
      <a class="back-link" href="../index.html#projects">${icon('arrowLeft')}All projects</a>

      <header class="case-header">
        <p class="project-index">Project ${pad2(index + 1)}<span>Case study</span></p>
        <h1 style="view-transition-name: title-${project.slug}">${esc(project.name)}</h1>
        <p class="case-tagline">${esc(project.tagline)}</p>
        <p class="case-summary">${esc(project.summary)}</p>
        ${chips(project.cardStack, 'chips--sm case-stack')}
        <div class="case-links">
          ${extLink(project.repo || profile.github, `${icon('github')}${project.repo ? 'View source' : 'GitHub profile'} ${icon('arrowUpRight')}`, {
            cls: 'btn btn-secondary',
            label: project.repo ? `${project.name} source on GitHub` : 'GitHub profile',
          })}
        </div>
      </header>

      <div class="case-layout">
      <aside class="case-toc" aria-label="On this page">
        <p class="kicker">On this page</p>
        <ol>
          ${join([['results', 'Results'], ['problem', 'Problem'], ['solution', 'Solution'], ['architecture', 'Architecture'], ['implementation', 'Implementation'], ['challenges', 'Challenges'], ['technology', 'Technology']], ([id, label]) => `<li><a href="#${id}" data-toc>${label}</a></li>`)}
        </ol>
      </aside>
      <div class="case-main">
      <section class="case-section" aria-labelledby="results">
        <h2 id="results" class="case-h2 kicker">Results</h2>
        ${metricList(project.metrics, 'metrics metrics--lg')}
      </section>

      <div class="case-two">
        <section class="card case-panel" aria-labelledby="problem">
          <h2 id="problem" class="case-h2 kicker">Problem</h2>
          <p>${esc(project.problem)}</p>
        </section>
        <section class="card case-panel" aria-labelledby="solution">
          <h2 id="solution" class="case-h2 kicker">Solution</h2>
          <p>${esc(project.solution)}</p>
        </section>
      </div>

      <section class="case-section" aria-labelledby="architecture">
        <h2 id="architecture" class="case-h2 kicker">Architecture</h2>
        <div class="case-arch">${archDiagram(project)}</div>
      </section>

      <section class="case-section" aria-labelledby="implementation">
        <h2 id="implementation" class="case-h2 kicker">Technical implementation</h2>
        <dl class="impl-grid">
          ${join(project.implementation, (it, i) => `<div class="card"><span class="impl-num" aria-hidden="true">${pad2(i + 1)}</span><dt>${esc(it.title)}</dt><dd>${highlight(it.body)}</dd></div>`)}
        </dl>
      </section>

      <section class="case-section" aria-labelledby="challenges">
        <h2 id="challenges" class="case-h2 kicker">Engineering challenges</h2>
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
        <h2 id="technology" class="case-h2 kicker">Technology</h2>
        ${chips(project.stack)}
      </section>

      </div>
      </div>

      <nav class="next-project" aria-label="Next project">
        <a class="card next-card" href="${next.slug}.html" style="${themeStyle(next)}">
          <span class="next-kicker kicker">Next project</span>
          <span class="next-name">${esc(next.name)}</span>
          <span class="next-tagline">${esc(next.tagline)}</span>
          ${icon('arrowRight', 'icon next-arrow')}
        </a>
      </nav>
    </div>
  </main>`;
