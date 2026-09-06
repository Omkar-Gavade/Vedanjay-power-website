/**
 * PER-ROUTE HEAD INJECTION — what makes the metadata reachable at all.
 *
 * THE PROBLEM THIS SOLVES
 * The site is a client-rendered SPA, so the asset store serves ONE index.html
 * for every route: one generic title, an empty <div id="root">, and no
 * description, canonical, Open Graph or structured data anywhere in it. The
 * <Seo> component does emit all of that — but only once React has mounted.
 *
 * Google executes JavaScript and will eventually see the rendered head. Social
 * scrapers do not. facebookexternalhit, Twitterbot, LinkedInBot, WhatsApp and
 * Slack all read the raw HTML and stop. Without this step, every share of every
 * page on this site shows the home page's title and no image, and the entire
 * Open Graph implementation is dead on arrival.
 *
 * WHAT IT DOES
 * Writes a real HTML file per route — dist/about/index.html and so on — each a
 * copy of the shell with that route's head baked in. Cloudflare's asset store
 * serves the exact file for the exact path, so /about/ gets /about/index.html;
 * everything else still falls through to the SPA. The body is untouched and
 * React still mounts normally.
 *
 * WHY NOT FULL SSR: the app reads matchMedia, sessionStorage and
 * IntersectionObserver during render. Server-rendering it would mean a
 * compatibility layer for all of that, and the payoff — body HTML for a crawler
 * that already renders JS — is far smaller than the payoff here.
 *
 *   node scripts/prerender.mjs            after `vite build`
 *   node scripts/prerender.mjs --check    verify dist is current
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import {
  routeSeo, absolute, ORIGIN, OG_SIZE, OG_DEFAULT, ROUTE_HERO,
} from '../frontend/src/data/seo.js';
import { getMedia, smallSrc } from '../frontend/src/data/media.js';
import { graphFor } from '../frontend/src/data/schema.js';
import { company } from '../frontend/src/data/company.js';

const CHECK = process.argv.includes('--check');
const DIST = 'frontend/dist';
const shellPath = join(DIST, 'index.html');

if (!existsSync(shellPath)) {
  console.error(`${shellPath} not found — run the build first.`);
  process.exit(1);
}
/**
 * The pristine shell, with any PREVIOUS injection stripped back out.
 *
 * The home page's document IS dist/index.html, so this script overwrites the
 * file it reads its shell from. Without this the run is not idempotent: a
 * second invocation without an intervening build would read the already-injected
 * home page as its shell and inject on top of it, giving that page two of every
 * tag — and it made `--check` fail immediately after a successful write, which
 * is how the bug surfaced.
 */
const pristine = (html) => html
  .split('\n')
  .filter((line) => !line.includes('data-seo="static"') && !line.includes('rel="preload" as="image"'))
  .join('\n')
  /* The shell's own <title> goes too — every page injects its own below. It has
     to be dropped explicitly because the injected title carries data-seo and is
     already removed by the filter above; leaving the original in place would
     put two titles in the document. */
  .replace(/[ \t]*<title>[\s\S]*?<\/title>\n?/, '');

const shell = pristine(readFileSync(shellPath, 'utf8'));

/** Attribute-safe. The JSON-LD is escaped separately — see below. */
const attr = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

/**
 * `<` inside a <script> block would end the element early, so it is escaped as
 * a unicode sequence — still valid JSON, and inert as markup.
 */
const ldSafe = (obj) => JSON.stringify(obj).replace(/</g, '\\u003c');

/**
 * Every injected tag carries data-seo="static" so main.jsx can remove exactly
 * these before React mounts — see the note there. Without it the document ends
 * up with two of everything: two titles, two canonicals, two JSON-LD blocks.
 */
function headFor(meta) {
  const url = absolute(meta.path);
  const image = `${ORIGIN}${meta.og ?? OG_DEFAULT}`;
  const graph = graphFor({
    path: meta.path, title: meta.title, description: meta.description,
  });

  const D = 'data-seo="static"';
  const title = `    <title ${D}>${attr(meta.title)}</title>\n`;

  /* LCP PRELOAD. The hero is the largest element on every page, and in a
     client-rendered SPA the browser cannot discover it until the bundle has
     parsed and React has mounted. Declaring it here starts the download with
     the document instead. The srcset and sizes MATCH what the page renders —
     a preload that disagrees fetches a second, unused file.

     NOT marked data-seo="static": React never renders a preload, so there is no
     duplicate to clean up, and pulling the link out of the head on mount only
     risks orphaning a fetch that is already in flight. */
  const hero = getMedia(ROUTE_HERO[meta.path]);
  const preload = hero
    ? `    <link rel="preload" as="image" href="${hero.src}"`
      + ` imagesrcset="${smallSrc(hero.src)} 1000w, ${hero.src} 1800w"`
      + ` imagesizes="100vw" fetchpriority="high" />\n`
    : '';

  return title + preload + `    <meta ${D} name="description" content="${attr(meta.description)}" />
    <link ${D} rel="canonical" href="${url}" />
    <meta ${D} name="robots" content="index, follow, max-image-preview:large" />
    <meta ${D} property="og:type" content="website" />
    <meta ${D} property="og:site_name" content="${attr(company.legalName)}" />
    <meta ${D} property="og:locale" content="en_IN" />
    <meta ${D} property="og:title" content="${attr(meta.title)}" />
    <meta ${D} property="og:description" content="${attr(meta.description)}" />
    <meta ${D} property="og:url" content="${url}" />
    <meta ${D} property="og:image" content="${image}" />
    <meta ${D} property="og:image:width" content="${OG_SIZE.width}" />
    <meta ${D} property="og:image:height" content="${OG_SIZE.height}" />
    <meta ${D} property="og:image:alt" content="${attr(meta.title)}" />
    <meta ${D} name="twitter:card" content="summary_large_image" />
    <meta ${D} name="twitter:title" content="${attr(meta.title)}" />
    <meta ${D} name="twitter:description" content="${attr(meta.description)}" />
    <meta ${D} name="twitter:image" content="${image}" />
    <script ${D} type="application/ld+json">${ldSafe(graph)}</script>
`;
}

function pageFor(meta) {
  /* The title is part of headFor's block and the shell's own has been stripped,
     so the document ends up with exactly one — two <title> elements is the
     duplicate-title fault this whole change exists to prevent. */
  return shell.replace('</head>', `${headFor(meta)}  </head>`);
}

const problems = [];
let written = 0;

for (const meta of routeSeo) {
  /* '/' is the shell itself; every other route becomes a directory index. */
  const out = meta.path === '/'
    ? shellPath
    : join(DIST, meta.path.replace(/^\/|\/$/g, ''), 'index.html');
  const html = pageFor(meta);

  if (CHECK) {
    if (!existsSync(out)) { problems.push(`missing ${out}`); continue; }
    if (readFileSync(out, 'utf8') !== html) problems.push(`${out} is out of date`);
    continue;
  }
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  written += 1;
}

if (problems.length) {
  console.error('Prerender FAILED:');
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(CHECK
  ? `Prerendered head current for ${routeSeo.length} routes`
  : `Prerendered head into ${written} route documents`);
