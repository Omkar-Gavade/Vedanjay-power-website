/**
 * Bundle budget gate.
 *
 * Baselines are the measured build immediately BEFORE the chatbot was added.
 * The chat panel must stay out of the initial payload entirely; only the
 * launcher may be added to it.
 */
import { readFileSync } from 'node:fs';
import { globSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

const BASELINE = { js: 84961, css: 23850 };
const BUDGET = { js: 2048, css: 0, chunk: 15360 };

const gz = (p) => gzipSync(readFileSync(p), { level: 9 }).length;
const one = (pattern) => {
  const hits = globSync(pattern);
  if (hits.length !== 1) throw new Error(`expected exactly one match for ${pattern}, got ${hits.length}`);
  return hits[0];
};

const js = gz(one('frontend/dist/assets/index-*.js'));
const css = gz(one('frontend/dist/assets/index-*.css'));
const chunkJs = globSync('frontend/dist/assets/ChatPanel-*.js').map(gz).reduce((a, b) => a + b, 0);
const chunkCss = globSync('frontend/dist/assets/ChatPanel-*.css').map(gz).reduce((a, b) => a + b, 0);

const rows = [
  ['initial JS', js - BASELINE.js, BUDGET.js],
  ['initial CSS', css - BASELINE.css, BUDGET.css],
  ['chat chunk (JS+CSS)', chunkJs + chunkCss, BUDGET.chunk],
];

let ok = true;
for (const [label, actual, budget] of rows) {
  const pass = actual <= budget;
  if (!pass) ok = false;
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${label.padEnd(22)} ${String(actual).padStart(7)} B  (budget ${budget} B)`);
}

if (!ok) {
  console.error('\nBundle budget exceeded. The chat panel must stay in its lazy chunk —\n' +
    'check that chat.css is imported by ChatPanel.jsx and NOT by styles/index.css.');
  process.exit(1);
}
console.log('\nAll budgets within limits.');
