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
import { joinList } from '../utils/list.js';

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

/**
 * The company's registered name. Every route title below STARTS with it — the
 * owner's rule since 12 Sep 2026 that the name shows in every browser tab —
 * and, since 16 Sep 2026, continues with that page's search keywords. On its
 * own it is the title of the not-found page and the pre-render shell.
 */
export const SITE_TITLE = company.legalName;

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
 * @typedef {{path:string, title:string, description:string, keywords:string[],
 *            og?:string, breadcrumb:string, parent?:string}} RouteSeo
 */

/**
 * KEYWORD TITLES, 16 Sep 2026. Every title leads with the registered company
 * name — the owner wanted the name in every browser tab — and then carries the
 * words people search for on that page. The title is the strongest on-page
 * ranking signal there is, so a tab that said only the company name told
 * Google nothing about forecasting, QCA or open access.
 */
const brand = (words) => `${company.legalName} | ${words}`;

/**
 * KEYWORDS, one set per page. The FIRST is the page's primary term, and no two
 * pages share one: two pages chasing the same search split its ranking between
 * them. Every term is something the page substantiates, taken from the
 * company's own service descriptions (IRD §9–§10) and the regulations it works
 * under — nothing here promises work the company does not do. They feed the
 * WebPage structured data; there is deliberately no <meta name="keywords">,
 * which Google ignores and some engines treat as a spam signal.
 */

