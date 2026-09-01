# Page Specifications

Every launch page specified to the same template: purpose · audience · user goal · sections ·
content hierarchy · CTAs · assets · interactions · SEO intent · mobile considerations.

`TO VERIFY` markers reference the register in [`docs/06-content/company-facts.md`](../06-content/company-facts.md).

---

# 1. Home — `/`

**Purpose.** Answer, in one screen, what Vedanjay does and why it can be trusted — then route each
audience to its own path.
**Target audience.** All six, weighted to Journeys 1–3.
**Primary user goal.** "Understand this firm in 15 seconds and find my path."
**SEO intent.** Brand queries + "renewable energy consultant India / Madhya Pradesh / QCA".

## Storytelling sequence — reasoned, not copied

The brief supplied a hypothesis sequence. It was tested against research and changed. The homepage
must answer the brief's six questions in the order a *sceptical technical buyer* asks them — and
crucially, **proof is moved up**, because Vedanjay's proof is stronger than its scale.

```
1  HERO — capability + proof strip          → Who are you? What do you do?
2  POSITIONING — what we actually do        → In concrete terms?
3  SERVICES — 6 cards                       → What can I buy?
4  PROOF IN NUMBERS — 4 dated stats         → What scale?
5  CLIENTS + REPEAT BUSINESS                → Who trusts you? ← differentiator
6  FEATURED CASE STUDY                      → Prove it on one job ← differentiator
7  INDUSTRIES — 4 segments                  → Which of these am I?
8  WHY VEDANJAY — credentials + partner     → Why you over anyone else?
9  CTA + FOOTER                             → What now?
```

**Nine sections** (Tata Power runs 15; Pattern B10 rejected).

**Deviations from the brief's hypothesis, with reasoning:**

| Change | Reasoning |
|---|---|
| Proof (5, 6) raised above Why-Vedanjay | Demonstration beats assertion. Vedanjay's client roster is more persuasive than any claim it can write about itself. |
| Sustainability section **removed** | No measured data exists (fact register §12). ESG boilerplate without metrics is the exact noise the gap analysis rejects. |
| News/insights **removed** at launch | Gated on an editorial owner. A stale feed is how the legacy site decayed. |
| Testimonials **removed** | None exist and none are `TO VERIFY`-able. Named repeat business is stronger anyway. |
| Capabilities merged into Services | Six service cards already state capability; a separate section would repeat it. |
| Industries moved *after* proof | A visitor self-selects a segment more readily once the firm is established as credible. |

## Section detail

### 1. Hero
- **Content hierarchy:** kicker → H1 → sub-line → CTAs → proof strip.
- **Kicker** (mono, uppercase, small): `RENEWABLE POWER CONSULTANCY · EST. 2011`
- **H1** — states what only Vedanjay could say (Pattern B11 rejects sector slogans):
  > **We get renewable projects approved, connected and scheduled.**
- **Sub-line:** Open access, grid connectivity, forecasting and O&M for India's renewable
  generators, utilities and industrial power buyers. QCA-registered in three states.
