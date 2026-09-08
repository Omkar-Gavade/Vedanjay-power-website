/**
 * DOT GRID for the portfolio map — Asia, with India at the centre.
 *
 * The map is drawn as a field of dots. They have to be WHOLE: a dot pattern
 * clipped by a coastline leaves half-dots all round the edge, which is the
 * difference between the effect looking designed and looking like a fill that
 * went wrong. So the grid is decided here, against the real geometry, and the
 * component draws only complete dots.
 *
 * WHY ASIA AND NOT JUST INDIA. India alone floats in a void, which is the
 * clearest tell that a thing is a diagram rather than a map. The window is
 * centred on India and reaches from the Gulf to the South China Sea, so the
 * portfolio reads as sitting inside a region rather than on a cut-out.
 *
 * FOUR CLASSES OF DOT, decided per cell by rasterising each mask on its own:
 *   -2  land outside India      -1  India, no capacity behind it
 *   0..n  one of the portfolio states, indexed into `states`
 * Rendering everything at once in distinct colours would be one pass instead of
 * ten, but the rasteriser antialiases between neighbours and a blended pixel
 * cannot be attributed.
 *
 * India's own geometry is india.geojson — the source scripts/build-india-map.mjs
 * asserts carries the official boundary (Ladakh past 37°N, J&K still containing
 * Muzaffarabad). Natural Earth supplies only the land around it, and India is
 * rasterised over the top, so NE's line of control is never what gets drawn.
 *
 *   node scripts/build-asia-dots.mjs           write
 *   node scripts/build-asia-dots.mjs --check   verify the committed file
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { portfolioByState } from '../frontend/src/data/portfolio.js';

const CHECK = process.argv.includes('--check');
/* .cache/ is gitignored, so the sources are fetched on first run rather than
   assumed present — otherwise this builds on my machine and nowhere else. */
const INDIA_URL = 'https://raw.githubusercontent.com/udit-001/india-maps-data/main/geojson/india.geojson';
const NE_URL = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson';
const INDIA = fileURLToPath(new URL('../.cache/india.geojson', import.meta.url));
const NE = fileURLToPath(new URL('../.cache/ne50.geojson', import.meta.url));

async function cached(file, url) {
  if (!existsSync(file)) {
    mkdirSync(dirname(file), { recursive: true });
    const res = await fetch(url);
    if (!res.ok) throw new Error(`fetch failed (${res.status}): ${url}`);
    writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  }
  return JSON.parse(readFileSync(file, 'utf8'));
}
const OUT = fileURLToPath(new URL('../frontend/public/maps/asia-dots.json', import.meta.url));

/* The window. Centred on India's own centre (~82.5°E, ~22.5°N) so the country
   sits in the middle of the frame rather than off to one side, and tight
   enough that India owns about half the width. A wider window shows more of
   Asia and turns the subject into a detail. */
const LON0 = 58; const LON1 = 108;
const LAT0 = 2; const LAT1 = 42;
const W = 1300;
const CELL = 13;

const merc = (lat) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI / 180) / 2)) * (180 / Math.PI);
const y0 = merc(LAT0); const y1 = merc(LAT1);
const sx = W / (LON1 - LON0);
const H = Math.round((y1 - y0) * sx);
const px = (p) => [(p[0] - LON0) * sx, H - (merc(p[1]) - y0) * sx];

const cols = Math.ceil(W / CELL);
const rows = Math.ceil(H / CELL);

const ringsOf = (geom) => (geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates).flat();
const fmt = (n) => Math.round(n * 10) / 10;
const toPath = (rings) => rings.map((r) => {
  const s = r.map(px);
  if (s.length < 3) return '';
  return `M${s.map(([a, b]) => `${fmt(a)} ${fmt(b)}`).join('L')}Z`;
}).join('');

/** Rasterise paths at exactly one pixel per dot cell. */
async function mask(d) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${cols}" height="${rows}" `
    + `viewBox="0 0 ${W} ${H}"><path d="${d}" fill="#000" fill-rule="nonzero"/></svg>`;
  const { data, info } = await sharp(Buffer.from(svg), { limitInputPixels: false })
    .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, c: info.channels };
}
const at = (m, x, y) => m.data[(y * m.w + x) * m.c + 3];

/* ---------------------------------------------------------------- geometry */
const ne = await cached(NE, NE_URL);
const inWindow = (f) => ringsOf(f.geometry).some((r) => r.some(
  ([lo, la]) => lo > LON0 - 20 && lo < LON1 + 20 && la > LAT0 - 15 && la < LAT1 + 15,
));
const landD = ne.features.filter(inWindow).map((f) => toPath(ringsOf(f.geometry))).join('');

