/**
 * Generates frontend/src/data/projects.generated.js from the project register.
 *
 * The register (docs/06-content/project-register.md) reproduces the legacy
 * projects table VERBATIM, typos included, and is the source of truth. Parsing
 * it — rather than retyping 52 rows — means the site cannot drift from the
 * record, and the row count is asserted rather than assumed.
 *
 *   node scripts/build-projects.mjs [--check]
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const SRC = resolve(ROOT, 'docs/06-content/project-register.md');
const OUT = resolve(ROOT, 'frontend/src/data/projects.generated.js');

const EXPECTED_ROWS = 52;

/* The register header lists the source's spelling errors and states they are
   "corrected in the new site's content layer". Only documented typos are fixed;
   place names are left exactly as published, since correcting a place we cannot
   verify would be inventing. */
const TYPOS = [
  [/Liasoning/g, 'Liaisoning'], [/Liasioning/g, 'Liaisoning'],
  [/Maintanace/g, 'Maintenance'], [/Maintanance/g, 'Maintenance'],
  [/Tessting/g, 'Testing'], [/Redisson/g, 'Radisson'],
  [/Hayderabad/g, 'Hyderabad'], [/Optaining/g, 'Obtaining'],
  [/B\$LA/g, 'B4LA'], [/Commissioing/g, 'Commissioning'],
  [/Comissioning/g, 'Commissioning'], [/Infrastructrue/g, 'Infrastructure'],
  [/Constructin/g, 'Construction'], [/Antena/g, 'Antenna'],
  [/Gorgaon/g, 'Gurgaon'],
];
const fix = (s) => TYPOS.reduce((acc, [re, to]) => acc.replace(re, to), s).replace(/\s+/g, ' ').trim();

/** "Operation and Maintenance" appears under two spellings in the source. */
const CATEGORY = {
  'Electrical Infrastructure': 'electrical',
  'Liaisoning Services': 'regulatory',
  'Electrical Infrastructure & Liaisoning': 'electrical-regulatory',
  'Operation and Maintenance': 'om',
  'Civil Infrastructure': 'civil',
};

const md = readFileSync(SRC, 'utf8');
const rows = [];
for (const line of md.split('\n')) {
  const m = /^\|\s*(\d+)\s*\|(.+)\|\s*$/.exec(line.trim());
  if (!m) continue;
  const cells = m[2].split('|').map((c) => fix(c));
  if (cells.length < 4) continue;
  const [particulars, client, scope, rawCat] = cells;
  const category = CATEGORY[rawCat];
  if (!category) throw new Error(`Unmapped category "${rawCat}" on row ${m[1]}`);
  rows.push({ id: Number(m[1]), particulars, client, scope, category });
}

if (rows.length !== EXPECTED_ROWS) {
  console.error(`✗ Parsed ${rows.length} rows, expected ${EXPECTED_ROWS}. The register changed — check it.`);
  process.exit(1);
}

const counts = rows.reduce((a, r) => ({ ...a, [r.category]: (a[r.category] ?? 0) + 1 }), {});

const out = `/**
 * GENERATED FILE — DO NOT EDIT.
 * Produced by scripts/build-projects.mjs from docs/06-content/project-register.md,
 * which reproduces the legacy projects table verbatim. Regenerate: npm run projects
 *
 * Every row is VERIFIED (as published on the legacy site). No row in the source
 * states a date, duration or contract value, so none is shown.
 */
export const projects = ${JSON.stringify(rows, null, 2)};

/** Asserted at build time against the register. */
export const PROJECT_TOTAL = ${rows.length};

export const projectCounts = ${JSON.stringify(counts, null, 2)};
`;

if (process.argv.includes('--check')) {
  let cur = '';
  try { cur = readFileSync(OUT, 'utf8'); } catch { /* missing */ }
  if (cur !== out) { console.error('✗ projects.generated.js is stale. Run: npm run projects'); process.exit(1); }
  console.log(`✓ projects.generated.js up to date (${rows.length} rows)`);
} else {
  writeFileSync(OUT, out);
  console.log(`✓ projects.generated.js written — ${rows.length} rows`, counts);
}
