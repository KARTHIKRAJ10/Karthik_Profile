// Checks every internal link and asset reference in dist/.
// Usage: npm run build && npm run check:links
// Honors BASE_PATH so it can verify a project-site build (BASE_PATH=/repo).
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;
const rawBase = process.env.BASE_PATH || '/';
const base = rawBase === '/' ? '' : `/${rawBase.replace(/^\/+|\/+$/g, '')}`;

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const pages = walk(dist).filter((f) => f.endsWith('.html'));
const idCache = new Map();
const idsOf = (file) => {
  if (!idCache.has(file)) {
    const html = readFileSync(file, 'utf8');
    idCache.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  }
  return idCache.get(file);
};

const problems = [];
let checked = 0;

for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  const rel = relative(dist, page);
  const refs = [...html.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, '&'));

  for (const ref of refs) {
    if (/^(https?:|mailto:|tel:|data:)/.test(ref)) continue;
    checked++;

    if (ref.startsWith('#')) {
      if (ref.length > 1 && !idsOf(page).has(ref.slice(1))) problems.push(`${rel}: missing anchor ${ref}`);
      continue;
    }
    if (!ref.startsWith('/')) {
      problems.push(`${rel}: relative link "${ref}" (use the href() helper)`);
      continue;
    }
    if (base && !(ref === base || ref.startsWith(`${base}/`))) {
      problems.push(`${rel}: "${ref}" is missing the base path ${base}`);
      continue;
    }

    const [pathPart, hash] = ref.slice(base.length).split('#');
    const path = decodeURIComponent(pathPart.split('?')[0]);
    let target = join(dist, path);
    if (existsSync(target) && statSync(target).isDirectory()) target = join(target, 'index.html');
    if (!existsSync(target)) {
      problems.push(`${rel}: broken link ${ref}`);
      continue;
    }
    if (target.endsWith('.html') && !path.endsWith('/') && !path.endsWith('.html')) {
      problems.push(`${rel}: "${ref}" should end with a trailing slash`);
    }
    if (hash && target.endsWith('.html') && !idsOf(target).has(hash)) problems.push(`${rel}: missing anchor in ${ref}`);
  }
}

console.log(`Checked ${checked} internal references across ${pages.length} pages (base "${base || '/'}").`);
if (problems.length) {
  console.error(`\n${problems.length} problem(s):\n` + problems.map((p) => `  - ${p}`).join('\n'));
  process.exit(1);
}
console.log('No broken internal links or missing assets.');
