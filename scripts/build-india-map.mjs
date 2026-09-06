/**
 * INDIA MAP GENERATOR.
 *
 * Produces frontend/public/maps/india-states.json — one SVG path per state or
 * union territory, pre-projected into a fixed viewBox, for the homepage
 * portfolio map.
 *
 * WHY GENERATED, AND WHY NOT SHIPPED AS GeoJSON
 * The source is 4 MB of district geometry. Sending that to a browser to draw a
 * map roughly 700px wide is indefensible, and parsing it on the main thread is
 * worse. Projecting and simplifying here turns it into a small file of path
 * strings the browser can hand straight to the renderer.
 *
 * THE BOUNDARY, which is the whole reason this source was chosen.
 * India's official map is not what most map libraries ship. Natural Earth, GADM
 * and the usual CDN "india.json" files all draw the de-facto line of control,
 * which omits Gilgit-Baltistan, Pakistan-administered Kashmir and Aksai Chin.
 * Publishing that depiction from an Indian company's website is not a neutral
 * act — Indian law requires the official boundary.
 *
 * This source carries it, and the generator ASSERTS it rather than trusting it:
 * the build fails unless Ladakh reaches beyond 37°N and 80°E (Gilgit-Baltistan
 * and Aksai Chin) and Jammu and Kashmir still contains the Muzaffarabad and
 * Mirpur districts. It also fails unless all 36 current states and union
 * territories are present — the previous candidate dataset predated both the
 * 2014 creation of Telangana and the 2019 reorganisation, and would have drawn
 * a map missing one of the three states the company is registered in.
 *
 * DISSOLVE
 * The source is districts, not states. Districts of one state share their
 * internal edges exactly, so each internal edge appears twice in opposite
 * directions and cancels; what survives is the state outline. Fills are built
 * from the raw district rings regardless, so a topology defect can only cost an
 * outline, never a hole in the map.
 *
 *   node scripts/build-india-map.mjs           # regenerate
 *   node scripts/build-india-map.mjs --check   # fail if the output is stale
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const SOURCE_URL = 'https://raw.githubusercontent.com/udit-001/india-maps-data/main/geojson/india.geojson';
/* Surrounding countries, for context only — see the CONTEXT note below. 50 m is
   the right resolution for a background layer; 10 m would be four times the
   bytes for detail nobody can see behind India. */
const CONTEXT_URL = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson';
const CACHE = fileURLToPath(new URL('../.cache/india.geojson', import.meta.url));
const CTX_CACHE = fileURLToPath(new URL('../.cache/ne50.geojson', import.meta.url));
const OUT = fileURLToPath(new URL('../frontend/public/maps/india-states.json', import.meta.url));

/* Rounded to 1e-6 degrees (~11cm) so shared district edges compare equal
   despite float noise; anything coarser starts merging distinct vertices. */
const Q = 1e6;
const key = (p) => `${Math.round(p[0] * Q)},${Math.round(p[1] * Q)}`;

