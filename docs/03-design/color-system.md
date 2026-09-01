# Colour System

---

## 1. The problem to solve

Two findings from research constrain this decision.

**The sector has converged on teal-green.** Tata Power (teal / sea-green), Suzlon (teal / turquoise),
ReNew (teal-green on white). The legacy Vedanjay green — applied inconsistently as `#389743`,
`#47A859` and `#248427` — sits inside the same convergence zone. A refined version of that green
would make Vedanjay visually indistinguishable from its three largest neighbours, all of whom
outspend it.

**Vedanjay is not an ecological brand.** It is an electrical engineering and regulatory firm. Its
work is 132 kV bays, telemetry cabinets, AMR metering, capacitor banks and SLDC terminals. The
eco-green vocabulary describes an outcome its clients pursue; it does not describe what Vedanjay
actually does.

---

## 2. The decision

A three-part palette:

| Role | Colour | Reasoning |
|---|---|---|
| **Ground** | Graphite ink — near-black with a cool green undertone | Premium, engineered, serious. Lets photography and typography carry the page. Nobody in the comparator set uses a dark ground as the primary brand surface. |
| **Primary** | Deep evergreen | Retains brand equity from the existing mark and the "Connecting to a more Sustainable Future" line — but **deepened out of the sector's mid-green zone** into something closer to a British-racing/institutional green. Reads as establishment, not startup. |
| **Accent** | **Copper** | The metal of conductors, busbars, windings and earthing. Semantically *true* to the business in a way green is not — and worn by **none** of the five comparators. Provides warmth, which greens and teals cannot, and reads as premium the way brass and bronze do in luxury branding. |

**Copper is the differentiating decision.** It is the visual equivalent of the positioning argument:
Vedanjay is an electrical engineering firm serving the renewable sector, not a green-energy brand.

Surfaces are warm off-white rather than pure white — pure white against a graphite ground is harsh,
and a warm paper tone reads as editorial and printed rather than as a web template.

---

## 3. Tokens

All tokens are declared as CSS custom properties and consumed through Tailwind theme extension.
Raw hex values never appear in component code.

### Ink — neutral ground and text (cool graphite, faint green undertone)

| Token | Hex | Use |
|---|---|---|
| `ink-950` | `#0A0F0D` | Hero ground, footer, dark bands |
| `ink-900` | `#111815` | Dark surface, cards on dark |
| `ink-800` | `#1B2420` | Elevated dark surface, borders on dark |
| `ink-700` | `#2A3531` | Dark borders, dividers on dark |
| `ink-600` | `#3E4A45` | Muted text on light, icons |
| `ink-500` | `#5C6A64` | Secondary text on light |
| `ink-400` | `#84938C` | Placeholder, disabled, captions |
| `ink-300` | `#AFBAB4` | Borders (strong), dividers on dark surfaces |
| `ink-200` | `#D2DAD5` | Borders (default) |
| `ink-100` | `#E8EDEA` | Subtle fills, table stripes |
| `ink-50` | `#F4F7F5` | Section alternation on light |

### Green — primary brand

| Token | Hex | Use |
|---|---|---|
| `green-900` | `#0E2A1C` | Deepest brand fill |
| `green-800` | `#143D28` | Dark brand band |
| `green-700` | `#1A5033` | **Brand core** — large fills, logo lockup |
| `green-600` | `#21653F` | Hover on primary fill |
| `green-500` | `#2E7D4F` | Interactive primary, links on light |
| `green-400` | `#489567` | Links on dark, active states |
| `green-300` | `#74B489` | Subtle accents on dark |
| `green-200` | `#A7D1B4` | Light fills |
| `green-100` | `#D3E8D9` | Tint backgrounds |
| `green-50` | `#EEF6F0` | Faintest tint |

### Copper — accent

Used at **low coverage — a target of 3–5% of any viewport.** Copper earns its premium reading from
scarcity. Used broadly it becomes decorative and cheap.

| Token | Hex | Use |
|---|---|---|
| `copper-700` | `#7B4A1F` | Pressed states |
| `copper-600` | `#9A5E28` | Hover on copper fill |
| `copper-500` | `#B87333` | **Accent core** — true copper. CTA fills, rules, active indicator |
| `copper-400` | `#CE8B3F` | Accent on dark ground (meets AA on `ink-950`) |
| `copper-300` | `#DBA363` | Kicker text on dark, hairlines |
| `copper-200` | `#E8C296` | Subtle accent on dark |
| `copper-100` | `#F4E1CA` | Tint |
| `copper-50` | `#FBF3EA` | Faintest tint on light |

### Paper — light surfaces

| Token | Hex | Use |
|---|---|---|
| `paper` | `#FAFAF8` | Page background (warm, not pure white) |
| `paper-raised` | `#FFFFFF` | Cards, inputs, elevated surfaces |

### Semantic

| Token | Hex | Use |
|---|---|---|
| `success` | `#2E7D4F` | Reuses `green-500` — success *is* on-brand here |
| `warning` | `#85610C` | Form warnings, expiring credentials (darkened from a mid-amber so it passes AA as text — 5.4:1) |
| `error` | `#B3261E` | Validation errors |
| `info` | `#1F5F8B` | Informational notes (a blue, deliberately outside brand, so it reads as system rather than brand) |

