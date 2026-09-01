# Pattern Extraction Matrix

Every row states **what was actually done**, **why it works**, **what user problem it solves**,
**whether Vedanjay adopts it**, and **how Vedanjay improves on it**.

Priorities: **MUST HAVE** (launch-blocking) · **SHOULD HAVE** (launch if budget allows) ·
**NICE TO HAVE** (post-launch) · **AVOID** (researched and rejected).

---

## A. Information architecture

| # | Pattern | Source | Why it works | User problem solved | Vedanjay adaptation | Priority |
|---|---|---|---|---|---|---|
| A1 | **One indexable page per service**, each with scope, deliverables and its own CTA | DNV | The service page *is* the product page in a services business: the SEO unit, the sales-collateral unit, the analytics unit, the URL you paste into an email | "I need a CEIG approval consultant in MP" — currently no page exists that can answer, or rank | Six service pages under `/services/`, each ~800–1,200 words, each with scope, process, deliverables, evidence, FAQ, enquiry form. Replaces the jQuery show/hide that hides five of six services | **MUST HAVE** |
| A2 | **Intent-named navigation**, not org-chart-named | ReNew ("Work With Us", "Leading Sustainably", "Business Enquiries") | Labels match how visitors think, not how the company is structured | Visitor cannot map their need onto internal terminology | Replace "Cooperation Partner" and "Meet Our Team" with intent labels; see `docs/03-design/navigation.md` | **MUST HAVE** |
| A3 | **Six top-level nav items maximum** | ReNew (6) vs Vikram Solar (9), legacy Vedanjay (7 with inverted weight) | Beyond ~7 items, scanning cost rises and every item loses salience | Cannot find services because they share one slot with a single-partner page | 5 primary + 1 CTA. Services gets a mega-menu; Partners and Awards are demoted into pages | **MUST HAVE** |
| A4 | **Dual-axis entry into the offer** (by product **and** by application) | Waaree | Buyers arrive knowing either *what they need* or *who they are* — serve both doors | An HT factory manager doesn't know the phrase "open access consultancy"; they know they overpay for power | Axis 1: by service (6). Axis 2: by segment — Industry · Commercial · Utilities & DISCOMs · RE Generators & IPPs. Builds out the legacy site's best unexploited instinct | **MUST HAVE** |
| A5 | **Breadcrumbs on every inner page** | DNV | Orients deep-linked arrivals from search; supplies `BreadcrumbList` structured data | Arriving on a service page from Google with no sense of position | Breadcrumb component on every page below top level, with JSON-LD | **SHOULD HAVE** |
| A6 | **Second navigation axis in the footer** (by service type, by content type) | DNV | Gives the footer a job beyond legal links; catches users who exhausted the header | Dead-end at page bottom | Footer as a genuine sitemap: services, segments, company, resources, contact | **SHOULD HAVE** |
| A7 | Deep product-catalogue mega-menu | Waaree | Correct for SKUs — Vedanjay has none | — | **Rejected.** Would manufacture false complexity | **AVOID** |
| A8 | Full investor-relations tree | ReNew, Tata Power, Waaree, Vikram Solar | Correct for listed companies | — | **Rejected.** Vedanjay is unlisted (CIN `…PTC…` = private limited). Publishing an IR shell signals pretence | **AVOID** |

---

## B. Homepage & hero

