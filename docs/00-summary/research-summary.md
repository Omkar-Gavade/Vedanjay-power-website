# Research Summary

**Vedanjay Power Pvt. Ltd. — Research, Information Architecture, UI/UX & React Architecture**
**Phase 1–4 · 2026-08-31**

---

## Executive summary

Vedanjay Power is a considerably better company than its website suggests.

The audit found a firm with a **regulator-granted QCA licence in three states**, an **'A' class
electrical contractor licence**, **52 named executed works** at 220/132/33 kV for named utilities and
IPPs, **41 named clients** including Tata Steel, Siemens Gamesa, Suzlon, Vikram Solar, Waaree, Tata Power
Solar and ReNew, a **German technology partnership**, and **documented repeat business** from the
largest names in Indian renewables. It has been incorporated since 2011.

It presents all of this on a 2017 Bootstrap 3 theme that loads 56 script tags and three separate
slider libraries, has **no contact form on any page**, gives **five of its six services no URL at
all**, serves 57 images with **zero alt text**, and renders its mobile hero headline clipped
mid-word as "We are the Profes…".

The central finding of the research is a reframing. The five comparators named in the brief —
Waaree, Tata Power, Vikram Solar, ReNew, Suzlon — are **not Vedanjay's competitors. Four of the five
are its clients.** They are asset owners and manufacturers; Vedanjay is the services firm they hire
to get their plants approved, connected, metered and scheduled. Copying their information
architecture would force Vedanjay to compete on portfolio scale, where it is weakest, and would hide
regulatory access and repeat business, where it is strongest.

**The recommended direction:** rebuild as a services-led site on the DNV model — one indexable page
per service line — differentiated by three things no competitor in this category does: real
photography of actual technical work, copy that names the buyer rather than the energy transition,
and visible repeat business.

---

## Existing website findings

**The measured state** (all figures verified 2026-08-31):

| | |
|---|---|
| Pages | 11, flat `.html`, no CMS |
| Script tags on homepage | **56** (55 executing) |
| Stylesheets | **18** |
| Slider libraries loaded | **3** (Slider Revolution ×11 files, LayerSlider + GreenSock, RoyalSlider) |
| Icon library | `livicons` — **609 KB of JavaScript** |
| Hero images | 1.47 MB and 1.04 MB JPEGs, no `srcset`, no lazy loading |
| Images with alt text | **0 of 57** |
| `<h1>` on homepage | **3** |
| `<html lang>` | Absent |
| Open Graph / canonical / structured data | **All absent** |
| Meta description | The literal string "Vedanjay Power Pvt. Ltd." |
| Broken requests on homepage | 3 × HTTP 404 (visible as broken-image placeholders in the mobile hero) |
| jQuery | 3.0.0 loads; 1.9.1 requested and **404s** — the plugin suite was written for 1.9 |
| Webfont | Arimo, requested over `http://` on an HTTPS page — **blocked as mixed content, never renders** |
| External download links | **15 of 22 return HTTP 503** |
| Copyright year | Hard-coded **2017** |

**The top ten defects, ranked by commercial cost**, are listed in
[`existing-website-audit.md §10`](../01-research/existing-website-audit.md). The first four:

1. **No contact form anywhere.** Every lead must be hand-composed as an email.
2. **Five of six services have no URL** — invisible to search, unlinkable, unmeasurable.
3. **No CTA on nine of eleven pages.** Persuasion happens, then leads nowhere.
4. **Mobile hero is broken** — clipped headline, broken images, a ~10px untappable CTA.

**What the legacy site does well, and must not be lost:** the services copy is written by
practitioners who know the domain (SLDC synchronisation, ABT/AMR compliance, CEIG approvals, REC
issuance, BOOT/BOT, CAPEX vs RESCO); the 52-row project register is specific and checkable; the
client roster is genuinely impressive; and the Industry/Commercial/Utilities/RE segmentation instinct
is better than anything observed at the comparators — it is simply never built out.

---

## Competitor findings

**Group A — the five named (sector craft references).**

| Site | Strongest transferable idea |
|---|---|
| **ReNew** | Six intent-named nav items; a *named* statistics block; the framed statistic — "9% of India's renewable energy generation" |
| **Suzlon** | Capability-first homepage with no decorative hero; **"1,900+ industrial clients"** — a client count, which is the natural proof for a services firm |
| **Vikram Solar** | **"as of March 31, 2025"** attached to a statistic — the single best credibility practice observed |
| **Tata Power** | Horizontal-scroll solutions rail; every statistic tied to a human or civic outcome |
| **Waaree** | Dual-axis entry — by product *and* by application |

**Group B — the structural reference. DNV** (`dnv.com/energy`) is the closest analogue that exists:
an independent energy advisory and assurance firm selling technical due diligence, grid-code
compliance and regulatory certification. Its IA is services-led and granular — **every individual
service has its own indexable URL**, with breadcrumbs, tagging and a second navigation axis. This is
the model.