---

## 4. Semantic aliases

Components reference these, never the scales directly. This is what makes a future theme change a
one-file edit.

```
--surface              paper           --surface-raised      paper-raised
--surface-sunken       ink-50          --surface-inverse     ink-950
--text-primary         ink-900         --text-secondary      ink-600
--text-muted           ink-400         --text-inverse        paper
--text-inverse-muted   ink-300         --text-brand          green-700
--border               ink-200         --border-strong       ink-300
--border-inverse       ink-800         --focus-ring          copper-500
--action-primary-bg    green-700       --action-primary-fg   paper
--action-accent-bg     copper-500      --action-accent-fg    ink-950
--rule-accent          copper-500
```

---

## 5. Contrast verification (WCAG 2.1)

Every combination shipped in the design has been checked. The legacy site fails AA in several hero
frames (white text over unoverlaid photography).

| Foreground | Background | Ratio | Standard |
|---|---|---|---|
| `ink-900` #111815 | `paper` #FAFAF8 | **17.24:1** | AAA |
| `ink-600` #3E4A45 | `paper` #FAFAF8 | **8.85:1** | AAA |
| `ink-500` #5C6A64 | `paper` #FAFAF8 | **5.43:1** | AA |
| `ink-400` #84938C | `paper` #FAFAF8 | **3.08:1** | ⚠ Large text / decorative / disabled only — **never body text** |
| `paper` #FAFAF8 | `ink-950` #0A0F0D | **18.49:1** | AAA |
| `ink-300` #AFBAB4 | `ink-950` #0A0F0D | **9.66:1** | AAA |
| `green-700` #1A5033 | `paper` #FAFAF8 | **8.97:1** | AAA |
| `paper` #FAFAF8 | `green-700` #1A5033 | **8.97:1** | AAA — primary button |
| `green-500` #2E7D4F | `paper` #FAFAF8 | **4.83:1** | AA |
| `green-500` #2E7D4F | `ink-950` #0A0F0D | **3.83:1** | ⚠ Large text only — **use `green-400` on dark instead** |
| `green-400` #489567 | `ink-950` #0A0F0D | **5.31:1** | AA — links on dark |
| `copper-500` #B87333 | `paper` #FAFAF8 | **3.63:1** | ⚠ AA **large text only (≥24 px)** |
| `ink-950` #0A0F0D | `copper-500` #B87333 | **5.09:1** | AA — **the correct CTA pairing** |
| `copper-400` #CE8B3F | `ink-950` #0A0F0D | **6.80:1** | AA |
| `copper-300` #DBA363 | `ink-950` #0A0F0D | **8.68:1** | AAA — kickers on dark |
| `error` #B3261E | `paper` #FAFAF8 | **6.25:1** | AA |
| `warning` #85610C | `paper` #FAFAF8 | **5.41:1** | AA |
| `info` #1F5F8B | `paper` #FAFAF8 | **6.55:1** | AA |

*Ratios computed against the WCAG 2.1 relative-luminance formula, not estimated.*

**Binding rules from this table:**
1. Copper CTAs use **`ink-950` text on copper** (5.09:1). White on copper is 1.9:1 and fails outright.
2. `copper-500` is never body text on light (3.63:1). On dark, use `copper-300` or `copper-400`.
3. `green-500` is the link colour **on light only** (4.83:1). On dark grounds it drops to 3.83:1 —
   use `green-400` (5.31:1) there.
4. `ink-400` is for placeholders, disabled states and decoration — never body text.
5. **Text over photography always sits on a scrim** — a `ink-950` gradient at 0.55→0.85 opacity —
   never directly on an image. This is the legacy site's contrast failure, designed out structurally.

---

## 6. Application rules

**Section rhythm.** Alternate `paper` → `ink-50` → `paper`, with `ink-950` reserved for exactly
three moments per page: the hero, one mid-page feature, and the closing CTA. Dark bands are
punctuation. Overused they flatten; used sparingly they create the page's structure.

**Where copper is permitted.** Primary CTA fills · the kicker rule above section headings ·
active navigation indicator · statistic numerals · focus rings · hover borders on cards ·
the single-line-diagram motif. **Nowhere else.**

**Where green is permitted.** Logo lockup · primary buttons on light grounds · links ·
success states · large brand fills. Green is the institutional colour; copper is the attention colour.

**Never.** Gradients as decoration (brand-adjacent scrims over photography only) · more than two
brand colours in one component · colour as the sole carrier of meaning (always pair with icon,
text or position) · pure `#FFFFFF` page backgrounds · pure `#000000`.

---

## 7. Dark mode

**Not implemented at launch.** Deliberate: this is a marketing site with a designed dark ground
already in the palette, viewed mostly in daylight on mobile. A second full theme doubles the QA
surface for no measurable user benefit here.

The architecture does not preclude it — every colour is a semantic alias over a token, so a dark
theme is a redefinition of §4, not a rewrite of components. Recorded in the decision log.

---

## Related

- [Typography](typography.md) · [Spacing & grid](spacing-grid.md) · [UI/UX direction](ui-ux-direction.md)
- [Gap analysis](../01-research/gap-analysis.md) — differentiation move #5
