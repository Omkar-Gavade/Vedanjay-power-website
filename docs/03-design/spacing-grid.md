# Spacing, Grid & Layout

---

## 1. The problem to solve

The legacy site has no spacing system. It uses Bootstrap 3 defaults patched per page with inline
`!important` overrides injected into each document's `<head>` — `.bottom-padding{margin-bottom:20px}`,
`#customIconRadius{border-radius:50px;height:100px;width:100px}`, `#headerCentered{padding-top:20px}`.
Each page has its own private spacing rules, so nothing is consistent between them.

Consistent spacing is the least visible and most load-bearing part of looking expensive. It is what
makes a site read as one designed system rather than a set of assembled pages.

---

## 2. Base unit

**4px base, 8px primary rhythm.** Every spacing value is a multiple of 4; most are multiples of 8.

| Token | px | rem | Typical use |
|---|---|---|---|
| `space-0` | 0 | 0 | — |
| `space-1` | 4 | 0.25 | Icon-to-label gap |
| `space-2` | 8 | 0.5 | Tight internal padding |
| `space-3` | 12 | 0.75 | Input padding (vertical) |
| `space-4` | 16 | 1 | Default element gap |
| `space-5` | 20 | 1.25 | Mobile container padding |
| `space-6` | 24 | 1.5 | Card padding, grid gutter |
| `space-8` | 32 | 2 | Card padding (large), tablet container |
| `space-10` | 40 | 2.5 | Group separation |
| `space-12` | 48 | 3 | Desktop container padding |
| `space-16` | 64 | 4 | Section padding (mobile) |
| `space-20` | 80 | 5 | Section padding (tablet) |
| `space-24` | 96 | 6 | Section padding (desktop) |
| `space-32` | 128 | 8 | Section padding (large desktop) |
| `space-40` | 160 | 10 | Hero vertical, major breaks |

---

## 3. Containers

| Token | Max width | Use |
|---|---|---|
| `container-prose` | 720px | Long-form text, case-study body, legal pages |
| `container-narrow` | 960px | Focused content, forms, single-column sections |
| `container` | **1280px** | **Default** — most sections |
| `container-wide` | 1440px | Editorial full-bleed, project register, mega-menu |
| `container-full` | 100% | Hero images, dark bands, maps |

**1280px** is chosen deliberately over 1140px (Bootstrap-era, dated) and 1536px (too wide — the
measure becomes uncomfortable and the layout loses tension). At 1280px with 48px padding, the
content area is 1184px, which divides cleanly into a 12-column grid at 24px gutters.

### Container padding (gutter to viewport edge)

| Breakpoint | Padding |
|---|---|
| < 480px | 20px |
| 480–767px | 24px |
| 768–1023px | 32px |
| 1024–1439px | 48px |
| ≥ 1440px | 64px |

---

## 4. Grid

**12 columns**, `display: grid`, not a float or flex emulation.

| Breakpoint | Columns | Gutter |
|---|---|---|
| < 640px | 4 | 16px |
| 640–1023px | 8 | 24px |
| ≥ 1024px | 12 | 24px |
| ≥ 1440px | 12 | 32px |

### Standard column patterns

| Pattern | Desktop | Tablet | Mobile |
|---|---|---|---|
| Service cards | 4 + 4 + 4 (3-up) | 4 + 4 (2-up) | 4 (1-up) |
| Statistics | 3 + 3 + 3 + 3 (4-up) | 4 + 4 (2-up) | 2 + 2 (2-up) |
| Editorial split | 5 + 7 or 7 + 5 | 8 (stacked) | 4 (stacked) |
| Case study feature | 6 + 6, offset | 8 (stacked) | 4 (stacked) |
| Text + sidebar | 8 + 4 | 8 (stacked) | 4 (stacked) |
| Project register | 12 (table) | 12 (table, scroll) | 4 (**cards**) |

**Asymmetry is the default for editorial sections.** A 5/7 or 7/5 split has visual tension that a
6/6 split does not. 6/6 is reserved for genuinely peer content.

---

## 5. Vertical rhythm

