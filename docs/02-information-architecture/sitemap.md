# Sitemap & Navigation Structure

**Status:** proposed final. Derived from the audit, the pattern matrix and the gap analysis —
not from the brief's hypothesis sitemap, which was tested and modified (see §5).

---

## 1. Design principles applied

1. **The service page is the product page.** (Pattern A1, from DNV.) Six service lines → six
   indexable URLs. This is the single most consequential change from the legacy site, where five of
   six services have no URL at all.
2. **Two doors into the offer.** (Pattern A4.) Visitors arrive knowing *what they need* (service) or
   *who they are* (segment). Both are first-class navigation axes.
3. **Navigation weight follows commercial value.** The legacy site gave a top-level slot to a
   single-partner page and one shared slot to six services. Inverted.
4. **Five primary items plus one action.** (Pattern A3.) Below the ~7-item scanning threshold, with
   deliberate room to add Insights and Careers without restructuring.
5. **Nothing ships that cannot be maintained.** Insights and a resource library are architecturally
   supported but excluded from launch — the legacy Downloads page (15 dead links) is the cautionary
   case.

---

## 2. Final sitemap

```text
/                                   Home

/services/                          Services overview  ── mega-menu anchor
├── /services/open-access/          Open Access Power Sale & Purchase
├── /services/forecasting-scheduling/  Forecasting & Scheduling (QCA)
├── /services/liaisoning/           Regulatory Liaisoning & Approvals
├── /services/electrical-infrastructure/  Electrical Infrastructure Services
├── /services/rooftop-solar/        Rooftop Solar — Turnkey
└── /services/operations-maintenance/  Operations & Maintenance

/industries/                        Who we work with  ── second axis
├── /industries/industrial/         Industrial & HT consumers
├── /industries/commercial/         Commercial & institutional
├── /industries/utilities/          Utilities & DISCOMs
└── /industries/renewable-generators/  RE generators & IPPs

/projects/                          Project register (filterable, 52 works)
└── /projects/:slug                 Case study  (4–6 at launch)

/about/                             Company
├── /about/leadership/              Leadership & team
├── /about/credentials/             Credentials, licences & recognition
└── /about/partners/                Cooperation partners  (enercast GmbH)

/contact/                           Contact & enquiry

/careers/                           Careers                      [Phase 2 — gated on TO VERIFY #17]
/insights/                          Insights & regulatory updates [Phase 2 — gated on editorial owner]
/insights/:slug                     Article                      [Phase 2]

/privacy/                           Privacy policy               [legal, footer only]
/terms/                             Terms of use                 [legal, footer only]
/sitemap.xml  /robots.txt           Generated
/404                                Not found
```

**Launch scope: 19 pages.** Legacy site: 11 pages, of which 5 services and 4 segments were unaddressable.

---

## 3. Primary navigation

```text
┌──────────────────────────────────────────────────────────────────────────┐
│  [LOGO]   Services ▾   Industries ▾   Projects   About ▾   Contact       │
│                                                          [ Enquire → ]   │
└──────────────────────────────────────────────────────────────────────────┘
```

Five primary items + one distinct action button (Pattern D1). Behaviour, states, keyboard model and
mobile drawer are specified in full in [`docs/03-design/navigation.md`](../03-design/navigation.md).

### Services mega-menu

Two columns of services with one-line descriptors (Pattern D3 — the menu should sell, not just list),
plus a rail and a featured case study.

```text
┌─ SERVICES ──────────────────────────────┬─ BY INDUSTRY ─┬─ FEATURED ────────┐
│                                          │               │                   │
│ Open Access Power        Rooftop Solar   │ Industrial    │  [case study      │
│ Cheaper power under      Turnkey solar   │ Commercial    │   thumbnail]      │
│ intra-state open access  on your roof    │ Utilities     │                   │
│                                          │ RE Generators │  29.4 MW wind —   │
│ Forecasting & Scheduling Operations &    │               │  telemetry to     │
│ QCA-registered in 3      Maintenance     │ ───────────── │  SLDC sync        │
│ states                   Solar & wind O&M│ All services →│  Read →           │
│                                          │               │                   │
│ Regulatory Liaisoning    Electrical      │               │                   │
│ CEIG, DISCOM, SLDC,      Infrastructure  │               │                   │
│ grid connectivity        33/132/220 kV   │               │                   │
└──────────────────────────────────────────┴───────────────┴───────────────────┘
```

The QCA descriptor is deliberately placed in the menu itself — the credential works hardest where
decisions are made, not only on the page it describes.

### About dropdown

Simple list, no mega-menu: Company · Leadership · Credentials & Recognition · Partners.

### Industries dropdown

Four segments with one-line descriptors.

---

## 4. Footer as a second navigation axis

