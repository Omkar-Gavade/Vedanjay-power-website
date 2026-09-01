# Navigation Specification

The brief designates the navbar as high priority. It is also where the legacy site fails most
structurally: seven top-level items with **inverted commercial weight** (a single-partner page holds
a slot while six services share one), no distinct CTA, no active-page indication, and a spelling
error — "Image Gallary" — in the primary menu.

---

## 1. Structure

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                                                                                │
│   [VEDANJAY POWER]    Services ▾  Industries ▾  Projects  About ▾  Contact     │
│                                                             [ Enquire → ]      │
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘
```

**Five primary items + one action.** Below the ~7-item scanning threshold, with deliberate room for
`Insights` and `Careers` in Phase 2 without restructuring.

| Item | Type | Target |
|---|---|---|
| Logo | Link | `/` |
| Services | **Mega-menu** | `/services/` |
| Industries | Dropdown | `/industries/` |
| Projects | Link | `/projects/` |
| About | Dropdown | `/about/` |
| Contact | Link | `/contact/` |
| **Enquire** | **Button (copper)** | `/contact/?intent=general` |

**Parent items are links, not just triggers.** Clicking "Services" navigates to `/services/`;
hovering opens the menu. A trigger that does nothing on click is a common and frustrating failure.

**Deliberately excluded:**
- **Search** — a 19-page site does not warrant it. Search adds an input, an index, an empty state
  and a results template to build and maintain, in exchange for solving a findability problem that
  five nav items already solve. Revisit if Insights ships and the page count exceeds ~40.
- **Language switcher** — single-language site (`en-IN`).
- **Stock ticker** — Waaree's pattern; Vedanjay is a private limited company.
- **Announcement ticker** — the legacy site's marquee is clipped mid-word at both edges and is a
  WCAG 2.2.2 failure. Rejected (Pattern B9).

---

## 2. Scroll behaviour

Three states. This is the mechanism that lets the hero image run full-bleed to the top of the
viewport while guaranteeing the header stays legible everywhere else.

| State | Trigger | Appearance |
|---|---|---|
| **Transparent** | At top of a page with a dark hero (`scrollY < 24`) | No background. Logo and links in `paper`. A `ink-950` gradient scrim (0.5 → 0) behind the header guarantees contrast regardless of the photograph beneath. Height 88px. |
| **Solid** | `scrollY ≥ 24` on any page | `paper` background at 0.96 opacity with `backdrop-filter: blur(12px)`; 1px `ink-200` bottom border; `shadow-sm`. Logo and links in `ink-900`. Height **72px**. |
| **Hidden** | Scrolling **down** past 400px | Translates up by its own height. Returns immediately on any upward scroll. |

**Accessibility rule — non-negotiable.** The transparent state never relies on the photograph for
contrast. The gradient scrim is part of the header component, not the hero image. This is precisely
where the legacy site fails WCAG AA.

**Pages without a dark hero** (Contact, legal, 404) start in the solid state. The transparent state
is opt-in per route, not a global default.

**Implementation.** A single passive scroll listener behind `requestAnimationFrame`, exposed as
`useScrollDirection()`. The header transitions `background`, `height` and `transform` only — all
compositor-friendly properties. **No layout property is animated.**

**Reduced motion.** Under `prefers-reduced-motion: reduce`, the hide-on-scroll behaviour is disabled
entirely — the header simply stays solid and visible. Motion that removes navigation is exactly the
kind that causes discomfort.

---

## 3. Services mega-menu

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                                                                  │
│  ━━ SERVICES                              ━━ BY INDUSTRY    ━━ FEATURED          │
│                                                                                  │
│  01  Open Access Power      04  Rooftop Solar    Industrial   ┌──────────────┐   │
│      Cheaper power under        Turnkey solar    Commercial   │              │   │
│      intra-state open access    on your roof     Utilities    │  [photo]     │   │
│                                                  RE Generators│              │   │
│  02  Forecasting &          05  Operations &                  └──────────────┘   │
│      Scheduling                 Maintenance      ───────────  Suzlon · 29.4 MW   │
│      QCA-registered in          Solar & wind     All services→ Telemetry to      │
│      three states               O&M                            SLDC sync         │
│                                                                Read the case →   │
│  03  Regulatory             06  Electrical                                       │
│      Liaisoning                 Infrastructure                                   │
│      CEIG, DISCOM, SLDC,        33 / 132 / 220 kV                                │
│      grid connectivity          works                                            │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

- Spans `container-wide` (1440px), anchored below the header. Not full-viewport-width — a menu wider
  than the content it belongs to loses its relationship to the trigger.
- Every service carries a **one-line descriptor** (Pattern D3). Six bare names do not convey scope,
  and the descriptors are where the buyer's own vocabulary appears.
- Mono numerals `01`–`06` supply rhythm and reinforce the technical register.
- The **QCA descriptor sits in the menu itself** — the credential works hardest where decisions are
  made, not only on the page that explains it.
- The featured case study makes the menu a discovery surface rather than a list, and gives the
  differentiating asset a permanent, sitewide placement.

**Behaviour.**
- **Open:** hover (150ms intent delay) or `Enter`/`Space`/`ArrowDown` on the trigger.
- **Close:** `Escape` (focus returns to the trigger), click outside, focus leaving the menu, or
  route change.
- **Close delay:** 200ms on mouse-leave, so a diagonal cursor path to a menu item does not dismiss it.
- **Animation:** opacity 0→1, translateY −8px→0, 200ms. Content does not stagger — a menu is a tool,
  and staggering delays the user's target.
- **One menu open at a time.**

---

## 4. Keyboard & accessibility

The legacy site's service tabs are `onclick` handlers on non-interactive elements — unreachable and
inoperable by keyboard. The new navigation meets the WAI-ARIA disclosure pattern.

| Key | Behaviour |
|---|---|
| `Tab` | Moves through: skip link → logo → each nav item → Enquire. A **closed** menu's children are not in the tab order. |
| `Enter` / `Space` on a trigger | Toggles the menu |
| `ArrowDown` on a trigger | Opens the menu and focuses its first item |
| `ArrowUp` / `ArrowDown` inside | Moves between items |
| `Escape` | Closes; **returns focus to the trigger** |
| `Tab` from the last item | Closes and moves to the next header item |

**Semantics.** `<nav aria-label="Primary">` · `<button aria-expanded aria-controls>` for triggers ·
`aria-current="page"` on the active link · a skip-to-content link as the first focusable element ·
menu panels are `hidden` (not merely visually hidden) when closed, so their links are invisible to
assistive technology and to sequential navigation.

**Focus.** A 2px `copper-500` ring at 2px offset, using `:focus-visible`. Focus indicators are
**never** removed — the legacy theme suppresses them.

**Touch targets.** Every interactive element is at least 44 × 44px. The legacy hero CTA measures far
below this.

---

## 5. Mobile navigation (< 1024px)

```
┌──────────────────────────────┐    ┌──────────────────────────────┐
│ [LOGO]              [ ☰ ]    │    │ [LOGO]              [ ✕ ]    │
└──────────────────────────────┘    ├──────────────────────────────┤
                                    │  Services              ⌄     │
    Header: 64px, always solid      │    Open Access               │
                                    │    Forecasting & Scheduling  │
                                    │    Regulatory Liaisoning     │
                                    │    Electrical Infrastructure │
                                    │    Rooftop Solar             │
                                    │    Operations & Maintenance  │
                                    │    All services →            │
                                    │  Industries            ⌄     │
                                    │  Projects                    │
                                    │  About                 ⌄     │
                                    │  Contact                     │
                                    ├──────────────────────────────┤
                                    │  [    Enquire →          ]   │
                                    │  📞 +91 73142-39605          │
                                    │  ✉  services@vedanjay-…      │
                                    └──────────────────────────────┘