| # | Pattern | Source | Why it works | User problem solved | Vedanjay adaptation | Priority |
|---|---|---|---|---|---|---|
| B1 | **Capability-first opening — no decorative hero** | Suzlon (opens straight into 5 offering cards) | For a buyer who already knows the category, a stock landscape wastes the most valuable screen in the site | "What do you actually do?" answered in one screen instead of three | Hero is a **statement of capability + proof**, not a mood. One headline naming the actual business, one sub-line, two CTAs, and a QCA/licence proof strip immediately beneath | **MUST HAVE** |
| B2 | **Named statistics section** ("Our Green Footprint", "Our Revolution in Numbers") | ReNew, Vikram Solar | Naming the block frames the numbers as a claim rather than decoration | Numbers floating without meaning | "Vedanjay in numbers" — **four** reconciled, dated figures. Fewer than competitors, deliberately: four defensible numbers beat eight contradictory ones | **MUST HAVE** |
| B3 | **Dated statistics** — "as of March 31, 2025" | Vikram Solar | A date converts a marketing number into an auditable one | Reader discounts every undated figure | Hard rule: every statistic renders with an "as at" date from the content layer. Directly fixes the legacy site's 100-vs-110 MW and 700-vs-30 MW contradictions | **MUST HAVE** |
| B4 | **Framed statistic** — "9% of India's renewable energy generation" | ReNew | Reframes an absolute number as a position claim, which is far more memorable | 22,185 GWh means nothing to a non-specialist | Frame Vedanjay's figures against something legible: e.g. "QCA-registered in 3 states" is inherently framed — few firms hold it anywhere | **SHOULD HAVE** |
| B5 | **Client count as the headline metric** | Suzlon — "1,900+ industrial clients" | For a services firm, clients served is the natural proof; MW owned is not | Services firm has no portfolio to quote | Lead with clients served and projects executed (52 named works), not with generation capacity Vedanjay does not own | **MUST HAVE** |
| B6 | **Horizontal-scroll solutions rail** | Tata Power | Presents 5–6 peers compactly without a vertical wall of cards | Six services would otherwise consume a full screen each | Considered. **Deferred** — at six items a static 3×2 grid is more scannable, more accessible and needs no JS. Revisit only if service lines exceed eight | **NICE TO HAVE** |
| B7 | **Founder / leadership presence on the homepage** | ReNew (Sumant Sinha) | Attaches a face to institutional claims; converts "a firm" into "these people" | "Who am I actually dealing with?" | High value here, because the legacy site's central claim is "backed by technocrats" and it shows **no faces at all**. Requires client-supplied photography (`TO VERIFY` #13) | **SHOULD HAVE** |
| B8 | Rotating hero carousel / slogan slider | Vikram Solar, legacy Vedanjay | — | — | **Rejected.** Slides after the first are rarely seen; each dilutes the others; it is the direct cause of the legacy site's clipped mobile headline | **AVOID** |
| B9 | Scrolling announcement ticker below the nav | ReNew, legacy Vedanjay | — | — | **Rejected.** Motion competes with the headline, text clips at edges, non-pausable motion is a WCAG 2.2.2 failure. Legacy implementation clips mid-word at both ends | **AVOID** |
| B10 | 15-section homepage | Tata Power | — | — | **Rejected.** A conglomerate's problem. Vedanjay's homepage targets 9 sections | **AVOID** |
| B11 | Generic transition slogan as H1 | Waaree ("Accelerating Global Energy Transition"), Vikram Solar ("Creating Climate for Change") | — | — | **Rejected.** Interchangeable across the whole sector. Vedanjay's H1 must state something only Vedanjay could say — regulatory access and grid connection, not planetary ambition | **AVOID** |

---

## C. Proof & credibility

| # | Pattern | Source | Why it works | User problem solved | Vedanjay adaptation | Priority |
|---|---|---|---|---|---|---|
| C1 | **Projects as written case studies** with real photography, client problem, approach, outcome | Arup / Mott MacDonald / AFRY category practice | Proves capability by demonstration rather than assertion; the single largest differentiator available | "Have you done my job before, for someone like me?" | Convert 4–6 of the 52 works into full case studies — e.g. the 29.4 MW Suzlon telemetry + SLDC synchronisation, the 10 MW Refex CEIG-to-commissioning, the 52 km ReNew 33 kV O&M. **No Indian firm in this category does this** | **MUST HAVE** |
| C2 | **Filterable project register** | DNV (tagged, filterable, searchable service grid) | Makes a large dataset explorable rather than exhausting | 52 rows in a raw table are unreadable, especially on mobile | Filter by service, segment, technology, voltage class and state; card layout on mobile, table on desktop. Data already exists and is captured in `docs/06-content/project-register.md` | **MUST HAVE** |
| C3 | **Global-presence map** as a credibility device | Suzlon (17 countries) | Spatialises reach faster than any list | "Do you operate where my asset is?" | Vedanjay's honest equivalent: an **India state map** highlighting QCA registration (MH, TG, MP) and executed-project states. Truthful about scope while making three-state regulatory coverage look like the asset it is | **SHOULD HAVE** |
| C4 | **Repeat-business made visible** | *Not done by any site researched* — an original opportunity | Repeat purchase is the strongest possible quality signal in professional services | Logo wall proves contact, not satisfaction | Surface order counts per client (MPPTCL ×7, Suzlon ×7, ReNew ×5, Regen Powertech ×4, Vikram Solar ×4, Tata Power Solar ×4). Already true in the data and completely invisible today | **SHOULD HAVE** |
| C5 | **Credentials block** (licences, registrations, certifications) | DNV (certification-led positioning) | Third-party-granted status outranks self-description | "Are you actually allowed to do this?" | QCA registration in 3 states + 'A' class electrical licence + ISO, presented as verifiable credentials with numbers and validity — not as badges. Pending `TO VERIFY` #5, #6, #11 | **MUST HAVE** |
| C6 | Undifferentiated logo wall | All five | Weak — proves only that a logo was obtained | — | Retained but **upgraded**: normalised monochrome logos, grouped by the four segments, each group linking to segment-specific evidence. Plus 3 named client stories | **SHOULD HAVE** |
| C7 | Awards marquee ticker | Legacy Vedanjay | — | — | **Rejected.** Reframed as a dated Recognition timeline inside About. All awards are 2016–2019; a static dated list is honest, a scrolling ticker pretends to currency | **AVOID** |

---

## D. Navigation & interaction craft

