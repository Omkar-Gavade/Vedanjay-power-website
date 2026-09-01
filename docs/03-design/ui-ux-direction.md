# UI/UX Direction

The creative brief for Vedanjay Power. Everything in `docs/03-design/` derives from the position
stated here.

---

## 1. The idea

> **Instrument-grade.**

Vedanjay's work is metering, telemetry, SCADA, load despatch, forecasting, grid synchronisation and
regulatory approval. It is precision work in a domain where being approximately right has a cost.
The website should feel the way that work feels: **measured, exact, engineered, unexaggerated.**

This is a deliberate rejection of the sector's default register. The five comparators all sell
*aspiration* — turbines against blue sky, "accelerating the energy transition", GW counters,
net-zero pledges. Vedanjay cannot outspend them on aspiration and does not need to. It can out-**specify**
them.

**The design should read as though it were made by the same people who commission a 132 kV bay.**

Three consequences follow:

1. **Restraint is the aesthetic.** The site looks expensive through typography, space, alignment and
   photography — not through effects. Every effect the legacy site owns (three slider libraries, an
   animated icon bundle, a marquee) has been removed and nothing has replaced them.
2. **Specificity is the voice.** Not "end-to-end renewable solutions" but "CEIG approval, DISCOM
   connectivity, SLDC synchronisation, ABT metering". The technical vocabulary *is* the credential.
3. **Proof outranks assertion.** The site shows 52 executed works, named clients and regulator-granted
   licences before it makes a single claim about itself.

---

## 2. Design principles

Six principles. Each is testable — a design either satisfies it or it does not.

### I. Evidence before adjective
Every claim is adjacent to its proof. A statistic carries an "as at" date. A capability carries an
executed project. A credential carries an issuing authority and a number. **If a claim cannot be
evidenced, it does not ship** — the `Stat` component makes the date a required prop precisely so
this cannot be forgotten.

### II. The technical word is the right word
CEIG, SLDC, ABT, AMR, RTU, LTOA, REC, DSM, BOOT/BOT, RESCO. This vocabulary is retained and
explained, never simplified away. To a technical buyer it is the qualification; to a non-technical
buyer a glossary and plain-language explainers do the work. The legacy site's greatest content
strength is that it was written by practitioners — that must survive the redesign.

### III. Space is the budget
When a section feels crowded, content is removed — never spacing. Generous whitespace, a 68ch
measure and 1.65 line height signal confidence. Density signals a company trying to look bigger than
it is.

### IV. Structure is visible
Asymmetric editorial splits, a strict 12-column grid, the kicker system on every section, a 2px
radius, hairline borders. Nothing is centred that should be aligned. Nothing is positioned by eye.
The composition should look deliberate at a glance, before a word is read.

### V. Motion serves comprehension
Four permitted patterns — reveal, hero entrance, interactive feedback, count-up. Nothing over 600ms.
If an animation is noticed as an animation, it is too much.

### VI. Mobile is not a reduction
The phone layout is designed, not derived. Tables become cards. Process steps become timelines.
Calling is a primary action. The legacy site treats mobile as a casualty of the desktop design; that
is the specific failure being reversed.

---

## 3. Visual language