```

- **Full-screen drawer**, not a dropdown. Slides from the right, 250ms.
- **Accordion sections** — tapping "Services" expands in place. **No nested drilldown screens**:
  going one level deep and back is a well-documented source of disorientation, and with only six
  children per section, accordions are faster.
- Each accordion ends with an "All services →" link to the parent page, so the parent is reachable.
- **Enquire is a full-width button**, pinned at the drawer foot.
- **Phone and email are tap-to-call and tap-to-email**, directly in the drawer. On a phone, calling
  beats filling in a form — and the audit found no form exists at all today.
- Body scroll locks while open; focus is trapped; `Escape` closes; the trigger regains focus.
- Row height 56px — comfortably above the 44px minimum.

---

## 6. Breadcrumbs

On every page below top level (Pattern A5). Critical because Journey 1 arrives **directly on a
service page from search** and needs orientation without having seen the homepage.

```
Home  ›  Services  ›  Regulatory Liaisoning
```

- `label` type (Plex Mono, uppercase, +0.12em), `ink-500`, current page in `ink-900`, not a link.
- `<nav aria-label="Breadcrumb">` with an ordered list; separators are CSS pseudo-elements
  (`aria-hidden`), never text nodes.
- Emits `BreadcrumbList` JSON-LD.
- On mobile: shows only the immediate parent (`‹ Services`) to preserve horizontal space.

---

## 7. Active state

The legacy site highlights only "Home" and gives no active indication anywhere else.

- **Top-level:** a 2px `copper-500` underline, inset 4px below the label; `aria-current="page"`.
- **Section match:** `/services/liaisoning/` marks **Services** active — a child route activates
  its parent.
- **Within a mega-menu:** the active service carries a copper left border and `ink-900` text.
- **In-page section nav** (service pages, ≥1024px): a sticky rail tracking scroll position via
  `IntersectionObserver`; the active section is marked with a copper indicator and `aria-current="true"`.

---

## 8. Footer navigation

Specified in [`docs/02-information-architecture/sitemap.md §4`](../02-information-architecture/sitemap.md).
It functions as the site's second navigation axis (Pattern A6) — a genuine sitemap rather than the
legacy footer's four links — and carries the credential line (QCA, 'A' class licence, CIN) on every
page, which supports Journeys 3 and 6.

**The copyright year is computed at render time.** The legacy site's hard-coded "2017" is the single
clearest signal of abandonment on the whole site, and it is a one-line fix that must not be repeated.

---

## Related

- [Sitemap](../02-information-architecture/sitemap.md) · [Components](components.md) · [Motion system](motion-system.md)
- [Pattern matrix D1–D3](../01-research/competitor-patterns.md)
