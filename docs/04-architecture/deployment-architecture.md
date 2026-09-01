# Deployment Architecture

**Constraint from the brief:** cloud deployment, with frontend and backend clearly separated.

---

## 1. Topology

```
                          ┌─────────────────────────┐
                          │   vedanjay-power.com    │
                          │        (DNS)            │
                          └───────────┬─────────────┘
                                      │
              ┌───────────────────────┴───────────────────────┐
              │                                               │
              ▼                                               ▼
   ┌─────────────────────────┐                    ┌───────────────────────┐
   │  FRONTEND               │   HTTPS + JSON     │  BACKEND              │
   │  Static HTML/CSS/JS     │ ─────────────────► │  Node + Express       │
   │  Global CDN edge        │                    │  Container            │
   │                         │                    │  api.vedanjay-power…  │
   │  Cloudflare Pages       │                    │  Cloudflare Workers / │
   │  (or Vercel / S3+CF)    │                    │  Render / Fly.io      │
   └─────────────────────────┘                    └───────────┬───────────┘
                                                              │
                                                              ▼
                                                  ┌───────────────────────┐
                                                  │  Email provider       │
                                                  │  (Resend / SES)       │
                                                  └───────────────────────┘
```

**Two independent deployments.** Either can be redeployed, rolled back or replaced without touching
the other — the separation the brief requires, carried through to infrastructure.

---

## 2. Frontend hosting

**Recommended: Cloudflare Pages.** (Vercel or S3 + CloudFront are equivalent alternatives.)

| Requirement | How it is met |
|---|---|
| Global edge delivery | The audience is Indian; edge presence in Mumbai/Delhi/Chennai matters for LCP |
| Static hosting | Output is pre-rendered HTML + hashed assets — no server runtime, nothing to patch |
| Atomic deploys + instant rollback | A bad deploy is reverted in seconds |
| Preview deployments per PR | Content and design changes are reviewed on a real URL |
| Free TLS, HTTP/2 + HTTP/3, Brotli | — |
| Redirect rules | The 11 legacy `.html` → new-path 301s live here, at the edge |
| Cost | Effectively zero at this traffic |

### Caching

The legacy site sets `cache-control: max-age=3600` on **everything**, including immutable assets.

| Asset | Header |
|---|---|
| Hashed JS/CSS (`app.a1b2c3.js`) | `public, max-age=31536000, immutable` |
| Fonts (WOFF2) | `public, max-age=31536000, immutable` |
| Images (hashed) | `public, max-age=31536000, immutable` |
| HTML | `public, max-age=0, must-revalidate` |
| `sitemap.xml`, `robots.txt` | `public, max-age=3600` |

Content-hashed filenames make year-long immutable caching safe; HTML always revalidates, so a deploy
is live immediately.

### Security headers (edge)

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Content-Security-Policy: default-src 'self'; img-src 'self' data:;
  font-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';
  connect-src 'self' https://api.vedanjay-power.com https://challenges.cloudflare.com;
  frame-src https://challenges.cloudflare.com; frame-ancestors 'none';
  base-uri 'self'; form-action 'self'
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=(), interest-cohort=()
```

**Note:** self-hosting the fonts is what allows `font-src 'self'` with no third-party origin — and it
makes the legacy site's mixed-content font failure structurally impossible.

---

## 3. Backend hosting

**Recommended: a container on Render, Fly.io or Railway** — or Cloudflare Workers if the Express app
is adapted, keeping the whole stack on one provider.

| Requirement | How it is met |
|---|---|
| Always-on HTTPS endpoint | Managed TLS on `api.vedanjay-power.com` |
| Low idle cost | Traffic is a handful of enquiries per day; scale-to-low or a small always-on instance |
| Health checks | `GET /api/health` drives platform health probes |
| Secrets management | Platform-managed env vars; never in source or image |
| Zero-downtime deploy | Rolling restart with health gating |
| Logs | Structured JSON to platform log aggregation |

**Why a container rather than serverless functions:** the Express app is a coherent unit with shared
middleware (CORS, rate limiting, error handling). Rate limiting in particular is awkward across
stateless function invocations without an external store. One small container is simpler, cheaper at
this scale, and easier to reason about.

**Sizing:** 512 MB / 0.5 vCPU is generous for three endpoints. There is no reason to over-provision.

---

## 4. Domains & DNS

| Host | Points to | Notes |
|---|---|---|
| `vedanjay-power.com` | Frontend (CDN) | Apex |
| `www.vedanjay-power.com` | → 301 → apex | Single canonical host |
| `api.vedanjay-power.com` | Backend | CORS allowlist contains **only** the apex |

**Email DNS is a launch-blocking requirement**, not an afterthought: SPF, DKIM and DMARC records for
the sending domain. Enquiry notifications that land in spam are functionally identical to a broken
form — and the entire commercial value of this rebuild rests on that form working.

---

## 5. Environments

| Environment | Frontend | Backend | Purpose |
|---|---|---|---|
| **Local** | `vite dev` :5173 | `nodemon` :4000 | Development |
| **Preview** | Per-PR CDN URL | Shared staging API | Review of content and design changes |
| **Staging** | `staging.vedanjay-power.com` | `api-staging…` | Pre-release verification; `noindex` |
| **Production** | `vedanjay-power.com` | `api.vedanjay-power.com` | — |

Staging carries `X-Robots-Tag: noindex` and a `robots.txt` disallow — a staging copy indexed
alongside production is a real and common SEO problem.

---

## 6. CI/CD

```
Push / PR
   ├─ install (cached)
   ├─ lint  (eslint + jsx-a11y)
   ├─ test  (vitest unit + integration)
   ├─ build (frontend: vite + static pre-render │ backend: docker build)
   ├─ budget check ── JS <120 KB gz · CSS <25 KB gz · page <600 KB   ← fails the build
   ├─ Lighthouse CI ── LCP <2.5s · CLS <0.05 · a11y ≥95              ← fails the build
   ├─ axe accessibility scan                                        ← fails the build
   └─ Playwright ── 3 critical journeys
        │
   PR   ├─→ preview deploy (frontend) — commented on the PR
        │
   main └─→ production deploy (frontend + backend) → smoke test → notify
