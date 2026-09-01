# Responsive Strategy

**Context from the audit.** The legacy site's mobile experience is not merely unpolished — it is
broken. The hero headline renders as "We are the Profes…", clipped mid-word, because Slider
Revolution positions caption layers at absolute pixel coordinates computed for a fixed design width:
`.tp-mask-wrap` measures **800px inside a 375px viewport**. The company name renders as "edanjay
Power Pvt. Ltd.". Broken-image placeholders appear inside the hero. The CTA renders at roughly 10px.

Mobile is where this audience actually reads. Getting it right is not a finishing pass.

---

## 1. Breakpoints

| Name | Range | Design target |
|---|---|---|
| `xs` | 320–479 | 360px |
| `sm` | 480–767 | 600px |
| `md` | 768–1023 | 834px |
| `lg` | 1024–1439 | 1280px |
| `xl` | ≥ 1440 | 1512px |

**Mobile-first.** Base styles are unprefixed; every media query is `min-width`. Design begins at
360px — the narrowest realistic Android width — because a layout that works at 360 works everywhere,
while the reverse is not true.

The major layout shift is at **1024px**, where navigation changes from drawer to horizontal and the
grid opens from 8 to 12 columns.

---

## 2. What changes at each breakpoint

### Typography
Handled by `clamp()` — continuous scaling with **no breakpoint jumps**, so there is no width at
which type is mis-sized. See `typography.md §3`.

| | Mobile 375 | Desktop 1440 |
|---|---|---|
| Homepage H1 | 40px | 88px |
| Section H2 | 28px | 44px |
| Body | 16px | 17px |
| Statistic | 40px | 72px |

**Body never drops below 16px** — which also prevents iOS Safari's automatic zoom on input focus.

### Grid
4 columns (<640) → 8 (640–1023) → 12 (≥1024). Gutters 16 → 24 → 32px.

### Container padding
20 → 24 → 32 → 48 → 64px.

### Section spacing
Standard sections: 64 → 80 → 96 → 112px. Hero: 96 → 128 → 160 → 176px.
Roughly a 1.75× expansion from mobile to large desktop — mobile needs density, desktop needs air.

---

## 3. Component behaviour by breakpoint

| Component | Mobile (<768) | Tablet (768–1023) | Desktop (≥1024) |
|---|---|---|---|
| **Header** | 64px, always solid, hamburger | 64px, solid, hamburger | 88px transparent → 72px solid, full nav |
| **Navigation** | Full-screen drawer, accordions | Drawer | Horizontal + mega-menu |
| **Enquire CTA** | Full-width in drawer foot | In drawer | Copper button in header |
| **Hero** | Text over image, 4:5 crop, stacked full-width CTAs | 3:2 crop, inline CTAs | 16:9 or full-bleed, inline CTAs |
| **Proof strip** | 2×2 grid | 4-across | 4-across inline |
| **Service cards** | 1-up | 2-up | 3-up |
| **Statistics** | 2×2 | 2×2 | 4-across |
| **Segment cards** | 1-up (<480) / 2-up | 2-up | 4-across |
| **Logo grid** | 3-across, no hover | 4-across | 6-across, hover |
| **Editorial split** | Stacked, image first | Stacked | 5/7 asymmetric |
| **Case study fact bar** | 2-col definition list | 3-col | Inline row |
| **Project register** | **Cards** | Table, horizontal scroll | Full table |
| **Filters** | Bottom sheet + count badge | Collapsible bar | Inline chip bar |
| **Service in-page nav** | Scrollable chip row, pinned | Chip row | Sticky side rail |
| **Process steps** | Vertical timeline | Vertical timeline | Horizontal 4-up |
| **Footer** | Accordion columns | 2-col | 4-col |
| **Forms** | Single column, 48px fields | Single column | Two-column where paired |
| **State map** | State list | Map | Map + list |

---

## 4. Images

The legacy site serves a **1.47 MB JPEG** and a **1.04 MB JPEG** in the hero, with no `srcset`, no
lazy loading, no modern formats and no dimensions.

```html
<picture>
  <source type="image/avif" srcset="hero-640.avif 640w, hero-1024.avif 1024w,
                                    hero-1440.avif 1440w, hero-2048.avif 2048w"
          sizes="100vw">
  <source type="image/webp" srcset="…">
  <img src="hero-1024.jpg" width="1600" height="900" alt="…"
       loading="eager" fetchpriority="high" decoding="async">
</picture>
```

