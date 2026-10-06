// Packages the deployable site into dist/ for hosts that expect an output directory (Vercel).
// GitHub Pages serves the repository root directly and does not need this step.
// Run with `npm run dist` (builds first).
import { cp, rm, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'dist');

// Everything a visitor's browser requests; build scripts, content source, and node_modules stay out.
const PUBLIC = ['index.html', 'projects', 'assets', 'favicon.svg', 'favicon.png'];

await rm(out, { recursive: true, force: true });
await mkdir(out);
for (const entry of PUBLIC) {
  const src = join(root, entry);
  if (!existsSync(src)) throw new Error(`missing ${entry} — run \`npm run build\` first`);
  await cp(src, join(out, entry), { recursive: true, filter: (p) => !p.endsWith('.DS_Store') });
}
console.log(`Packaged ${PUBLIC.join(', ')} into dist/`);
