# Design System — Index & Implementation

The design system is specified across the documents below. This page is the index, the token
implementation reference, and the governance model.

| Document | Contents |
|---|---|
| [UI/UX direction](ui-ux-direction.md) | The creative position, principles, art direction, voice, quality-bar self-assessment |
| [Colour system](color-system.md) | Palette, semantic aliases, verified contrast table, application rules |
| [Typography](typography.md) | Type pairing, fluid scale, weights, tracking, measure, the kicker system |
| [Spacing & grid](spacing-grid.md) | Base unit, containers, 12-column grid, vertical rhythm, radius, elevation, z-index |
| [Components](components.md) | 38 components, APIs, and the audit of the brief's suggested list |
| [Navigation](navigation.md) | Header states, mega-menu, keyboard model, mobile drawer, breadcrumbs |
| [Motion](motion-system.md) | Four permitted patterns, tokens, rejected effects, reduced-motion handling |
| [Responsive strategy](responsive-strategy.md) | Breakpoints, per-component behaviour, images, touch, testing matrix, budgets |

---

## Token implementation

Tokens are declared **once** as CSS custom properties and consumed through Tailwind's theme
extension. This gives Tailwind's authoring ergonomics while keeping a single source of truth that
non-Tailwind CSS and future themes can also read.

`frontend/src/styles/tokens.css`
```css
:root {
  /* Ink */
  --ink-950:#0A0F0D; --ink-900:#111815; --ink-800:#1B2420; --ink-700:#2A3531;
  --ink-600:#3E4A45; --ink-500:#5C6A64; --ink-400:#84938C; --ink-300:#AFBAB4;
  --ink-200:#D2DAD5; --ink-100:#E8EDEA; --ink-50:#F4F7F5;

  /* Green — primary */
  --green-900:#0E2A1C; --green-800:#143D28; --green-700:#1A5033; --green-600:#21653F;
  --green-500:#2E7D4F; --green-400:#489567; --green-300:#74B489; --green-200:#A7D1B4;
  --green-100:#D3E8D9; --green-50:#EEF6F0;

  /* Copper — accent */
  --copper-700:#7B4A1F; --copper-600:#9A5E28; --copper-500:#B87333; --copper-400:#CE8B3F;
  --copper-300:#DBA363; --copper-200:#E8C296; --copper-100:#F4E1CA; --copper-50:#FBF3EA;

  /* Paper */
  --paper:#FAFAF8; --paper-raised:#FFFFFF;

  /* Semantic */
  --success:#2E7D4F; --warning:#85610C; --error:#B3261E; --info:#1F5F8B;

  /* Aliases — components reference ONLY these */
  --surface:var(--paper);          --surface-raised:var(--paper-raised);
  --surface-sunken:var(--ink-50);  --surface-inverse:var(--ink-950);
  --text-primary:var(--ink-900);   --text-secondary:var(--ink-600);
  --text-muted:var(--ink-400);     --text-inverse:var(--paper);
  --text-inverse-muted:var(--ink-300); --text-brand:var(--green-700);
  --border:var(--ink-200);         --border-strong:var(--ink-300);
  --border-inverse:var(--ink-800); --focus-ring:var(--copper-500);
  --action-primary-bg:var(--green-700); --action-primary-fg:var(--paper);
  --action-accent-bg:var(--copper-500); --action-accent-fg:var(--ink-950);
  --rule-accent:var(--copper-500);

  /* Type */
  --font-display:'Archivo Expanded','Archivo',system-ui,sans-serif;
  --font-sans:'Archivo',system-ui,-apple-system,'Segoe UI',sans-serif;
  --font-mono:'IBM Plex Mono',ui-monospace,'SF Mono',Menlo,monospace;

  /* Motion */
  --duration-instant:100ms; --duration-fast:150ms; --duration-base:250ms;
  --duration-slow:400ms;    --duration-deliberate:600ms; --duration-count:900ms;
  --ease-out:cubic-bezier(.22,1,.36,1);
  --ease-in-out:cubic-bezier(.65,0,.35,1);
  --ease-emphasis:cubic-bezier(.16,1,.3,1);

  /* Radius */
  --radius-sm:2px; --radius-md:4px; --radius-full:9999px;

  /* Z-index */
  --z-raised:10; --z-sticky:20; --z-header:50; --z-dropdown:60;
  --z-drawer:70; --z-modal:80; --z-toast:90; --z-skip:100;
}
```

`frontend/tailwind.config.js` maps these into the theme, so `bg-surface`, `text-primary`,
`border-accent`, `font-mono`, `rounded-sm` and the fluid type scale are all available as utilities
while the values live in one file.

**Rule: no raw hex, px duration, or arbitrary z-index appears in component code.** A literal colour
in a component is a review failure — it is exactly how the legacy site ended up with three different
greens.

---

## Governance

1. **Adding a token requires a decision-log entry.** Tokens grow by justification, not convenience.
2. **Adding a component requires two use sites.** Per `components.md`, a component used once is a
   section, not a component.
3. **Accessibility requirements are encoded in prop types.** `alt` on `Figure`, `asOf` on `Stat`,
   `label` on `FormField` are required props — the compiler enforces what code review would miss.
4. **Contrast is verified, not estimated.** Every pairing in `color-system.md §5` was computed
   against the WCAG relative-luminance formula. Any new pairing must be too.
5. **New motion must be one of the four permitted patterns**, or it needs a decision-log entry.
6. **Budgets are CI-enforced**, not aspirational — see `responsive-strategy.md §8`.

---

## Related

- [Frontend architecture](../04-architecture/frontend-architecture.md)
- [Decision log](../05-decisions/decision-log.md)