| Element | Direction | Reasoning |
|---|---|---|
| **Palette** | Graphite ink ground · deep evergreen primary · **copper** accent · warm paper surfaces | Sector has converged on teal-green. Copper is the metal of conductors and busbars — semantically true, and worn by none of the five comparators. [→ colour-system](color-system.md) |
| **Type** | **Archivo** (industrial grotesque, display + text) + **IBM Plex Mono** (data, kickers, figures) | Mono numerals make statistics read as instrument readouts. Rejects Inter (SaaS default) and Poppins/Montserrat (Indian corporate default). [→ typography](typography.md) |
| **Layout** | 1280px container, 12-column, asymmetric editorial splits, full-bleed imagery with contained text | Structure over decoration. [→ spacing-grid](spacing-grid.md) |
| **Shape** | **2px radius**, hairline borders, no resting shadows | Engineered, not friendly. The brief rejects excessive rounding; the legacy site's 50px circular icon wells are the anti-example. |
| **Photography** | **Real Vedanjay work** — 132 kV bays, telemetry cabinets, metering yards, engineers on site | All five comparators use identical stock. This is the highest-impact single investment available. [→ §5](#5-art-direction) |
| **Iconography** | ~20 line icons, 1.5px stroke, inline SVG sprite | Replaces 609 KB of `livicons` JavaScript. |
| **Data** | Mono figures, `tabular-nums`, unit and date always attached | The register, the stats and the tables all read as one system. |
| **Motion** | Four patterns, ≤600ms, transform/opacity only | [→ motion-system](motion-system.md) |

---

## 4. Explicitly rejected

The brief names what to avoid; each is mapped to a concrete decision.

| Avoid | How this design avoids it |
|---|---|
| Generic SaaS design | Archivo not Inter; 2px radius not 12px; copper not indigo; no gradient meshes |
| Template-like layouts | Asymmetric 5/7 splits; a kicker system unique to this site; editorial case studies |
| Excessive rounded cards | 2px house radius. `radius-full` restricted to filter chips and avatars |
| Overuse of gradients | Gradients used **only** as photographic scrims for legibility — never as decoration |
| Cheap-looking animations | Four patterns only; no bounce, no parallax, no cursor effects, no page transitions |
| Excessive glassmorphism | One backdrop-blur in the entire system: the solid header state |
| Random decorative elements | Only one decorative motif exists — the single-line-diagram, and only as a hero fallback |
| Overly playful UI | No spring easing, no illustration, no emoji, no rounded friendly forms |
| Visual clutter | One idea per section; max three type sizes per component; nine homepage sections |
| Stock-image-heavy design | Real work photography as the primary direction; technical diagrams as the fallback — stock is not in either path |

---

## 5. Art direction

**The primary direction: photograph the real work.** Vedanjay has executed 52 works at named
substations. A photograph of an actual 132 kV feeder bay, a telemetry cabinet with its door open, an
AMR meter being commissioned, or an engineer at an SLDC terminal is *categorically* different from
anything in the comparator set — and it proves presence in a way no claim can.

**Treatment:** natural light, no heavy grading, no colour-wash overlays. Wide establishing shots for
heroes; tight detail shots for service pages. People included where possible and always doing
something, never posed. Scrims applied only where text sits over image, never for mood.

**Fallback direction** (if `TO VERIFY` #19 fails and no owned photography exists):
**technical-diagram-led.** Single-line diagrams, grid schematics, state coverage maps and metering
topologies rendered as fine copper linework on graphite. Treated as a deliberate system, this is
still differentiated and still on-brand — it is simply less powerful than the real thing. This
fallback is designed for, not improvised.

**Never:** turbines silhouetted against a sunset · rows of panels at golden hour · generic
handshake/boardroom photography · people pointing at screens · stock imagery of any kind.

---

## 6. Voice and tone

| | |
|---|---|
| **Is** | Precise · factual · plainly confident · technically fluent · specific about scope |
| **Is not** | Aspirational · slogan-driven · self-congratulatory · vague about outcomes · apologetic |

**Sentence test:** *would an engineer at MPPTCL read this and think "these people know what they're
talking about", or "this is marketing"?*

- Numbers carry units and dates. "700+ MW commissioned (as at March 2026)", never "extensive experience".
- Services are described by scope and deliverable, not by benefit adjectives.
- Vedanjay is the subject of its sentences: "We secured CEIG approval and SLDC synchronisation for a
  29.4 MW wind project," not "Vedanjay is committed to excellence in project delivery."
- Segment pages open on the **reader's** situation, not the company's capability.
- Errors of tone in the legacy copy — "The Firm is Back-by Technocrat Personalities" — are corrected,
  but the technical substance is preserved.

---

## 7. The quality bar — self-assessment

The brief requires this direction to be tested against six roles.

**Creative Director — "Does this feel premium enough?"**
Yes, and by the right mechanism. Premium here comes from an 88px display headline at −0.035em
tracking, a 68ch measure, 128px section rhythm, real photography and a copper accent held to 3–5%
coverage. It does not come from effects — which is what makes it durable. The risk is that restraint
executed poorly reads as plain; the mitigation is that typographic scale and asymmetric composition
do the work that decoration would otherwise be asked to do. **The one genuine dependency is
photography.** With real work photographs this direction is distinctive; with diagrams it is
distinctive-but-quieter; with stock it collapses into the sector average. This is stated plainly in
the risk register rather than hidden.

**UX Director — "Can a visitor understand Vedanjay within seconds?"**
Yes. The first screen carries a headline naming the actual business ("We get renewable projects
approved, connected and scheduled"), a sub-line naming the four services and the QCA status, and a
proof strip with licences and executed-work count — all above the fold. The legacy site's first
screen says "Harvest the wind for your energy needs and we will help you", which identifies neither
the business nor the buyer.

**Enterprise Designer — "Does this look credible for serious business stakeholders?"**
Yes, and credibility is the axis the whole direction optimises for. CIN and licence line in the
footer of every page. A credentials page built for procurement verification. 52 named works with
named authorities. Dated statistics. No unevidenced claim anywhere — enforced at the component API
level. The reason the fact register is the first document in this project is that for this audience,
**an unverifiable number is worse than no number**.

**Frontend Architect — "Can this architecture scale without becoming messy?"**
Yes. Content is data, not markup, so adding a service or a project is a data edit. Routes are file-
organised and lazy-loaded. One base `Card` prevents variant drift. Semantic colour aliases mean a
theme change is one file. The deliberate exclusions — no Redux, no GraphQL, no SSR, no animation
library — are what keep a 19-page site from carrying enterprise-scale ceremony.
[→ frontend-architecture](../04-architecture/frontend-architecture.md)

**Performance Engineer — "Are we adding effects that don't justify their cost?"**
The animation budget is **under 3 KB gzipped** and the total initial page budget is **600 KB** — against
a legacy homepage that ships 55 scripts, 18 stylesheets, 609 KB of icon JavaScript and 2.5 MB of hero
JPEGs. Parallax, page transitions, cursor effects, carousels and animation libraries were each
considered and rejected on cost. Every retained animation uses `transform`/`opacity` only.

**Mobile UX Designer — "Does the experience remain excellent on a phone?"**
Yes, and this receives the most attention because it is where the legacy site fails hardest — a
headline clipped mid-word, broken image placeholders, a ~10px CTA. Mobile gets designed treatments,
not derived ones: tables become cards, process steps become timelines, filters become a bottom sheet,
tap-to-call is a primary action. Seven testable rules in `responsive-strategy.md §6` map directly to
the seven measured failures.

---

## 8. Success criteria

The design succeeds if:

1. A technical buyer landing on a service page from Google can determine within 30 seconds that
   Vedanjay does exactly what they need, has done it before, and how to start.
2. An HT industrial buyer who has never heard the phrase "open access" understands the mechanism and
   requests a tariff assessment.
3. A procurement engineer can verify every credential in two clicks from any page.
4. Nothing on the site is a claim that cannot be sourced.
5. It does not look like Waaree, ReNew, Suzlon, Vikram Solar or Tata Power.
6. It works — genuinely, not nominally — at 360px.

---

## Related

- [Colour system](color-system.md) · [Typography](typography.md) · [Spacing & grid](spacing-grid.md)
- [Components](components.md) · [Navigation](navigation.md) · [Motion](motion-system.md) · [Responsive](responsive-strategy.md)
- [Gap analysis](../01-research/gap-analysis.md) · [Decision log](../05-decisions/decision-log.md)
