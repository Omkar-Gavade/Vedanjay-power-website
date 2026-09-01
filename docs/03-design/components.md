# Component System

**Governing rule from the brief:** *"Do not create components just for the sake of creating
components."* Every component below exists because it appears **in at least two distinct page
specifications**, or because it encapsulates behaviour too complex to repeat safely (focus
trapping, form state, filtering).

The brief's suggested list has been audited: some components were merged, some rejected, and some
added that the page specs actually require. Reasoning is given in §7.

---

## Component inventory

### Primitives

#### `Button`
| Prop | Values |
|---|---|
| `variant` | `primary` (green fill) · `accent` (copper fill, `ink-950` text) · `secondary` (outline) · `ghost` (text + arrow) |
| `size` | `sm` (36px) · `md` (44px) · `lg` (52px) |
| `as` | `button` · `a` · `Link` — polymorphic |
| `iconRight` `iconLeft` `loading` `disabled` `fullWidth` | |

Minimum touch target 44px at all sizes (`sm` retains 44px of tappable area via padding).
`accent` uses dark-on-copper — the only AA-passing copper pairing (5.09:1).
`loading` sets `aria-busy` and preserves the button's width to prevent layout shift.

#### `Link`
Wraps React Router `Link`; auto-detects external URLs and applies `target="_blank"`
`rel="noopener noreferrer"` plus a visually-hidden "(opens in a new tab)".

#### `Icon`
A single inline-SVG sprite component, ~20 icons, tree-shaken. `aria-hidden` by default;
`title` promotes it to `role="img"`.
*Replaces the legacy site's 609 KB `livicons` JavaScript bundle.*

#### `Container`
`size`: `prose` (720) · `narrow` (960) · `default` (1280) · `wide` (1440) · `full`.
Owns responsive padding so no page repeats it.

#### `Section`
Wraps content with vertical rhythm and background.
`tone`: `paper` · `sunken` (`ink-50`) · `inverse` (`ink-950`) · `brand` (`green-700`)
`spacing`: `hero` · `default` · `compact` · `feature` · `cta`
Renders `<section>`, accepts `aria-labelledby`. **This component is what makes vertical rhythm
consistent sitewide** — the exact thing the legacy site's per-page inline overrides destroy.

#### `Reveal`
Wraps children in the standard reveal animation. Props: `delay`, `stagger`, `disabled`.
Uses the shared `IntersectionObserver` and applies the visible state immediately under
`prefers-reduced-motion`.

---

### Typography & structure

#### `SectionHeader`
The kicker system from `typography.md §6` — the most-repeated pattern on the site.
```
━━ copper rule
KICKER            ← mono, uppercase
Heading           ← display-md
Optional intro    ← body-lg, 56ch
```
Props: `kicker`, `heading`, `intro`, `align` (`left` default, `center` for CTA sections),
`as` (`h2` default — level is controllable independently of size), `tone` (light/inverse).

#### `Prose`
Applies typographic rules to long-form content: 68ch measure, paragraph spacing, list styling,
link treatment. Used by case studies, About and legal pages.

#### `Breadcrumb`
Ordered list + `BreadcrumbList` JSON-LD. Collapses to the immediate parent on mobile.

---

### Navigation

#### `Header`
Composes `Logo`, `PrimaryNav`, `MegaMenu`, `MobileDrawer`, `Button`.
Owns the three scroll states; consumes `useScrollDirection()`.
`heroTone` prop declares whether the route permits the transparent state (opt-in, not global).

#### `MegaMenu`
Services panel. Full keyboard model per `navigation.md §4`. `hidden` when closed.

#### `DropdownMenu`
Simpler disclosure for Industries and About. Shares the mega-menu's keyboard behaviour.

#### `MobileDrawer`
Full-screen drawer, accordion sections, focus trap, body-scroll lock, tap-to-call/email footer.

#### `SectionNav`
Sticky in-page navigation for service pages (≥1024px). `IntersectionObserver`-driven active state.
Becomes a horizontally scrollable chip row on mobile.

#### `Footer`
Four link columns + credential line + CIN + **computed** copyright year.

---

### Content

#### `Card` — one base, four compositions
Rejecting four separate card components in favour of one primitive with composed variants. They
share border, radius, hover behaviour, focus ring and full-card-link semantics; only the internal
slots differ. Four independent components would drift.

