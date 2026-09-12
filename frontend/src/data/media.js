/**
 * MEDIA REGISTRY — every photograph on the site is declared here, by slug.
 *
 * Components never reference a file path. To swap in real Vedanjay photography:
 * drop the file into `frontend/public/images/` (plus a ≤1000px copy in `sm/`),
 * then change `src` and `alt` on the matching entry. Nothing else changes.
 *
 * PROVENANCE: current files are TEMPORARY licensed placeholders from Unsplash
 * (Unsplash License — commercial use permitted, no attribution required).
 * Full record in `frontend/public/images/CREDITS.json`. Subject matter is
 * restricted to power, grid and renewable infrastructure; no office/meeting
 * stock, no coal or smokestack imagery.
 *
 * `focal` maps to object-position and controls cropping at every breakpoint —
 * the one field worth tuning after a photo swap.
 */
const base = '/images/';

/** @typedef {{src:string, alt:string, focal?:string}} MediaItem */

/** @type {Record<string, MediaItem>} */
export const media = {
  'hero-primary': {
    src: `${base}hero-substation.jpg`,
    alt: 'High-voltage substation switchyard with steel gantries and transmission towers',
    focal: '50% 55%',
  },
  /* Renamed from 'about-operations' on 7 Sep 2026 along with the photograph.
     The slug names the subject, and this one is no longer a control desk. */
  'grid-transmission': {
    src: `${base}grid-transmission-dusk.jpg`,
    alt: 'High-voltage transmission towers and conductors receding across open ground at sunset',
    focal: '50% 55%',
  },

  // ---- Capabilities --------------------------------------------------------
  'cap-forecasting': {
    src: `${base}ops-monitoring.jpg`,
    alt: 'Operators monitoring live generation and scheduling data on control-room displays',
    focal: '50% 45%',
  },
  'cap-openaccess': {
    src: `${base}svc-open-access.jpg`,
    alt: 'Overhead transmission lines carried on lattice towers',
    focal: '50% 50%',
  },
  'cap-metering': {
    src: `${base}svc-electrical.jpg`,
    alt: 'Power transformer and high-voltage bushings at close range',
    focal: '50% 50%',
  },
  'cap-infrastructure': {
    src: `${base}svc-liaisoning.jpg`,
    alt: 'Electrical switchgear and insulator stacks in a substation yard',
    focal: '50% 50%',
  },
  'cap-gridstudies': {
    src: `${base}proj-grid.jpg`,
    alt: 'Transmission tower against an open sky',
    focal: '50% 45%',
  },
  'cap-projects': {
    src: `${base}hero-solar.jpg`,
    alt: 'Rows of photovoltaic modules across a utility-scale solar plant',
    focal: '50% 55%',
  },

  // ---- Renewable technologies ---------------------------------------------
  'tech-solar': {
    src: `${base}proj-solar-field.jpg`,
    alt: 'Photovoltaic array extending across a solar site',
    focal: '50% 50%',
  },
  'tech-wind': {
    src: `${base}ind-generators.jpg`,
    alt: 'Wind turbine seen close against the sky',
    focal: '50% 45%',
  },
  'tech-hybrid': {
    src: `${base}svc-forecasting.jpg`,
    alt: 'Wind turbines on open ground beneath a broad sky',
    focal: '50% 45%',
  },

  /* The projects hero. Same photograph as 'tech-solar' — a utility-scale array
     is what that page is about, and the hero shows it wide and dimmed under a
     scrim rather than as a card, so the two never appear together. It carries
     its own entry so the hero can be re-pointed without touching the
     homepage. */
  'projects-hero': {
    src: `${base}proj-solar-field.jpg`,
    alt: 'Rows of photovoltaic modules across a utility-scale solar plant under an open sky',
    focal: '50% 52%',
  },

  // ---- Contact -------------------------------------------------------------
  'contact-hero': {
    src: `${base}contact-transmission.jpg`,
    alt: '',
    focal: '55% 60%',
  },

  // ---- Footprint & closing -------------------------------------------------
  /* Was a floodlit substation at night — green steel under sodium light, busy
     and hard to lay a headline over. The company-overview hero wants breadth,
     not equipment. */
  'footprint': {
    src: `${base}windfarm-golden-hour.jpg`,
    alt: 'Aerial view of wind turbines standing over patchwork farmland at golden hour',
    focal: '50% 52%',
  },
  'cta-close': {
    src: `${base}cta-dusk.jpg`,
    alt: 'Substation switchyard against an evening sky',
    focal: '50% 50%',
  },
};

export const getMedia = (slug) => media[slug] ?? null;

/**
 * Hero slideshow order. Sequenced so consecutive frames differ in subject and
 * tone — substation, then solar field, then control room, then wind — rather
 * than four variations of the same shot.
 *
 * Each frame declares its own Ken Burns direction so the movement never repeats
 * identically between slides.
 */
/**
 * EVERY FRAME CARRIES ITS OWN HEADLINE, and the two change together: the line
 * should say something about the picture behind it rather than float over four
 * unrelated photographs.
 *
 * The first is the company's own strapline, set exactly as the company writes
 * it. The other three are facts already published elsewhere on this site — the
 * technologies covered, the registrations held, and the QCA portfolio figure
 * from data/stats.js. Nothing here is claimed for the first time, and the
 * breaks are chosen by hand so no line ever ends on a preposition.
 */
export const heroSlides = [
  {
    slug: 'hero-primary', pan: 'in-left',
    lines: ['Connecting to a More', 'Sustainable Future'],
  },
  {
    slug: 'cap-projects', pan: 'in-right',
    lines: ['Forecasting and scheduling', 'for solar, wind and hybrid.'],
  },
  {
    slug: 'grid-transmission', pan: 'in-up',
    lines: ['Registered QCA operations', 'in three states and WRLDC.'],
  },
  {
    slug: 'tech-wind', pan: 'in-down',
    lines: ['5,000+ MW under forecasting', 'and scheduling.'],
  },
];

/** Small-variant path for the srcset. Files live in /images/sm/. */
export const smallSrc = (src) => src.replace('/images/', '/images/sm/');
