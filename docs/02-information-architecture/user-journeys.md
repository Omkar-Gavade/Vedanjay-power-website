# User Journeys

Six audiences, each with a defined entry point, question sequence, path, conversion and failure mode.

**Governing principle from the audit:** the legacy site serves every audience identical content in
identical order, and offers no CTA on nine of eleven pages. Every journey below therefore ends in a
**named, specific action** — never a generic "Contact us".

---

## Audience priority

Ranked by commercial value, which determines whose journey wins when designs conflict.

| Rank | Audience | Why ranked here |
|---|---|---|
| 1 | **RE generator / IPP / EPC** (technical buyer) | Highest-value repeat work; already the client base (Suzlon, Vikram Solar, Tata Power Solar, ReNew, Waaree) |
| 2 | **HT industrial / commercial energy buyer** | Largest addressable volume; open access is the highest-margin service; **worst served today** |
| 3 | **Utility / DISCOM / government** | Long cycles, high credibility value; needs credentials above all |
| 4 | **Business partner / vendor / OEM** | Low volume, strategic (the enercast model) |
| 5 | **Job candidate** | Matters to the "technocrat firm" claim |
| 6 | **Investor / lender / diligence** | Private company — informational, not transactional |

---

## Journey 1 — RE generator / IPP / EPC  *(priority 1)*

**Persona.** Project manager at a wind or solar IPP. A 30 MW plant is mechanically complete and not
yet earning. She needs CEIG approval, DISCOM connectivity, SLDC synchronisation, telemetry and ABT
metering — fast. Every week of delay is lost revenue.

**Entry.** Google: *"SLDC synchronisation consultant Madhya Pradesh"*, *"CEIG approval renewable MP"*,
*"telemetry RTU commissioning SLDC"* → lands **directly on a service page**, not the homepage.

**Questions, in order.**
1. Do you do exactly this? → 2. Have you done it for someone like me? → 3. How long does it take? →
4. Are you licensed? → 5. Who do I call?

**Path.**
```
Google → /services/liaisoning/  ── scope, process, deliverables
              │
              ├─→ evidence strip: "Suzlon · 29.4 MW · telemetry + SLDC sync"
              │        └─→ /projects/suzlon-29-4mw-telemetry-sldc-sync
              ├─→ /projects/?service=liaisoning   (filtered register)
              ├─→ /about/credentials/             ('A' class licence, QCA)
              └─→ [Enquire about this service] ──→ /contact/?service=liaisoning
```

**Conversion.** Service-scoped enquiry form, pre-filled with the service, capturing capacity, state,
technology and target commissioning date.

**Critical requirement.** She lands mid-site from search. Every service page must therefore be
self-sufficient: breadcrumb, positioning, proof, credentials and CTA all present without a homepage
visit. **This journey is impossible on the legacy site** — five of six services have no URL.

**Failure mode designed out.** Service page that describes capability but shows no comparable
executed work.

---

## Journey 2 — HT industrial / commercial energy buyer  *(priority 2)*

**Persona.** Plant head or CFO at a manufacturing unit on an HT connection, paying a rising tariff.
He does **not** know the phrase "open access consultancy". He knows his electricity bill is too high.

**Entry.** Google: *"reduce electricity cost factory Madhya Pradesh"*, *"open access power
Maharashtra industry"*, *"cheaper power HT consumer"* — or a peer referral.

**Questions.**
1. Can I actually pay less? → 2. Is this legal and safe? → 3. What does it involve? →
4. Who else has done it? → 5. What does it cost me?

**Path.**
```
Google / referral → /industries/industrial/   ── opens on HIS situation, not on the energy transition
              │
              ├─→ "How open access works" — 4-step explainer
              ├─→ /services/open-access/       ── the mechanism in detail
              ├─→ proof: Tata Steel · Mahindra · Kirloskar · IPCA · Radisson Blu
              └─→ [Request a tariff assessment] ──→ /contact/?intent=assessment
```

**Conversion.** *"Request a tariff assessment"* — a specific, low-commitment, obviously valuable
action. Not "Contact us".

**Critical requirement.** This audience needs **education before persuasion**. The segment page must
explain open access in plain language before naming a service. Pattern E1 (name the buyer) is
load-bearing here.

**Failure mode designed out.** Leading with "Open Access Power Services & Consultancy" — the legacy
site's framing, which is meaningless to the person with the problem.

---

## Journey 3 — Utility / DISCOM / government  *(priority 3)*

**Persona.** Executive engineer at a state transmission utility evaluating vendors for substation or
bay work. Procurement-driven, risk-averse, checklist-oriented.

**Entry.** Direct navigation, tender research, or existing relationship (MPPTCL appears 5× in the register).

**Questions.**
1. Are you qualified and licensed? → 2. Have you executed at this voltage class? →
3. Do you have utility experience? → 4. Are you financially and statutorily sound? →
5. Can I get your profile?

**Path.**
```
Direct → / ── proof strip (QCA · 'A' class licence · CIN · est. 2011)
       │
       ├─→ /about/credentials/  ── licences, registrations, ISO, recognition
       ├─→ /projects/?segment=utilities  ── MPPTCL, KEC, MPPMCL work at 220/132/33 kV
       ├─→ /services/electrical-infrastructure/
       └─→ [Download company profile] + [Vendor / tender enquiry]
```