Section padding is the primary driver of perceived premium quality. Generous whitespace is what the
brief's §17 means by "looks expensive because of restraint".

| Section type | Mobile | Tablet | Desktop | Large |
|---|---|---|---|---|
| **Hero** | 96 / 64 | 128 / 80 | 160 / 96 | 176 / 112 |
| **Standard** | 64 | 80 | 96 | 112 |
| **Compact** (logo strips, proof bars) | 40 | 48 | 56 | 64 |
| **Feature** (dark bands, case studies) | 80 | 104 | 128 | 144 |
| **Closing CTA** | 72 | 88 | 104 | 120 |

*(Hero shows top / bottom separately — the top absorbs the fixed header.)*

### Within a section

| Gap | Value |
|---|---|
| Kicker → heading | `space-3` (12) |
| Heading → body | `space-4` (16) |
| Heading block → content | `space-10` mobile / `space-12` desktop |
| Content → section CTA | `space-10` (40) |
| Between cards in a grid | `space-6` mobile / `space-8` desktop |
| Between paragraphs | `space-6` (24) |
| Between list items | `space-3` (12) |

**Rule:** the gap *between* groups is always larger than the gap *within* a group. Proximity is what
communicates structure — when both gaps are equal, as on the legacy site, everything reads as one
undifferentiated block.

---

## 6. Radius, borders, elevation

Deliberately restrained. The brief rejects "excessive rounded cards"; heavy radii and soft shadows
are the visual signature of consumer SaaS, not of infrastructure engineering.

| Token | Value | Use |
|---|---|---|
| `radius-none` | 0 | Images, dark bands, table cells |
| `radius-sm` | 2px | **Default** — cards, inputs, buttons |
| `radius-md` | 4px | Modals, dropdowns, mega-menu |
| `radius-full` | 9999px | Filter chips and avatars **only** |

**2px is the house radius.** Enough to avoid looking unfinished; small enough to read as engineered
rather than friendly. The legacy site's 50px circular icon wells are the opposite of this.

**Borders carry structure; shadows almost never do.**

| Token | Value |
|---|---|
| `border-hairline` | 1px `ink-200` |
| `border-default` | 1px `ink-300` |
| `border-accent` | 2px `copper-500` (active/hover) |
| `shadow-sm` | `0 1px 2px rgb(10 15 13 / 0.05)` |
| `shadow-md` | `0 4px 12px rgb(10 15 13 / 0.08)` — dropdowns, mega-menu |
| `shadow-lg` | `0 12px 32px rgb(10 15 13 / 0.12)` — modals only |

Cards are defined by a **hairline border and background differentiation**, not by a shadow. On hover
the border shifts to copper. No card in the system carries a resting drop shadow.

---

## 7. Composition principles

1. **Whitespace is the budget.** When a section feels cramped, remove content — do not reduce space.
2. **Asymmetry by default** in editorial sections; symmetry only for genuinely peer content.
3. **Full-bleed with contained text.** Images and dark bands span the viewport; text stays in the
   container. This creates scale without breaking the reading rhythm.
4. **Alignment is absolute.** Everything aligns to the 12-column grid or to a text baseline. Nothing
   is positioned by eye.
5. **One idea per section.** If a section needs two headings, it is two sections.
6. **The 8px rule.** If a value is not a multiple of 8 (or 4 at small scales), it is a mistake.

---

## 8. Z-index scale

Named tokens only. Arbitrary `z-index: 9999` values are what make stacking contexts unmaintainable.

| Token | Value | Use |
|---|---|---|
| `z-base` | 0 | Default |
| `z-raised` | 10 | Cards on hover, sticky in-page nav |
| `z-sticky` | 20 | Sticky section navigation |
| `z-header` | 50 | Site header |
| `z-dropdown` | 60 | Mega-menu, dropdowns |
| `z-drawer` | 70 | Mobile navigation drawer |
| `z-modal` | 80 | Modals, filter bottom sheet |
| `z-toast` | 90 | Notifications |
| `z-skip` | 100 | Skip-to-content link (must beat everything) |

---

## Related

- [Typography](typography.md) · [Colour system](color-system.md) · [Responsive strategy](responsive-strategy.md)
