import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { portfolioByState } from '../src/data/portfolio.js';

/**
 * The shipped dot grid, guarded.
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
  fileURLToPath(new URL('../public/maps/asia-dots.json', import.meta.url)), 'utf8',
));

/** Dots as triples, and the projection inverted so geography is asserted as
 *  geography rather than as grid cells. */
const dots = [];
for (let i = 0; i < map.dots.length; i += 3) {
  dots.push({ cx: map.dots[i], cy: map.dots[i + 1], s: map.dots[i + 2] });
}
const mercDeg = (lat) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI / 180) / 2)) * (180 / Math.PI);
const sx = map.width / (map.bounds.lon1 - map.bounds.lon0);
const toLon = (x) => map.bounds.lon0 + x / sx;
const toLat = (y) => {
  const m = mercDeg(map.bounds.lat0) + (map.height - y) / sx;
  return (2 * (Math.atan(Math.exp((m * Math.PI) / 180)) - Math.PI / 4) * 180) / Math.PI;
};
/** Centre of a cell, in projected units. */
const px = (c) => c * map.cell + map.cell / 2;

/** Every dot that is India — whether or not it carries capacity. */
const indiaDots = dots.filter((d) => d.s >= -1);

describe('portfolio atlas geometry', () => {
  it('is a dot grid, not an empty file', () => {
    expect(dots.length).toBeGreaterThan(3000);
    expect(indiaDots.length).toBeGreaterThan(800);
  });

  it('draws India’s official northern boundary', () => {
    /* Asserted in DEGREES, not cells. Ladakh including Gilgit-Baltistan reaches
       past 37°N; a line-of-control dataset stops around 35.7°N. The grid is
       coarse — a row is roughly 0.4° here — so the northernmost dot CENTRE sits
       a little below the true edge, and 36.3 separates the two datasets
       decisively without being brittle about the sampling. */
    const north = Math.min(...indiaDots.map((d) => d.cy));
    expect(toLat(px(north))).toBeGreaterThan(36.3);
  });

  it('reaches Arunachal Pradesh in the east', () => {
    /* ~97°E. Datasets that truncate the north-east lose this outright. */
    const east = Math.max(...indiaDots.map((d) => d.cx));
    expect(toLon(px(east))).toBeGreaterThan(95.5);
  });

  it('reaches Kutch in the west and the Indian Ocean in the south', () => {
    const west = Math.min(...indiaDots.map((d) => d.cx));
    const south = Math.max(...indiaDots.map((d) => d.cy));
    expect(toLon(px(west))).toBeLessThan(70.5);
    expect(toLat(px(south))).toBeLessThan(10.5);
  });

  it('seats India in surrounding land rather than a void', () => {
    /* s === -2 is land outside India. Without it the country floats, which is
       the clearest tell that a thing is a diagram rather than a map. */
    const world = dots.filter((d) => d.s === -2);
    expect(world.length).toBeGreaterThan(indiaDots.length);
  });

  it('centres India in the frame', () => {
    const cx = indiaDots.reduce((a, d) => a + d.cx, 0) / indiaDots.length;
    const off = Math.abs(px(cx) - map.width / 2) / map.width;
    expect(off, 'India should sit near the middle of the window').toBeLessThan(0.12);
  });

  it('gives every portfolio state its own dots and a turbine anchor', () => {
    expect(map.states).toEqual(portfolioByState.map((s) => s.state));
    expect(map.anchors).toHaveLength(map.states.length);
    const empty = map.states.filter((_, i) => !dots.some((d) => d.s === i));
    expect(empty, 'a state with no dots is invisible on the map').toEqual([]);
  });

  it('puts each anchor inside its own state', () => {
    /* A turbine planted in the sea, or over a neighbour, is the failure this
       catches — the anchors are centroids, and a centroid can fall outside a
       concave shape. */
    map.anchors.forEach(([ax, ay], i) => {
      const near = dots.filter((d) => d.s === i)
        .some((d) => Math.abs(px(d.cx) - ax) <= map.cell && Math.abs(px(d.cy) - ay) <= map.cell);
      expect(near, `${map.states[i]}'s anchor is not on its own dots`).toBe(true);
    });
  });

  it('records the window it was projected with', () => {
    const b = map.bounds;
    expect(b.lon1).toBeGreaterThan(b.lon0);
    expect(b.lat1).toBeGreaterThan(b.lat0);
    expect(map.width / map.height).toBeGreaterThan(0.9);
    expect(map.width / map.height).toBeLessThan(1.5);
  });
});