const india = await cached(INDIA, INDIA_URL);
const stateName = (f) => f.properties.st_nm ?? f.properties.NAME_1 ?? f.properties.name;

/* ---- boundary assertions: the reason this dataset was chosen ----
   Every off-the-shelf india.json on a CDN draws the line of control instead of
   India's official map. The build fails unless Ladakh reaches past 37°N and
   80°E (Gilgit-Baltistan and Aksai Chin) and Jammu and Kashmir still contains
   Muzaffarabad and Mirpur. These ran in the map generator this replaced; they
   move here with the geometry. */
{
  const fail = (m) => { throw new Error(`ASIA MAP: ${m}`); };
  const byState = new Map();
  const districts = new Map();
  for (const f of india.features) {
    const st = stateName(f);
    if (!byState.has(st)) { byState.set(st, []); districts.set(st, []); }
    byState.get(st).push(...ringsOf(f.geometry));
    districts.get(st).push(f.properties.district ?? null);
  }
  if (byState.size !== 36) fail(`expected 36 states/UTs, got ${byState.size}`);
  const bounds = (rings) => rings.flat().reduce(
    (b, p) => [Math.min(b[0], p[0]), Math.min(b[1], p[1]), Math.max(b[2], p[0]), Math.max(b[3], p[1])],
    [Infinity, Infinity, -Infinity, -Infinity],
  );
  const lad = bounds(byState.get('Ladakh') ?? fail('missing Ladakh'));
  if (lad[3] < 37) fail(`Ladakh reaches only ${lad[3].toFixed(2)}N — Gilgit-Baltistan is missing`);
  if (lad[2] < 80) fail(`Ladakh reaches only ${lad[2].toFixed(2)}E — Aksai Chin is missing`);
  const jk = districts.get('Jammu and Kashmir') ?? fail('missing Jammu and Kashmir');
  for (const d of ['Muzaffarabad', 'Mirpur']) {
    if (!jk.includes(d)) fail(`Jammu and Kashmir is missing the ${d} district`);
  }
}
const indiaD = india.features.map((f) => toPath(ringsOf(f.geometry))).join('');

const named = portfolioByState.map((s) => s.state);
const stateD = named.map((n) => {
  const parts = india.features.filter((f) => stateName(f) === n);
  if (!parts.length) { console.error(`no geometry for ${n}`); process.exit(1); }
  return toPath(parts.flatMap((f) => ringsOf(f.geometry)));
});

/* ----------------------------------------------------------------- classify */
const landM = await mask(landD);
const indiaM = await mask(indiaD);
const stateM = [];
for (const d of stateD) stateM.push(await mask(d));

const dots = [];
for (let y = 0; y < rows; y += 1) {
  for (let x = 0; x < cols; x += 1) {
    const isIndia = at(indiaM, x, y) >= 128;
    if (!isIndia && at(landM, x, y) < 128) continue;
    let s = isIndia ? -1 : -2;
    if (isIndia) {
      for (let i = 0; i < stateM.length; i += 1) {
        if (at(stateM[i], x, y) >= 128) { s = i; break; }
      }
    }
    dots.push([x, y, s]);
  }
}

/** Turbine anchors: each portfolio state's own centroid, in grid cells. */
const anchors = named.map((_, i) => {
  const cells = dots.filter((d) => d[2] === i);
  const cx = cells.reduce((a, d) => a + d[0], 0) / cells.length;
  const cy = cells.reduce((a, d) => a + d[1], 0) / cells.length;
  return [Math.round(cx * CELL * 10) / 10 + CELL / 2, Math.round(cy * CELL * 10) / 10 + CELL / 2];
});

const payload = {
  cell: CELL, cols, rows, width: W, height: H,
  /* Recorded so the shipped artefact can be checked as GEOGRAPHY rather than
     as pixels — frontend/test/asia-map.test.js inverts this to assert the
     official boundary on the file the browser actually downloads. */
  bounds: { lon0: LON0, lat0: LAT0, lon1: LON1, lat1: LAT1 },
  states: named, anchors,
  dots: dots.flat(),
};
const json = `${JSON.stringify(payload)}\n`;

if (CHECK) {
  const current = existsSync(OUT) ? readFileSync(OUT, 'utf8') : null;
  if (current !== json) { console.error(`${OUT} is out of date — run \`npm run dots\``); process.exit(1); }
  console.log(`Asia dot grid current — ${dots.length} dots, ${cols}x${rows}`);
} else {
  writeFileSync(OUT, json);
  const ind = dots.filter((d) => d[2] >= -1).length;
  console.log(`Wrote ${OUT}: ${dots.length} dots (${ind} in India, `
    + `${dots.filter((d) => d[2] >= 0).length} in portfolio states), ${cols}x${rows}, `
    + `${Math.round(json.length / 1024)} kB`);
}