**The sector's uniformity is the opportunity.** Three of five use teal-green. Four of five lead with
an undated capacity figure. **Five of five use interchangeable stock photography. Five of five
address "the energy transition" in the abstract and never name the buyer.**

---

## Industry UX trends

1. **Services firms are converging on granular, individually-indexed service pages** (DNV). The
   service page is the product page.
2. **Dated, sourced statistics** are becoming the credibility differentiator as audiences discount
   round marketing numbers.
3. **Intent-named navigation** is replacing org-chart navigation.
4. **Carousels and tickers are being abandoned** — and remain a WCAG 2.2.2 problem.
5. **Editorial case studies with real photography** are standard in engineering consultancy
   (Arup, Mott MacDonald, AFRY) and **absent from Indian renewables**.
6. **Motion is contracting.** Premium now reads as restraint: short, purposeful transitions, no
   parallax, no page-transition overlays.

---

## Opportunities

Ranked by impact. All are already true of the company; none require inventing anything.

| # | Opportunity | Why it wins |
|---|---|---|
| 1 | **Give each of six services its own page** | Unlocks the queries Vedanjay's buyers actually type — "QCA Maharashtra", "CEIG approval consultant MP", "SLDC synchronisation" — none of which it can rank for today |
| 2 | **Add a contact form with intent routing** | Fixes the largest direct commercial gap; five routed inboxes |
| 3 | **Photograph the real work** | 52 executed works at real substations. No competitor does this. Highest-impact single investment |
| 4 | **Lead with the QCA licence** | A regulator-granted, externally checkable status held in three states — currently one unstyled sentence below the fold |
| 5 | **Make repeat business visible** | MPPTCL ×7, Suzlon ×7, ReNew ×5, Vikram Solar ×4, Tata Power Solar ×4. Strongest signal in professional services; **no competitor publishes it** |
| 6 | **Name the buyer** | Segment pages opening on the reader's situation. The whole sector talks past the individual |
| 7 | **Make the 52-row register explorable** | Best asset, worst presentation |
| 8 | **Show leadership faces and credentials** | A firm whose pitch is "backed by technocrats" currently shows no faces |
| 9 | **Escape the sector's teal convergence** | Graphite + evergreen + **copper** — the metal of conductors |
| 10 | **Write case studies** | 4–6 photographed, written engagements would put Vedanjay ahead of every Indian firm in its category |

---

## Problems to solve

**Structural:** six services on one URL · no contact form · no CTA on nine pages · no segment pages ·
52-row table unusable on mobile · navigation weight inverted against commercial value.

**Credibility:** contradictory statistics (100 vs 110 MW; 700 MW vs 30 MW) · undated everything ·
QCA and licence buried in body copy · no leadership faces · 15 dead download links · awards all
pre-2019 · copyright frozen at 2017.

**Technical:** 56 scripts · three slider libraries · 609 KB icon JS · 2.5 MB hero JPEGs · webfont
blocked by mixed content · 404 on a core script · `cache-control: max-age=3600` on immutable assets.

**Accessibility:** 0/57 alt attributes · no `lang` · three `<h1>` · keyboard-inoperable service tabs ·
suppressed focus states · white text on unoverlaid photography · touch targets far below 44px.

**Mobile:** hero headline clipped mid-word · broken-image placeholders in the hero · ~10px CTA ·
centred full-width body copy · slider caption wrapper 800px wide in a 375px viewport.

---

## Recommended direction

**Position.**
> Vedanjay Power is the firm that gets renewable energy projects approved, connected, metered and
> scheduled — and keeps them running.

Not a generator, not a manufacturer, not an "energy transition partner". The specialist that asset
owners hire for the regulatory and grid-interface layer between a built plant and a revenue-earning
one. The five largest names in the sector already agree — they hire Vedanjay to do exactly this.

**Information architecture.** 19 pages. Five nav items plus a distinct action. Two axes into the
offer: six service pages and four segment pages. A filterable 52-row project register plus 4–6 case
studies. Credentials as a procurement-facing page.
→ [`sitemap.md`](../02-information-architecture/sitemap.md)

**Design.** *Instrument-grade* — measured, exact, unexaggerated. Graphite ink ground, deep evergreen
primary, **copper** accent at 3–5% coverage, warm paper surfaces. **Archivo** for display and text,
**IBM Plex Mono** for statistics and technical figures, so numbers read as instrument readouts. 2px
radius, hairline borders, no resting shadows. Real photography of actual technical work.
Four motion patterns, nothing over 600ms, under 3 KB of animation JavaScript.
→ [`ui-ux-direction.md`](../03-design/ui-ux-direction.md)

**Architecture.** React + Vite + Tailwind, statically pre-rendered — same SEO as SSR with no server
runtime. Content as structured data behind an accessor layer, so a CMS migration later touches one
file. Filter state in the URL. No Redux, no GraphQL, no SSR framework, no animation library, no
component library. A three-endpoint Express backend with no database. Budgets fail the CI build.
→ [`frontend-architecture.md`](../04-architecture/frontend-architecture.md)

