# Typography

---

## 1. The problem to solve

The legacy site declares exactly one webfont — **Arimo**, loaded over `http://fonts.googleapis.com`
on an HTTPS page. **The browser blocks it as mixed content.** The intended typeface has never
rendered in production; the site displays in the browser's Arial fallback. Headings are pinned at a
fixed `28px !important`, so they do not scale across breakpoints.

In other words: **there is currently no typographic design in production at all.** Typography is
therefore not a refinement on this project — it is the single largest available upgrade in perceived
quality, and the cheapest.

---

## 2. Type pairing

Two families. Both variable, both self-hosted, both with genuine reason to be here.

### Display & text — **Archivo**

An industrial grotesque from Omnibus-Type, designed for **both** display and text — which lets one
family carry headlines and body without a mismatched pairing. Its `Archivo Expanded` optical width
gives hero headlines architectural presence that a normal-width grotesque cannot.

**Why not the obvious choices.** Inter is the default of every SaaS product and reads as a template —
the brief explicitly rejects generic SaaS design. Poppins and Montserrat are the Indian corporate
default and would place Vedanjay exactly where the sector already is. Archivo is neutral enough for
a corporate register but has enough character — squared terminals, tight apertures, a slightly
condensed lowercase — to read as *engineered* rather than *generic*.

### Technical data — **IBM Plex Mono**

Used for statistics, kickers, table figures, technical specifications, voltage classes, capacities
and breadcrumbs.

**This is the distinctive move in the system.** A monospace for numerals makes statistics read as
*instrument readouts* rather than marketing figures — which is exactly the register for a firm whose
work is metering, telemetry, SCADA and load despatch. It also solves a real problem: filterable
tables of MW and kV values need tabular alignment. IBM Plex Mono carries engineering heritage and is
warmer and less code-editor-ish than JetBrains Mono.

The pairing is a deliberate expression of the positioning: **Archivo for the corporation, Plex Mono
for the engineering.**

```
--font-display : 'Archivo Expanded', 'Archivo', system-ui, sans-serif
--font-sans    : 'Archivo', system-ui, -apple-system, 'Segoe UI', sans-serif
--font-mono    : 'IBM Plex Mono', ui-monospace, 'SF Mono', Menlo, monospace
```

### Loading strategy

- **Self-hosted**, not Google Fonts CDN. Removes a third-party origin, a DNS lookup and a privacy
  concern — and makes the mixed-content failure structurally impossible.
- Variable WOFF2 only. Latin subset. Roughly **~95 KB total** for both families — versus the legacy
  site's **609 KB of JavaScript for icons alone**.
- `font-display: swap`, with `<link rel="preload">` on the two faces used above the fold
  (Archivo Expanded 600, Archivo 400).
- `size-adjust` on the fallback stack to minimise layout shift during swap.
- Weights shipped: Archivo 400 / 500 / 600 / 700; Plex Mono 400 / 500. **Nothing else** — every
  additional weight is bytes on the critical path.

---

## 3. Type scale

**Fluid**, using `clamp()` — one declaration spans mobile to large desktop with no breakpoint jumps
and no possibility of the legacy site's fixed-`28px` failure. Ratio: 1.200 (minor third) at mobile,
opening to 1.333 (perfect fourth) at desktop, so headlines gain authority on large screens while
staying readable on small ones.

| Token | Mobile (375) | Desktop (1440) | `clamp()` | Use |
|---|---|---|---|---|
| `display-xl` | 40px | 88px | `clamp(2.5rem, 1.2rem + 5.6vw, 5.5rem)` | Homepage H1 only |
| `display-lg` | 34px | 64px | `clamp(2.125rem, 1.35rem + 3.3vw, 4rem)` | Page H1 |
| `display-md` | 28px | 44px | `clamp(1.75rem, 1.3rem + 1.9vw, 2.75rem)` | Section headings (H2) |
| `heading-lg` | 22px | 30px | `clamp(1.375rem, 1.17rem + 0.87vw, 1.875rem)` | Sub-sections (H3) |
| `heading-md` | 19px | 22px | `clamp(1.1875rem, 1.13rem + 0.26vw, 1.375rem)` | Card titles (H4) |
| `heading-sm` | 17px | 18px | `clamp(1.0625rem, 1.04rem + 0.11vw, 1.125rem)` | Small headings, labels |
| `body-lg` | 18px | 20px | `clamp(1.125rem, 1.07rem + 0.22vw, 1.25rem)` | Lead paragraphs, intros |
| `body` | 16px | 17px | `clamp(1rem, 0.98rem + 0.11vw, 1.0625rem)` | Default body |
| `body-sm` | 15px | 15px | `0.9375rem` | Captions, table cells, meta |
| `label` | 12px | 13px | `clamp(0.75rem, 0.72rem + 0.11vw, 0.8125rem)` | Kickers, mono labels, breadcrumbs |
| `stat` | 40px | 72px | `clamp(2.5rem, 1.6rem + 3.9vw, 4.5rem)` | Statistic numerals (mono) |

