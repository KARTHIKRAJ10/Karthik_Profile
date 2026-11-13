// Lists every piece of information still needed to complete the content.
// Usage: npm run drafts
import { readdirSync, readFileSync } from 'node:fs';
import { parse } from 'yaml';

const root = new URL('../src/content/', import.meta.url);
let total = 0;

function collect(node, path, out) {
  if (Array.isArray(node)) {
    node.forEach((item, i) => collect(item, [...path, item?.name ?? item?.label ?? item?.title ?? i + 1], out));
  } else if (node && typeof node === 'object') {
    if (Array.isArray(node.needs)) node.needs.forEach((n) => out.push([path.join(' > '), n]));
    if (node.status === 'draft' && !node.needs?.length) out.push([path.join(' > '), 'Value missing']);
    for (const [k, v] of Object.entries(node)) if (k !== 'needs') collect(v, [...path, k], out);
  }
}

for (const collection of ['experience', 'projects']) {
  console.log(`\n=== ${collection} ===`);
  for (const file of readdirSync(new URL(`${collection}/`, root)).filter((f) => f.endsWith('.yaml')).sort()) {
    const data = parse(readFileSync(new URL(`${collection}/${file}`, root), 'utf8'));
    const out = [];
    collect(data, [], out);
    if (data.industryNeedsConfirmation) out.push(['industry', `Confirm industry: "${data.industry}"`]);
    for (const ev of data.evidence ?? []) if (!ev.url && /add /i.test(ev.note ?? '')) out.push(['evidence', `${ev.label}: ${ev.note}`]);
    if (!out.length) continue;
    total += out.length;
    console.log(`\nsrc/content/${collection}/${file}  (${out.length})`);
    for (const [where, need] of out) console.log(`  [${where}] ${need}`);
  }
}
console.log(`\n${total} open item(s).`);
