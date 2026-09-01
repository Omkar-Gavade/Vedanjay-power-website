# Frontend Architecture

**Stack:** React 18 · JavaScript · Vite · Tailwind CSS · React Router
**Scope:** 19 routes, ~38 components, largely static content, three forms.

---

## 1. The sizing decision

The most important architectural judgement on this project is **what not to build.**

This is a ~19-page marketing site with three forms and one filterable dataset. Architecting it like
an enterprise application would be the mirror image of the legacy site's failure: the legacy site
loads 55 scripts to do the work of five, and over-engineering the replacement would repeat that
mistake in a more fashionable idiom.

| Considered | Decision | Reasoning |
|---|---|---|
| Next.js / SSR | **No** | Content is fully known at build time. Static pre-rendering gives the same SEO with no server runtime, no hosting cost and no hydration complexity. The brief also specifies a *separate* backend — SSR would blur that boundary. |
| TypeScript | **No** — brief specifies JavaScript | Mitigated with JSDoc type annotations, `checkJs` in the editor, and PropTypes on shared components. Recorded as a decision-log trade-off. |
| Redux / Zustand / Jotai | **No** | There is no cross-cutting client state. Filter state lives in the URL; form state is local; nothing else is shared. |
| React Query / SWR | **No** at launch | Only three POST endpoints and no server-derived reads. Adds a cache layer with nothing to cache. Revisit if a CMS is introduced. |
| GraphQL | **No** | Three form endpoints. |
| Framer Motion | **No** | The four motion patterns are ~40 lines of CSS and two hooks; the library is ~34 KB gzipped. |
| A component library (MUI, Chakra, shadcn) | **No** | The whole point is a distinctive design. Adopting a library's visual defaults undermines the differentiation strategy, and overriding them costs more than building 38 purpose-built components. |
| Vite | **Yes** | Fast dev server, native ESM, straightforward static build, first-class code splitting. |
| React Router v6 | **Yes** | Nested layouts, lazy routes, `useSearchParams` for filter state. |
| Tailwind | **Yes** — brief specifies it | Configured to consume the design tokens, so utilities carry semantic names. |

**Result: initial JS budget under 120 KB gzipped**, against a legacy homepage issuing 55 script requests.

---

## 2. Directory structure

```text
frontend/
├── public/
│   ├── favicon.svg  ·  favicon.ico  ·  apple-touch-icon.png
│   ├── robots.txt   ·  og-default.jpg
│   └── documents/                  # company profile PDF
│
├── src/
│   ├── main.jsx                    # entry: root render, router, providers
│   ├── App.jsx                     # route tree
│   │
│   ├── assets/
│   │   ├── fonts/                  # self-hosted Archivo + IBM Plex Mono (woff2)
│   │   ├── images/                 # processed, responsive variants
│   │   ├── logos/clients/          # normalised monochrome client logos
│   │   └── icons/                  # SVG sprite source
│   │
│   ├── styles/
│   │   ├── tokens.css              # ← single source of truth for all design tokens
│   │   ├── base.css                # reset, element defaults, focus-visible
│   │   ├── fonts.css               # @font-face, size-adjust fallbacks
│   │   └── index.css               # Tailwind layers + imports
│   │
│   ├── components/                 # reusable, presentational, page-agnostic
│   │   ├── primitives/             # Button, Link, Icon, Container, Section, Reveal, Prose
│   │   ├── navigation/             # Header, MegaMenu, DropdownMenu, MobileDrawer,
│   │   │                           #   SectionNav, Breadcrumb, Footer
│   │   ├── content/                # SectionHeader, Card(+compositions), Stat, StatGrid,
│   │   │                           #   LogoGrid, Timeline, CredentialBlock, FeatureBlock,
│   │   │                           #   CTABand, FAQ, Figure, StateMap
│   │   ├── projects/               # ProjectRegister, FilterBar, ProjectTable, ProjectCard
│   │   ├── forms/                  # FormField, Input, Textarea, Select, Checkbox,
│   │   │                           #   EnquiryForm, ProfileDownloadForm
│   │   └── feedback/               # Alert, Modal, Skeleton, ErrorBoundary, SEO
│   │
│   ├── sections/                   # page-specific compositions of components
│   │   ├── home/                   # HomeHero, PositioningSection, ServicesGrid,
│   │   │                           #   NumbersSection, ClientsSection, FeaturedCase,
│   │   │                           #   IndustriesSection, WhyVedanjay, ClosingCTA
│   │   ├── services/               # ServiceHero, ServiceScope, ServiceProcess,
│   │   │                           #   ServiceEvidence, ServiceFAQ
│   │   ├── industries/  projects/  about/  contact/
│   │
│   ├── layouts/
│   │   ├── RootLayout.jsx          # Header + Outlet + Footer + skip link + scroll restoration
│   │   ├── PageLayout.jsx          # adds Breadcrumb + page <SEO>
│   │   └── ServiceLayout.jsx       # adds SectionNav + service enquiry CTA
│   │
│   ├── pages/                      # one file per route; composes sections, owns SEO
│   │   ├── Home.jsx  NotFound.jsx
│   │   ├── services/               # ServicesIndex.jsx, ServiceDetail.jsx
│   │   ├── industries/  projects/  about/
│   │   ├── Contact.jsx
│   │   └── legal/                  # Privacy.jsx, Terms.jsx
│   │
│   ├── data/                       # ← content as structured data (see §5)
│   │   ├── services.js  industries.js  projects.js  caseStudies.js
│   │   ├── clients.js   credentials.js recognition.js leadership.js
│   │   ├── partners.js  stats.js       faqs.js       navigation.js
│   │   └── company.js              # name, CIN, addresses, phones, emails
│   │
│   ├── hooks/
│   │   ├── useScrollDirection.js   # the ONE scroll listener sitewide
│   │   ├── useReveal.js            # shared IntersectionObserver
│   │   ├── useCountUp.js
│   │   ├── useMediaQuery.js
│   │   ├── useReducedMotion.js
│   │   ├── useFocusTrap.js
│   │   ├── useProjectFilters.js    # URL-backed filter state
│   │   └── useForm.js              # validation, submission, error state
│   │
│   ├── services/                   # API layer — the ONLY place fetch() is called
│   │   ├── client.js               # base fetch wrapper: baseURL, timeout, errors, retry
│   │   ├── enquiries.js            # submitEnquiry()
│   │   └── downloads.js            # requestProfileDownload()
│   │
│   ├── utils/
│   │   ├── cn.js                   # class merge
│   │   ├── format.js               # capacity, voltage, date formatting
│   │   ├── slug.js  ·  validate.js  ·  seo.js   # JSON-LD builders
│   │
│   └── constants/
│       ├── routes.js               # route paths — single source, no string literals
│       ├── breakpoints.js  ·  motion.js  ·  filters.js
│
├── index.html
├── vite.config.js  ·  tailwind.config.js  ·  postcss.config.js
├── .eslintrc.cjs   ·  .prettierrc  ·  .env.example
└── package.json
```