**Body text never drops below 16px on mobile** — the legacy site's illegible logo tagline and ~10px
hero CTA are the failure being designed out.

---

## 4. Weight, line height, tracking

Tracking is not decoration here. Large display type set at default tracking looks amateur; the
negative tracking on display sizes is what separates editorial typography from default typography.

| Style | Family | Weight | Line height | Letter spacing |
|---|---|---|---|---|
| `display-xl` | Archivo Expanded | 600 | 0.95 | **-0.035em** |
| `display-lg` | Archivo Expanded | 600 | 1.00 | **-0.03em** |
| `display-md` | Archivo | 600 | 1.10 | **-0.02em** |
| `heading-lg` | Archivo | 600 | 1.20 | -0.015em |
| `heading-md` | Archivo | 600 | 1.30 | -0.01em |
| `heading-sm` | Archivo | 600 | 1.40 | 0 |
| `body-lg` | Archivo | 400 | **1.60** | 0 |
| `body` | Archivo | 400 | **1.65** | 0 |
| `body-sm` | Archivo | 400 | 1.55 | 0 |
| `label` | IBM Plex Mono | 500 | 1.30 | **+0.12em**, uppercase |
| `stat` | IBM Plex Mono | 500 | 1.00 | -0.02em, `tabular-nums` |

**Rules.**
- Display sizes get **negative** tracking; small uppercase mono labels get **generous positive**
  tracking (+0.12em). Uppercase at default tracking is unreadable.
- Body line height is 1.60–1.65 — generous, because this site carries genuinely technical prose that
  needs to be readable, not skimmed.
- All numerals in statistics and tables use `font-variant-numeric: tabular-nums` so figures align
  in columns and do not jitter during count-up animation.
- Weight 700 is reserved for emphasis inside body copy. Headings are 600 — at display sizes, 700
  reads as shouting.

---

## 5. Measure

| Context | Max width | Reasoning |
|---|---|---|
| Body prose | **68ch** | Within the 45–75 character comfort range |
| Lead paragraph | 56ch | Shorter measure at larger size keeps the line count balanced |
| Display headline | 18ch | Forces 2–3 line headlines with deliberate breaks |
| Card body | 42ch | Constrained by card width |
| Table cell | none | Governed by the table |

The legacy site sets long paragraphs **centre-aligned at full container width** — measure far beyond
75 characters, with a ragged left edge that forces the eye to hunt for each line start.
**All body copy in the new system is left-aligned.** Centring is permitted only for standalone
headings and short CTA blocks under 3 lines.

---

## 6. The kicker system

A recurring device that gives every section a consistent editorial opening and carries the copper
accent at exactly the right scale.

```
━━ COPPER RULE (24px × 2px)
OPEN ACCESS POWER              ← label / Plex Mono / uppercase / +0.12em / ink-500
Cheaper power, legally         ← display-md / Archivo 600 / -0.02em / ink-900
  and reliably sourced.
```

Used on every section heading sitewide. It is the single most repeated pattern in the design and
does most of the work of making the site feel like one designed system rather than assembled pages.

---

## 7. Hierarchy rules

1. **One `<h1>` per page.** The legacy homepage has three.
2. Heading levels never skip. Visual size is a *token*, not a tag — a small heading uses
   `heading-sm` styling on the semantically correct element.
3. Maximum **three** type sizes visible in any single component.
4. Emphasis comes from **size, weight and space** — not colour, and never underline (reserved for links).
5. Body links: `green-500` on light, `green-400` on dark, underlined with a 2px offset; underline
   thickens on hover. Never colour-only.

---

## Related

- [Colour system](color-system.md) · [Spacing & grid](spacing-grid.md) · [Components](components.md)
- [Existing website audit §3](../01-research/existing-website-audit.md) — the mixed-content font failure