/** Douglas–Peucker on lon/lat. Tolerance is in degrees. */
function simplify(pts, tol) {
  if (pts.length < 3) return pts;
  const sq = tol * tol;
  const d2 = (p, a, b) => {
    let x = a[0], y = a[1], dx = b[0] - x, dy = b[1] - y;
    if (dx || dy) {
      const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);
      if (t > 1) { x = b[0]; y = b[1]; } else if (t > 0) { x += dx * t; y += dy * t; }
    }
    return (p[0] - x) ** 2 + (p[1] - y) ** 2;
  };
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    let max = 0, idx = -1;
    for (let i = a + 1; i < b; i++) {
      const d = d2(pts[i], pts[a], pts[b]);
      if (d > max) { max = d; idx = i; }
    }
    if (max > sq && idx > -1) { keep[idx] = 1; stack.push([a, idx], [idx, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}

/** Every ring of a Polygon / MultiPolygon. */
function ringsOf(geom) {
  const polys = geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates;
  return polys.flat();
}

/**
 * Cancel every edge that two districts of the same state share, then chain what
 * survives back into closed rings — the state's own outline.
 */
function dissolve(rings) {
  const edges = new Map();
  for (const ring of rings) {
    for (let i = 0; i < ring.length - 1; i++) {
      const a = key(ring[i]), b = key(ring[i + 1]);
      if (a === b) continue;
      const fwd = `${a}|${b}`, rev = `${b}|${a}`;
      if (edges.has(rev)) edges.delete(rev);        // internal: cancels
      else edges.set(fwd, [ring[i], ring[i + 1]]);
    }
  }
  const next = new Map();
  for (const [k, seg] of edges) {
    const from = k.split('|')[0];
    if (!next.has(from)) next.set(from, []);
    next.get(from).push(seg);
  }
  const out = [];
  const used = new Set();
  for (const [k, segs] of next) {
    for (const seg of segs) {
      const id = `${key(seg[0])}|${key(seg[1])}`;
      if (used.has(id)) continue;
      const ring = [seg[0]];
      let cur = seg, guard = 0;
      while (guard++ < 200000) {
        used.add(`${key(cur[0])}|${key(cur[1])}`);
        ring.push(cur[1]);
        const cand = (next.get(key(cur[1])) ?? [])
          .find((s) => !used.has(`${key(s[0])}|${key(s[1])}`));
        if (!cand) break;
        cur = cand;
        if (key(cur[1]) === key(ring[0])) { ring.push(cur[1]); used.add(`${key(cur[0])}|${key(cur[1])}`); break; }
      }
      if (ring.length > 3) out.push(ring);
    }
  }
  return out;
}

async function cached(file, url) {
  if (!existsSync(file)) {
    mkdirSync(path.dirname(file), { recursive: true });
    const res = await fetch(url);
    if (!res.ok) throw new Error(`fetch failed (${res.status}): ${url}`);
    writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  }
  return JSON.parse(readFileSync(file, 'utf8'));
}

/** Sutherland–Hodgman against an axis-aligned rectangle, in lon/lat. */
function clipRing(ring, [x0, y0, x1, y1]) {
  const edges = [
    [(p) => p[0] >= x0, (a, b) => [x0, a[1] + ((b[1] - a[1]) * (x0 - a[0])) / (b[0] - a[0])]],
    [(p) => p[0] <= x1, (a, b) => [x1, a[1] + ((b[1] - a[1]) * (x1 - a[0])) / (b[0] - a[0])]],
    [(p) => p[1] >= y0, (a, b) => [a[0] + ((b[0] - a[0]) * (y0 - a[1])) / (b[1] - a[1]), y0]],
    [(p) => p[1] <= y1, (a, b) => [a[0] + ((b[0] - a[0]) * (y1 - a[1])) / (b[1] - a[1]), y1]],
  ];
  let out = ring;
  for (const [keep, cut] of edges) {
    const next = [];
    for (let i = 0; i < out.length; i++) {
      const cur = out[i], prev = out[(i + out.length - 1) % out.length];
      const kc = keep(cur), kp = keep(prev);
      if (kc) {
        if (!kp) next.push(cut(prev, cur));
        next.push(cur);
      } else if (kp) next.push(cut(prev, cur));
    }
    out = next;
    if (!out.length) return [];
  }
  return out;
}

function build(geo, ctxGeo) {
  const byState = new Map();
  const districts = new Map();
  for (const f of geo.features) {
    const st = f.properties.st_nm;
    if (!byState.has(st)) { byState.set(st, []); districts.set(st, []); }
    byState.get(st).push(...ringsOf(f.geometry));
    districts.get(st).push(f.properties.district ?? null);
  }

  /* ---- boundary assertions: the reason this dataset was chosen ---- */
  const bounds = (rings) => rings.flat().reduce(
    (b, p) => [Math.min(b[0], p[0]), Math.min(b[1], p[1]), Math.max(b[2], p[0]), Math.max(b[3], p[1])],
    [Infinity, Infinity, -Infinity, -Infinity],
  );
  const fail = (m) => { throw new Error(`INDIA MAP: ${m}`); };
  if (byState.size !== 36) fail(`expected 36 states/UTs, got ${byState.size}`);
  for (const s of ['Ladakh', 'Jammu and Kashmir', 'Telangana', 'Maharashtra', 'Madhya Pradesh']) {
    if (!byState.has(s)) fail(`missing ${s}`);
  }
  const lad = bounds(byState.get('Ladakh'));
  if (lad[3] < 37) fail(`Ladakh reaches only ${lad[3].toFixed(2)}N — Gilgit-Baltistan is missing`);
  if (lad[2] < 80) fail(`Ladakh reaches only ${lad[2].toFixed(2)}E — Aksai Chin is missing`);
  const jk = districts.get('Jammu and Kashmir');
  for (const d of ['Muzaffarabad', 'Mirpur']) {
    if (!jk.includes(d)) fail(`Jammu and Kashmir is missing the ${d} district`);
  }

  /* ---- project ---- */
  const all = bounds([...byState.values()].flat());
  /* Mercator's y is in radians while longitude here is in degrees; scaling it
     back to degrees keeps both axes in the same unit, without which the map
     comes out 1000x20. */
  const merc = (lat) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI / 180) / 2)) * (180 / Math.PI);

  /* A margin of open frame around the country. Without it India is cropped to
     its own bounding box and floats in a void, which is the single clearest
     tell that a thing is a diagram rather than a map — there is no sea, and no
     land on the other side of any border. 1.6° is enough to seat it without
     shrinking it noticeably. */
  const MARGIN = 1.6;
  const frame = [all[0] - MARGIN, all[1] - MARGIN, all[2] + MARGIN, all[3] + MARGIN];

  const W = 1000;
  const x0 = frame[0], x1 = frame[2];
  const y0 = merc(frame[1]), y1 = merc(frame[3]);
  const sx = W / (x1 - x0);
  const H = Math.round((y1 - y0) * sx);
  const px = (p) => [
    ((p[0] - x0) * sx),
    (H - (merc(p[1]) - y0) * sx),
  ];
  /* ~0.0025° ≈ 275 m. The earlier 0.008 was already sub-pixel at the size the
     map draws, but "sub-pixel on a 700px desktop" is not the same as sub-pixel
     on a 3x phone or when a state is zoomed — and simplification artefacts read
     as cheapness long before they read as error. Two decimal places on a
     1000-unit viewBox is ~1/30 px at display size. */
  const TOL = 0.0025;
  const fmt = (n) => Math.round(n * 100) / 100;
  const toPath = (rings) => rings.map((r) => {
    const s = simplify(r, TOL).map(px);
    if (s.length < 3) return '';
    return `M${s.map(([a, b]) => `${fmt(a)} ${fmt(b)}`).join('L')}Z`;
  }).join('');

  /**
   * Where a label or bubble can sit INSIDE a state.
   *
   * An area centroid is the obvious choice and the wrong one: Gujarat wraps
   * around the Gulf of Khambhat and Maharashtra is deeply concave, so their
   * centroids land in water or in a neighbour. This is a pole of
   * inaccessibility instead — a coarse grid search for the interior point
   * furthest from any edge — which is always inside the shape and visually
   * centred in its bulkiest part.
   */
  function anchor(rings) {
    const pts = rings.map((r) => r.map(px));
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const r of pts) for (const [x, y] of r) {
      x0 = Math.min(x0, x); x1 = Math.max(x1, x);
      y0 = Math.min(y0, y); y1 = Math.max(y1, y);
    }
    const inside = (x, y) => {
      let win = false;
      for (const r of pts) {
        for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
          const [xi, yi] = r[i], [xj, yj] = r[j];
          if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) win = !win;
        }
      }
      return win;
    };
    const edgeDist = (x, y) => {
      let best = Infinity;
      for (const r of pts) {
        for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
          const [xi, yi] = r[i], [xj, yj] = r[j];
          let dx = xj - xi, dy = yj - yi;
          let t = dx || dy ? ((x - xi) * dx + (y - yi) * dy) / (dx * dx + dy * dy) : 0;
          t = Math.max(0, Math.min(1, t));
          const px2 = xi + t * dx - x, py2 = yi + t * dy - y;
          best = Math.min(best, px2 * px2 + py2 * py2);
        }
      }
      return Math.sqrt(best);
    };
    const N = 48;
    let best = null, bestD = -1;
    for (let i = 1; i < N; i++) {
      for (let j = 1; j < N; j++) {
        const x = x0 + ((x1 - x0) * i) / N;
        const y = y0 + ((y1 - y0) * j) / N;
        if (!inside(x, y)) continue;
        const d = edgeDist(x, y);
        if (d > bestD) { bestD = d; best = [x, y]; }
      }
    }
    return (best ?? [(x0 + x1) / 2, (y0 + y1) / 2]).map((n) => Math.round(n * 10) / 10);
  }

  const states = [...byState.keys()].sort().map((name) => {
    const raw = byState.get(name);
    const outline = dissolve(raw);
    return {
      name,
      /* Label/bubble anchor, guaranteed inside the shape. */
      at: anchor(raw),
      /* Fill comes from the raw district rings — always correct, even if the
         dissolve hits a topology defect.
         MUST be drawn with the default fill-rule (nonzero). Under evenodd,
         neighbouring districts whose rings happen to wind in opposite
         directions cancel each other and the state renders as a few slivers;
         nonzero unions them, and still subtracts a genuine hole because a hole
         ring is wound against its own exterior. */
      fill: toPath(raw),
      /* Outline is the dissolved boundary: a stroke on `fill` would draw every
         internal district border. */
      outline: toPath(outline.length ? outline : raw),
    };
  });

  /* The national boundary, dissolved across every state the same way each
     state was dissolved across its districts. Drawn heavier than the internal
     borders — the convention on any real map, and the single cheapest thing
     that stops a choropleth looking like a diagram. */
  const national = toPath(dissolve([...byState.values()].flat()));

  /**
   * CONTEXT — the surrounding countries, drawn UNDERNEATH India.
   *
   * This layer is Natural Earth, which draws the de-facto line of control, so
   * its Pakistan and China polygons cover territory India's official map
   * assigns to Ladakh and Jammu and Kashmir. That overlap is deliberate and
   * harmless BECAUSE OF THE DRAW ORDER: India is painted opaquely on top, so
   * every disputed square kilometre renders as Indian. Nothing from this layer
   * is ever visible inside India's official boundary, and India itself is
   * excluded from it entirely.
   *
   * Rings are clipped to the frame first — otherwise the whole of China and
   * Russia ship to a browser to draw a strip along one border.
   */
  const CTX_TOL = 0.02;
  const context = [];
  for (const f of ctxGeo.features) {
    const name = f.properties.ADMIN ?? f.properties.NAME;
    /* India is excluded because this layer draws the line of control. The
       Siachen Glacier ships as its own Natural Earth feature and lies inside
       Ladakh on India's official map, so it is dropped too rather than left to
       surface as a separate labelled patch. */
    if (!name || name === 'India' || name === 'Siachen Glacier') continue;
    const clipped = ringsOf(f.geometry)
      .map((r) => clipRing(r, frame))
      .filter((r) => r.length > 2);
    if (!clipped.length) continue;
    const d = clipped.map((r) => {
      const q = simplify(r, CTX_TOL).map(px);
      if (q.length < 3) return '';
      return `M${q.map(([a, b]) => `${fmt(a)} ${fmt(b)}`).join('L')}Z`;
    }).join('');
    if (d) context.push({ name, path: d, at: anchor(clipped) });
  }

  return {
    viewBox: `0 0 ${W} ${H}`,
    width: W,
    height: H,
    /* Geographic frame, so a test can convert a projected y back to a latitude
       and assert the boundary claim directly instead of guessing at pixels. */
    bounds: { lon0: frame[0], lat0: frame[1], lon1: frame[2], lat1: frame[3] },
    national,
    context,
    states,
  };
}

const geo = await cached(CACHE, SOURCE_URL);
const ctx = await cached(CTX_CACHE, CONTEXT_URL);
const built = build(geo, ctx);
const json = JSON.stringify(built);

const check = process.argv.includes('--check');
const current = existsSync(OUT) ? readFileSync(OUT, 'utf8') : null;
if (check) {
  if (current !== json) {
    console.error('✗ india-states.json is stale — run `npm run map`');
    process.exit(1);
  }
  console.log(`✓ india-states.json up to date (${built.states.length} states, ${(json.length / 1024).toFixed(0)} KB)`);
} else {
  mkdirSync(path.dirname(OUT), { recursive: true });
  writeFileSync(OUT, json);
  console.log(`✓ ${built.states.length} states/UTs → ${OUT} (${(json.length / 1024).toFixed(0)} KB, viewBox ${built.viewBox})`);
}
