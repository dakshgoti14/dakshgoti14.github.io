// Static site generator: content/site.mjs -> index.html + projects/<slug>.html
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
const { profile, seo, projects } = content;
const year = new Date().getFullYear();
const abs = (path) => `${profile.siteUrl}/${path}`;

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  jobTitle: profile.role,
  url: profile.siteUrl,
  email: `mailto:${profile.email}`,
  image: abs(profile.photo),
  sameAs: [profile.github, profile.linkedin],
  worksFor: { '@type': 'Organization', name: content.experience[0].company },
  alumniOf: content.education.map((e) => ({ '@type': 'CollegeOrUniversity', name: e.school })),
};

const homePage = () => {
  c.ctx.base = '';
  return `${c.head({
  title: seo.title,
  description: seo.description,
  canonical: `${profile.siteUrl}/`,
  ogImage: abs(seo.ogImage),
  jsonLd: personJsonLd,
  aurora: true,
})}
${c.bodyOpen()}
${c.navbar({ profile, nav: content.nav, home: '' })}
  <main id="main">
${c.hero(content)}
${c.aboutSection(content)}
${c.capabilitiesSection(content)}
${c.experienceSection(content)}
${c.projectsSection(content)}
${c.principlesSection(content)}
${c.skillsSection(content)}
${c.educationSection(content)}
${c.githubSection({ ...content, github })}
${c.contactSection(content)}
  </main>
${c.footer({ profile, year })}
${c.commandPalette({ profile, sections: content.sections, projects, home: '', caseBase: 'projects/' })}
</body>
</html>
`;
};

const projectPage = (project, index) => {
  const next = projects[(index + 1) % projects.length];
  c.ctx.base = '../';
  return `${c.head({
    title: `${project.name} — ${project.tagline} | ${profile.name}`,
    description: project.summary,
    canonical: abs(`projects/${project.slug}.html`),
    ogImage: abs(seo.ogImage),
  })}
${c.bodyOpen()}
${c.navbar({ profile, nav: content.nav, home: '../index.html' })}
${c.caseStudy({ project, index, next, profile })}
${c.footer({ profile, year })}
${c.commandPalette({ profile, sections: content.sections, projects, home: '../index.html', caseBase: '' })}
</body>
</html>
`;
};

const outputs = [
  ['index.html', homePage()],
  ...projects.map((p, i) => [`projects/${p.slug}.html`, projectPage(p, i)]),
];

await Promise.all(outputs.map(([file, html]) => writeFile(join(root, file), html)));

// Self-host GSAP (GitHub Pages serves no node_modules): copy the three files the pages load.
const vendorDir = join(root, 'assets/js/vendor');
const gsapDist = join(root, 'node_modules/gsap/dist');
if (existsSync(gsapDist)) {
  await mkdir(vendorDir, { recursive: true });
  await Promise.all(['gsap.min.js', 'ScrollTrigger.min.js', 'SplitText.min.js'].map((f) => copyFile(join(gsapDist, f), join(vendorDir, f))));
} else if (!existsSync(join(vendorDir, 'gsap.min.js'))) {
  console.warn('GSAP not found — run `npm install` (motion falls back to CSS-only).');
}
console.log(`Built ${outputs.length} pages: ${outputs.map(([f]) => f).join(', ')}`);
