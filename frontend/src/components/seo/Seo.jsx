import { company } from '../../data/company.js';
import {
  absolute, seoFor, OG_DEFAULT, OG_SIZE,
} from '../../data/seo.js';
import { graphFor } from '../../data/schema.js';

/**
 * Head metadata for one route.
 *
 * React 19 hoists <title>, <meta>, <link> and <script> out of the tree into
 * <head> natively, so this needs no helmet and no provider — it renders the
 * tags where the page renders, and React puts them in the right place.
 *
 * A page passes its ROUTE, not its metadata: the title, description, canonical,
 * social card and structured data all come from the table in data/seo.js. That
 * is what makes "no two pages share a title" a property a test can check,
 * rather than a thing someone has to remember.
 *
 * @param {{route:string, extraSchema?:object[], noindex?:boolean}} props
 */
export function Seo({ route, extraSchema = [], noindex = false }) {
  const meta = seoFor(route);

  /* A route with no entry is not indexable — the 404 is the only one that
     reaches this branch, and it must not advertise itself. */
  if (!meta) {
    return (
      <>
        <meta name="robots" content="noindex, follow" />
      </>
    );
  }

  const url = absolute(meta.path);
  const image = `${absolute('/').replace(/\/$/, '')}${meta.og ?? OG_DEFAULT}`;
  const graph = graphFor({
    path: meta.path,
    title: meta.title,
    description: meta.description,
    extra: extraSchema,
  });

  return (
    <>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={url} />
      {noindex
        ? <meta name="robots" content="noindex, follow" />
        : <meta name="robots" content="index, follow, max-image-preview:large" />}

      {/* Open Graph. og:image is an absolute URL with declared dimensions —
          without them a scraper has to fetch the image before it can lay the
          card out, and some simply do not bother. */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={company.legalName} />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content={String(OG_SIZE.width)} />
      <meta property="og:image:height" content={String(OG_SIZE.height)} />
      <meta property="og:image:alt" content={meta.title} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={image} />

      <script type="application/ld+json">{JSON.stringify(graph)}</script>
    </>
  );
}