| Composition | Slots | Used on |
|---|---|---|
| `ServiceCard` | index numeral, title, descriptor, arrow | Home, `/services/`, mega-menu |
| `ProjectCard` | client, title, meta chips (capacity/voltage/state), category | `/projects/`, service evidence, mobile register |
| `SegmentCard` | icon, title, problem line, arrow | Home, `/industries/` |
| `PersonCard` | photo or initials monogram, name, role, qualifications, LinkedIn | `/about/leadership/` |

Full-card links use a pseudo-element overlay so the card is one tab stop, not several — while inner
links (where present) remain independently reachable.

`PersonCard` **deliberately omits direct phone and email**, replacing them with a "Contact {name}"
action that routes through the enquiry form with a "for the attention of" field. The legacy site
publishes three personal mobile numbers in plain text.

#### `Stat` / `StatGrid`
`Stat`: mono numeral (count-up), unit, label, **`asOf` date**.
The `asOf` prop is **required** — it is a type-level enforcement of Pattern B3 and the direct fix
for the legacy site's contradictory figures. A statistic cannot be rendered without a date.
`StatGrid` handles 3-up and 4-up, degrading to 2×2 on mobile, and renders however many stats it is
given (so the homepage falls back to three if one cannot be evidenced).

#### `LogoGrid`
Normalised monochrome client logos in a uniform bounding box. `grouped` prop for segment grouping.
Fixed aspect ratio per cell prevents the legacy site's ragged mixed-resolution wall.

#### `Timeline`
Vertical dated list. Used for the Recognition timeline on `/about/credentials/` and for the
"How it works" process on service pages.

#### `CredentialBlock`
Licence or registration with issuing authority, number, validity and an optional certificate link.
Renders a `TO VERIFY` state in non-production builds so unverified claims are visible during review
rather than shipping silently.

#### `FeatureBlock`
Asymmetric image-and-content composition (5/7 or 7/5, reversible). Used for the homepage featured
case study, service overviews and About sections.

#### `CTABand`
Full-width closing call to action. `tone`: `inverse` (default) · `brand`. Heading, body, primary and
secondary actions.

#### `FAQ`
Accordion. Native `<details>`/`<summary>` styled — keyboard and screen-reader behaviour for free,
works without JavaScript. Emits `FAQPage` JSON-LD from the same data.

#### `Figure`
Responsive image with caption, `srcset`, AVIF/WebP sources, explicit `width`/`height` (prevents CLS),
`loading="lazy"` below the fold, and a **required** `alt`.
*The legacy homepage has 57 images and zero alt attributes — `alt` being required at the type level
makes that failure impossible to repeat.*

#### `StateMap`
India map highlighting QCA-registered states and executed-project states (Pattern C3).
Inline SVG, no mapping library. Degrades to a plain state list on mobile and without JavaScript.

---

### Project register

#### `ProjectRegister`
Container for the 52-row dataset. Owns filter state, reads and writes the **URL query string** so
filtered views are shareable and linkable from service pages.

#### `FilterBar`
Chip-based multi-select across service, segment, technology, voltage class and state.
Announces result counts via `aria-live="polite"`. Collapses to a bottom sheet on mobile with an
applied-count badge.

#### `ProjectTable`
Desktop table with proper `<caption>`, `<th scope>` and mono figures.
**Below 768px it renders `ProjectCard`s instead** — a hard swap, not a horizontal scroll.
This is the fix for the audit's #6 defect.

---

### Forms

#### `Form` primitives — `Input`, `Textarea`, `Select`, `Checkbox`, `FormField`
`FormField` owns the label / description / error / `aria-describedby` wiring so no field can ship
with a missing or unassociated label.
All inputs carry correct `inputmode`, `autocomplete` and `enterkeyhint`.
Errors are announced via `aria-live` and focus moves to the first invalid field.

#### `EnquiryForm`
The site's primary conversion component — and the single largest functional gap on the legacy site,
which **has no form anywhere**.
Props: `intent` (`general` · `service` · `assessment` · `partnership` · `vendor`), `service`,
`attention`. Intent is read from the query string and pre-selected, so the visitor never re-states
what the originating page already knows.
Includes honeypot + Cloudflare Turnstile, inline validation on blur, a pending state, and a success
state that replaces the form with a confirmation and a reference number.

#### `ProfileDownloadForm`
Gated company-profile download (name, organisation, email) for Journey 3.

---

### Feedback & utility

#### `Alert`
`variant`: `info` · `success` · `warning` · `error`. Icon + colour + text — never colour alone.