| # | Pattern | Source | Why it works | User problem solved | Vedanjay adaptation | Priority |
|---|---|---|---|---|---|---|
| D1 | **Distinct primary CTA in the header**, visually separate from nav links | ReNew ("Business Enquiries") | Gives every page a persistent, unambiguous next step | Legacy site has no visually distinct CTA anywhere, and no CTA at all on 9 of 11 pages | Solid accent "Enquire" button, persistent across all breakpoints, present in the mobile drawer as a full-width action | **MUST HAVE** |
| D2 | **Transparent-over-hero → solid-on-scroll navbar** | Common premium practice; used across the sector | Maximises hero impact, then guarantees legibility and orientation | Nav either blocks the hero or becomes unreadable over imagery | Specified in full in `docs/03-design/navigation.md`, incl. the accessibility-safe fallback (never rely on transparency for contrast) | **MUST HAVE** |
| D3 | **Mega-menu with descriptions**, not bare link lists | DNV, ReNew | Lets the menu *sell*; descriptions pre-qualify the click | Six service names alone don't convey scope | Services mega-menu: 6 services in two columns, each with a one-line descriptor, plus a segment rail and a featured case study | **SHOULD HAVE** |
| D4 | **Live stock ticker in the navbar** | Waaree | Correct for a listed company | — | **Rejected.** Vedanjay is a private limited company | **AVOID** |
| D5 | **Scroll-reveal on section entry** | Sector-wide | Directs attention and paces a long page | Long pages read as flat walls | Adopted, but strictly bounded: opacity + 16 px rise, 400 ms, fires once, 60 ms stagger, fully disabled under `prefers-reduced-motion`. See `docs/03-design/motion-system.md` | **SHOULD HAVE** |
| D6 | **Animated number counters** on statistics | Tata Power, ReNew, Vikram Solar | Draws the eye to the most important claims on the page | Statistics get skimmed past | Adopted with guardrails: fires once on entry, ≤900 ms, `tabular-nums`, and **the final value is present in the DOM before animation** so it survives no-JS, screen readers and reduced-motion | **SHOULD HAVE** |
| D7 | Parallax backgrounds, cursor effects, page-transition overlays | Various premium sites | Rarely justifies cost | — | **Rejected at launch.** Fails the performance test in the brief's §23 quality bar; parallax additionally causes motion discomfort | **AVOID** |

---

## E. Content & tone

| # | Pattern | Source | Why it works | User problem solved | Vedanjay adaptation | Priority |
|---|---|---|---|---|---|---|
| E1 | **Name the buyer explicitly** | *Not done by any site researched* — an original opportunity | Sector copy addresses "the energy transition"; nobody addresses the person reading | An HT factory manager doesn't self-identify as a participant in an energy transition | Segment pages that open on the reader's actual situation — e.g. "You run an HT connection and your tariff keeps rising." Builds out the legacy Industry/Commercial/Utilities/RE instinct | **MUST HAVE** |
| E2 | **Preserve practitioner vocabulary** | DNV (unapologetically technical) | Domain-correct terminology *is* the credential to a technical buyer | Generalist marketing copy reads as an agency, not an engineer | Keep CEIG, SLDC, ABT, AMR, RTU, LTOA/MTOA/STOA, REC, DSM, grid code, BOOT/BOT, CAPEX/RESCO — with a glossary for non-specialists rather than dumbing the copy down | **MUST HAVE** |
| E3 | **Period-stamped content** (FY25) | ReNew | Signals a maintained site | A 2017 copyright line signals abandonment | Every statistic, case study and credential carries a date. Footer year is computed | **MUST HAVE** |
| E4 | **Insights / thought leadership** ("RE-Insights") | ReNew, DNV | Regulatory change is Vedanjay's actual product — commentary on it is the most natural content engine available | "Does this firm track the regulations that affect me?" | **Deferred to Phase 2.** A stale blog is worse than none — exactly the lesson of the legacy Downloads page. Architecture supports it from day one; content ships only with committed editorial ownership | **NICE TO HAVE** |
| E5 | Regulatory download library | Legacy Vedanjay | Genuinely useful *if maintained* | Clients need current state regulations | **Rejected in current form** — 15 of 22 links return HTTP 503. Rebuild only with an owner and a review cadence, else omit | **AVOID (as built)** |

---

## Summary — what gets built

**MUST HAVE (13):** A1 · A2 · A3 · A4 · B1 · B2 · B3 · B5 · C1 · C2 · C5 · D1 · D2 · E1 · E2 · E3
**SHOULD HAVE (10):** A5 · A6 · B4 · B7 · C3 · C4 · C6 · D3 · D5 · D6
**NICE TO HAVE (2):** B6 · E4
**AVOID (11):** A7 · A8 · B8 · B9 · B10 · B11 · C7 · D4 · D7 · E5

The three patterns that will differentiate Vedanjay most, in order:

1. **C1 — real photographed case studies.** No Indian firm in this category does it.
2. **E1 — naming the buyer.** The entire sector talks past the reader.
3. **C4 — visible repeat business.** Already true in Vedanjay's data; nobody surfaces it.

---

## Related

- [Competitor analysis](competitor-analysis.md)
- [Gap analysis](gap-analysis.md)
- [Navigation specification](../03-design/navigation.md)
- [Motion system](../03-design/motion-system.md)
