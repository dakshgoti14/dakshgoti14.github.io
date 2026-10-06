// Downloads the brand marks listed in content/tech.mjs into assets/img/tech/ so the site
// serves them itself (no third-party requests at runtime). Run with `npm run logos`.
// Sources: devicon (MIT) and simple-icons (CC0).
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LOGOS } from '../content/tech.mjs';

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets/img/tech');
await mkdir(out, { recursive: true });

const results = await Promise.allSettled(
  Object.entries(LOGOS).map(async ([key, { src, fill }]) => {
    const res = await fetch(src);
    if (!res.ok) throw new Error(`${key}: HTTP ${res.status} ${src}`);
    let svg = (await res.text()).replace(/<\?xml[^>]*>\s*/, '').replace(/<!--[\s\S]*?-->/g, '').trim();
    if (fill) svg = svg.replace(/<svg\b/, `<svg fill="${fill}"`);
    await writeFile(join(out, `${key}.svg`), svg + '\n');
    return key;
  })
);

const failed = results.filter((r) => r.status === 'rejected');
console.log(`fetched ${results.length - failed.length}/${results.length} logos`);
failed.forEach((f) => console.error('  ' + f.reason.message));
if (failed.length) process.exit(1);