#### `Modal`
Focus trap, `Escape` to close, scroll lock, `role="dialog" aria-modal`.
Used only for the mobile filter sheet and image lightboxes. Not for content.

#### `Skeleton`
Loading placeholders matching final content dimensions. No shimmer animation.

#### `SEO`
Per-route `<title>`, meta description, canonical, OG/Twitter tags and JSON-LD.

#### `ErrorBoundary`
Route-level. Renders a branded fallback with navigation rather than a blank page.

---

## 7. Audit of the brief's suggested component list

| Suggested | Decision | Reasoning |
|---|---|---|
| `Navbar` | → `Header` | Composes several parts; "Header" names the actual responsibility. |
| `MegaMenu`, `MobileMenu` | Kept (`MobileDrawer`) | Genuinely distinct behaviour and keyboard models. |
| `Button` | Kept | — |
| `SectionHeader` | Kept | Most-repeated pattern on the site. |
| `Hero` | **Rejected as a component** | Hero content differs structurally per page type. Composed from `Section` + `SectionHeader` + `Button` + `Figure`. A `Hero` component would become a prop-soup god-component — a known anti-pattern. |
| `Stat`, `StatGrid` | Kept, with **required `asOf`** | Type-enforces the dated-statistic rule. |
| `Card` | Kept as **one base + four compositions** | Four independent card components would drift in hover, focus and link semantics. |
| `ServiceCard`, `ProjectCard`, `NewsCard` | Merged into `Card` compositions; `NewsCard` **deferred** | No news at launch. |
| `ImageBlock` | → `Figure` | Standard semantic name; carries alt/CLS/lazy responsibilities. |
| `VideoBlock` | **Deferred** | No video assets exist. Would be speculative. |
| `Timeline` | Kept | Recognition timeline + service process. |
| `LogoCloud` | → `LogoGrid` | "Cloud" implies scattered placement; this is a normalised grid — which is the whole point of the fix. |
| `Testimonial` | **Rejected** | No testimonials exist and none are `TO VERIFY`-able. Building it would invite fabrication. Named repeat business is stronger evidence anyway. |
| `CTA` | → `CTABand` | — |
| `Breadcrumb` | Kept | — |
| `Footer` | Kept | — |
| `Form`, `Input`, `Select` | Kept, plus `FormField`, `Textarea`, `Checkbox` | `FormField` is what makes label/error/`aria-describedby` wiring impossible to get wrong. |
| `Modal` | Kept, **scope narrowed** | Mobile filter sheet and lightbox only. Never for content — modal content is unlinkable and unindexable. |
| `Accordion` | → `FAQ`, on native `<details>` | Free keyboard and AT behaviour; works without JS. |
| `Tabs` | **Rejected** | The legacy site's central architectural failure is exactly this: six services behind a tab-like toggle on one URL. Tabs hide content from search, deep links and analytics. Replaced by six routed pages (Pattern A1). |
| — | **Added:** `CredentialBlock` | Pattern C5; page specs require it on four pages. |
| — | **Added:** `StateMap` | Pattern C3. |
| — | **Added:** `ProjectRegister`, `FilterBar`, `ProjectTable` | Pattern C2; the 52-row dataset needs real behaviour. |
| — | **Added:** `Section`, `Container`, `Reveal`, `Prose`, `SectionNav`, `SEO`, `ErrorBoundary` | Structural; each removes repetition across every page. |

**Net: 38 components.** Every one is used on two or more pages, or encapsulates behaviour that must
not be reimplemented.

---

## 8. Component API principles

1. **Composition over configuration.** `<Section tone="inverse"><SectionHeader …/>…</Section>`,
   not `<Section header={{…}} items={[…]} />`.
2. **No boolean explosion.** More than three booleans means a `variant` enum is missing.
3. **Semantic level is decoupled from visual size.** `<SectionHeader as="h3" size="display-md">`.
4. **Accessibility is not optional.** `alt` on `Figure`, `asOf` on `Stat`, and a label on every
   `FormField` are **required props** — the type signature enforces what review would otherwise miss.
5. **No component owns page data.** Data arrives as props from the route, so components stay
   testable and the content source can change without touching them.
6. **Every interactive component is keyboard-complete before it is styled.**

---

## Related

- [Page specifications](../02-information-architecture/page-specifications.md)
- [Navigation](navigation.md) · [Motion system](motion-system.md) · [Frontend architecture](../04-architecture/frontend-architecture.md)
