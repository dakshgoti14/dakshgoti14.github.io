// Snapshots public metadata (language, last push, URL) for the repositories listed in
// content/site.mjs `openSource` into content/github.json. The build reads the snapshot,
// so the site never calls the GitHub API at runtime. Run with `npm run github`.
import { writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { profile, openSource } from '../content/site.mjs';

const owner = new URL(profile.github).pathname.replace(/\//g, '');
const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'content/github.json');

const snapshot = {};
for (const { repo } of openSource) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'portfolio-build' },
  });
  if (!res.ok) throw new Error(`${repo}: HTTP ${res.status}`);
  const d = await res.json();
  snapshot[repo] = { url: d.html_url, language: d.language, pushedAt: d.pushed_at, fork: d.fork };
}

await writeFile(out, JSON.stringify({ fetchedAt: new Date().toISOString(), repos: snapshot }, null, 2) + '\n');
console.log(`wrote content/github.json (${Object.keys(snapshot).length} repos)`);
