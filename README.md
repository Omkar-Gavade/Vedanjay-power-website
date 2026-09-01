# Vedanjay Power — Corporate Website

A new corporate digital presence for **Vedanjay Power Pvt. Ltd.** (CIN `U40100MP2011PTC026570`),
a renewable power consultancy providing open access, forecasting & scheduling, regulatory
liaisoning, electrical infrastructure, rooftop solar and O&M services.

Replacing [vedanjay-power.com](https://vedanjay-power.com/).

---

## Status

**Phases 1–4 complete** (research → IA → UI/UX direction → architecture), documented in [`docs/`](docs/).

**Home page and navigation are built.** Nine sections, light/dark themes, rotating photographic hero,
mega-menu and mobile drawer, full motion system. Verified at seven breakpoints with zero console
errors. See [`docs/04-architecture/implementation-notes.md`](docs/04-architecture/implementation-notes.md).

Remaining routes (services, industries, projects, about, contact) render an "in development"
placeholder and are next.

### Run it

```bash
npm install --prefix frontend && npm run dev --prefix frontend
```

---

## Structure

```
vedanjay-power/
├── frontend/     React + Vite + Tailwind          (scaffold pending)
├── backend/      Node + Express                   (scaffold pending)
├── docs/         All research, specs and decisions ← the deliverable of this phase
└── README.md
```

Frontend and backend are independent applications with separate dependencies, builds and deploys.
They communicate over HTTP + JSON only.

---

## Start here

**[`docs/00-summary/research-summary.md`](docs/00-summary/research-summary.md)** — executive summary,
findings, recommended direction, risks and open questions.

Full documentation index: [`docs/README.md`](docs/README.md).

---

## The direction in brief

**Position.** Vedanjay Power is the firm that gets renewable energy projects approved, connected,
metered and scheduled — and keeps them running.

**Key research finding.** The five comparators named in the brief (Waaree, Tata Power, Vikram Solar,
ReNew, Suzlon) are **not competitors — four of the five are Vedanjay's clients.** They are asset
owners; Vedanjay is the services firm they hire. Information architecture is therefore modelled on
**DNV**, an independent energy advisory firm, not on IPP websites.

**Three differentiators**, all already true of the company and none currently used:
1. Real photography of actual technical work — the entire sector uses stock
2. Copy that names the buyer — the entire sector addresses "the energy transition"
3. Visible repeat business — MPPTCL ×7, Suzlon ×7, ReNew ×5, Vikram Solar ×4, Tata Power Solar ×4

**Design.** Brand palette sampled from Vedanjay's own logo — green `#40A040`, deep petrol
`#004048`, energy amber `#F87820` — modernised, with verified contrast on every shipped pairing.
Photography-led, light and dark themes, Archivo + IBM Plex Mono.

**Architecture.** React + Vite + Tailwind, statically pre-rendered. Content as structured data behind
an accessor layer. Three-endpoint Express backend, no database. Performance and accessibility budgets
fail the CI build.

---

## What the audit found

The existing site is a 2017 Bootstrap 3 theme. Measured 2026-08-31:

| | |
|---|---|
| Script tags on the homepage | **56** (three separate slider libraries) |
| Icon library | 609 KB of JavaScript |
| Hero images | 1.47 MB + 1.04 MB JPEGs |
| Images with alt text | **0 of 57** |
| Services with their own URL | **1 of 6** |
| Contact forms on the site | **0** |
| Pages with a call to action | **2 of 11** |
| External download links returning HTTP 503 | **15 of 22** |
| Webfont | Blocked as mixed content — has never rendered |
| Mobile hero headline | Clipped mid-word: *"We are the Profes…"* |

Full detail: [`docs/01-research/existing-website-audit.md`](docs/01-research/existing-website-audit.md).

---

## Content integrity

No company fact appears on the new site unless it is verified. All claims are tracked in
[`docs/06-content/company-facts.md`](docs/06-content/company-facts.md), which registers
**20 `TO VERIFY` items — 10 of them launch-blocking**, including contradictory statistics on the
legacy site (100 MW vs 110 MW; 700 MW vs 30 MW) and the QCA registration that is the company's lead
credential.

This is enforced in code, not only in process: `Stat` requires an `asOf` date prop, and
`getStats()` filters on a verified flag — so an unsourced statistic cannot ship.

---

## Next steps

1. **Send `TO VERIFY` #1–#10 to the client** — the critical path. They gate the homepage hero, the
   statistics block and the credentials page.
2. **Resolve art direction** (photography vs technical diagrams) — longest lead time.
3. **Client review** of the design direction, particularly the copper accent and the removal of
   Sustainability from the sitemap.
4. **On approval:** scaffold the frontend, implement tokens and primitives, then build the Home and
   service-page templates — they carry the two highest-value user journeys.

---

## Tech stack

| | |
|---|---|
| Frontend | React 19 · JavaScript · Vite 8 · **Bootstrap 5 (grid + utilities) + custom CSS** · React Router 7 |
| Backend | Node 20 · Express 4 · Zod · Resend (or SES) |
| Hosting | Static CDN (Cloudflare Pages) + container backend |
| Testing | Vitest · React Testing Library · Playwright · axe · Lighthouse CI |
