// Static site generator: content/site.mjs -> the homepage, one directory per inner page
// (about/, experience/, projects/, education/, contact/), a page per case study, the 404, and a sitemap.
// Zero dependencies. Run with `npm run build` (Node 18+).
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import * as content from '../content/site.mjs';
import * as c from './components.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
// Repository metadata snapshot (npm run github); the build still works without it.
const github = await readFile(join(root, 'content/github.json'), 'utf8').then(JSON.parse, () => ({ repos: {} }));
const { profile, seo, projects, pages, pageMeta } = content;
const year = new Date().getFullYear();
const abs = (path) => `${profile.siteUrl}/${path}`;

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  jobTitle: profile.role,
  url: `${profile.siteUrl}/`,
  email: `mailto:${profile.email}`,
  image: abs(profile.photo),
  sameAs: [profile.github, profile.linkedin],
  worksFor: { '@type': 'Organization', name: content.experience[0].company },
  alumniOf: content.education.map((e) => ({ '@type': 'CollegeOrUniversity', name: e.school })),
};

// One page: sets the render context first (components read it), then wraps `main` in the shared shell.
// `path` is the page's URL path from the site root; `base` leads back to the root from it.
const page = ({ key, path, base, title, description, ogImage = seo.ogImage, jsonLd, preload, noindex, main }) => {
  c.ctx.base = base;
  c.ctx.page = key;
  const body = main();
  return `${c.head({ title, description, canonical: abs(path), ogImage: abs(ogImage), jsonLd, preload: preload?.(), noindex })}
${c.bodyOpen()}
${c.navbar({ profile, pages })}
${body}
${c.footer({ profile, year, pages, experience: content.experience })}
${c.commandPalette({ profile, pages, projects })}
</body>
</html>
`;
};

// Search results truncate titles past ~70 characters; long ones drop the name suffix to keep the project's words.
const caseTitle = (p) => {
  const full = `${p.name} — ${p.tagline} | ${profile.name}`;
  return full.length <= 70 ? full : `${p.name} — ${p.tagline}`;
};

const inner = (key, sections) =>
  page({ key, path: `${key}/`, base: '../', ...pageMeta[key], main: () => `  <main id="main">\n${sections().join('\n')}\n  </main>` });

const outputs = [
  ['index.html', page({
    key: 'home', path: '', base: '', title: seo.title, description: seo.description, jsonLd: personJsonLd,
    preload: () => c.portraitPreload(profile),
    main: () => `  <main id="main">
${c.hero(content)}
${c.toolStrip(content)}
${c.aboutTeaser(content)}
${c.capabilitiesSection(content)}
${c.featuredWork(content)}
${c.experienceTeaser(content)}
${c.ctaBand(content)}
  </main>`,
  })],
  ['about/index.html', inner('about', () => [c.aboutHero(content), c.storySection(content), c.glanceSection(content), c.principlesSection(content), c.skillsSection(content)])],
  ['experience/index.html', inner('experience', () => [c.experienceHero(content), c.workHistory(content)])],
  ['projects/index.html', inner('projects', () => [c.projectsHero(content), c.caseStudiesSection(content), c.workSection(content), c.githubSection({ ...content, github }), c.archiveSection(content)])],
  ['education/index.html', inner('education', () => [c.educationHero(content), c.degreesSection(content), c.certificationsSection(content)])],
  ['contact/index.html', inner('contact', () => [c.contactHero(content), c.messageSection(content)])],
  ...projects.map((project, index) => [`projects/${project.slug}.html`, page({
    key: 'projects', path: `projects/${project.slug}.html`, base: '../',
    title: caseTitle(project),
    description: project.summary,
    // Per-project preview (npm run assets), falling back to the site-wide image.
    ogImage: existsSync(join(root, `assets/img/og/${project.slug}.png`)) ? `assets/img/og/${project.slug}.png` : seo.ogImage,
    main: () => c.caseStudy({ project, index, next: projects[(index + 1) % projects.length], profile }),
  })]),
  // Served by GitHub Pages and Vercel for unknown paths at any depth, hence root-absolute URLs.
  ['404.html', page({
    key: '', path: '', base: '/', title: `Page not found | ${profile.name}`, description: seo.description, noindex: true,
    main: () => c.notFound(content),
  })],
];

// Sitemap and robots.txt for every indexable page.
const urls = [...pages.map((p) => p.path), ...projects.map((p) => `projects/${p.slug}.html`)];
outputs.push(['sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${abs(u)}</loc></url>`).join('\n')}
</urlset>
`]);
outputs.push(['robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${abs('sitemap.xml')}\n`]);

for (const [file] of outputs) await mkdir(dirname(join(root, file)), { recursive: true });
await Promise.all(outputs.map(([file, html]) => writeFile(join(root, file), html)));

// Self-host GSAP (GitHub Pages serves no node_modules): copy the files the pages load.
const vendorDir = join(root, 'assets/js/vendor');
const gsapDist = join(root, 'node_modules/gsap/dist');
if (existsSync(gsapDist)) {
  await mkdir(vendorDir, { recursive: true });
  await Promise.all(['gsap.min.js', 'ScrollTrigger.min.js', 'SplitText.min.js', 'ScrambleTextPlugin.min.js'].map((f) => copyFile(join(gsapDist, f), join(vendorDir, f))));
} else if (!existsSync(join(vendorDir, 'gsap.min.js'))) {
  console.warn('GSAP not found — run `npm install` (motion falls back to CSS-only).');
}
console.log(`Built ${outputs.length} files: ${outputs.map(([f]) => f).join(', ')}`);
