import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/**
 * The shipped map geometry, guarded.
 *
 * The generator asserts the boundary against the SOURCE, but the source is
 * fetched and cached outside the repo — so nothing would catch the shipped file
 * being replaced, hand-edited, or regenerated from a different dataset. These
 * assertions run against the artefact the browser actually downloads.
 *
 * The boundary matters more than the rest. Every convenient india.json on a CDN
 * draws the line of control rather than India's official map, and swapping this
 * file for one of those is a change no visual review would reliably catch.
 */

const map = JSON.parse(readFileSync(
  fileURLToPath(new URL('../public/maps/india-states.json', import.meta.url)), 'utf8',
));

/** Bounding box of an SVG path built only from M/L/Z, as the generator emits. */
function bbox(d) {
  const nums = d.match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? [];
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (let i = 0; i + 1 < nums.length; i += 2) {
    x0 = Math.min(x0, nums[i]); x1 = Math.max(x1, nums[i]);
    y0 = Math.min(y0, nums[i + 1]); y1 = Math.max(y1, nums[i + 1]);
  }
  return { x0, y0, x1, y1 };
}

const byName = new Map(map.states.map((s) => [s.name, s]));

/* Invert the Mercator projection recorded in `bounds`, so geography can be
   asserted as geography. */
const mercDeg = (lat) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI / 180) / 2)) * (180 / Math.PI);
const sx = map.width / (map.bounds.lon1 - map.bounds.lon0);
const toLon = (x) => map.bounds.lon0 + x / sx;
const toLat = (y) => {
  const m = mercDeg(map.bounds.lat0) + (map.height - y) / sx;
  return (2 * (Math.atan(Math.exp((m * Math.PI) / 180)) - Math.PI / 4) * 180) / Math.PI;
};

describe('india map geometry', () => {
  it('carries all 36 current states and union territories', () => {
    expect(map.states).toHaveLength(36);
  });

  it('includes the states created since the older datasets were cut', () => {
    // Telangana (2014) and Ladakh (2019) are both absent from the GADM extract
    // this file replaced — and Telangana is a registered operating state.
    expect(byName.has('Telangana')).toBe(true);
    expect(byName.has('Ladakh')).toBe(true);
    // and the current spellings, not "Orissa" / "Uttaranchal"
    expect(byName.has('Odisha')).toBe(true);
    expect(byName.has('Uttarakhand')).toBe(true);
  });

  it('draws India’s official northern boundary', () => {
    /* Asserted in DEGREES, not pixels. The frame now carries a margin of open
       sea and neighbouring land around the country, so "Ladakh reaches the top
       of the viewBox" stopped being the same claim as "Ladakh reaches 37°N".
       Projected coordinates are converted back through the recorded bounds and
       checked against the latitude and longitude that actually matter:
       Gilgit-Baltistan to the north, Aksai Chin to the east. */
    const ladakh = bbox(byName.get('Ladakh').fill);
    expect(toLat(ladakh.y0)).toBeGreaterThan(37);
    expect(toLon(ladakh.x1)).toBeGreaterThan(80);
  });

  it('keeps the Pakistan-administered districts inside Jammu and Kashmir', () => {
    /* Muzaffarabad and Mirpur push J&K west of 74°E; without them the state's
       western edge retreats towards the Jhelum. */
    const jk = bbox(byName.get('Jammu and Kashmir').fill);
    expect(toLon(jk.x0)).toBeLessThan(73.6);
  });

  it('seats the country in surrounding land and sea', () => {
    /* The context layer is what stops the map reading as a diagram. It is
       Natural Earth, which draws the line of control — so it must never
       include India itself, and it is painted under India's opaque fill. */
    expect(map.context.length).toBeGreaterThan(8);
    const names = map.context.map((c) => c.name);
    expect(names).not.toContain('India');
    expect(names).not.toContain('Siachen Glacier');
    for (const n of ['Pakistan', 'China', 'Nepal', 'Bangladesh', 'Sri Lanka', 'Myanmar']) {
      expect(names).toContain(n);
    }
    /* Every context country must have been clipped to the frame. */
    for (const c of map.context) {
      const b = bbox(c.path);
      expect(b.x0).toBeGreaterThan(-2);
      expect(b.x1).toBeLessThan(map.width + 2);
    }
  });

  it('gives every state a fill and a separate dissolved outline', () => {
    const broken = map.states.filter((s) => !s.fill?.startsWith('M') || !s.outline?.startsWith('M'));
    expect(broken.map((s) => s.name)).toEqual([]);
  });

  it('has an outline that is far simpler than the district fill', () => {
    /* The outline is the dissolve's product. If the dissolve silently failed it
       would fall back to the raw district rings and the two would be identical,
       which would draw every internal district border on the map. */
    const mh = byName.get('Maharashtra');
    expect(mh.outline.length).toBeLessThan(mh.fill.length / 2);
  });

  it('declares a viewBox matching India’s aspect', () => {
    expect(map.viewBox).toBe(`0 0 ${map.width} ${map.height}`);
    const ratio = map.height / map.width;
    expect(ratio).toBeGreaterThan(1.05);
    expect(ratio).toBeLessThan(1.2);
  });
});
