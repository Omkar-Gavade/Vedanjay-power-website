import { company } from './company.js';
import { capabilities } from './capabilities.js';
import { industries } from './industries.js';
import { PORTFOLIO_TOTAL_MW, PORTFOLIO_COUNT, portfolioByState } from './portfolio.js';
import { awards, awardYears } from './awards.js';
import { leadership } from './team.js';
import { allResources } from './downloads.js';
import { partners } from './partners.js';
import { shots } from './gallery.js';
import { ROUTES, BUILT_ROUTES } from '../constants/routes.js';

/**
 * SEO METADATA — one entry per indexable route, and the only place any of it
 * is written.
 *
 * WHY THIS FILE EXISTS
 * Every page carried its own <title>, description and canonical, each building
 * the canonical with its own copy of `company.website.replace(/\/$/, '')`.
 * Eleven copies of one expression is eleven chances to get a URL wrong, and
 * nothing could check that two pages had not drifted into the same title —
 * which is the single most common technical SEO fault there is. Now the routes
 * are a table: duplicates are a test failure, not a discovery six months later
 * in Search Console.
 *
 * FIGURES ARE INTERPOLATED, NEVER TYPED. Where a description states a number
 * (5,509 MW, 52 works, 20 documents, 8 awards) it comes from the module that
 * owns and asserts it, exactly as the assistant's answers do. A description
 * cannot claim something the site does not.
 *
 * ON KEYWORDS. The terms these descriptions carry — QCA, forecasting and
 * scheduling, open access, ABT metering, grid studies, Maharashtra, Madhya
 * Pradesh, Telangana — are the words the company uses for the things it
 * actually does, and each appears once, in a sentence a person would read out
 * loud. There is no keyword list, no repetition for weight, and no term here
 * that the page below it does not substantiate.
 *
 * LENGTHS are enforced by frontend/test/seo.test.js: titles ≤ 62 characters so
 * they are not truncated in results, descriptions 120–170.
 */

/** Production origin, without a trailing slash. The one place it is derived. */
export const ORIGIN = company.website.replace(/\/+$/, '');

/** Absolute URL for a route path. Routes already carry their trailing slash. */
export const absolute = (path) => `${ORIGIN}${path === '/' ? '/' : path}`;

const mw = (n) => n.toLocaleString('en-IN', { maximumFractionDigits: 0 });

/**
 * Social preview images, 1200×630, generated from the photography already on
 * each page by scripts/build-seo.mjs. A page without its own falls back to the
 * site card rather than to nothing.
 */
const OG_DIR = '/og';
export const OG_DEFAULT = `${OG_DIR}/vedanjay-power.jpg`;
export const OG_SIZE = { width: 1200, height: 630 };

/**
 * @typedef {{path:string, title:string, description:string, og?:string,
 *            breadcrumb:string, parent?:string}} RouteSeo
 */

