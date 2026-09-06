import { company } from './company.js';
import { capabilities } from './capabilities.js';
import { ORIGIN, absolute, trailFor } from './seo.js';
import { ROUTES } from '../constants/routes.js';

/**
 * STRUCTURED DATA. One organisation, described once.
 *
 * WHAT WAS WRONG BEFORE
 * The home page and the contact page each emitted their own Organization node
 * for the same company, and they disagreed: one sliced the last line off every
 * address, the other sliced two, so between them the published postcode and
 * the state were both wrong on one page or the other. Two conflicting
 * descriptions of one entity is worse for a crawler than one — it has to pick.
 *
 * Now there is a single organisation node with a stable @id, and every other
 * node on the site REFERENCES it rather than restating it. The address comes
 * from `company.offices[].postal`, which carries the same tokens the page
 * prints rather than a substring guess at them.
 *
 * WHAT IS DELIBERATELY ABSENT
 * No aggregateRating, no review, no price, no offer, no openingHours, no
 * numberOfEmployees, no foundingLocation, no award node. Every one of those is
 * either unpublished or unverifiable from the source documents, and a rich
 * result built on an invented field is a manual action waiting to happen.
 */

const id = (fragment) => `${ORIGIN}/#${fragment}`;

export const ORG_ID = id('organization');
export const SITE_ID = id('website');

const postalAddress = (o) => ({
  '@type': 'PostalAddress',
  streetAddress: o.postal.street,
  addressLocality: o.postal.locality,
  addressRegion: o.postal.region,
  postalCode: o.postal.postalCode,
  addressCountry: o.postal.country,
});

/** E.164, built from the published number rather than typed a second time. */
const TEL = `+91${company.phone.display}`;

/**
 * The organisation itself.
 *
 * ProfessionalService (a subtype of LocalBusiness) rather than a bare
 * Organization: the company publishes two street addresses, a telephone number
 * and a defined service catalogue, which is exactly what that type is for.
 * `areaServed` lists the registered operating areas — the states where QCA
 * operations are actually registered, not a marketing footprint.
 */
export const organizationSchema = {
  '@type': 'ProfessionalService',
  '@id': ORG_ID,
  name: company.legalName,
  alternateName: company.name,
  slogan: company.tagline,
  url: `${ORIGIN}/`,
  description: company.overview,
  foundingDate: String(company.established),
  logo: {
    '@type': 'ImageObject',
    url: `${ORIGIN}/brand/vedanjay-power-logo.png`,
    width: 400,
    height: 99,
  },
  image: `${ORIGIN}/og/vedanjay-power.jpg`,
  telephone: TEL,
  email: company.emails.general,
  sameAs: company.social.filter((s) => s.href).map((s) => s.href),
  address: company.offices.map(postalAddress),
  areaServed: company.operatingAreas.map((a) => ({
    '@type': 'AdministrativeArea',
    name: a.name,
  })),
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: company.emails.general,
      telephone: TEL,
      areaServed: 'IN',
      availableLanguage: ['en', 'hi'],
    },
    {
      '@type': 'ContactPoint',
      contactType: 'technical support',
      email: company.emails.operations,
      areaServed: 'IN',
      availableLanguage: ['en', 'hi'],
    },
  ],
  /* The service catalogue, from the same list the services page renders. */
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Power-sector services',
    itemListElement: capabilities.map((c) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: c.name,
        description: c.summary,
        serviceType: c.name,
        provider: { '@id': ORG_ID },
        areaServed: company.operatingAreas.map((a) => a.name),
      },
    })),
  },
};

/** The site, so a crawler can tie every page to one publisher. */
export const websiteSchema = {
  '@type': 'WebSite',
  '@id': SITE_ID,
  url: `${ORIGIN}/`,
  name: company.name,
  /* No `potentialAction`/SearchAction: the site has no search endpoint, and
     declaring one that 404s is worse than declaring none. */
  publisher: { '@id': ORG_ID },
  inLanguage: 'en-IN',
};

/** Where a page sits, so results show a trail instead of a bare URL. */
export function breadcrumbSchema(path) {
  const trail = trailFor(path);
  if (trail.length < 2) return null;
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((node, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: node.breadcrumb,
      item: absolute(node.path),
    })),
  };
}

/** The page itself, tied to the site and the organisation. */
export const webPageSchema = ({ path, title, description }) => ({
  '@type': 'WebPage',
  '@id': `${absolute(path)}#webpage`,
  url: absolute(path),
  name: title,
  description,
  isPartOf: { '@id': SITE_ID },
  about: { '@id': ORG_ID },
  inLanguage: 'en-IN',
});

/**
 * Every node a page emits, in ONE @graph rather than several loose scripts —
 * which is what lets the nodes reference each other by @id instead of each
 * repeating the organisation.
 */
export function graphFor({ path, title, description, extra = [] }) {
  const nodes = [webPageSchema({ path, title, description })];
  const crumbs = breadcrumbSchema(path);
  if (crumbs) nodes.push(crumbs);
  /* The organisation and the site are declared once, on the home page. Every
     other page points at them by @id. */
  if (path === ROUTES.home) nodes.unshift(organizationSchema, websiteSchema);
  return { '@context': 'https://schema.org', '@graph': [...nodes, ...extra] };
}