### Why each directory exists

| Directory | Responsibility | Boundary rule |
|---|---|---|
| `components/` | Reusable, page-agnostic UI | **Never imports from `data/` or `pages/`.** Receives everything as props. |
| `sections/` | Page-specific compositions | May import `components/` and `data/`. Never imported by `components/`. |
| `layouts/` | Route-level chrome | Renders `<Outlet/>`. |
| `pages/` | One per route; composes sections; owns SEO | The only place that knows about routing. |
| `data/` | Content as structured JS | **No JSX, no imports from `components/`.** Pure data + JSDoc types. |
| `hooks/` | Reusable stateful logic | No JSX. |
| `services/` | HTTP boundary | **The only place `fetch()` appears.** |
| `utils/` | Pure functions | No React, no side effects. |
| `constants/` | Fixed values | No logic. |

**The critical boundary is `components/` ↛ `data/`.** It is what keeps components testable in
isolation and lets the content source change (JS module → CMS API) without touching a single
component. Enforced by an ESLint `no-restricted-imports` rule, not by convention alone.

---

## 3. Component boundaries

Three tiers, with a strict dependency direction:

```
pages/  →  sections/  →  components/  →  primitives/
   ↓          ↓
 data/      data/
```

Dependencies point **one way only**. A `components/` file importing from `sections/` is a lint error.

- **Primitives** — no business meaning (`Button`, `Container`, `Section`).
- **Components** — reusable with business meaning (`ServiceCard`, `Stat`, `CredentialBlock`).
- **Sections** — one page's composition of the above (`HomeHero`, `ServiceEvidence`).
- **Pages** — assemble sections, declare SEO, receive route params.

**Component rule (from `components.md`):** used on two or more pages, or encapsulating non-trivial
behaviour. A component used once is a section.

---

## 4. Routing