**Conversion.** Company profile download (gated on name + organisation + email) and a vendor-enquiry
route distinct from sales.

**Critical requirement.** **Credentials must be reachable in two clicks from any page.** This
audience does not browse; it verifies. Footer credential line supports this on every page.

**Failure mode designed out.** Credentials scattered across body copy, as they are today.

---

## Journey 4 — Business partner / vendor / OEM  *(priority 4)*

**Persona.** BD manager at a foreign technology company (the enercast pattern) or an OEM seeking a
local execution partner in MP/MH.

**Questions.** Who are you? · What is your reach? · Do you already partner with anyone? · Who decides?

**Path.**
```
Referral / LinkedIn → /about/ ── company, scale, markets
                  │
                  ├─→ /about/partners/     ── enercast GmbH as proof of partnering capability
                  ├─→ /about/leadership/   ── who to talk to
                  ├─→ /projects/           ── execution evidence
                  └─→ [Partnership enquiry] ──→ /contact/?intent=partnership
```

**Critical requirement.** The existing German partnership is the proof that Vedanjay can run an
international technical partnership. `/about/partners/` must present enercast as a *working
relationship with a scope*, not a logo.

---

## Journey 5 — Job candidate  *(priority 5)*

**Persona.** Electrical engineer, 2–8 years, considering a specialist consultancy over an OEM.

**Questions.** What would I work on? · Who would I learn from? · Is this a real firm? · Is anything open?

**Path.**
```
Job board / referral → /about/ ─→ /about/leadership/ ─→ /projects/ ─→ /careers/  [Phase 2]
```

**Launch behaviour.** No `/careers/` page. Footer carries a single `careers@` route with a plain
statement of how to apply speculatively. **Deliberate:** an empty careers page with no vacancies is
worse than an honest email address (`TO VERIFY` #17).

**Critical requirement.** For this audience, `/projects/` is the recruiting page — 220 kV bays, SLDC
integration and telemetry commissioning are what an ambitious young engineer wants to work on.

---

## Journey 6 — Investor / lender / diligence  *(priority 6)*

**Persona.** Analyst at a lender or a corporate development team verifying Vedanjay as a counterparty.

**Questions.** Is this entity real? · How long established? · Who controls it? · What is the track record?

**Path.**
```
Search → / ─→ /about/ ─→ /about/credentials/ ─→ /projects/ ─→ footer (CIN, registered address)
```

**Critical requirement.** **Legal transparency, not an investor-relations section.** CIN, registered
address, incorporation year and directors, all consistent with the MCA record. The registered-address
discrepancy (`TO VERIFY` #10) matters most to exactly this reader.

**Explicitly not built.** No IR tree, no financials, no shareholder pages — Vedanjay is a private
limited company (Pattern A8).

---

## Cross-journey conversion architecture

Every page has exactly one primary action, sized to the visitor's stage.

| Stage | Page types | Primary action | Commitment |
|---|---|---|---|
| Awareness | Home, Industries | *Explore services* / *See how it works* | None |
| Consideration | Service, Segment | *Request a tariff assessment* / *Enquire about this service* | Low |
| Evaluation | Projects, Case study, Credentials | *Discuss a similar project* / *Download profile* | Medium |
| Decision | Contact | Routed enquiry form | High |

**Enquiry routing.** One form, one endpoint, five intents — `general`, `service` (with service slug),
`assessment`, `partnership`, `vendor`. Intent is carried in the query string from the originating CTA
and pre-selected, so the visitor never re-states what the page already knows. Backend routes to the
right inbox; see [`docs/04-architecture/backend-architecture.md`](../04-architecture/backend-architecture.md).

---

## Journey coverage matrix

Which pages carry which journeys — used to check no page is orphaned and no journey has a gap.

| Page | J1 IPP | J2 Industrial | J3 Utility | J4 Partner | J5 Candidate | J6 Diligence |
|---|:--:|:--:|:--:|:--:|:--:|:--:|
| `/` | ● | ● | ● | ○ | ○ | ○ |
| `/services/` | ● | ○ | ○ | ○ | | |
| `/services/:slug` | **●** | ● | ● | ○ | ○ | |
| `/industries/` | ○ | ● | ○ | | | |
| `/industries/:slug` | ○ | **●** | ● | | | |
| `/projects/` | ● | ○ | ● | ● | ● | ● |
| `/projects/:slug` | ● | ● | ● | ○ | ● | ○ |
| `/about/` | ○ | ○ | ● | **●** | ● | ● |
| `/about/leadership/` | ○ | | ○ | ● | ● | ● |
| `/about/credentials/` | ● | ○ | **●** | ● | | **●** |
| `/about/partners/` | ○ | | | **●** | | ○ |
| `/contact/` | ● | ● | ● | ● | ● | ○ |

● primary · ○ secondary · **bold** = the decisive page for that journey

---

## Related

- [Sitemap](sitemap.md)
- [Page specifications](page-specifications.md)
- [Gap analysis](../01-research/gap-analysis.md)
