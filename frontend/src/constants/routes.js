/** Route paths. Pages that are not yet implemented resolve to the interim
 *  "coming soon" page; `BUILT_ROUTES` records which ones actually exist. */
export const ROUTES = {
  home: '/',
  about: '/about/',
  team: '/about/team/',
  awards: '/about/awards/',
  downloads: '/about/downloads/',
  partners: '/about/partners/',
  services: '/services/',
  industries: '/industries/',
  projects: '/projects/',
  gallery: '/projects/gallery/',
  careers: '/careers/',
  contact: '/contact/',
  privacy: '/privacy/',
  terms: '/terms/',
};

/**
 * Routes that are actually implemented and safe to link to.
 *
 * Single source of truth, consumed by:
 *   - data/assistant.js — every answer the assistant offers a link to is
 *     checked against this list by frontend/test/assistant.test.js, so the
 *     assistant can never send a visitor to a page that does not exist
 *
 * Adding a page means building it AND adding it here, in that order.
 */
export const BUILT_ROUTES = [
  ROUTES.home,
  ROUTES.about,
  ROUTES.team,
  ROUTES.awards,
  ROUTES.downloads,
  ROUTES.partners,
  ROUTES.services,
  ROUTES.industries,
  ROUTES.projects,
  ROUTES.gallery,
  ROUTES.careers,
  ROUTES.contact,
];

/**
 * Routes whose hero is full-bleed and dark enough for the header to sit INSIDE
 * it — the navbar goes transparent and the hero runs behind it.
 *
 * This is the global switch for that behaviour. It was previously hardcoded in
 * RootLayout as `pathname === ROUTES.home`, which is why every other hero page
 * rendered a solid bar stacked above its own hero.
 *
 * Downloads joined this list on 5 Sep 2026, when its hero changed from a light
 * plate to a full-bleed photograph. The two must move together: the overlay
 * state inverts the nav labels to white, which is only legible over a dark
 * hero.
 */
export const OVERLAY_HERO_ROUTES = [
  ROUTES.home,
  ROUTES.about,
  ROUTES.team,
  ROUTES.awards,
  ROUTES.downloads,
  ROUTES.partners,
  ROUTES.services,
  ROUTES.industries,
  ROUTES.projects,
  ROUTES.gallery,
  ROUTES.careers,
  ROUTES.contact,
];

/** @param {string} pathname */
export const hasOverlayHero = (pathname) =>
  OVERLAY_HERO_ROUTES.includes(pathname.endsWith('/') ? pathname : `${pathname}/`);