/** @type {RouteSeo[]} */
export const routeSeo = [
  {
    path: ROUTES.home,
    breadcrumb: 'Home',
    title: 'Vedanjay Power — Renewable Energy Forecasting & QCA',
    description: `Power-sector solutions across renewable forecasting and scheduling (QCA), `
      + `open-access power, ABT metering, transmission and grid studies. `
      + `Established ${company.established}.`,
    og: `${OG_DIR}/home.jpg`,
  },
  {
    path: ROUTES.about,
    breadcrumb: 'About',
    title: 'About Vedanjay Power — Power-Sector Solutions Since 2011',
    description: `Established ${company.established}, Vedanjay Power is a diversified `
      + `power-sector solutions company supporting India's renewable-energy sector. `
      + `Our vision, mission, values and journey.`,
    og: `${OG_DIR}/about.jpg`,
  },
  {
    path: ROUTES.team,
    parent: ROUTES.about,
    breadcrumb: 'Team',
    title: 'Leadership Team — Vedanjay Power',
    description: `The people leading Vedanjay Power's forecasting, open-access and `
      + `electrical infrastructure work — `
      + `${leadership.map((l) => `${l.name}, ${l.role}`).join('; ')}.`,
    og: `${OG_DIR}/team.jpg`,
  },
  {
    path: ROUTES.awards,
    parent: ROUTES.about,
    breadcrumb: 'Awards',
    title: 'Awards & Recognition — Vedanjay Power',
    description: `${awards.length} industry recognitions between ${awardYears.at(-1)} and `
      + `${awardYears[0]} for solar and renewable-energy consulting, each published with `
      + `its certificate.`,
    og: `${OG_DIR}/awards.jpg`,
  },
  {
    path: ROUTES.downloads,
    parent: ROUTES.about,
    breadcrumb: 'Downloads',
    title: 'Regulatory Downloads — Forecasting, Scheduling & Open Access',
    description: `${allResources.length} regulatory documents covering forecasting and `
      + `scheduling, open access, and rooftop solar net metering — readable in the browser `
      + `without downloading.`,
    og: `${OG_DIR}/downloads.jpg`,
  },
  {
    path: ROUTES.partners,
    parent: ROUTES.about,
    breadcrumb: 'Partners',
    title: 'Partners — Vedanjay Power',
    description: `${partners.length} organisations named on Vedanjay Power's partner `
      + `listing, including a technology partnership with ENERCAST GmbH, Germany for `
      + `AI/ML-enabled forecasting.`,
    og: `${OG_DIR}/partners.jpg`,
  },
  {
    path: ROUTES.services,
    breadcrumb: 'Services',
    title: 'Services — QCA, Open Access, ABT Metering & Grid Studies',
    description: `${capabilities.length} service lines: forecasting and scheduling (QCA), `
      + `open-access power sale and purchase, ABT metering and telemetry, electrical `
      + `infrastructure and grid studies.`,
    og: `${OG_DIR}/services.jpg`,
  },
  {
    path: ROUTES.industries,
    breadcrumb: 'Industries',
    title: 'Industries Served — Vedanjay Power',
    description: `We work with ${industries.length} kinds of organisation across India's `
      + `power sector — ${industries.slice(0, 3).map((i) => i.name.toLowerCase()).join(', ')} `
      + `and more.`,
    og: `${OG_DIR}/industries.jpg`,
  },
  {
    path: ROUTES.projects,
    breadcrumb: 'Projects',
    title: 'Our Projects — Renewable-Energy Portfolio',
    description: `Vedanjay Power's renewable-energy project portfolio — ${mw(PORTFOLIO_TOTAL_MW)} MW `
      + `across ${PORTFOLIO_COUNT} solar and wind projects in ${portfolioByState.length} Indian states.`,
    og: `${OG_DIR}/projects.jpg`,
  },
  {
    path: ROUTES.gallery,
    parent: ROUTES.projects,
    breadcrumb: 'Gallery',
    title: 'Site Photography — Vedanjay Power Projects',
    description: `${shots.length} photographs from Vedanjay Power's own sites — switchyard `
      + `structures, work at height, foundations, module mounting, metering and earthing.`,
    og: `${OG_DIR}/gallery.jpg`,
  },
  {
    path: ROUTES.careers,
    breadcrumb: 'Careers',
    title: 'Careers — Vedanjay Power',
    description: `Work in renewable-energy forecasting and scheduling, open access, metering `
      + `and telemetry, or electrical infrastructure. Applications are read as they arrive.`,
    og: `${OG_DIR}/careers.jpg`,
  },
  {
    path: ROUTES.contact,
    breadcrumb: 'Contact',
    title: 'Contact Vedanjay Power — Indore & Pune Offices',
    description: `Corporate office in ${company.offices[0].city}, branch office in `
      + `${company.offices[1].city}. Call ${company.phone.display} or email `
      + `${company.emails.general} for forecasting, QCA and open-access enquiries.`,
    og: `${OG_DIR}/contact.jpg`,
  },
];

/**
 * The hero photograph each route renders, by media slug — read off the pages
 * themselves, not chosen here.
 *
 * Two things need it and must not disagree: the social card for the route
 * (scripts/build-seo.mjs crops this image to 1200x630) and the LCP preload
 * (scripts/prerender.mjs). In a client-rendered SPA the hero cannot be
 * discovered until the bundle has parsed and React has mounted, so the largest
 * element on every page starts downloading late. Preloading it from the static
 * head removes that wait entirely.
 */
export const ROUTE_HERO = {
  [ROUTES.home]: 'hero-primary',
  [ROUTES.about]: 'footprint',
  [ROUTES.team]: 'grid-transmission',
  [ROUTES.awards]: 'tech-solar',
  [ROUTES.downloads]: 'cta-close',
  [ROUTES.partners]: 'cap-openaccess',
  [ROUTES.services]: 'cap-infrastructure',
  [ROUTES.industries]: 'cap-openaccess',
  [ROUTES.projects]: 'cap-gridstudies',
  [ROUTES.gallery]: 'cap-projects',
  [ROUTES.careers]: 'cap-infrastructure',
  [ROUTES.contact]: 'contact-hero',
};

export const seoByPath = new Map(routeSeo.map((r) => [r.path, r]));

/** Look up a route's metadata. Returns null for anything not indexable. */
export const seoFor = (path) => seoByPath.get(path) ?? null;

/**
 * Breadcrumb trail for a route, walking `parent` up to the home page. Used for
 * BreadcrumbList — Google renders it in place of the raw URL in results, which
 * is why the nested pages declare a parent at all.
 */
export function trailFor(path) {
  const trail = [];
  let node = seoByPath.get(path);
  while (node) {
    trail.unshift(node);
    node = node.parent ? seoByPath.get(node.parent) : null;
  }
  const home = seoByPath.get(ROUTES.home);
  if (trail[0] !== home && home) trail.unshift(home);
  return trail;
}

/**
 * Routes that belong in the sitemap: everything built AND described here.
 * `/privacy/` and `/terms/` are declared in ROUTES but have no page, so they
 * are absent from BUILT_ROUTES and cannot reach this list.
 */
export const indexableRoutes = BUILT_ROUTES.filter((p) => seoByPath.has(p));