```jsx
<Route element={<RootLayout />}>
  <Route index element={<Home />} />

  <Route path="services" element={<PageLayout />}>
    <Route index element={<ServicesIndex />} />
    <Route path=":slug" element={<ServiceDetail />} />   {/* ServiceLayout inside */}
  </Route>

  <Route path="industries" element={<PageLayout />}>
    <Route index element={<IndustriesIndex />} />
    <Route path=":slug" element={<IndustryDetail />} />
  </Route>

  <Route path="projects" element={<PageLayout />}>
    <Route index element={<ProjectsIndex />} />
    <Route path=":slug" element={<CaseStudy />} />
  </Route>

  <Route path="about" element={<PageLayout />}>
    <Route index element={<About />} />
    <Route path="leadership"  element={<Leadership />} />
    <Route path="credentials" element={<Credentials />} />
    <Route path="partners"    element={<Partners />} />
  </Route>

  <Route path="contact" element={<Contact />} />
  <Route path="privacy" element={<Privacy />} />
  <Route path="terms"   element={<Terms />} />
  <Route path="*"       element={<NotFound />} />
</Route>
```

- **Dynamic routes are data-driven.** `:slug` is validated against `data/services.js`; an unknown
  slug renders `NotFound` with a 404 status in the pre-render. Adding a seventh service is a data
  edit, not a routing change.
- **Code splitting:** Home and the shared layout are in the initial bundle. Every other route is
  `React.lazy()` + `Suspense`, with a route-matched `Skeleton` fallback.
- **Scroll restoration:** scroll to top on navigation; preserve position on back/forward; honour
  `#hash` anchors.
- **Focus management:** on route change, focus moves to the page `<h1>` and the route is announced
  via a visually-hidden `aria-live` region. SPAs silently break screen-reader navigation without this.
- **Route constants** live in `constants/routes.js`. No path string literals in components.

---

## 5. Content & data flow

**Content is structured data, not markup.** This is the decision that determines whether the site is
still maintainable in five years — the legacy site's content is welded into HTML, which is why it
froze in 2017.

```js
// data/services.js
export const services = [
  {
    slug: 'forecasting-scheduling',
    index: '02',
    name: 'Forecasting & Scheduling',
    descriptor: 'QCA-registered in three states',
    summary: '…',
    scope: [ /* … */ ],
    process: [ { step: 1, title: '…', body: '…' }, /* … */ ],
    deliverables: [ /* … */ ],
    credentials: ['qca-mh', 'qca-tg', 'qca-mp'],
    relatedProjects: ['suzlon-29-4mw-telemetry', /* … */],
    faqs: [ /* … */ ],
    seo: { title: '…', description: '…' },
  },
  // …
];
```

**Why local JS modules rather than a CMS at launch:**
- The content is stable — service descriptions and a project register change rarely.
- Zero runtime cost: content is bundled and pre-rendered.
- Content changes go through review, which matters when the fact register lists 20 unverified claims.
- **A CMS is not precluded.** Because every consumer reads through `data/` accessor functions rather
  than importing arrays directly, swapping the source for an API is a change to `data/` only.
  See [`data-flow.md`](data-flow.md).

**Relationships are by ID, not by nesting.** A project references service slugs; a service references
project slugs. Resolution happens in accessor functions (`getProjectsForService(slug)`). This avoids
duplicated data and lets one project appear under several services — the taxonomy requirement from
Pattern A1.

**The 52-row register** lives in `data/projects.js`, generated from
`docs/06-content/project-register.md` with spellings corrected and structured fields added
(service, segment, technology, voltage, state) so it is filterable.

---

## 6. State management

| State | Where it lives | Why |
|---|---|---|
| Route | React Router | — |
| **Project filters** | **URL query string** (`useSearchParams`) | Shareable, linkable, back-button-correct. Service pages link to `/projects/?service=liaisoning`. |
| Form values | Local `useState` via `useForm` | Never shared across components |
| Form submission | Local (`idle`/`submitting`/`success`/`error`) | — |
| Mobile drawer open | Local to `Header` | — |
| Mega-menu open | Local to `Header` | — |
| Reduced-motion preference | `useReducedMotion()` (media query) | Read, not stored |
| Scroll direction | `useScrollDirection()` | One listener sitewide |

**No global state store.** Nothing is shared widely enough to justify one. Adding Redux here would
be ceremony, and ceremony is how codebases become unmaintainable.

---

## 7. API layer

All network access goes through `services/`. **No component calls `fetch()` directly.**

```js
// services/client.js — the single HTTP boundary
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function post(path, body, { timeout = 15000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new ApiError(data.message ?? 'Request failed', res.status, data.errors);
    return data;
  } catch (err) {
    if (err.name === 'AbortError') throw new ApiError('Request timed out', 408);
    throw err;
  } finally {
    clearTimeout(timer);
  }
}
```

Only three calls exist: `submitEnquiry()`, `requestProfileDownload()`, and (Phase 2) `subscribe()`.
`ApiError` carries a status and field-level errors, which `useForm` maps back onto `FormField`s.

---

## 8. Error handling & loading