(Pattern A6.) The legacy footer carried four links. The new footer is a genuine sitemap.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│  VEDANJAY POWER                                                             │
│  Connecting to a more sustainable future                                    │
│                                                                             │
│  SERVICES          INDUSTRIES        COMPANY           CONTACT              │
│  Open Access       Industrial        About             Indore (registered)  │
│  Forecasting & S.  Commercial        Leadership        [address]            │
│  Liaisoning        Utilities         Credentials       [phone] [email]      │
│  Electrical Infra. RE Generators     Partners          Pune office          │
│  Rooftop Solar                       Projects          [TO VERIFY]          │
│  O&M                                 Contact                                │
│                                                                             │
│  QCA registered: Maharashtra · Telangana · Madhya Pradesh   [TO VERIFY]     │
│  'A' class Electrical Contractor licence  [TO VERIFY]                       │
│  CIN U40100MP2011PTC026570                                                  │
│─────────────────────────────────────────────────────────────────────────────│
│  © {computed year} Vedanjay Power Private Limited   Privacy · Terms   [in]  │
└─────────────────────────────────────────────────────────────────────────────┘
```

The credential line and CIN in the footer are a deliberate institutional-credibility device: they
appear on every page, they are externally checkable, and they cost one line. The copyright year is
**computed**, never hard-coded — the legacy site's frozen "2017" is the exact failure being designed out.

---

## 5. How this differs from the brief's hypothesis — and why

The brief supplied a starting sitemap and asked for it to be validated and modified. It was tested
against the audit findings and changed in seven places.

| # | Hypothesis | Decision | Reasoning |
|---|---|---|---|
| 1 | `Business / Solutions` | → **`Services` with six child pages** | Vedanjay sells services, not solutions or products. Six real, distinct lines already exist and each needs its own URL (Pattern A1). "Solutions" is the sector's emptiest word. |
| 2 | — (not present) | → **`Industries` added as a top-level axis** | The legacy homepage already segments Industry / Commercial / Utilities / RE and never builds pages behind it. This is the site's best unexploited instinct and the basis of differentiation move #4. |
| 3 | `Projects → Ongoing / Completed` | → **single filterable register + case studies** | No project row on the legacy site carries a date or status, so an ongoing/completed split cannot be populated truthfully (`TO VERIFY` #14). Filtering by service, segment, technology, voltage and state is more useful to every audience and works with the data that actually exists. |
| 4 | `Sustainability` (top level) | → **removed** | Vedanjay has no measured, audited sustainability data (fact register §12). A sustainability page without metrics is the ESG boilerplate the gap analysis warns against. The honest contribution — enabling others' renewable assets to connect and run — is stated on About and demonstrated by the project register. Revisit only if real data exists. |
| 5 | `Media / News` (top level) | → **deferred to `/insights/` in Phase 2** | Gated on a named editorial owner. A stale news section is precisely how the legacy site decayed. |
| 6 | `About → Why Vedanjay` | → **merged into `/about/` and `/about/credentials/`** | "Why Vedanjay" as a standalone page is an assertion page. The argument is stronger distributed across credentials (licences), projects (evidence) and leadership (people). |
| 7 | `About → Vision & Mission` | → **section within `/about/`, not a page** | Vision and Mission are three paragraphs of legacy copy. They do not carry a URL's worth of intent and no visitor searches for them. |
| 8 | `Careers` (top level) | → **deferred, footer link at launch** | Gated on `TO VERIFY` #17 — whether live vacancies exist. An empty careers page harms more than it helps. |

**Also removed from the legacy IA:**

- `Cooperation Partner` as a top-level item → demoted to `/about/partners/` and a section on the
  Forecasting page. One partner does not warrant a navigation slot.
- `Clients` as a standalone page → distributed. Logos into Home and Industries; named engagements
  into Projects and case studies. A context-free logo wall proves nothing (Pattern C6).
- `Image Gallery` → removed. Photography is redistributed to where it carries meaning.
- `Downloads` → removed as built (15 of 22 links return HTTP 503). Returns only as a maintained
  resource hub with a named owner.
- `Awards` → folded into `/about/credentials/` as a dated Recognition timeline (Pattern C7).

---

## 6. URL conventions

- Lowercase, hyphenated, no trailing file extension, **with** trailing slash on directory routes.
- Nouns, not verbs. Service slugs use the language buyers search for (`open-access`, not
  `power-sale-consultancy`).
- No dates in URLs — content is durable, not chronological.
- Case-study slugs are descriptive and stable: `/projects/suzlon-29-4mw-telemetry-sldc-sync`.
- Legacy redirects (301) from every old `.html` path — see below.

### Redirect map

Preserves whatever equity the legacy URLs hold and prevents 404s from external links and the
`VPPL_PROFILE.PDF` circulating in email.

| Legacy | → New |
|---|---|
| `/index.html` | `/` |
| `/about-us.html` | `/about/` |
| `/team.html` | `/about/leadership/` |
| `/awards.html` | `/about/credentials/` |
| `/partners.html` | `/about/partners/` |
| `/services.html` | `/services/` |
| `/projects.html` | `/projects/` |
| `/clients.html` | `/industries/` |
| `/image-gallery.html` | `/projects/` |
| `/downloads.html` | `/services/` |
| `/contact.html` | `/contact/` |

---

## 7. Content-to-page mapping

Confirms every piece of legacy content has a destination — nothing is silently lost.

| Legacy content | New destination |
|---|---|
| 6 service descriptions | 6 service pages (verbatim technical content preserved, Pattern E2) |
| 52-row project table | `/projects/` register + 4–6 case studies |
| 41 client logos | Home proof strip + Industries segment pages |
| About / Vision / Mission / Promise | `/about/` |
| Team (3 people) | `/about/leadership/` |
| 7 awards | `/about/credentials/` — dated Recognition timeline |
| enercast GmbH | `/about/partners/` + section on `/services/forecasting-scheduling/` |
| QCA claim (buried) | Home hero proof strip + `/about/credentials/` + Forecasting page |
| 'A' class licence (buried) | Home proof strip + `/about/credentials/` + Electrical Infrastructure page |
| 4 statistics | Home "Vedanjay in numbers" — reconciled and dated |
| Contact details | `/contact/` + footer |
| 7 self-hosted PDFs | `/about/credentials/` (company profile) — regulatory PDFs dropped pending an owner |
| 15 dead external PDFs | **Dropped** (HTTP 503) |
| Image gallery | Redistributed into project and service pages |

---

## Related

- [User journeys](user-journeys.md)
- [Page specifications](page-specifications.md)
- [Navigation specification](../03-design/navigation.md)
- [Gap analysis](../01-research/gap-analysis.md)