---

## Risks

| Risk | Severity | Mitigation |
|---|---|---|
| **Contradictory statistics ship as-is** | High | Content freeze blocked on `TO VERIFY` #1–#4. `asOf` is a required prop; `getStats()` filters on a verified flag, so the homepage degrades to three statistics rather than publishing an unsourceable fourth |
| **No real photography available** | High | Differentiation move #3 collapses. Documented fallback: technical-diagram-led direction (single-line diagrams, schematics, coverage maps in copper linework). Still differentiated, meaningfully less powerful |
| **QCA registration lapsed or narrower than claimed** | High | It is the lead credential. Blocked on `TO VERIFY` #5 before hero copy is finalised |
| **Content maintenance stops after launch** | High | The exact failure that produced the current site. Every record carries an "as at" date; Insights and Careers deferred until owners are named; CMS path documented |
| Client logo permissions unobtainable | Medium | Fall back to unbranded descriptors; the project register text stands on its own |
| enercast partnership lapsed | Medium | Blocked on `TO VERIFY` #7; the Forecasting page is written to stand without it |
| Leadership will not supply photos and bios | Medium | `PersonCard` works with initials monograms, but the credibility cost is real and flagged |
| Copper accent rejected by the client | Medium | Reasoning is documented in D-007; the palette architecture makes an accent change a token edit |
| Over-engineering a 19-page site | Medium | Deliberate exclusions recorded in D-013, D-014, D-017 |
| Scope creep into Careers/Insights before owners exist | Medium | D-006; navigation sized to absorb both later without restructuring |

---

## Open questions — `TO VERIFY`

**20 items** are registered in [`company-facts.md §13`](../06-content/company-facts.md).
**Ten are launch-blocking:**

1. Reconcile 100 MW vs 110 MW open-access figure, with date
2. Evidence for the 2,000 MW forecasting portfolio, with date
3. Reconcile 700 MW commissioned vs +30 MW O&M; confirm each scope
4. Exact client count, with date
5. QCA certificates and registration numbers for MH, TG, MP — **the lead credential**
6. 'A' class electrical licence number, issuing authority, validity
7. Is the enercast GmbH cooperation still active?
8. Logo usage permission for all 41 client logos
9. Pune office address, or remove the two-office claim
10. Correct registered address and PIN (452008 vs 452001 — the site and the MCA record disagree)

Non-blocking but high value: ISO/GST/Udyam registrations · recognition after 2019 · leadership photos
and bios · project dates and durations for the 52-row register · whether owned site photography
exists · whether live vacancies exist.

**Recommendation:** send items 1–10 to the client as a single questionnaire now. They gate the
homepage hero, the statistics block and the credentials page — the three highest-value surfaces on
the site — and everything else can proceed in parallel.

---

## Deliverables from this phase

| Area | Documents |
|---|---|
| **Research** | [Existing website audit](../01-research/existing-website-audit.md) · [Competitor analysis](../01-research/competitor-analysis.md) · [Pattern matrix](../01-research/competitor-patterns.md) · [Gap analysis](../01-research/gap-analysis.md) |
| **Information architecture** | [Sitemap](../02-information-architecture/sitemap.md) · [User journeys](../02-information-architecture/user-journeys.md) · [Page specifications](../02-information-architecture/page-specifications.md) |
| **UI/UX** | [Direction](../03-design/ui-ux-direction.md) · [Design system](../03-design/design-system.md) · [Colour](../03-design/color-system.md) · [Typography](../03-design/typography.md) · [Spacing & grid](../03-design/spacing-grid.md) · [Components](../03-design/components.md) · [Navigation](../03-design/navigation.md) · [Motion](../03-design/motion-system.md) · [Responsive](../03-design/responsive-strategy.md) |
| **Architecture** | [Frontend](../04-architecture/frontend-architecture.md) · [Backend](../04-architecture/backend-architecture.md) · [Data flow](../04-architecture/data-flow.md) · [Deployment](../04-architecture/deployment-architecture.md) |
| **Decisions** | [Decision log](../05-decisions/decision-log.md) — 24 decisions, 8 open |
| **Content** | [Company fact register](../06-content/company-facts.md) · [Project register](../06-content/project-register.md) — 52 rows |

---

## Recommended next steps

1. **Send `TO VERIFY` #1–#10 to the client** as a single questionnaire. This is the critical path.
2. **Resolve the art-direction question** (#19) — it determines the visual identity and has the
   longest lead time if a photography shoot is required.
3. **Client review of the design direction**, particularly the copper accent (D-007) and the removal
   of Sustainability from the sitemap (D-005).
4. **On approval:** scaffold the frontend, implement the token layer and the component primitives,
   then build the Home and service-page templates first — they carry the two highest-value journeys.