**Rules.**
- AVIF → WebP → JPEG fallback chain.
- Widths generated at 640 / 1024 / 1440 / 2048.
- Explicit `width`/`height` on every image (prevents CLS).
- `loading="lazy"` on everything below the fold; `fetchpriority="high"` on the hero only.
- **Art direction, not just scaling:** the hero uses a different crop on mobile (4:5, focal point
  preserved) rather than a letterboxed desktop image. A 16:9 substation photograph scaled to 375px
  shows nothing legible.
- **Budget: no single image over 200 KB** at its largest served size.

---

## 5. Touch

- **Minimum target 44 × 44px**, everywhere. The legacy hero CTA is far below this.
- **8px minimum spacing** between adjacent targets.
- **No hover-dependent information.** Every hover state has a touch or focus equivalent; nothing is
  revealed only on hover.
- Tap-to-call and tap-to-email are primary actions on mobile Contact and in the nav drawer —
  on a phone, calling beats typing.
- `touch-action: manipulation` to remove the 300ms tap delay.
- Primary actions sit within comfortable thumb reach; destructive or secondary actions do not.

---

## 6. Rules that prevent the legacy failures

These are stated as testable constraints because each maps to a specific measured defect.

1. **No fixed pixel widths on layout containers.** Every container uses `%`, `fr`, `ch`, `rem` or
   `clamp()`. *(Fixes: `.tp-mask-wrap` at 800px inside 375px.)*
2. **`document.documentElement.scrollWidth` must never exceed `window.innerWidth`** at any width from
   320px to 2560px. Asserted in the responsive test pass. *(Fixes: horizontal overflow.)*
3. **Text must never be clipped.** No `overflow: hidden` on any text container without an explicit,
   reviewed reason. *(Fixes: "We are the Profes…".)*
4. **Absolute positioning is not used for text layout.** Hero text is grid- or flow-positioned.
   *(Fixes: the root cause of the slider bugs.)*
5. **Every image has explicit dimensions.** *(Fixes: layout shift.)*
6. **Minimum body size 16px, minimum target 44px.** *(Fixes: the ~10px CTA.)*
7. **Tables become cards below 768px.** *(Fixes: the 52-row register.)*

---

## 7. Testing matrix

| Width | Device class | Checks |
|---|---|---|
| 320 | Small Android | No overflow, no clipping, everything readable |
| 360 | Common Android | Primary mobile design target |
| 375 | iPhone SE / mini | **The width where the legacy site fails** |
| 390 | iPhone 14/15 | Most common iOS width |
| 430 | iPhone Pro Max | |
| 768 | iPad portrait | Grid transition to 8-col |
| 834 | iPad Air | |
| 1024 | iPad landscape | **Navigation transition** — drawer → horizontal |
| 1280 | Laptop | Primary desktop target |
| 1440 | Desktop | |
| 1920 | Large desktop | Container caps; no over-stretched measure |
| 2560 | Ultrawide | Layout stays centred and contained |

**Per width, verify:** no horizontal scroll · no clipped text · all targets ≥44px · images correctly
cropped · nav operable · forms usable · focus visible throughout a full keyboard pass.

**Also tested:** 200% browser zoom (WCAG 1.4.4), 400% zoom reflow (WCAG 1.4.10), landscape phone
orientation, and `prefers-reduced-motion`.

---

## 8. Performance budget

| Metric | Budget |
|---|---|
| LCP (mobile, 4G) | **< 2.5s** |
| INP | < 200ms |
| CLS | **< 0.05** |
| JS (initial route, gzipped) | **< 120 KB** |
| CSS (gzipped) | < 25 KB |
| Fonts | < 95 KB (2 variable families, latin subset) |
| Largest image | < 200 KB |
| Total initial page weight | **< 600 KB** |
| Requests (initial) | < 30 |

For comparison, the legacy homepage issues **55 script requests and 18 stylesheet requests**, and
ships 609 KB of icon JavaScript plus 2.5 MB of hero JPEGs.

---

## Related

- [Spacing & grid](spacing-grid.md) · [Typography](typography.md) · [Components](components.md)
- [Existing website audit §5–§6](../01-research/existing-website-audit.md) — the measured failures
