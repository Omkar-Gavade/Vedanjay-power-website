# Documentation

All project research, architecture, specifications and decisions for the Vedanjay Power website.

**Start here:** [`00-summary/research-summary.md`](00-summary/research-summary.md) — executive
summary, findings, recommended direction, risks and open questions.

```
docs/
├── 00-summary/
│   └── research-summary.md              ← START HERE
│
├── 01-research/
│   ├── existing-website-audit.md        Full audit of vedanjay-power.com (measured)
│   ├── competitor-analysis.md           5 named comparators + DNV structural reference
│   ├── competitor-patterns.md           Pattern matrix — MUST/SHOULD/NICE/AVOID
│   └── gap-analysis.md                  Differentiation strategy + risk register
│
├── 02-information-architecture/
│   ├── sitemap.md                       Final sitemap, navigation, redirect map
│   ├── user-journeys.md                 6 audiences, paths, conversion architecture
│   └── page-specifications.md           Every page, section by section
│
├── 03-design/
│   ├── ui-ux-direction.md               Creative position, principles, art direction, voice
│   ├── design-system.md                 Index + token implementation + governance
│   ├── color-system.md                  Palette, aliases, verified contrast
│   ├── typography.md                    Archivo + IBM Plex Mono, fluid scale
│   ├── spacing-grid.md                  Base unit, containers, grid, rhythm, z-index
│   ├── components.md                    38 components + audit of the brief's list
│   ├── navigation.md                    Header states, mega-menu, keyboard, mobile
│   ├── motion-system.md                 4 patterns, tokens, rejected effects
│   └── responsive-strategy.md           Breakpoints, per-component behaviour, budgets
│
├── 04-architecture/
│   ├── frontend-architecture.md         React/Vite structure, routing, a11y, perf
│   ├── implementation-notes.md          WHAT WAS BUILT: stack, components, QA log
│   ├── backend-architecture.md          3 endpoints, security, email, no database
│   ├── data-flow.md                     Content / interaction / submission flows
│   └── deployment-architecture.md       Hosting, CI/CD, monitoring, launch checklist
│
├── 05-decisions/
│   └── decision-log.md                  24 decisions with reasoning + 8 open
│
└── 06-content/
    ├── company-facts.md                 Verified fact register + 20 TO VERIFY items
    └── project-register.md              All 52 executed works, verbatim
```

## Reading paths

| If you are… | Read |
|---|---|
| The client / stakeholder | `00-summary` → `01-research/gap-analysis` → `03-design/ui-ux-direction` |
| A designer | `03-design/ui-ux-direction` → `design-system` → `components` → `navigation` |
| A developer | `04-architecture/frontend-architecture` → `03-design/design-system` → `02-.../page-specifications` |
| Writing content | `06-content/company-facts` → `02-.../page-specifications` |
| Questioning a decision | `05-decisions/decision-log` |

## Conventions

- **`TO VERIFY`** marks any claim not independently confirmed. Nothing marked `TO VERIFY` may ship
  as a factual statement. The register is in `06-content/company-facts.md §13`.
- **Decisions are logged, not assumed.** Anything significant has an entry in `05-decisions/`.
- **Evidence over assertion.** Audit findings are measured; contrast ratios are computed; comparator
  claims cite the page they came from.
