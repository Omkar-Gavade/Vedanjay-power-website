# Decision Log

Every significant decision in this phase, with context, options considered, reasoning and trade-offs.
Newest decisions are appended; superseded decisions are marked, never deleted.

**Status key:** `ACCEPTED` · `DEFERRED` · `SUPERSEDED` · `BLOCKED`

---

## D-001 · Replace rather than redesign the existing site
**Date:** 2026-08-31 · **Status:** ACCEPTED

**Context.** The brief allows either. The audit measured: 56 script tags, 18 stylesheets, three
separate slider libraries, 609 KB of icon JavaScript, 2.5 MB of hero JPEGs, a 404 on jQuery 1.9.1
while jQuery 3.0.0 also loads, a mixed-content-blocked webfont, 0/57 images with alt text, and a
mobile hero headline clipped mid-word.

**Options.** (a) Restyle the existing Bootstrap 3 theme. (b) Rebuild the frontend, keep the content.
(c) Rebuild everything including content.

**Chosen.** (b).

**Reasoning.** The mobile failures are not CSS oversights — Slider Revolution positions caption
layers at absolute pixel coordinates for a fixed design width (`.tp-mask-wrap` measured at 800px in a
375px viewport). That class of defect cannot be fixed without removing the slider. Roughly 95% of the
payload implements features the business does not have (audio playlist, pricing slider, chart
widgets, image zoom). Meanwhile the *content* — six expert service descriptions, 52 named executed
works, 41 clients — is genuinely valuable and irreplaceable.

**Trade-offs.** Higher up-front cost than a restyle; whatever SEO equity the legacy URLs hold must be
carried by 301 redirects (mapped in `sitemap.md §6`).

---

## D-002 · Reframe the five named comparators as clients, not competitors
**Date:** 2026-08-31 · **Status:** ACCEPTED

**Context.** The brief names Waaree, Tata Power, Vikram Solar, ReNew and Suzlon as competitors to
research.

**Finding.** Cross-referencing the legacy client list and project register shows **four of the five
are Vedanjay's clients** — Waaree (3 CEIG mandates), Tata Power Solar (4), Vikram Solar (4 civil
works), Suzlon (7 telemetry/SLDC mandates), ReNew (5 O&M mandates). They are asset owners and
manufacturers; Vedanjay is a services firm they hire.

**Chosen.** Study all five for *craft* (navigation, motion, statistics presentation). Take *information
architecture* from **DNV**, an independent energy assurance and advisory firm — a true structural analogue.

**Reasoning.** An IPP's IA (product catalogue, investor relations, GW hero, ESG library) would force
Vedanjay to compete on portfolio scale, where it is weakest, and would hide regulatory access and
repeat business, where it is strongest.

**Trade-offs.** Diverges from the brief's implied framing — stated explicitly rather than silently.

---

## D-003 · One indexable page per service line
**Date:** 2026-08-31 · **Status:** ACCEPTED

**Context.** The legacy site holds all six services on `/services.html` behind a jQuery
`showHideDiv()` toggle. Five of six have no URL.

**Options.** (a) Keep tabs. (b) Accordion on one page. (c) Six routed pages.

**Chosen.** (c) — six pages under `/services/`.

**Reasoning.** In a services business the service page *is* the product page: the SEO unit, the
sales-collateral unit, the analytics unit, the URL pasted into an email. This is DNV's model
(Pattern A1). Vedanjay currently cannot rank for "QCA Maharashtra", "CEIG approval consultant MP" or
"SLDC synchronisation" — the exact queries its buyers type — because no page exists to rank. This is
the single highest-value structural change in the project.

**Trade-offs.** Six pages to write and maintain instead of one. Requires ~800–1,200 words each — but
the legacy copy already supplies most of the substance.

---

## D-004 · Add `Industries` as a second top-level navigation axis
**Date:** 2026-08-31 · **Status:** ACCEPTED

**Context.** The legacy homepage segments Industry / Commercial / Utilities / RE Generators as four
decorative tiles with no pages behind them.

**Chosen.** Four segment pages under `/industries/`, each opening on the reader's situation.

