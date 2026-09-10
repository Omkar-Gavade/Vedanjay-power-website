import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/**
 * No class may be defined in BOTH a global stylesheet and a lazily-loaded one.
 *
 * WHY THIS TEST EXISTS
 * `.vp-strengths` was owned by sections.css, where it is the homepage's
 * "Why Vedanjay Power" list — a Bootstrap row with `.col-*` children. A grid
 * with the same name was later added to about.css for the About page.
 *
 * Nothing looked wrong. about.css ships inside the LAZY page chunks, so a
 * visitor landing on the homepage saw the correct layout. But the moment they
 * opened About, Services, Careers or Projects, that stylesheet was injected and
 * stayed for the rest of the session — so navigating back to the homepage
 * turned the section into a 3-column grid with a 1px gap and a rounded border,
 * collapsing each item from 400px to 133px wide.
 *
 * It is invisible on a fresh load, invisible in a unit test, and only appears
 * after a particular navigation order. That is exactly the kind of bug worth
 * spending a test on.
 */

const read = (f) => readFileSync(
  fileURLToPath(new URL(`../src/styles/${f}`, import.meta.url)), 'utf8',
);

/** Loaded on every page, in the initial CSS bundle. */
const GLOBAL = ['base.css', 'sections.css', 'components.css', 'hero.css', 'navbar.css', 'motion.css', 'tokens.css'];
/** Imported by lazy page/panel chunks — injected on first visit and never removed. */
const LAZY = ['about.css', 'contact.css', 'chat.css', 'map.css'];

/**
 * Deliberate extensions: a lazy sheet adding context-specific rules to a
 * global component rather than redefining its layout. Each entry is a
 * decision, so adding one should be conscious.
 */
const ALLOWED = new Set([
  'vp-btn', 'vp-btn--outline',   // contact/chat restyle the shared button in place
  'vp-arrow',                    // motion.css owns the animation; contact.css positions it
  'vp-eyebrow',                  // spacing tweaks per page context
  'vp-gal__item', 'vp-gal__frame', 'vp-gal__zoom', // motion.css only releases these under reduced motion
]);

/** Class names appearing in any selector, comments stripped. */
function classesIn(file) {
  const css = read(file).replace(/\/\*[\s\S]*?\*\//g, '');
  const found = new Set();
  for (const selector of css.match(/[^{}]+(?=\{)/g) ?? []) {
    // ignore at-rule preludes: @media (max-width:575.98px) would yield "98px"
    if (selector.trim().startsWith('@')) continue;
    for (const c of selector.match(/\.[A-Za-z_-][A-Za-z0-9_-]*/g) ?? []) {
      found.add(c.slice(1));
    }
  }
  return found;
}

describe('stylesheet layering', () => {
  it('no class is defined in both a global and a lazily-loaded stylesheet', () => {
    const globalOwner = new Map();
    for (const f of GLOBAL) {
      for (const c of classesIn(f)) if (!globalOwner.has(c)) globalOwner.set(c, f);
    }

    const collisions = [];
    for (const f of LAZY) {
      for (const c of classesIn(f)) {
        if (globalOwner.has(c) && !ALLOWED.has(c)) {
          collisions.push(`.${c} — ${globalOwner.get(c)} and ${f}`);
        }
      }
    }

    expect(collisions, 'a lazy stylesheet redefines a global class; rename it '
      + 'or add it to ALLOWED if the override is deliberate').toEqual([]);
  });

  it('the classes this test was written for stay separated', () => {
    const sections = classesIn('sections.css');
    const base = classesIn('base.css');
    const about = classesIn('about.css');

    // homepage keeps its own
    expect(base.has('vp-stat')).toBe(true);

    // the About-page versions were renamed away from them
    expect(about.has('vp-stat'), '.vp-stat must not be redefined in about.css').toBe(false);
    expect(about.has('vp-figure')).toBe(true);
    /* The overview rebuild of 10 Sep 2026 retired .vp-keystr and .vp-techgrid
       with the sections that used them; its own classes all carry vp-ov-. */
    expect(about.has('vp-ov-value')).toBe(true);

    /* .vp-strengths and .vp-tech were the original offenders and are now
       defined nowhere: the homepage sections that owned them were replaced by
       the portfolio map and the coverflow, and About has always used
       .vp-keystr / .vp-techgrid. Asserted so neither can quietly come back on
       one side only. */
    expect(sections.has('vp-strengths')).toBe(false);
    expect(about.has('vp-strengths')).toBe(false);
    expect(sections.has('vp-tech')).toBe(false);
    expect(about.has('vp-tech')).toBe(false);

    /* .vp-cover is why this run mattered: the coverflow was first written as
       .vp-cover, which about.css already uses for the tinted section band on
       About and Careers. Two unrelated components, one name, and whichever
       stylesheet loaded second would have won. The coverflow has since become
       three .vp-xcard cards; the About name must still not come back here. */
    expect(sections.has('vp-cover')).toBe(false);
    expect(sections.has('vp-flow')).toBe(false);
    expect(sections.has('vp-xcard')).toBe(true);
  });
});