```

**Budgets and accessibility fail the build.** This is the mechanism that prevents drift back toward
the legacy site's condition. A performance budget that only warns is a performance budget that is
eventually ignored — 55 scripts and 18 stylesheets is what that looks like after nine years.

---

## 7. Monitoring

| Concern | Tool |
|---|---|
| Uptime (frontend + `/api/health`) | Platform monitor or UptimeRobot; alert on 2 consecutive failures |
| Real-user Core Web Vitals | Cloudflare Web Analytics (privacy-preserving, cookieless, no consent banner required) |
| Backend errors | Structured logs + Sentry (PII-redacted) |
| **Email delivery** | Provider dashboard + an alert on any send failure — **the highest-priority alert on the system** |
| Form submissions | Logged with reference and intent; weekly volume review |
| Search visibility | Google Search Console — sitemap, index coverage, and confirmation that the six service pages are indexed |
| Broken links | Scheduled crawl. *The legacy Downloads page has 15 dead external links (HTTP 503) that went unnoticed for years* |

**Analytics choice.** Cloudflare Web Analytics or Plausible over Google Analytics: no cookie banner
(so no consent UI to design and no dark-pattern risk), materially lighter, and adequate for the
questions that matter here — which service pages convert, and where enquiries originate.

---

## 8. Backup & recovery

| Asset | Protection |
|---|---|
| Source + content | Git — content lives in `data/` and `docs/`, so it is versioned and diffable |
| Deployed builds | Platform retains previous deploys; rollback is one action |
| Enquiries | Delivered to email — the inbox is the record of truth at launch (see `backend-architecture.md §4`) |
| Media assets | Git LFS or object storage, backed up separately |
| DNS | Configuration documented in `docs/04-architecture/` |
| Secrets | Platform secret store + an offline record held by the client |

**Recovery:** the frontend can be fully rebuilt from Git and redeployed in minutes. The backend is
stateless. There is no database to restore — a direct benefit of the §4 persistence decision.

---

## 9. Launch checklist

**Blocking:**
- [ ] All `TO VERIFY` items 1–10 resolved (statistics, QCA, licence, enercast, addresses, logo permissions)
- [ ] SPF / DKIM / DMARC configured and a test enquiry delivered to the real inbox
- [ ] All 11 legacy `.html` redirects verified live
- [ ] `sitemap.xml` and `robots.txt` correct; staging de-indexed
- [ ] Lighthouse ≥90 on performance and ≥95 on accessibility, mobile
- [ ] Keyboard-only pass on every page template
- [ ] Responsive pass at all 12 widths in `responsive-strategy.md §7`
- [ ] Privacy policy published and covering form-data handling and retention
- [ ] Google Search Console verified and the sitemap submitted

**Post-launch (first week):**
- [ ] Confirm the six service pages are indexed
- [ ] Verify enquiry routing to each of the five inboxes
- [ ] Review real-user Core Web Vitals against the budgets
- [ ] Check Search Console for crawl errors on redirected URLs

---

## Related

- [Frontend architecture](frontend-architecture.md) · [Backend architecture](backend-architecture.md) · [Data flow](data-flow.md)
- [Responsive strategy §8](../03-design/responsive-strategy.md) — the enforced budgets