- **Primary CTA:** `Explore our services →` · **Secondary CTA:** `Talk to an engineer`
- **Proof strip** (immediately beneath, on the same screen) — the audit's #7 defect, fixed:
  `QCA · Maharashtra, Telangana, Madhya Pradesh` [TO VERIFY #5] │ `'A' class Electrical
  Contractor licence` [TO VERIFY #6] │ `52 executed works` │ `Est. 2011`
- **Assets:** one full-bleed photograph of **real Vedanjay work** — a 132 kV bay or telemetry
  cabinet (differentiation move #3; `TO VERIFY` #19). **Fallback:** deep ink ground with a fine
  single-line-diagram motif in copper. No stock turbines. **No carousel** (Pattern B8).
- **Interactions:** static image, no parallax. Text rises 16 px / fades on load, 400 ms, once.
- **Mobile:** H1 drops to 32 px; proof strip becomes a 2×2 grid; CTAs stack full-width;
  image crops to a 4:5 focal region. **Text must never overflow** — the legacy site's defining bug.

### 2. Positioning
- Two-column editorial: a 3–4 sentence statement, plus the four things Vedanjay does in plain terms.
- Source: legacy About copy, rewritten. Drop "more than 10 years" (stale) → "Established 2011".
- No CTA. Mobile: single column.

### 3. Services — 6 cards
- 3×2 grid desktop · 2×3 tablet · 1×6 mobile. Each card: mono numeral, name, one-line descriptor,
  `→`. Whole card is one link.
- CTA: `All services →`. Interaction: border and numeral shift to copper on hover; 150 ms.

### 4. Vedanjay in numbers  *(Pattern B2)*
- **Four** reconciled, **dated** figures. All blocked on `TO VERIFY` #1–#4.
  Proposed: `700+ MW commissioned` · `2,000 MW under forecasting` · `52 works executed` ·
  `50+ clients served`. Each renders with an "as at" date.
- Interaction: count-up on first entry, ≤900 ms, `tabular-nums`, **final value in the DOM before
  animation** (Pattern D6).
- Mobile: 2×2 grid.
- **Degradation rule:** if only three figures can be evidenced, the section renders three. It never
  ships a number that cannot be sourced.

### 5. Clients & repeat business  *(differentiator — Pattern C4)*
- Normalised monochrome logo grid (opacity 0.6 → 1.0 on hover), grouped by segment.
- **Beneath it, the line no competitor publishes:**
  > Suzlon has returned seven times. MPPTCL seven times. ReNew five times.
  > Regen Powertech, Vikram Solar and Tata Power Solar four times each.
- Assets: 41 logos re-cut to a uniform bounding box, monochrome (`TO VERIFY` #8).
- Mobile: 3-across grid, alphabetical, no hover state.

### 6. Featured case study  *(differentiator — Pattern C1)*
- Full-bleed asymmetric: large photograph left, content right. Client, capacity, scope, outcome.
- Proposed: **Suzlon — 29.4 MW wind — telemetry installation, AMR metering and SLDC synchronisation.**
- CTA: `Read the case study →` and `All 52 projects →`.
- Mobile: image above, content below; reduced type scale.

### 7. Industries — 4 segments
- Four cards: Industrial · Commercial · Utilities & DISCOMs · RE Generators & IPPs.
- Each opens on the **reader's problem**, not the service name (Pattern E1).
- Mobile: 2×2, then 1-up below 480 px.

### 8. Why Vedanjay
- Credentials block (QCA, 'A' class licence, ISO `TO VERIFY` #11, est. 2011, CIN) + the enercast
  GmbH partnership (`TO VERIFY` #7) + a state coverage map (Pattern C3).
- CTA: `Our credentials →`. Mobile: map becomes a simple state list.

### 9. Closing CTA
- Dark full-width band. `Tell us about your project` + phone + email. Two routes: enquiry form, direct call.

---

# 2. Services overview — `/services/`

**Purpose.** Route to the correct service; establish breadth.
**Audience.** J1, J2, J3. **Goal.** "Which of these do I need?"
**SEO intent.** "renewable energy consultancy services India".

**Sections.** Breadcrumb → H1 + intro → 6 service cards with 2–3 line descriptions →
"Not sure which you need?" segment cross-link → credentials strip → CTA.

**CTAs.** Primary per card (`Learn more →`); page-level `Talk to an engineer`.
**Interactions.** Card hover; staggered reveal (60 ms).
**Mobile.** Single column; descriptions truncate to two lines.

---

# 3. Service page — `/services/:slug` × 6  *(the most important template on the site)*

**Purpose.** Convert a search arrival into an enquiry. **This is the product page** (Pattern A1).
**Audience.** J1 primary; J2/J3 secondary. **Goal.** "Do you do exactly this, have you done it
before, and how do I start?"
**SEO intent.** The highest-value queries Vedanjay can own — *"QCA Maharashtra"*, *"CEIG approval
consultant MP"*, *"SLDC synchronisation"*, *"open access consultant"*, *"solar O&M India"*,
*"forecasting and scheduling DSM"*. **None of these has a page today.**

**Sections (fixed order across all six):**

```
Breadcrumb  ·  Home › Services › {Service}
H1 + one-line value statement
Overview                    ← legacy copy, edited, vocabulary preserved (Pattern E2)
What's included             ← scope checklist
How it works                ← numbered process, 4–6 steps
Deliverables                ← what the client receives
Evidence                    ← 3 project cards filtered to this service
Credentials                 ← licences relevant to THIS service
FAQ                         ← 4–6 questions (also feeds FAQPage schema)
Related services            ← 2–3 cross-links
Enquiry CTA                 ← scoped: "Enquire about {Service}"
```

**Per-service specifics:**

| Slug | Lead credential | Key evidence | Distinctive content |
|---|---|---|---|
| `open-access` | QCA registration | Tata Steel, Mahindra, Kirloskar, IPCA, Radisson | LTOA/MTOA/STOA explainer; REC issuance in MP; tariff-saving mechanism |
| `forecasting-scheduling` | **QCA in 3 states** [TO VERIFY #5] | 2,000 MW under forecasting [TO VERIFY #2] | enercast GmbH partnership [TO VERIFY #7]; 72-hour forecasts; DSM penalty avoidance |
| `liaisoning` | 700+ MW commissioned [TO VERIFY #3] | Suzlon 29.4 MW; Refex 10 MW | CEIG · DISCOM · grid connectivity · SLDC sync · telemetry/RTU · net metering |
| `electrical-infrastructure` | **'A' class licence** [TO VERIFY #6] | MPPTCL 220/132 kV bays; KEC 132/25 kV traction | Voltage classes; ABT/AMR/telemetry compliance; civil + erection |
| `rooftop-solar` | — | Waaree/Tata Power Solar CEIG mandates | CAPEX vs RESCO/OPEX comparison table; 0.10 kW–100 kW+ ranges; BOOT/BOT |
| `operations-maintenance` | RE Assets Gold Award | ReNew 52 km + 18 km 33 kV O&M; 405 kWp | Preventive/corrective/predictive matrix; solar vs wind scope; PR guarantees |

**Assets.** One hero image per service (real work preferred); process diagram; 3 project thumbnails.
**Interactions.** Sticky in-page section nav on desktop ≥1024 px; accordion FAQ; scroll reveal.
**Mobile.** In-page nav becomes a horizontally scrollable chip row pinned under the header;
process steps become a vertical timeline; enquiry CTA repeats after Evidence *and* at page end.

---

# 4. Industries overview — `/industries/`

**Purpose.** Second door into the offer (Pattern A4). **Audience.** J2 primary.
**Goal.** "Which of these am I?" **SEO intent.** "open access for industry", "solar for manufacturing".
**Sections.** Breadcrumb → H1 → 4 segment cards → client logos grouped by segment → CTA.
**Mobile.** Single column; logos 3-across.

---

# 5. Industry page — `/industries/:slug` × 4

**Purpose.** Speak to one buyer in their own terms (Pattern E1 — the sector-wide gap).
**Audience.** J2 (industrial/commercial), J1 (RE generators), J3 (utilities).
**Goal.** "This firm understands my situation."

**Sections.**
```
Breadcrumb
H1 — names the reader's situation, not the service
The problem      ← opens on their actual pain
How we help      ← 2–4 relevant services, in their language
How it works     ← plain-language explainer  (critical for Industrial)
Proof            ← clients + projects filtered to this segment
FAQ
CTA              ← segment-specific
```

| Slug | Opening problem | Services surfaced | CTA |
|---|---|---|---|
| `industrial` | "You run an HT connection and your tariff keeps rising." | Open Access, Rooftop Solar, EIS | **Request a tariff assessment** |
| `commercial` | Malls, hotels, campuses — high day-load, roof area available | Rooftop Solar, Open Access, O&M | Request a rooftop feasibility study |
| `utilities` | Substation, bay and line works to specification and schedule | EIS, O&M, Liaisoning | Vendor / tender enquiry |
| `renewable-generators` | "Your plant is built. It isn't earning yet." | Liaisoning, Forecasting & Scheduling, O&M, EIS | Discuss commissioning support |

**Mobile.** Plain-language explainer becomes a vertical stepped list — this is the page most likely
read on a phone, so it takes priority in the responsive pass.

---

# 6. Projects register — `/projects/`

**Purpose.** Convert the site's strongest asset from an unreadable table into explorable evidence
(Pattern C2). **Audience.** All. **Goal.** "Have you done work like mine?"
**SEO intent.** Long-tail client and works queries.

**Sections.** Breadcrumb → H1 + count → featured case studies (4–6) → **filter bar** → register →
"Your project isn't here?" CTA.

**Filters** — derived from data that actually exists: Service (6) · Segment (4) · Technology
(wind/solar/hybrid/grid) · Voltage class (220/132/33/33-11/LT) · State. Filter state is held in the
**URL query string**, so filtered views are shareable and linkable from service pages
(`/projects/?service=liaisoning`).

**Assets.** 52 rows from `docs/06-content/project-register.md`; case-study photography.
**Interactions.** Client-side filtering (52 rows — no pagination, no server round-trip);
results count announced via `aria-live`; empty state with a reset action.
**Mobile.** **Table becomes cards** — the audit's #6 defect. Filters collapse into a bottom sheet
with an applied-filter count badge.

---

# 7. Case study — `/projects/:slug` × 4–6

**Purpose.** The strongest differentiator available (Pattern C1). **Audience.** J1, J3.
**Goal.** "Prove it on one real job."

**Sections.** Breadcrumb → H1 → fact bar (client · capacity · location · voltage · services · year
[TO VERIFY #14]) → The brief → The challenge → What we did → Outcome → Photography → Services used →
Next case study → CTA.

**Assets.** 4–8 real photographs per case study. **This is the project's highest-value asset
dependency** (`TO VERIFY` #19); the fallback is technical diagrams.
**Mobile.** Fact bar becomes a 2-column definition list; images full-bleed.

---

# 8. About — `/about/`

**Purpose.** Institutional credibility. **Audience.** J3, J4, J6.
**Sections.** Breadcrumb → H1 → the firm (est. 2011, Indore + Pune [TO VERIFY #9]) → what we do →
Vision / Mission / Promise (legacy copy, condensed from five blocks to three) → people teaser →
credentials teaser → partner teaser → CTA.
**Note.** Drops "more than 10 years" (stale, written ~2017) in favour of "Established 2011", which
is registry-verifiable and ages correctly.

---

# 9. Leadership — `/about/leadership/`

**Purpose.** Put faces to the "backed by technocrats" claim — the audit's most damaging omission.
**Audience.** J4, J5, J6.
**Sections.** Breadcrumb → H1 → leadership cards (photo, name, role, bio, qualifications, LinkedIn)
→ team composition (from legacy About: renewable professionals, civil & electrical engineers, finance
and management) → careers cross-link → CTA.
**Blocked on `TO VERIFY` #13** (photos, bios, qualifications) and #15 (whether Anjali Gajanan Yadav
should be listed).
**Privacy change from legacy:** personal mobile numbers and individual emails are **removed**. Each
person routes through a single contact form with a "for the attention of" field. The legacy site
publishes three direct mobiles in plain text — a spam-harvesting liability with no upside.

---

# 10. Credentials & recognition — `/about/credentials/`

**Purpose.** The verification page for procurement (Pattern C5). **Audience.** J3, J6, J1.
**Goal.** "Are you qualified, and can I check it?"
**Sections.** Breadcrumb → H1 → **licences & registrations** (QCA × 3 states with numbers and
validity; 'A' class electrical licence; CIN; GST/Udyam) → certifications (ISO, `TO VERIFY` #11) →
**Recognition** — a *dated* timeline of the seven 2016–2019 awards (Pattern C7, replacing the
marquee) → company profile download → CTA.
**Interactions.** Profile download is gated on name + organisation + email, posting to the backend.
**Mobile.** Credential cards stack; timeline becomes vertical.

---

# 11. Partners — `/about/partners/`

**Purpose.** Present enercast GmbH as a working relationship, not a logo. **Audience.** J4, J1.
**Sections.** Breadcrumb → H1 → enercast GmbH (who they are, Kassel, what the cooperation covers:
Wind Forecast, Solar Forecast, enercast SKY) → what it means for clients → link to
`/services/forecasting-scheduling/` → partnership enquiry CTA.
**Blocked on `TO VERIFY` #7** — if the cooperation has lapsed, this page is removed and the
Forecasting page is rewritten to stand alone.

---

# 12. Contact — `/contact/`

**Purpose.** Fix the single most commercially costly defect on the legacy site — **there is no
contact form anywhere today.** **Audience.** All.

**Sections.** H1 → **enquiry form** → direct contact (Indore registered office [TO VERIFY #10];
Pune office [TO VERIFY #9]; phone; email) → map → response-time commitment → routed alternatives
(careers, vendor, partnership).

**Form fields.** Name · Organisation · Email · Phone · **Intent** (general / service / assessment /
partnership / vendor — pre-selected from the query string) · Service (conditional) · State ·
Capacity (conditional) · Message · consent checkbox · honeypot + Turnstile.

**Interactions.** Inline validation on blur; disabled submit while pending; success replaces the
form with a confirmation and a reference number; errors are announced via `aria-live` and focus
moves to the first invalid field.
**Mobile.** Single column; correct `inputmode`/`autocomplete` on every field; tap-to-call and
tap-to-email as primary actions above the form — on a phone, calling beats typing.

---

# 13. Supporting pages

| Page | Notes |
|---|---|
| `/privacy/`, `/terms/` | Footer only. Privacy policy must cover form data handling and retention. |
| `/404` | Branded; offers Services, Projects, Contact. Important — 11 legacy URLs redirect, and any missed path lands here. |

---

## Global page furniture

**Every page carries:** unique `<title>` and meta description; canonical; OG + Twitter tags with a
per-page image; `<html lang="en-IN">`; breadcrumbs with `BreadcrumbList` JSON-LD (except Home);
skip-to-content link; one `<h1>`; the footer credential line.

**Structured data:** `Organization` (Home — with CIN, address, contact), `Service` (each service
page), `BreadcrumbList` (all inner), `FAQPage` (service and industry pages).
The legacy site has **none** of this.

---

## Related

- [Sitemap](sitemap.md)
- [User journeys](user-journeys.md)
- [Component system](../03-design/components.md)
- [Company fact register](../06-content/company-facts.md)