**Errors.**
- `ErrorBoundary` at the route level — a crashing page renders a branded fallback with working
  navigation, not a blank screen.
- Form errors are field-level where the API returns them, form-level otherwise.
- Network failure produces an actionable message with the phone number as a fallback route —
  a failed form must never be a dead end for a lead.
- `NotFound` for unknown routes and unknown slugs.
- Image `onError` falls back to a neutral placeholder. *(The legacy site renders broken-image icons
  in its hero.)*

**Loading.**
- Route transitions: `Suspense` + a route-shaped `Skeleton` matching final dimensions (no CLS).
- Form submission: button enters `loading`, preserves width, sets `aria-busy`.
- Images: explicit dimensions + `loading="lazy"`; no spinners.
- **No full-page loading spinner.** Static content should never need one.

---

## 9. Accessibility strategy

Built in, not audited on. The legacy site has 57 images with zero alt text, no `lang`, three `<h1>`s
and keyboard-inoperable service tabs.

1. **Required props enforce it:** `alt` on `Figure`, `label` on `FormField`, `asOf` on `Stat`.
2. **Semantic HTML first** — `<nav>`, `<main>`, `<section aria-labelledby>`, `<details>` for FAQs.
3. **One `<h1>` per page**, no skipped levels; size is a token, not a tag.
4. **Full keyboard operability** on every interactive component before styling begins.
5. **`:focus-visible`** with a 2px copper ring; focus indicators are never removed.
6. **Route-change announcements** and focus management (§4).
7. **Verified contrast** — every pairing computed, not estimated.
8. **`prefers-reduced-motion`** honoured globally *and* per component, with the reveal implemented so
   content is never left permanently invisible.
9. **44px minimum touch targets.**
10. **`<html lang="en-IN">`.**

**Target: WCAG 2.1 AA.** Verified with axe in CI, plus a manual keyboard-only pass and a screen-reader
pass (NVDA/VoiceOver) per page template.

---

## 10. Performance strategy

| Technique | Detail |
|---|---|
| Route code splitting | `React.lazy` on all non-home routes |
| Static pre-rendering | `vite-plugin-ssg` or equivalent — real HTML per route for crawlers and first paint |
| Font loading | Self-hosted variable WOFF2, subset, preloaded, `size-adjust` fallbacks (~95 KB total) |
| Images | AVIF/WebP/JPEG, 4 widths, explicit dimensions, lazy below fold, `fetchpriority="high"` on hero |
| Icons | One inline SVG sprite (~20 icons) — *replaces 609 KB of `livicons` JS* |
| CSS | Tailwind JIT, purged; target <25 KB gzipped |
| No animation library | Four CSS patterns + two hooks, <3 KB |
| Single scroll listener | Passive + rAF, in `useScrollDirection()` |
| Single IntersectionObserver | Shared across all reveal targets |
| Caching | Content-hashed assets, `immutable` long-max-age; HTML `must-revalidate`. *(Legacy: `max-age=3600` on everything.)* |
| Bundle analysis | `rollup-plugin-visualizer`, budget check in CI |

**Budgets** (CI-enforced): initial JS <120 KB gz · CSS <25 KB gz · total initial page <600 KB ·
LCP <2.5s on mobile 4G · CLS <0.05.

---

## 11. SEO implementation

The legacy site has no OG tags, no canonical, no structured data, a meta description set to the
literal company name, and **five of six services with no URL**.

- `<SEO>` per page: unique title, description, canonical, OG/Twitter with per-page image.
- **Static pre-rendering** so crawlers receive real HTML, not an empty root div.
- JSON-LD: `Organization` (Home, incl. CIN and address) · `Service` (each of six) ·
  `BreadcrumbList` (all inner) · `FAQPage` (service and industry pages), all generated from the same
  `data/` that renders the visible content — so structured data cannot drift from the page.
- Generated `sitemap.xml` from the route table; `robots.txt`.
- **301 redirects for all 11 legacy `.html` URLs** (map in `sitemap.md §6`).

---

## 12. Tooling & quality

ESLint (`react`, `react-hooks`, `jsx-a11y`, `import`) with `no-restricted-imports` enforcing the
`components/` ↛ `data/` boundary · Prettier · Vitest + React Testing Library for hooks, form
validation, filter logic and component behaviour · Playwright for the three critical journeys
(service→enquiry, industry→assessment, project filtering) · axe in CI · Lighthouse CI against the
budgets · JSDoc + `checkJs` for editor-level type safety in the absence of TypeScript.

---

## Related

- [Backend architecture](backend-architecture.md) · [Data flow](data-flow.md) · [Deployment](deployment-architecture.md)
- [Components](../03-design/components.md) · [Decision log](../05-decisions/decision-log.md)
