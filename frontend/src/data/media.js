/**
 * MEDIA REGISTRY — the single place temporary imagery is declared.
 *
 * Every image on the homepage is referenced by SLUG, never by path. To swap in
 * real Vedanjay photography later:
 *   1. drop the new file into  frontend/public/images/
 *   2. change `src` (and `alt`) on the matching entry below
 * No component, section or stylesheet needs to change.
 *
 * `focal` maps to CSS object-position and controls cropping at every
 * breakpoint — the mechanism that stops portraits losing their subject on
 * mobile. Set it per image; it is the one thing worth tuning after a swap.
 *
 * PROVENANCE: current files are TEMPORARY development placeholders sourced from
 * Wikimedia Commons under CC licences. Machine-readable attribution for each
 * file is in `frontend/public/images/CREDITS.json`. These are stand-ins for
 * Vedanjay's own photographs and are not brand assets. If any placeholder
 * survives to production, its attribution must be honoured on the page or in a
 * credits page — see docs/05-decisions/decision-log.md (D-033).
 */

const base = '/images/';

/** @typedef {{src:string, alt:string, focal?:string, temporary?:boolean}} MediaItem */

/** @type {Record<string, MediaItem>} */
export const media = {
  // ---- Hero rotation -------------------------------------------------------
  'hero-substation': {
    src: `${base}hero-substation.jpg`,
    alt: 'A high-voltage substation switchyard with steel gantries and transmission towers behind it',
    focal: '50% 55%',
  },
  'hero-transmission': {
    src: `${base}hero-transmission.jpg`,
    alt: 'Electricity transmission pylons silhouetted against a sunset sky',
    focal: '50% 45%',
  },
  'hero-wind': {
    src: `${base}hero-wind.jpg`,
    alt: 'A wind turbine standing against a low sun',
    focal: '50% 50%',
  },
  'hero-solar': {
    src: `${base}hero-solar.jpg`,
    alt: 'Long rows of photovoltaic modules across a utility-scale solar plant',
    focal: '50% 55%',
  },

  // ---- Services ------------------------------------------------------------
  'svc-open-access': {
    src: `${base}svc-open-access.jpg`,
    alt: 'Overhead transmission lines carried on lattice towers across open country',
    focal: '50% 50%',
  },
  'svc-forecasting': {
    src: `${base}svc-forecasting.jpg`,
    alt: 'Wind turbines on open ground beneath a broad sky',
    focal: '50% 40%',
  },
  'svc-liaisoning': {
    src: `${base}svc-liaisoning.jpg`,
    alt: 'Electrical switchgear and insulator stacks inside a substation yard',
    focal: '50% 50%',
  },
  'svc-electrical': {
    src: `${base}svc-electrical.jpg`,
    alt: 'A power transformer and high-voltage bushings at close range',
    focal: '50% 50%',
  },
  'svc-rooftop': {
    src: `${base}svc-rooftop.jpg`,
    alt: 'Photovoltaic modules installed across a building rooftop',
    focal: '50% 50%',
  },
  'svc-om': {
    src: `${base}svc-om.jpg`,
    alt: 'Looking up at electrical infrastructure during site work',
    focal: '50% 50%',
  },

  // ---- Industries ----------------------------------------------------------
  'ind-industrial': {
    src: `${base}ind-industrial.jpg`,
    alt: 'A modern manufacturing floor with process equipment and electrical services',
    focal: '50% 50%',
  },
  'ind-commercial': {
    src: `${base}ind-commercial.jpg`,
    alt: 'A solar array on a building at golden hour',
    focal: '50% 45%',
  },
  'ind-utilities': {
    src: `${base}ind-utilities.jpg`,
    alt: 'A substation switchyard lit at dusk',
    focal: '50% 50%',
  },
  'ind-generators': {
    src: `${base}ind-generators.jpg`,
    alt: 'A wind turbine seen close against the sky',
    focal: '50% 45%',
  },

  // ---- Projects & trust ----------------------------------------------------
  'proj-grid': {
    src: `${base}proj-grid.jpg`,
    alt: 'A transmission tower against a dark, dramatic sky',
    focal: '50% 50%',
  },
  'proj-solar-field': {
    src: `${base}proj-solar-field.jpg`,
    alt: 'A photovoltaic array extending across a solar site',
    focal: '50% 55%',
  },
  'trust-team': {
    src: `${base}trust-team.jpg`,
    alt: 'A site engineer in protective headgear on an industrial site',
    focal: '50% 45%',
  },
  'cta-dusk': {
    src: `${base}cta-dusk.jpg`,
    alt: 'A substation switchyard against an open evening sky',
    focal: '50% 50%',
  },
};

/** Resolve a slug to a media item; returns null when the asset is absent so
 *  callers can fall back to a graphic treatment rather than a broken image. */
export const getMedia = (slug) => media[slug] ?? null;

/** Hero rotation order. Sequenced substation → transmission → wind → solar:
 *  grid infrastructure first (what Vedanjay actually does), generation second. */
export const heroSequence = [
  'hero-substation',
  'hero-transmission',
  'hero-wind',
  'hero-solar',
];