/** @type {RouteSeo[]} */
export const routeSeo = [
  {
    path: ROUTES.home,
    breadcrumb: 'Home',
    title: brand('QCA (Forecasting and Scheduling)'),
    description: `QCA Services (Forecasting and Scheduling) for solar, wind and hybrid plants in `
      + `Maharashtra, Madhya Pradesh and Telangana, plus open access, ABT metering and grid studies.`,
    keywords: ['QCA Services (Forecasting and Scheduling)', 'QCA services', 'Qualified Coordinating Agency',
      'renewable energy QCA Services (Forecasting and Scheduling)', 'solar and wind forecasting', 'DSM management',
      'open access power'],
    og: `${OG_DIR}/home.jpg`,
  },
  {
    path: ROUTES.about,
    breadcrumb: 'About',
    title: brand(`Power-Sector Solutions Since ${company.established}`),
    description: `Established ${company.established}, Vedanjay Power is a power-sector solutions `
      + `company for India's renewable energy: QCA, open access, metering, transmission and grid consultancy.`,
    keywords: ['power-sector solutions company', 'renewable energy consultancy India',
      'Vedanjay Power', 'QCA company India'],
    og: `${OG_DIR}/about.jpg`,
  },
  {
    path: ROUTES.team,
    parent: ROUTES.about,
    breadcrumb: 'Team',
    title: brand('Leadership Team'),
    description: `The people leading Vedanjay Power's QCA, open-access and electrical `
      + `infrastructure work — `
      + `${leadership.map((l) => `${l.name}, ${l.role}`).join('; ')}.`,
    keywords: ['Vedanjay Power leadership', ...leadership.map((l) => l.name)],
    og: `${OG_DIR}/team.jpg`,
  },
  {
    path: ROUTES.awards,
    parent: ROUTES.about,
    breadcrumb: 'Awards',
    title: brand('Solar Industry Awards'),
    description: `${awards.length} solar and renewable-energy industry awards won by Vedanjay Power between `
      + `${awardYears.at(-1)} and ${awardYears[0]}, including SolarQuarter and RE Assets, each with its certificate.`,
    keywords: ['solar industry awards', 'SolarQuarter awards', 'RE Assets Excellence Awards',
      'solar consulting company of the year'],
    og: `${OG_DIR}/awards.jpg`,
  },
  {
    path: ROUTES.downloads,
    parent: ROUTES.about,
    breadcrumb: 'Downloads',
    title: brand('MERC F&S and DSM Regulations'),
    description: `MERC forecasting, scheduling and deviation settlement regulations, open access rules and `
      + `rooftop net-metering orders: ${allResources.length} documents to read online.`,
    keywords: ['MERC forecasting and scheduling regulations', 'DSM regulations',
      'deviation settlement mechanism', 'MERC open access regulations', 'net metering regulations Maharashtra'],
    og: `${OG_DIR}/downloads.jpg`,
  },
  {
    path: ROUTES.partners,
    parent: ROUTES.about,
    breadcrumb: 'Partners',
    title: brand('Partners & ENERCAST AI Forecasting'),
    description: `Vedanjay Power's partner listing: ${partners.length} organisations, including ENERCAST GmbH, `
      + `Germany for AI/ML-enabled solar and wind power forecasting.`,
    keywords: ['ENERCAST forecasting partner', 'AI/ML energy forecasting', 'renewable energy partners'],
    og: `${OG_DIR}/partners.jpg`,
  },
  {
    path: ROUTES.services,
    breadcrumb: 'Services',
    title: brand('QCA, Open Access & ABT Metering'),
    description: `QCA Services (Forecasting and Scheduling), open-access power sale and purchase, ABT metering and `
      + `telemetry, EHV infrastructure and grid connectivity studies.`,
    keywords: ['QCA, open access and ABT metering', 'QCA Services (Forecasting and Scheduling)',
      'open access power sale and purchase', 'ABT metering and telemetry', 'EHV feeder bay and substation works',
      'transmission line stringing', 'grid connectivity studies'],
    og: `${OG_DIR}/services.jpg`,
  },
  {
    path: ROUTES.industries,
    breadcrumb: 'Industries',
    title: brand('Solar & Wind Developers, DISCOMs'),
    description: `Forecasting, QCA and electrical services for solar EPCs, wind OEMs and developers, DISCOMs `
      + `and transmission utilities, independent power producers and industry.`,
    keywords: ['solar and wind developers, DISCOMs and utilities', 'QCA for wind OEMs',
      'QCA for solar EPCs', 'independent power producers'],
    og: `${OG_DIR}/industries.jpg`,
  },
  {
    path: ROUTES.projects,
    breadcrumb: 'Projects',
    title: brand(`${mw(PORTFOLIO_TOTAL_MW)} MW Renewable QCA Portfolio`),
    description: `A ${mw(PORTFOLIO_TOTAL_MW)} MW renewable-energy portfolio under QCA Services `
      + `(Forecasting and Scheduling): ${PORTFOLIO_COUNT} solar and wind projects in ${portfolioByState.length} states, including `
      + `${joinList(portfolioByState.slice(0, 2).map((s) => s.state))}.`,
    keywords: ['renewable energy QCA portfolio', '5,000+ MW QCA Services (Forecasting and Scheduling)',
      'solar and wind projects India'],
    og: `${OG_DIR}/projects.jpg`,
  },
  {
    path: ROUTES.gallery,
    parent: ROUTES.projects,
    breadcrumb: 'Gallery',
    title: brand('Substation & Solar Site Photos'),
    description: `${shots.length} photos from Vedanjay Power substation and solar sites: switchyard structures, `
      + `work at height, foundations, module mounting, metering and earthing.`,
    keywords: ['substation and solar site photos', 'switchyard works', 'solar module mounting structure'],
    og: `${OG_DIR}/gallery.jpg`,
  },
  {
    path: ROUTES.careers,
    breadcrumb: 'Careers',
    title: brand('QCA & Renewable-Energy Careers'),
    description: `Careers in renewable-energy QCA Services (Forecasting and Scheduling), open access, metering `
      + `and electrical infrastructure, with offices in ${joinList(company.offices.map((o) => o.city))}.`,
    keywords: ['forecasting and QCA careers', 'renewable energy jobs', 'power sector jobs Pune and Indore'],
    og: `${OG_DIR}/careers.jpg`,
  },
  {
    path: ROUTES.contact,
    breadcrumb: 'Contact',
    title: brand(`${joinList(company.offices.map((o) => o.city)).replace(' and ', ' & ')} Offices`),
    description: `QCA Services (Forecasting and Scheduling) or open-access enquiries: offices in `
      + `${joinList(company.offices.map((o) => o.city))}. Call ${company.phone.display} or email `
      + `${company.emails.general}.`,
    keywords: [`${joinList(company.offices.map((o) => o.city))} offices`, 'QCA service provider Maharashtra',
      'QCA Services (Forecasting and Scheduling) enquiry', 'Vedanjay Power contact'],
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