**Reasoning.** Buyers arrive knowing either *what they need* (service) or *who they are* (segment) —
Waaree's dual-axis pattern (A4), applied to services. Critically, an HT factory manager does not
self-identify as needing "open access consultancy"; he knows his electricity bill is too high. No
comparator site addresses the individual buyer (Pattern E1), which makes this a differentiator as
well as a usability fix.

**Trade-offs.** Four more pages; some content overlap with service pages, managed by cross-linking
rather than duplication.

---

## D-005 · Remove `Sustainability` from the sitemap
**Date:** 2026-08-31 · **Status:** ACCEPTED

**Context.** The brief's hypothesis sitemap includes it; every comparator has one.

**Chosen.** Removed.

**Reasoning.** Vedanjay has no measured, audited sustainability data (fact register §12). A
sustainability page without metrics is ESG boilerplate — noise to the technical and institutional
readers this site targets, and inconsistent with the "evidence before adjective" principle. The
honest contribution (enabling others' renewable assets to connect and operate) is stated on About and
demonstrated by the project register.

**Trade-offs.** Diverges from sector convention and from the brief's hypothesis. Revisit immediately
if real data becomes available.

---

## D-006 · Defer Careers and Insights to Phase 2
**Date:** 2026-08-31 · **Status:** DEFERRED

**Reasoning.** Careers is gated on whether live vacancies exist (`TO VERIFY` #17); Insights is gated
on a named editorial owner. The legacy Downloads page — 15 of 22 links returning HTTP 503 — is the
proof that unmaintained sections actively damage credibility. Footer carries a `careers@` route at
launch. Navigation is sized at five items specifically to accommodate both later without restructuring.

---

## D-007 · Copper as the accent colour
**Date:** 2026-08-31 · **Status:** ACCEPTED

**Context.** The legacy site uses three inconsistent greens (`#389743`, `#47A859`, `#248427`).
Research found Tata Power, Suzlon and ReNew all in a teal-green family — the legacy green sits inside
the same convergence zone.

**Options.** (a) Refine the existing green. (b) Adopt sector teal. (c) Deep evergreen + copper accent.

**Chosen.** (c) — graphite ink ground, deep evergreen primary, **copper** accent, warm paper surfaces.

**Reasoning.** Copper is the metal of conductors, busbars and windings — semantically true to an
electrical infrastructure firm in a way that eco-green is not, and worn by **none** of the five
comparators. It supplies warmth that greens and teals cannot and reads premium the way brass and
bronze do. Deepening the green out of the mid-green zone retains brand equity while escaping the
convergence. This is differentiation move #5 in the gap analysis.

**Trade-offs.** A departure from the current brand green — requires client buy-in. Copper's contrast
profile is constrained: it fails AA as body text on light (3.63:1), so it is restricted to dark-on-copper
CTAs (5.09:1), large text, rules and accents at 3–5% coverage. These constraints are documented as
binding rules rather than left to discovery.

---

## D-008 · Archivo + IBM Plex Mono
**Date:** 2026-08-31 · **Status:** ACCEPTED

**Context.** The legacy site's only webfont (Arimo) is loaded over `http://` on an HTTPS page and is
**blocked as mixed content** — it has never rendered. There is effectively no typography in production.

**Options.** (a) Inter + a mono. (b) Poppins/Montserrat. (c) Archivo + IBM Plex Mono. (d) A serif display.

**Chosen.** (c).

**Reasoning.** Inter is the SaaS default the brief explicitly rejects; Poppins/Montserrat is the
Indian corporate default and would place Vedanjay exactly where the sector already sits. Archivo is an
industrial grotesque designed for both display and text — one family covers headlines and body, and
its Expanded axis gives hero headlines architectural presence. **IBM Plex Mono for statistics,
kickers and technical figures is the distinctive move:** monospace numerals make statistics read as
instrument readouts, which is precisely right for a firm doing metering, telemetry and load despatch.
A serif display was considered for institutional authority but reads literary rather than engineered.

**Trade-offs.** Two families to self-host (~95 KB). Archivo Expanded is a second file; used only for
`display-xl`/`display-lg`.

---

## D-009 · Self-host fonts
**Date:** 2026-08-31 · **Status:** ACCEPTED

**Reasoning.** Removes a third-party origin, a DNS lookup and a privacy concern; permits
`font-src 'self'` in CSP; and makes the legacy mixed-content failure structurally impossible.

**Trade-offs.** Font files are in the repository and must be updated manually. Acceptable — they
change essentially never.

---

## D-010 · Four motion patterns; no animation library
**Date:** 2026-08-31 · **Status:** ACCEPTED

**Context.** The legacy site ships three slider libraries plus GreenSock and 609 KB of animated icons.

**Chosen.** Four patterns only — section reveal, hero entrance, interactive feedback, statistic
count-up. Implemented in CSS plus two hooks. Framer Motion rejected.

**Reasoning.** Framer Motion is ~34 KB gzipped to replicate what `transform` and `opacity`
transitions already do. Parallax, page transitions, cursor effects, scroll-jacking and carousels were
each considered and rejected on cost against the brief's performance test. Animation budget: **under
3 KB gzipped**.

**Trade-offs.** Shared-element transitions are not available. Nothing in the page specifications
needs them. Revisit with a decision-log entry if that changes.

---

## D-011 · No hero carousel
**Date:** 2026-08-31 · **Status:** ACCEPTED

**Reasoning.** Slides after the first are seen by a small minority of visitors, and each additional
slide dilutes the first. The legacy site's carousel is also the direct cause of its clipped mobile
headline. A single decisive hero statement with a proof strip (Pattern B1, from Suzlon's
capability-first opening) does more work than five rotating slogans.

---

## D-012 · Statistics require an `asOf` date at the type level
**Date:** 2026-08-31 · **Status:** ACCEPTED · **BLOCKED on `TO VERIFY` #1–#4**

**Context.** The legacy site publishes contradictory figures: 100 MW vs 110 MW open access; 700 MW
commissioned vs +30 MW O&M; "50+ clients" against 41 logos and 52 project rows.

**Chosen.** `asOf` is a **required prop** on `Stat`. `getStats()` filters on a `verified` flag, and
`StatGrid` renders however many statistics it receives.

**Reasoning.** Vikram Solar's "as of March 31, 2025" (Pattern B3) is the single best credibility
practice observed in the research. Making the date required at the component API means an undated
statistic cannot ship, and the verified filter means the homepage degrades to three statistics rather
than publishing an unsourceable fourth. For institutional readers, an unverifiable number is worse
than no number.

**Trade-offs.** The homepage may launch with three statistics. Accepted deliberately.

---

## D-013 · React + Vite, static pre-rendered; no SSR framework
**Date:** 2026-08-31 · **Status:** ACCEPTED

**Options.** (a) Next.js. (b) Vite + React Router + static pre-render. (c) Vite SPA, client-only.

**Chosen.** (b).

**Reasoning.** Content is fully known at build time, so pre-rendering delivers the same SEO as SSR
with no server runtime, no hosting cost and no hydration complexity. Next.js would also blur the
frontend/backend separation the brief requires by encouraging API routes. A client-only SPA was
rejected — it would ship an empty root div to crawlers, which for a site whose whole purpose is
ranking on service queries is disqualifying.

**Trade-offs.** No on-demand server rendering. Not needed: content changes on deploy.

---

## D-014 · No global state library
**Date:** 2026-08-31 · **Status:** ACCEPTED

**Reasoning.** There is no cross-cutting client state. Filter state lives in the URL; form state is
local; nothing else is shared. Redux or Zustand here would be ceremony — and ceremony at small scale
is the same category of mistake as loading 55 scripts to do the work of five.

---

## D-015 · Project filter state lives in the URL
**Date:** 2026-08-31 · **Status:** ACCEPTED

**Reasoning.** Makes filtered views shareable (a salesperson can send a client Vedanjay's 132 kV
work), makes the back button behave correctly, survives refresh, and lets service pages deep-link
into pre-filtered views (`/projects/?service=liaisoning`). Client-side filtering of 52 rows needs no
server round-trip.

---

## D-016 · Content as local JS data modules behind an accessor layer
**Date:** 2026-08-31 · **Status:** ACCEPTED

**Options.** (a) Content in JSX. (b) Local structured data modules. (c) Headless CMS from day one.

**Chosen.** (b), with all consumption through accessor functions in `data/index.js`.

**Reasoning.** Content in JSX is exactly how the legacy site froze in 2017. A CMS is premature —
content is stable, no editing cadence has been demonstrated, and review of content changes is
*desirable* while 20 fact-register items remain unverified. The accessor layer is the seam that makes
a later CMS migration a rewrite of one file rather than of every page.

**Trade-offs.** Content edits require a developer and a deploy. Acceptable now; the migration path is
documented in `data-flow.md §6`.

---

## D-017 · Minimal backend — three endpoints, no database
**Date:** 2026-08-31 · **Status:** ACCEPTED

**Chosen.** `POST /api/enquiries`, `POST /api/downloads/profile`, `GET /api/health`. Email
notification only; no persistence.

**Reasoning.** The requirement is that a human at Vedanjay learns about an enquiry and can reply.
Email satisfies that. A database would add a managed instance, migrations, backups and a DPDP Act
retention obligation to store records nobody has a workflow to read. Newsletter and career uploads
are deferred for the same reason as D-006. The service layer is written so persistence is a one-line
addition (`backend-architecture.md §4`).

**Trade-offs.** No enquiry analytics or history beyond the inbox. **Trigger to revisit:** the client
asks how many enquiries arrived last month, or wants a CRM.

---

## D-018 · Fix the contact form gap as the highest-priority functional change
**Date:** 2026-08-31 · **Status:** ACCEPTED

**Reasoning.** The legacy site has **no contact form on any page**, despite the theme shipping
`bootstrapValidator.min.js`. Every enquiry requires the visitor to hand-compose an email. Combined
with no CTA on nine of eleven pages, this is the highest direct commercial cost in the audit. The
`EnquiryForm` carries intent through the query string so a visitor never re-states what the
originating page already knows, and the backend routes by intent to five separate inboxes.

---

## D-019 · Remove personal contact details from public pages
**Date:** 2026-08-31 · **Status:** ACCEPTED

**Reasoning.** The legacy `team.html` publishes three personal mobile numbers and three individual
emails in plain text — a spam-harvesting liability with no upside. `PersonCard` replaces these with a
"Contact {name}" action routing through the enquiry form with a "for the attention of" field.

**Trade-offs.** Slightly more friction for a visitor who wants to call a specific person. The main
office number remains prominent and tap-to-call sitewide.

---

## D-020 · No dark mode at launch
**Date:** 2026-08-31 · **Status:** DEFERRED

**Reasoning.** A marketing site with an already-dark designed ground, viewed mostly in daylight on
mobile. A second theme doubles the visual QA surface for no measurable benefit. Because every colour
is consumed through a semantic alias, adding it later is a redefinition of the alias block, not a
component rewrite.

---

## D-021 · JavaScript rather than TypeScript
**Date:** 2026-08-31 · **Status:** ACCEPTED (constraint from the brief)

**Reasoning.** The brief specifies JavaScript. Mitigated with JSDoc annotations on `data/` shapes and
shared component props, `checkJs` for editor-level checking, PropTypes on shared components, and
ESLint `no-restricted-imports` to enforce the `components/` ↛ `data/` boundary that types would
otherwise guard.

**Trade-offs.** No compile-time guarantee on the required-prop rules (`alt`, `asOf`, `label`) that the
accessibility strategy depends on. PropTypes catch these at runtime in development; they are also
covered by lint rules and tests. Recorded honestly as the main cost of this constraint.

---

## D-022 · No search function
**Date:** 2026-08-31 · **Status:** DEFERRED

**Reasoning.** 19 pages with five clear navigation items. Search would add an input, an index, an
empty state and a results template to maintain, to solve a findability problem the navigation already
solves. **Trigger to revisit:** Insights ships and the page count exceeds ~40.

---

## D-023 · Real work photography as the primary art direction
**Date:** 2026-08-31 · **Status:** ACCEPTED · **BLOCKED on `TO VERIFY` #19**

**Reasoning.** All five comparators use interchangeable stock imagery. Vedanjay has 52 executed works
at real substations — 132 kV bays, telemetry cabinets, metering yards, SLDC terminals. Real
photography of unglamorous technical work is categorically different from anything in the sector and
proves presence in a way no claim can. This is the highest-impact single investment available
(differentiation move #3).

**Trade-offs.** Depends entirely on the client owning or being able to commission photography.
**Documented fallback:** a technical-diagram-led direction — single-line diagrams, grid schematics
and coverage maps in copper linework on graphite — treated as a deliberate system. Still
differentiated, meaningfully less powerful. The risk is stated in `gap-analysis.md §7` rather than
discovered during build.

---

## D-024 · Performance and accessibility budgets fail the CI build
**Date:** 2026-08-31 · **Status:** ACCEPTED

**Chosen.** Initial JS <120 KB gz · CSS <25 KB gz · total page <600 KB · LCP <2.5s · CLS <0.05 ·
Lighthouse a11y ≥95 · axe clean. **All hard failures, not warnings.**

**Reasoning.** The legacy site did not become a 56-script page in one commit; it drifted there over
nine years. A budget that only warns is a budget that is eventually ignored. Hard failure is the only
mechanism that reliably prevents that drift.

**Trade-offs.** Occasionally a legitimate change will be blocked and require a budget conversation.
That conversation is the point.

---

## D-033 · Bootstrap 5 + custom CSS; Tailwind removed
**Date:** 2026-08-31 · **Status:** ACCEPTED (client direction) · **Supersedes part of D-013**

**Context.** The client directed a stack change: Bootstrap 5 and custom CSS, explicitly no Tailwind.

**Chosen.** Bootstrap's **grid and utilities only** (`bootstrap-grid.min.css` +
`bootstrap-utilities.min.css`), with a complete custom visual layer on top.

**Reasoning.** Every component on the site (buttons, nav, cards, hero) is purpose-built, so importing
full Bootstrap would ship ~160 KB of unused component CSS and invite the "generic Bootstrap template"
look the brief rejects. Grid + utilities gives the responsive foundation the client asked for at
23 KB gzipped total CSS including our own system.

**Trade-offs.** Design tokens live in plain CSS custom properties rather than a framework theme;
this is arguably cleaner and made the light/dark work simpler. Bootstrap 5.3's native
`data-bs-theme` attribute is reused as the theme switch, so the theme contract is standard.

---

## D-034 · Hero: rotating photography, not video
**Date:** 2026-08-31 · **Status:** ACCEPTED

**Context.** The brief asked for a large, "constantly changing" hero visual and left the medium open —
carousel, video, or another approach — asking that the choice follow from the business.

**Options.** (a) Cinematic video with image fallback. (b) Rotating full-bleed stills. (c) Single static image.

**Chosen.** (b) — four full-bleed stills on a 6.5s cross-dissolve with a slow scale drift.

**Reasoning.** Vedanjay's subject matter is **static infrastructure** — substation switchyards, feeder
bays, metering cabinets, module arrays. It photographs far better than it films; there is no motion
in the work itself to justify video. Four optimised stills cost roughly 1.1 MB total with only the
first loaded eagerly, against several megabytes for even a short loop, with no autoplay, battery or
mobile-data penalty. The rotation pauses on hover, on focus, when the tab is hidden, and becomes a
single static frame under `prefers-reduced-motion`.

**Trade-offs.** Less immediately arresting than good drone footage. Revisit if the client commissions
site videography.

---

## D-035 · Brand palette taken from the actual logo; copper direction dropped
**Date:** 2026-08-31 · **Status:** ACCEPTED (client direction) · **Supersedes D-007**

**Context.** The client directed that the existing Vedanjay identity — green, blue, white — be
preserved and modernised rather than replaced. D-007 had proposed a graphite/copper direction.

**Method.** Rather than guessing, the company's actual logo (`img/logo.png`) was downloaded and its
pixels sampled. The dominant values are:

| Sampled | Role |
|---|---|
| `#40A040` | Brand green (dominant mark colour) |
| `#004048` | Deep petrol blue — the "blue" in the identity |
| `#F87820` | Energy amber — accent in the sun motif |

**Chosen.** A full scale built on those three, plus cool blue-tinted neutrals. Interactive greens use
the AA-safe steps (`#35853A` on white, `#58B058` on dark), never the raw brand green, which is only
3.32:1 on white. Amber fills always take dark text — white on amber is 2.73:1 and fails outright.

**Reasoning.** The amber was a genuine find: it is already in the mark, it supplies the warmth the
copper direction was reaching for, and it keeps the site recognisably Vedanjay. Every shipped pairing
was computed against the WCAG relative-luminance formula, not estimated.

**Trade-offs.** Green sits closer to the sector norm than the copper direction would have. The
differentiation now rests on photography, editorial layout and the repeat-business content rather
than on palette alone.

---

## D-036 · Light and dark themes, with a no-flash boot
**Date:** 2026-08-31 · **Status:** ACCEPTED

**Chosen.** Both themes ship. An inline script in `index.html` resolves the theme **before first
paint** — stored choice first, else `prefers-color-scheme` — and stamps `data-bs-theme` on `<html>`.
The OS preference is followed until the user makes an explicit choice, after which the choice sticks.

**Reasoning.** Applying the theme from React would flash the wrong theme on every load. Transitions
are suppressed for the first two frames (`.vp-theme-booting`) so boot is instant rather than a fade,
and the same class is reapplied during a toggle so the switch reads as one deliberate change.

**Note.** Dark-ground sections (hero, projects, numbers, closing CTA) keep their cinematic treatment
in **both** themes. They carry a `.vp-on-dark-ground` class that re-points the text tokens; without
it they inherit near-black type from the light theme and go invisible — a bug found and fixed during QA.

---

## D-037 · Temporary photography: Unsplash, with a swappable media registry
**Date:** 2026-08-31 · **Status:** ACCEPTED · **Revisit on client photography**

**Context.** The client asked for relevant high-quality imagery now, to be replaced with real Vedanjay
photographs later.

**Sourcing.** Wikimedia Commons and Openverse were tried first and rejected: category and keyword
relevance was poor enough that slots filled with wrong subjects (a shopfront for "grid", an apartment
block for "utilities", empty fields for solar). Unsplash was used instead — subject accuracy is far
higher and the Unsplash License permits commercial use without attribution.

**Implementation.** All 18 images are declared in `frontend/src/data/media.js` keyed by **slug**, with
`alt` and a `focal` point per image. No component references a file path. Swapping in real photography
is: drop the file into `public/images/`, update `src` and `alt` on that one entry. Files are re-encoded
locally to ≤1800px plus a ≤1000px `sm/` variant wired into a `srcset`.

**Two images were replaced during QA** after review showed polluting smokestacks under "Industry" and
"Utilities" — the wrong signal for a renewable-energy consultancy.

**Provenance** is recorded in `frontend/public/images/CREDITS.json`. These are development
placeholders, not brand assets.

---

## D-038 · Register counts are asserted in development
**Date:** 2026-08-31 · **Status:** ACCEPTED

**Context.** QA caught the homepage publishing "All 53 projects" — the hand-written category
breakdown in `data/projects.js` summed to 53 against a 52-row register (Electrical Infrastructure
recorded as 19 rather than 17; O&M as 7 rather than 8, its two spellings not combined). The same
error had propagated into `docs/06-content/company-facts.md §9`. Both are corrected.

**Chosen.** `REGISTER_TOTAL` is now the single published figure, and a development-only assertion
fails loudly if `registerBreakdown` stops summing to it.

**Reasoning.** This is precisely the class of defect the whole verification discipline exists to
prevent — a plausible, unverified number reaching the page. A hand-maintained breakdown feeding a
headline figure needed a machine check, not care.

---

## Open decisions — blocked on client input

| ID | Decision | Blocked on |
|---|---|---|
| D-025 | Final homepage statistics (which four, and their dates) | `TO VERIFY` #1–#4 |
| D-026 | Whether the QCA credential leads the hero proof strip | `TO VERIFY` #5 |
| D-027 | Whether `/about/partners/` ships at all | `TO VERIFY` #7 (enercast currency) |
| D-028 | Whether client logos may be displayed | `TO VERIFY` #8 |
| D-029 | One office or two on Contact | `TO VERIFY` #9 |
| D-030 | Which registered address is correct (452008 vs 452001) | `TO VERIFY` #10 |
| D-031 | Art direction: photography or diagrams | `TO VERIFY` #19 |
| D-032 | Whether `/careers/` ships in Phase 2 | `TO VERIFY` #17 |

---

## Related

- [Research summary](../00-summary/research-summary.md) · [Company fact register](../06-content/company-facts.md)
