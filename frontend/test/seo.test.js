import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  routeSeo, seoByPath, indexableRoutes, ORIGIN, absolute, trailFor, OG_SIZE,
} from '../src/data/seo.js';
import {
  organizationSchema, websiteSchema, breadcrumbSchema, graphFor, ORG_ID,
} from '../src/data/schema.js';
import { ROUTES, BUILT_ROUTES } from '../src/constants/routes.js';
import { company } from '../src/data/company.js';
import { capabilities } from '../src/data/capabilities.js';

/**
 * SEO regressions are invisible: nothing breaks, no test fails, and six months
 * later two pages have the same title and neither ranks. These are the checks
 * that only a machine will ever actually run.
 */

const root = (p) => fileURLToPath(new URL(`../public/${p}`, import.meta.url));
const robots = readFileSync(root('robots.txt'), 'utf8');
const sitemap = readFileSync(root('sitemap.xml'), 'utf8');

describe('page metadata', () => {
  it('every built route has metadata', () => {
    const missing = BUILT_ROUTES.filter((p) => !seoByPath.has(p));
    expect(missing, 'a built page with no title or description is invisible').toEqual([]);
  });

  it('no route declares metadata for a page that does not exist', () => {
    const orphans = routeSeo.filter((r) => !BUILT_ROUTES.includes(r.path)).map((r) => r.path);
    expect(orphans).toEqual([]);
  });

  it('every title is unique', () => {
    const seen = new Map();
    const dupes = [];
    for (const r of routeSeo) {
      if (seen.has(r.title)) dupes.push(`${r.path} and ${seen.get(r.title)}: "${r.title}"`);
      seen.set(r.title, r.path);
    }
    expect(dupes).toEqual([]);
  });

  it('every description is unique', () => {
    const seen = new Map();
    const dupes = [];
    for (const r of routeSeo) {
      if (seen.has(r.description)) dupes.push(`${r.path} and ${seen.get(r.description)}`);
      seen.set(r.description, r.path);
    }
    expect(dupes).toEqual([]);
  });

  it('titles fit in a search result', () => {
    const long = routeSeo.filter((r) => r.title.length > 62)
      .map((r) => `${r.path} (${r.title.length})`);
    expect(long, 'titles over ~62 characters are truncated with an ellipsis').toEqual([]);
  });

  it('descriptions are a usable length', () => {
    const bad = routeSeo.filter((r) => r.description.length < 120 || r.description.length > 170)
      .map((r) => `${r.path} (${r.description.length})`);
    expect(bad).toEqual([]);
  });

  it('no title or description is empty or whitespace', () => {
    for (const r of routeSeo) {
      expect(r.title.trim().length).toBeGreaterThan(0);
      expect(r.description.trim().length).toBeGreaterThan(0);
    }
  });

  it('descriptions are not keyword lists', () => {
    /* A description that repeats one term is stuffing. Nothing should say the
       same significant word more than twice.
       PROPER NOUNS ARE EXEMPT: the three people leading the company share the
       surname Yadav, so the team description says it three times. That is a
       fact about the company, not a keyword — counting it as stuffing is the
       check being naive, not the copy being bad. Only words that appear in
       lowercase somewhere in the sentence are counted. */
    for (const r of routeSeo) {
      const words = r.description.replace(/[^A-Za-z\s]/g, ' ').split(/\s+/)
        .filter((w) => w.length > 4);
      const counts = new Map();
      for (const w of words) {
        if (w[0] === w[0].toUpperCase()) continue;    // proper noun or sentence start
        const k = w.toLowerCase();
        counts.set(k, (counts.get(k) ?? 0) + 1);
      }
      const over = [...counts].filter(([, n]) => n > 2);
      expect(over, `${r.path} repeats ${JSON.stringify(over)}`).toEqual([]);
    }
  });
});

describe('canonical URLs', () => {
  it('the origin is the production domain, with no trailing slash', () => {
    expect(ORIGIN).toBe('https://vedanjay-power.com');
  });

  it('every canonical is absolute, https, and on the production domain', () => {
    for (const r of routeSeo) {
      const url = absolute(r.path);
      expect(url.startsWith('https://vedanjay-power.com/'), url).toBe(true);
      expect(url).not.toContain('//about');   // no doubled slashes
      expect(url).not.toContain('localhost');
    }
  });

  it('every canonical keeps the trailing slash the router uses', () => {
    /* The routes are declared with trailing slashes. A canonical without one
       points at a URL the SPA does not serve, and splits the page in two. */
    for (const r of routeSeo) {
      expect(absolute(r.path).endsWith('/'), r.path).toBe(true);
    }
  });

  it('canonicals are unique — no two routes claim the same URL', () => {
    const urls = routeSeo.map((r) => absolute(r.path));
    expect(new Set(urls).size).toBe(urls.length);
  });
});

describe('robots.txt', () => {
  it('allows crawling', () => {
    expect(robots).toMatch(/^User-agent: \*/m);
    expect(robots).toMatch(/^Allow: \/$/m);
  });

  it('points at the sitemap on the production domain', () => {
    expect(robots).toContain(`Sitemap: ${ORIGIN}/sitemap.xml`);
  });

  it('never blocks CSS, JS or images', () => {
    /* Blocking these is how a rendered site gets indexed as an empty shell. */
    const disallows = [...robots.matchAll(/^Disallow:\s*(\S+)/gm)].map((m) => m[1]);
    for (const path of ['/assets/', '/images/', '/brand/', '/gallery/', '/og/']) {
      expect(disallows.some((d) => path.startsWith(d)), `${path} must stay crawlable`).toBe(false);
    }
  });

  it('does not block any indexable route', () => {
    const disallows = [...robots.matchAll(/^Disallow:\s*(\S+)/gm)].map((m) => m[1]);
    for (const route of indexableRoutes) {
      expect(disallows.some((d) => d !== '/' && route.startsWith(d)), route).toBe(false);
    }
  });
});

