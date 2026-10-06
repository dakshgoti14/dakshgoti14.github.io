# dakshgoti14.github.io

Portfolio of Daksh Goti, Software Engineer. Served by GitHub Pages at https://dakshgoti14.github.io.

The site is static HTML, CSS, and a small amount of JavaScript. There is no framework and there are no runtime dependencies.

## Editing content

All content lives in [`content/site.mjs`](content/site.mjs): profile, experience, projects, case studies, skills, education, and certifications. Make your edits there, then regenerate the pages:

```sh
npm install     # once — installs GSAP, which the build copies into assets/js/vendor/
npm test        # build, then check
```

`index.html` and `projects/{medinsight,orderstream,documind,streamguard}.html` are **generated**. Edit the content file or the components, not the generated HTML.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run build` | Generates the homepage and the case-study pages from `content/site.mjs` |
| `npm run check` | Checks local links, `#anchors`, duplicate ids, image alt text, `rel="noopener"`, heading order, metadata, and that removed personal details have not come back |
| `npm run logos` | Downloads the brand marks listed in `content/tech.mjs` into `assets/img/tech/` (devicon, MIT; simple-icons, CC0) |
| `npm run github` | Snapshots language and last-push dates for the repositories in `openSource` into `content/github.json` (the site never calls the GitHub API at runtime) |
| `npm run assets` | Re-renders `og-image.png`, `favicon.png`, and `apple-touch-icon.png` with local Chrome (`CHROME=/path` to override) |

Requires Node 18 or later.

## Layout

```
content/site.mjs        content data (single source of truth)
content/tech.mjs        technology name → brand logo / concept icon
scripts/components.mjs  HTML components (nav, hero, timeline, project card, architecture diagram, ...)
scripts/build.mjs       static generator
scripts/check.mjs       static checks
scripts/assets.mjs      raster asset renderer (uses scripts/og.html)
scripts/fetch-logos.mjs logo downloader
scripts/fetch-github.mjs GitHub metadata snapshot
assets/css/site.css     design system and layout
assets/js/site.js       progressive enhancement: mobile menu, ⌘K palette, architecture beams, active nav, TOC, reveal, count-up, copy
assets/js/motion.js     GSAP + ScrollTrigger choreography (hero intro, headings, timeline, project reveals, tilt)
assets/js/aurora.js     WebGL aurora shader behind the hero
assets/js/vendor/       self-hosted GSAP (copied from node_modules by the build)
```

## Motion

All animation is progressive enhancement. Visitors who prefer reduced motion get a static page; if GSAP or WebGL is unavailable,
the CSS-only version renders and a timeout in the page head guarantees nothing stays hidden. GSAP is used under its
[standard no-charge license](https://gsap.com/standard-license).

The legacy template (`assets/css/style.css`, `assets/js/main.js`, `assets/vendor/`) is kept only for the older, unlinked pages in `projects/`.
