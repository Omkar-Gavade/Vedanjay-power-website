# Implementation Notes — Home Page & Navbar

**Status:** Home page and navigation complete. Remaining routes render an honest
"in development" placeholder. Written 2026-08-31.

This records what was actually built, where it differs from the Phase 1–4 specification, and why.
The specification documents remain the source of intent; this is the source of fact.

---

## 1. Stack as built

| Layer | Choice | Note |
|---|---|---|
| Framework | React 19 | Native `<title>`/`<meta>` hoisting removes any need for a helmet library |
| Build | Vite 8 (rolldown) | `manualChunks` as an object is rejected by rolldown; default chunking is used |
| Routing | React Router 7 | Home eager, everything else lazy |
| CSS foundation | **Bootstrap 5.3 — grid + utilities only** | See D-033. Full Bootstrap would add ~160 KB of unused component CSS |
| Visual system | Custom CSS, token-driven | 7 stylesheets under `src/styles/` |
| Theme | `data-bs-theme` on `<html>` | Bootstrap 5.3's native contract, reused. See D-036 |
| Fonts | Archivo Variable + IBM Plex Mono, self-hosted via `@fontsource` | Archivo's `wdth` axis supplies the expanded display width from the same file |

**Bundle:** 89.4 KB JS gzipped · 23.4 KB CSS gzipped · zero console errors.

---

## 2. Stylesheet order

`src/styles/index.css` imports in this order, and the order matters:

```
bootstrap-grid + bootstrap-utilities   ← foundation, must be first
fonts
tokens.css       ← all design tokens + light/dark theme blocks
base.css         ← reset, typography scale, layout primitives
components.css   ← buttons, media, cards
navbar.css  hero.css  sections.css
motion.css       ← last: the reduced-motion overrides must win
```

**Gotcha found in build:** an earlier Tailwind-based iteration put the element reset in unlayered CSS,
where `a { color: inherit }` silently defeated every text-colour utility. With Bootstrap this cannot
recur (Bootstrap ships no reset here — `bootstrap-reboot` is deliberately not imported), but the
ordering above is load-bearing and should not be rearranged casually.

---

## 3. Component map

```
components/
├── ui/          Button · Media · Reveal (+RevealLines) · SectionHeading
├── nav/         Header · MegaMenu (+SimpleDropdown) · MobileDrawer
│                Brand · BrandMark · ThemeToggle
├── layout/      RootLayout · Footer · VerificationBadge (dev only)
└── home/        Hero · Intro · Capabilities · Industries · Projects
                 Numbers · Clients · WhyUs · ClosingCTA
```

Nine homepage sections, matching the storytelling sequence in
`docs/02-information-architecture/page-specifications.md §1`.

**`Media` is the only component that renders a photograph.** It resolves a slug from the media
registry, applies the focal point, wires the `srcset`, and degrades to a branded gradient panel when
an asset is missing — never a broken-image icon.

---

## 4. Motion system as built

Six patterns, all in `motion.css`, all suppressed under `prefers-reduced-motion`:

| Pattern | Where |
|---|---|
| Reveal (fade + 22px rise) | Every section |
| Line reveal (text rises out of its own mask) | Hero headline |
| Image reveal (clip-path wipe + settle from 1.16 scale) | Intro, Projects, WhyUs figures |
| Hero cross-dissolve + slow drift | Hero, 1.4s dissolve on a 6.5s dwell |
| Rule draw / bar fill | Section rules, project register bars |
| Hover: media zoom, arrow nudge | Cards, links, buttons |

**Safety contract:** elements render *visible* and are only "armed" (hidden) once JS confirms motion
is allowed. This ordering makes stranded-invisible content structurally impossible — verified in QA
by forcing the reduced-motion end state and confirming 0 of 48 animated elements stayed hidden.

One shared `IntersectionObserver` serves all reveals; one passive rAF-throttled scroll listener serves
the header. Reveal threshold is `0.01` with a negative bottom margin — a larger threshold can never
fire for elements taller than the viewport.

---

## 5. Navbar behaviour as built

- **Transparent over the hero**, condensing to a blurred, hairline-bordered bar past 28px scroll.
- The over-hero scrim belongs to the **header**, not the photograph, so contrast holds whatever frame
  is showing.