describe('sitemap.xml', () => {
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

  it('is well-formed and declares the sitemap namespace', () => {
    expect(sitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(sitemap).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
    expect(sitemap.trimEnd().endsWith('</urlset>')).toBe(true);
  });

  it('lists every indexable route exactly once', () => {
    expect(locs.sort()).toEqual(indexableRoutes.map(absolute).sort());
  });

  it('contains no duplicates', () => {
    expect(new Set(locs).size).toBe(locs.length);
  });

  it('contains no unbuilt, internal or query-string URLs', () => {
    for (const loc of locs) {
      expect(loc).not.toContain('?');
      expect(loc).not.toContain('#');
      expect(loc).not.toContain('localhost');
      expect(loc.startsWith('https://vedanjay-power.com/')).toBe(true);
    }
    /* Declared in ROUTES but never built — must not leak in. */
    expect(locs).not.toContain(absolute(ROUTES.privacy));
    expect(locs).not.toContain(absolute(ROUTES.terms));
  });

  it('every sitemap URL matches a canonical the site actually emits', () => {
    for (const loc of locs) {
      const path = loc.replace(ORIGIN, '');
      expect(seoByPath.has(path), `${loc} has no page metadata`).toBe(true);
    }
  });
});

describe('social cards', () => {
  it('every route has a card file on disk', () => {
    for (const r of routeSeo) {
      expect(r.og, `${r.path} declares no og image`).toBeTruthy();
      expect(existsSync(root(r.og.replace(/^\//, ''))), `${r.og} missing`).toBe(true);
    }
  });

  it('the default card exists', () => {
    expect(existsSync(root('og/vedanjay-power.jpg'))).toBe(true);
  });

  it('the declared card size is the 1.91:1 ratio scrapers expect', () => {
    expect(OG_SIZE.width).toBe(1200);
    expect(OG_SIZE.height).toBe(630);
  });
});

describe('structured data', () => {
  it('there is exactly one organisation node, on the home page', () => {
    const withOrg = routeSeo.filter((r) => {
      const g = graphFor({ path: r.path, title: r.title, description: r.description });
      return g['@graph'].some((n) => n['@id'] === ORG_ID && n.name);
    });
    expect(withOrg.map((r) => r.path)).toEqual([ROUTES.home]);
  });

  it('every page emits valid, serialisable JSON-LD', () => {
    for (const r of routeSeo) {
      const g = graphFor({ path: r.path, title: r.title, description: r.description });
      expect(() => JSON.parse(JSON.stringify(g))).not.toThrow();
      expect(g['@context']).toBe('https://schema.org');
      expect(Array.isArray(g['@graph'])).toBe(true);
      for (const node of g['@graph']) expect(node['@type']).toBeTruthy();
    }
  });

  it('the organisation is described from the published company record', () => {
    expect(organizationSchema.name).toBe(company.legalName);
    expect(organizationSchema.telephone).toBe(`+91${company.phone.display}`);
    expect(organizationSchema.email).toBe(company.emails.general);
    expect(organizationSchema.foundingDate).toBe(String(company.established));
    expect(organizationSchema.address).toHaveLength(company.offices.length);
  });

  it('every postal field appears verbatim in the address the page prints', () => {
    /* Structured data built by slicing the address lines got the postcode and
       the state wrong on two pages in two different ways. */
    company.offices.forEach((o, i) => {
      const printed = o.lines.join(' ');
      const addr = organizationSchema.address[i];
      expect(printed).toContain(addr.postalCode);
      expect(printed).toContain(addr.addressRegion);
      expect(addr.addressLocality).toBe(o.city);
      for (const part of addr.streetAddress.split(', ')) expect(printed).toContain(part);
    });
  });

  it('carries no rating, review, price or headcount', () => {
    /* None of these is published anywhere in the source documents, and a rich
       result built on an invented field earns a manual action. */
    const json = JSON.stringify(graphFor({
      path: ROUTES.home, title: 'x', description: 'y',
    }));
    for (const banned of ['aggregateRating', 'review', 'ratingValue', 'price',
      'numberOfEmployees', 'openingHours']) {
      expect(json, `${banned} is not published and must not be claimed`).not.toContain(banned);
    }
  });

  it('the service catalogue matches the services the site renders', () => {
    const names = organizationSchema.hasOfferCatalog.itemListElement
      .map((o) => o.itemOffered.name);
    expect(names).toEqual(capabilities.map((c) => c.name));
  });

  it('the website node points at the organisation rather than repeating it', () => {
    expect(websiteSchema.publisher).toEqual({ '@id': ORG_ID });
    expect(websiteSchema.name).toBeTruthy();
  });

  it('declares no SearchAction, because there is no search page', () => {
    expect(websiteSchema.potentialAction).toBeUndefined();
  });

  it('nested pages carry a breadcrumb trail; the home page does not', () => {
    expect(breadcrumbSchema(ROUTES.home)).toBeNull();
    const team = breadcrumbSchema(ROUTES.team);
    expect(team.itemListElement.map((i) => i.name)).toEqual(['Home', 'About', 'Team']);
    expect(team.itemListElement.map((i) => i.position)).toEqual([1, 2, 3]);
    expect(team.itemListElement.at(-1).item).toBe(absolute(ROUTES.team));
  });

  it('every breadcrumb item points at an indexable URL', () => {
    for (const r of routeSeo) {
      for (const node of trailFor(r.path)) {
        expect(indexableRoutes).toContain(node.path);
      }
    }
  });
});
