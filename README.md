# dakshgoti14.github.io

Portfolio of Daksh Goti, Software Engineer. Served by GitHub Pages at https://dakshgoti14.github.io.

The site is static HTML, CSS, and a small amount of JavaScript. There is no framework and there are no runtime dependencies.

## Editing content

All content lives in [`content/site.mjs`](content/site.mjs): profile, experience, projects, case studies, skills, education, and certifications. Make your edits there, then regenerate the pages:

```sh
npm install     # once — installs GSAP, which the build copies into assets/js/vendor/
npm test        # build, then check
```

The site has six pages in its menu — Home, About, Experience, Projects, Education, and Contact — plus a page per case study.
Each inner page is a directory with an `index.html` (so URLs read `/about/`, `/experience/`, …), and the menu, footer,
search palette, and `sitemap.xml` all come from the `pages` list in `content/site.mjs`.

These files are **generated** — edit the content file or the components, not the HTML:
`index.html`, `about/`, `experience/`, `projects/index.html` and the case studies beside it (`medinsight`, `orderstream`,
`contextflow`, `vectorforgedb`, `streamguard`, `documind`), `education/`, `contact/`, `404.html`, `sitemap.xml`, and `robots.txt`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run build` | Generates every page, the sitemap, and robots.txt from `content/site.mjs` |
| `npm run check` | Checks local links, `#anchors`, duplicate ids, image alt text, `rel="noopener"`, heading order, metadata, and that removed personal details have not come back |
| `npm run logos` | Downloads the brand marks listed in `content/tech.mjs` into `assets/img/tech/` (devicon, MIT; simple-icons, CC0) |
| `npm run github` | Snapshots language and last-push dates for the repositories in `openSource` into `content/github.json` (the site never calls the GitHub API at runtime) |
| `npm run dist` | Builds, then packages only the public files (the pages, `assets/`, favicons, sitemap) into `dist/` for Vercel |
| `npm run assets` | Re-renders `og-image.png`, the per-case-study previews in `assets/img/og/`, `favicon.png`, and `apple-touch-icon.png` with local Chrome (`CHROME=/path` to override) |
| `npm run fonts` | Downloads the self-hosted Space Grotesk and Geist Mono files (latin subset) into `assets/fonts/` |

Requires Node 18 or later.

## Deploy

- **GitHub Pages** deploys through `.github/workflows/pages.yml` on every push to `main`: it runs `npm ci`, `npm test`, and packages `dist/`. Pull requests run the same build and checks without deploying. Generated pages are also committed, so the repository root stays browsable.
- **Vercel** uses `vercel.json`: it runs `npm ci` and `npm run dist`, then serves `dist/`.

## Design

A flat, editorial system: a charcoal canvas with alternating bands, slate cards, Space Grotesk for all text
(Geist Mono for technical labels), and one solid accent colour. The tokens at the top of `assets/css/site.css`
define every colour, size, and duration.

The hero portrait is a cut-out with a transparent background, made on a Mac without uploading the photo anywhere:

```sh
swift scripts/cutout.swift assets/img/daksh-goti.jpg cutout.png   # macOS Vision subject mask
magick cutout.png -resize 780x portrait-780.png && cwebp -q 82 -alpha_q 90 portrait-780.png -o assets/img/portrait-cutout-780.webp
```

Repeat the last step for the 520 and 1040 widths. The footer avatar (`assets/img/avatar-160.webp`) is a square crop of the same cut-out, and the About page's round
portrait (`assets/img/portrait-round-*.webp`) is a square crop of the original photo.

## Layout

```
content/site.mjs        content data (single source of truth)
content/tech.mjs        technology name → brand logo / concept icon
scripts/components.mjs  HTML components (nav, hero, timeline, project card, architecture diagram, ...)
scripts/build.mjs       static generator (pages, sitemap.xml, robots.txt)
scripts/check.mjs       static checks
scripts/assets.mjs      raster asset renderer (uses scripts/og.html)
scripts/fetch-fonts.mjs self-hosted font downloader
scripts/cutout.swift    portrait background removal (macOS Vision)
scripts/fetch-logos.mjs logo downloader
scripts/fetch-github.mjs GitHub metadata snapshot
assets/css/site.css     design system and layout
assets/js/site.js       progressive enhancement: mobile menu, ⌘K palette, architecture beams, clickable cards, TOC, reveal, count-up, copy, message form
assets/js/motion.js     GSAP + ScrollTrigger choreography (hero depth on scroll, headings, project reveals)
assets/js/vendor/       self-hosted GSAP (copied from node_modules by the build)
```

## Motion

All animation is progressive enhancement. Visitors who prefer reduced motion get a static page; if GSAP is unavailable,
the CSS-only version renders and a timeout in the page head guarantees nothing stays hidden. The page-load intros are
CSS animations on the individual `translate`/`scale` properties; GSAP never targets an element that has one, because it
folds those properties into its own transform. GSAP is used under its
[standard no-charge license](https://gsap.com/standard-license).

The legacy template (`assets/css/style.css`, `assets/js/main.js`, `assets/vendor/`) is kept only for the older, unlinked pages in `projects/`.

The contact page's message form has no backend: it opens the visitor's own email app with the message filled in
(a plain `mailto:` form submission without JavaScript). Nothing is collected or stored by the site.
