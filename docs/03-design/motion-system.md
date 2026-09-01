# Motion System

**Principle.** Motion must earn its cost. Every animation in this system supports **hierarchy,
storytelling, feedback or orientation** — the four purposes named in the brief. Anything that only
looks impressive is rejected.

The legacy site is the cautionary case: it ships **three separate slider libraries** (Slider
Revolution across 11 files, LayerSlider with GreenSock, and RoyalSlider), plus 609 KB of JavaScript
to animate icons on hover — and the visible result is a hero headline clipped mid-word on mobile.

---

## 1. Tokens

### Duration

| Token | Value | Use |
|---|---|---|
| `duration-instant` | 100ms | Colour and opacity on small elements |
| `duration-fast` | **150ms** | Hover, focus, button states — the default for feedback |
| `duration-base` | 250ms | Dropdowns, accordions, drawer |
| `duration-slow` | 400ms | Section reveals, hero entrance |
| `duration-deliberate` | 600ms | Hero headline only |
| `duration-count` | 900ms | Statistic count-up |

**Nothing exceeds 600ms except the deliberate count-up.** Beyond ~400ms an interface stops feeling
responsive and starts feeling slow; the perception of quality comes from *precision*, not duration.

### Easing

| Token | Curve | Use |
|---|---|---|
| `ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | **Default** — entrances, reveals. Fast start, soft settle |
| `ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Position changes, drawer |
| `ease-emphasis` | `cubic-bezier(0.16, 1, 0.3, 1)` | Hero entrance only |
| `ease-linear` | `linear` | Count-up, progress |

No spring or bounce curves. They read as playful — the brief explicitly rejects that register.

### Distance

| Token | Value | Use |
|---|---|---|
| `rise-sm` | 8px | Dropdowns, tooltips |
| `rise-md` | **16px** | Section reveals — the default |
| `rise-lg` | 24px | Hero elements |

**Reveal distances stay small.** Long travel (40px+) reads as a template effect and increases the
perceived wait. 16px is enough to register as motion without delaying comprehension.

---

## 2. The four permitted motion patterns

Everything on the site is one of these. If a proposed animation is not on this list, it does not ship.

### A. Section reveal
Sections fade and rise as they enter the viewport.

- `opacity: 0 → 1`, `translateY: 16px → 0`
- 400ms, `ease-out`
- Trigger: `IntersectionObserver`, `threshold: 0.15`, `rootMargin: '0px 0px -80px 0px'`
- **Fires once.** Elements never re-animate on scroll-back — re-animation is disorienting and makes
  a page feel unstable.
- **Stagger:** 60ms between siblings, capped at **6 items** (360ms total). Beyond that the last item
  arrives noticeably late.
- **Above-the-fold content is never reveal-animated** — it would delay first contentful paint of the
  very content that matters most.

### B. Hero entrance
On initial page load only.

```
0ms    kicker      fade + rise-lg,  600ms, ease-emphasis
80ms   headline    fade + rise-lg,  600ms, ease-emphasis
200ms  sub-line    fade + rise-md,  400ms, ease-out
280ms  CTAs        fade + rise-md,  400ms, ease-out
360ms  proof strip fade,            400ms, ease-out
```

Total 760ms. The hero **image never animates** — no Ken Burns, no zoom, no parallax. The photograph
is the proof; moving it undermines it.

### C. Interactive feedback
150ms, `ease-out`, on `transform`, `opacity`, `background-color`, `border-color`, `color` only.

| Element | Hover | Active | Focus |
|---|---|---|---|
| Primary button | Background `green-700` → `green-600` | `translateY(1px)` | 2px copper ring, 2px offset |
| Accent button | Background `copper-500` → `copper-600` | `translateY(1px)` | 2px copper ring |
| Card | Border → `copper-500`; numeral → copper; arrow `translateX(4px)` | — | Ring on the whole card |
| Nav link | Copper underline scales `0 → 1` from left, 150ms | — | Ring |
| Logo grid item | `opacity 0.6 → 1`, 150ms | — | Ring |
| Text link | Underline thickens `1px → 2px` | — | Ring |
| Input | Border `ink-200` → `ink-400` | — | 2px copper ring, border → copper |

**Cards lift by border and arrow, never by shadow or scale.** Scale transforms on cards are the
single most template-looking effect in modern web design.

