# Data Flow

Three distinct flows. Keeping them separate is what allows a mostly-static site to have dynamic
behaviour without a runtime data layer.

```
1. CONTENT     build-time,  read-only    ── data/ modules → pre-rendered HTML
2. INTERACTION runtime,     client-only  ── URL query string → filtered views
3. SUBMISSION  runtime,     write-only   ── forms → backend → email
```

---

## 1. Content flow (build time)

```
docs/06-content/*.md        ← human-verified source of truth (fact register, project register)
        │  manual, reviewed transcription
        ▼
frontend/src/data/*.js      ← structured JS modules
        │  accessor functions (getService, getProjectsForService, …)
        ▼
sections/ + pages/          ← composed into React
        │  vite build + static pre-render
        ▼
Static HTML per route       ← served from CDN
```

**No runtime fetch for content.** Every page ships as real HTML. Crawlers, screen readers and slow
connections all receive complete content on first byte.

### Accessor layer — the seam that matters

Components and sections **never import the data arrays directly.** They call accessors:

```js
// data/index.js — the seam
export const getService          = (slug) => services.find(s => s.slug === slug);
export const getAllServices      = () => services;
export const getProjectsForService = (slug) => projects.filter(p => p.services.includes(slug));
export const getProjectsForSegment = (slug) => projects.filter(p => p.segments.includes(slug));
export const getCaseStudy        = (slug) => caseStudies.find(c => c.slug === slug);
export const getCredentials      = (ids) => credentials.filter(c => ids.includes(c.id));
export const getStats            = () => stats.filter(s => s.verified);   // ← see §1.2
```

**Why this matters.** Migrating to a CMS later means rewriting `data/index.js` to fetch instead of
filter. Every consumer is untouched. Without this seam, a CMS migration is a rewrite of every page.

### 1.2 The verified-stats gate

`getStats()` filters on `verified`. Statistics whose `TO VERIFY` items are unresolved are simply not
returned, and `StatGrid` renders however many it receives.

This is the fact register enforced in code. It is why the homepage can ship with three statistics
instead of four if one cannot be evidenced — rather than shipping a number nobody can source. The
legacy site's contradictory 100-vs-110 MW and 700-vs-30 MW figures are the failure this prevents.

### 1.3 Relationships by ID

```js
// data/projects.js
{ slug:'suzlon-29-4mw-telemetry', client:'Suzlon Gujarat Wind Park Limited',
  capacityMW:29.4, technology:'wind', voltage:'33kV', state:'MP',
  services:['liaisoning','electrical-infrastructure'],   // ← IDs, not nested objects
  segments:['renewable-generators'], caseStudy:true }
```

One project surfaces under multiple services and multiple segments with no duplication. This is what
makes the service-page "Evidence" section and the filterable register read from the same 52 rows.

### 1.4 Content update path

```
Client supplies a change  →  update docs/06-content/*.md (source of truth, with provenance)
                          →  update frontend/src/data/*.js
                          →  PR + review  →  merge  →  automatic rebuild + deploy
```

Review is deliberate. Given that 20 items in the fact register are unverified, content changes
passing through review is a feature, not friction.

---

## 2. Interaction flow (client runtime)

The only meaningful client-side state on the site: project register filtering.

```
User taps a filter chip
        ▼
useProjectFilters()  →  setSearchParams({ service:'liaisoning', voltage:'132kV' })
        ▼
URL becomes  /projects/?service=liaisoning&voltage=132kV
        ▼
useSearchParams() re-reads  →  filter applied to the in-memory 52 rows (useMemo)
        ▼
ProjectTable / ProjectCard grid re-renders
        ▼
Result count announced via aria-live
```

**Filter state lives in the URL, not in React state.** Consequences:
- Filtered views are **shareable** — a salesperson can send a client a link to Vedanjay's 132 kV work.
- The **back button works** as the user expects.
- Service pages deep-link into pre-filtered views (`/projects/?service=liaisoning`).
- State survives a page refresh.

**No server round-trip.** 52 rows filter in under a millisecond in memory. An API here would add
latency and a failure mode to data that cannot change between deploys.

---

## 3. Submission flow (runtime write)

```
EnquiryForm
   │  intent + service read from the query string (?intent=assessment&service=open-access)
   │  → pre-selected, so the visitor never re-states what the page already knows
   ▼
useForm()  — local state, validation on blur
   │
   ▼  submit
services/enquiries.js  →  services/client.js  →  POST /api/enquiries
   │                                                    │
   │                                                    ▼  (see backend-architecture §3)
   │                                    validate → honeypot → Turnstile → route → email
   │                                                    │
   ◀────────────────────────  201 { reference }  ────────┘
   ▼
Success state replaces the form: confirmation + reference number
```

**Error paths:**

| Response | Frontend behaviour |
|---|---|
| `422` field errors | Mapped onto `FormField`s; focus moves to the first invalid field; announced via `aria-live` |
| `429` rate limited | Form-level message **including the phone number** |
| `502` email failure | Form-level message **including the phone number**; entered values preserved |
| Network / timeout | Same as 502 |

**A failed submission must never be a dead end.** In every failure state the phone number is offered,
values are preserved, and retry is possible. The lead is worth more than the elegance of the error.

---

## 4. Contact information — single source

```
data/company.js   ← name, CIN, addresses, phones, emails, social
      ├──→ Footer
      ├──→ Contact page
      ├──→ MobileDrawer (tap-to-call / tap-to-email)
      ├──→ Form error fallback messages
      └──→ Organization JSON-LD
```

One edit updates every appearance. The legacy site hard-codes contact details across eleven pages,
which is how the registered address drifted out of step with the MCA record (`TO VERIFY` #10).

---

## 5. SEO data flow

```
data/*.js  ──┬──→ visible page content
             └──→ <SEO> → meta tags + JSON-LD
```

Structured data is generated **from the same data that renders the page**. It therefore cannot drift
from the visible content — a common and search-penalised failure when JSON-LD is hand-maintained.

`sitemap.xml` is generated at build time from the route table plus the `data/` slugs, so a new
service or case study is indexed automatically.

---

## 6. Future: CMS migration path

Documented now so today's decisions do not foreclose it.

**Trigger:** the client demonstrates a real editing cadence, or Insights ships with an editorial owner.

**Recommended:** a headless CMS (Sanity, Payload or Strapi) with **build-time** fetching — content is
still baked into static HTML, so runtime performance and resilience are unchanged.

```
CMS  →  build-time fetch  →  data/index.js accessors (rewritten)  →  unchanged components
     └─ webhook → rebuild → redeploy
```

**Only `data/index.js` changes.** No component, section, page or layout is touched — which is
precisely why the accessor seam exists from day one rather than being retrofitted.

**Explicitly not recommended:** runtime CMS fetching. It would trade the site's best properties —
instant loads, no runtime dependency, works if the CMS is down — for an editing convenience that
build-time fetching already provides.

---

## Related

- [Frontend architecture](frontend-architecture.md) · [Backend architecture](backend-architecture.md)
- [Company fact register](../06-content/company-facts.md) · [Project register](../06-content/project-register.md)