- Hides on scroll-down past 520px, returns on any scroll-up. **Disabled under reduced motion** —
  motion that removes navigation is the kind that causes discomfort.
- Parent items are links *and* triggers: click navigates, hover opens. 130ms open intent, 220ms close
  grace so a diagonal path into the panel does not dismiss it.
- Full WAI-ARIA disclosure keyboard model — verified: `ArrowDown` opens and focuses the first item,
  `aria-expanded` tracks state, `Escape` closes and returns focus to the trigger.
- Mobile: full-height drawer, accordions (not drill-down), focus trap, scroll lock without layout
  shift, cascading row entrance, and tap-to-call / tap-to-email in the foot.

---

## 6. Bugs found and fixed during QA

Recorded because each is a class of defect worth watching for.

| # | Defect | Cause | Fix |
|---|---|---|---|
| 1 | Nav links dark-on-dark over the hero | Unlayered reset outranked utilities (Tailwind iteration) | Reset moved into `@layer base`; later removed entirely with the Bootstrap switch |
| 2 | `window.scrollY` frozen at 0 — header states dead | `overflow-x: hidden` on `body` makes it a scroll container | `overflow-x: clip` on both `html` and `body` |
| 3 | Reveals never firing on tall sections | `threshold: 0.15` unreachable for elements taller than the viewport | `threshold: 0.01` + negative `rootMargin` |
| 4 | Bullet points in the mobile drawer | Reset scoped to `ul[class]`; the drawer list has no class | Reset applies to all `ul, ol` |
| 5 | "2011" badge overlapping the heading at 576–991px | Badge absolutely positioned while the layout had already stacked | Returns to flow below 992px, with its own border in dark mode |
| 6 | Numbers/Projects/CTA headings invisible in light theme | Sections paint their own dark ground but inherited light-theme near-black type | `.vp-on-dark-ground` re-points the text tokens |
| 7 | Homepage published "All 53 projects" | Hand-written category counts summed to 53 against a 52-row register | Counts corrected in app **and** docs; `REGISTER_TOTAL` is now the single figure, with a dev assertion |
| 8 | 9px logo sub-label, 11px eyebrows | Below the legibility floor — the exact defect flagged on the legacy site | Raised to 11px / 12px minimum |
| 9 | Capability stage 4:3 dominating stacked layouts | Fixed ratio | 16:9 below 992px |

---

## 7. Responsive verification

Audited at **320 · 375 · 414 · 768 · 1024 · 1440 · 1920**. At every width:

- `document.documentElement.scrollWidth === clientWidth` — **no horizontal overflow**
- **no clipped text** (no element with `scrollWidth > clientWidth`)
- **no touch target under 44px** (inline text links excluded, per WCAG 2.5.8)
- **no text below 12px** except the logo sub-label (11px) and a decorative caret
- **no broken images**, all `alt` present, exactly one `<h1>`

Layout transitions: navigation switches from drawer to horizontal at **992px**; the container caps at
**1360px**; the hero raises its height cap to 920px above 1400px.

---

## 8. Known gaps

1. **Photography is temporary.** 18 Unsplash placeholders — see D-037 and
   `frontend/public/images/CREDITS.json`. The registry makes replacement a one-file change.
2. **Seven claims are withheld** by the verification gate and do not render: the QCA registration,
   the 'A' class licence, ISO certifications, the enercast partnership, and the three MW figures.
   The dev-only badge lists them. They publish by flipping `verified: true` once evidenced.
3. **`ind-commercial` and `trust-team` images are loaded but currently unused** by any section —
   they are staged for the Industries and About pages.
4. **Only the home route is built.** Everything else renders the "in development" placeholder;
   navigation links to those routes already, which is intentional so the IA is testable.
5. **No automated test suite yet.** QA to date is manual plus scripted DOM audits.

---

## Related

- [Frontend architecture](frontend-architecture.md) — the specification this implements
- [Decision log](../05-decisions/decision-log.md) — D-033 to D-038 cover this phase
- [Page specifications §1](../02-information-architecture/page-specifications.md) — homepage sequence