### D. Statistic count-up
- Counts from 0 to the final value over 900ms, `ease-linear`, once, on first viewport entry.
- **The final value is rendered in the DOM before animation begins**, then animated. This means it
  is correct without JavaScript, correct for screen readers, and correct under reduced motion —
  the animation is a progressive enhancement over already-correct markup.
- `font-variant-numeric: tabular-nums` so digits do not jitter as they change width.
- The unit (`MW`, `+`) and the "as at" date do not animate.

---

## 3. Explicitly rejected

| Effect | Why rejected |
|---|---|
| **Parallax backgrounds** | Costs continuous scroll-linked repaint; a documented trigger for motion discomfort; adds no information. |
| **Custom cursors / cursor followers** | Breaks a platform affordance users rely on; meaningless on touch — which is most of this audience. |
| **Page-transition overlays** | Adds 300–600ms of *nothing* to every navigation. On a content site, speed of arrival is the experience. |
| **Scroll-jacking / snap-scroll sections** | Removes the user's control of their own scroll. |
| **Hero carousels / sliders** | Pattern B8. Also the direct cause of the legacy site's clipped mobile headline. |
| **Marquee / ticker** | Pattern B9. Non-pausable motion is a WCAG 2.2.2 failure; the legacy implementation clips text mid-word at both edges. |
| **Animated icon libraries** | The legacy `livicons` bundle costs 609 KB to animate decoration. |
| **Text scramble / typewriter effects** | Delays reading the most important words on the page. |
| **Letter-by-letter heading reveals** | Same cost, plus it breaks text selection and copy-paste. |
| **Scale-on-hover cards** | Reads as a template; causes subpixel text reflow. |
| **Auto-playing background video** | Large payload, battery cost, and it competes with the headline. Video is permitted only on a case-study page, muted, poster-first, `preload="none"`, behind an explicit play control. |

---

## 4. `prefers-reduced-motion`

Respected globally, not per-component.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Alongside the global reset, components respond individually:

| Behaviour | Under reduced motion |
|---|---|
| Section reveal | Content renders **visible immediately** — never left at `opacity: 0` |
| Hero entrance | No animation; final state on load |
| Count-up | Final value rendered directly |
| Header hide-on-scroll | **Disabled** — header stays solid and visible |
| Mobile drawer | Appears without slide; backdrop fades only |
| Mega-menu | Opens without translate |
| Hover feedback | **Retained** — colour changes are feedback, not decoration, and carry no motion |

**The critical failure to avoid:** a reveal implemented as "start at `opacity: 0`, animate to 1"
leaves content **permanently invisible** if the animation is suppressed. Implementation therefore
uses a `useReveal()` hook that checks the media query and applies the visible class immediately when
reduced motion is set — it never relies on the CSS override alone.

---

## 5. Performance rules

1. **Animate only `transform` and `opacity`.** Never `width`, `height`, `top`, `left`, `margin` or
   `padding` — these trigger layout on every frame.
2. **No `will-change` in stylesheets.** Applied only immediately before a known transition and
   removed after; a permanent `will-change` holds a compositor layer forever.
3. **One `IntersectionObserver` instance**, shared across all reveal targets. Not one per element.
4. **Scroll listeners are passive and rAF-throttled.** Exactly one scroll listener exists sitewide,
   in `useScrollDirection()`.
5. **No animation library at launch.** The four patterns above are ~40 lines of CSS plus two hooks.
   Framer Motion is ~34 KB gzipped to replicate what CSS already does — it is not justified here.
   Recorded in the decision log; revisit only if shared-element transitions are ever required.
6. **Animations pause when the tab is hidden** (`visibilitychange`).
7. **Budget:** total animation JavaScript **under 3 KB gzipped**.

---

## 6. Motion principles, restated

```
Fast          — 150ms feedback; nothing over 600ms
Purposeful    — hierarchy, storytelling, feedback or orientation, or it does not ship
Elegant       — ease-out, small distances, no bounce
Subtle        — 16px rise; if you notice the animation, it is too much
Consistent    — four patterns, applied everywhere; no bespoke effects
Performant    — transform and opacity only; under 3 KB
```

---

## Related

- [Navigation](navigation.md) · [Components](components.md) · [UI/UX direction](ui-ux-direction.md)
- [Existing website audit §6](../01-research/existing-website-audit.md) — the three-slider-library finding
