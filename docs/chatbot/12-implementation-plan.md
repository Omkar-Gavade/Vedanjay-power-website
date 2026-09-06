# 12 — Implementation Plan

Six phases. Each ends in a verifiable state. Estimates are for one engineer
familiar with this codebase.

Phases 0–1 deliberately front-load the two things that can invalidate the rest:
the knowledge pack (does the content support a useful assistant?) and the eval
gate (does the chosen model hold the accuracy line?). Discovering a problem there
after the UI is built would waste the UI work.

---

## Phase 0 — Foundations & content truth (0.5 day)

**Why first:** everything downstream consumes the pack. If the verified content
turns out to be too thin to answer P1's questions, that is a content decision for
the company, and it should surface on day one — not after the UI is built.

| # | Task | Output |
|---|---|---|
| 0.1 | Add correction notices to the two stale architecture docs (§11.1) | Docs no longer contradict reality |
| 0.2 | Log the runtime change in `docs/05-decisions/` | Decision history preserved |
| 0.3 | Write `worker/knowledge/build-pack.mjs` | Generator |
| 0.4 | Generate `pack.generated.js`; measure tokens | Pack ≤ 4k tokens |
| 0.5 | Assert no unverified key is present; fail build if so (§05.3) | Anti-fabrication layer 1 |
| 0.6 | Review the pack against §01 personas | Gap list for the company |

**Exit:** the pack exists, is verified-only, is under budget, and any content gap
is written down rather than discovered later.

---

## Phase 1 — Worker API & the eval gate (2 days)

**Why second:** this is where the provider question gets settled by measurement
(§10.2). Building UI against a model that cannot hold Class B would be wasted.

| # | Task | Output |
|---|---|---|
| 1.1 | `wrangler.toml`: `main`, `run_worker_first`, `[ai]`, ratelimits, observability (§11.3) | Config |
| 1.2 | `worker/index.js` route table + `env.ASSETS` fallback | Routing |
| 1.3 | `lib/validate.js` — clamps, strips `system`/`model`/`temperature` | T2/T3 defence |
| 1.4 | `lib/prompt.js` — server-side assembly | Grounding |
| 1.5 | `lib/provider.js` — `generate()` on Workers AI | Model call |
| 1.6 | `routes/chat.js` — handler in the §06.1 order, SSE | `POST /api/chat` |
| 1.7 | `routes/health.js` | `GET /api/health` |
| 1.8 | `lib/ratelimit.js` — salted-hash keying (§07.6) | Spend guard |
| 1.9 | Vitest + `@cloudflare/vitest-pool-workers`; unit + integration (§10.3–10.4) | Suite |
| 1.10 | **Build the golden set and run `npm run eval`** | Provider decision |

**Exit — the project's most important gate:** Class B (refusal) and Class D
(adversarial) at **100%**, Class A ≥ 90%, Class C ≥ 85%, worst of three runs.

**If it fails:** escalate `provider.js` to a frontier model behind a secret
(§04.6) and re-run. Do not proceed to Phase 2 on a failing gate, and do not
weaken the bar — the bar is the product requirement (§01.5).

**Verify:** static assets still serve and the Worker is **not** invoked for `/`.

---

## Phase 2 — Chat UI (2.5 days)

| # | Task | Output |
|---|---|---|
| 2.1 | `--vp-z-chat: 1045` token — below `--vp-z-drawer` (§02.2) | Layering |
| 2.2 | `ChatLauncher.jsx`, mounted in `RootLayout.jsx` | Entry point |
| 2.3 | `styles/chat.css` extending `.vp-drawer*` — **imported by the lazy chunk only** | Zero initial CSS |
| 2.4 | `ChatPanel.jsx` via `lazy` + `Suspense`, following `App.jsx:8` | Lazy panel |
| 2.5 | Wire **existing** `useFocusTrap(ref, active, onClose)` | A11y, reused |
| 2.6 | `useChat.js` — state, SSE consumption, `AbortController` | Streaming |
| 2.7 | `ChatMessage.jsx` — plain text, `\n`→`<p>`, links from the route table (§08.6) | XSS-safe render |
| 2.8 | `ChatComposer.jsx` — textarea, Enter/Shift+Enter, stop button | Input |
| 2.9 | All states: idle, sending, streaming, error, rate-limited, offline (§02.4) | Robustness |
| 2.10 | `aria-live="polite"` + `aria-busy`; announce settled answer only (§09.4) | Screen readers |
| 2.11 | `sessionStorage` persistence, try/catch wrapped, `v: 1` (§07.3) | Session continuity |
| 2.12 | Hero-scroll gating + scroll fade (§02.6) | Non-intrusion |
| 2.13 | Reduced-motion collapse | Motion contract |

**Exit:** full keyboard journey works; theme toggles correctly **with the panel
open**; initial bundle delta ≤ 2 kB JS / 0 B CSS; panel chunk loads on click only.

---

## Phase 3 — Enquiry capture (1 day)

| # | Task | Output |
|---|---|---|
| 3.1 | `routes/enquiries.js` against the **existing** `backend/README.md` contract + `source` (§06.2) | Shared endpoint |
| 3.2 | `lib/notify.js` — one-function transport interface | Delivery seam |
| 3.3 | `EnquiryFlow.jsx` — 3 fields, one at a time, confirm step, consent line | Capture UI |
| 3.4 | Contact routing by topic (§03.5), read from `data/company.js` | Correct inbox |
| 3.5 | `ENQUIRY_LIMIT` rate limit | Spam guard |

**Blocked on an open question:** the destination inbox and transport. Build to
the interface; a stub that logs (without PII) is acceptable until answered.

**Exit:** end-to-end enquiry works; only name/email/message required; cancel path
works; no extra field collected.

---

## Phase 4 — Hardening & verification (1 day)

| # | Task | Output |
|---|---|---|
| 4.1 | `.github/workflows/ci.yml` per §10.6 | First CI |
| 4.2 | Size checks — JS +2 kB, CSS +0 B, chunk ≤ 15 kB | Perf budget enforced |
| 4.3 | Secret grep on `dist` | T1 guard |
| 4.4 | Pack-regeneration diff check | Pack integrity |
| 4.5 | Full manual checklist (§10.5) incl. drawer/panel layering regression | UI verified |
| 4.6 | Lighthouse before/after on `/`, 5 runs | Perf proven |
| 4.7 | `CHAT_ENABLED` kill switch, both ends | Rollback |
| 4.8 | **Billing alert on the Cloudflare account** | Cost bounded |
| 4.9 | Security checklist (§08.11) signed off | Security verified |

**Exit:** CI green, budgets enforced, kill switch tested by actually flipping it.

---

## Phase 5 — Launch (0.5 day)

| # | Task |
|---|---|
| 5.1 | Deploy preview; re-run `npm run eval` |
| 5.2 | `/privacy/` paragraph on the assistant — **needs company sign-off** |
| 5.3 | Deploy production with `CHAT_ENABLED = "false"`; verify site untouched |
| 5.4 | Flip to `"true"` |
| 5.5 | Watch logs 30 min: errors, p50 first token, rate-limit hits |

**Exit:** live, monitored, reversible in one config change.

---

## Phase 6 — Post-launch (deferred, evidence-driven)

Not scheduled. Each item has a trigger, so it is done when justified rather than
because it was on a roadmap.

| Item | Trigger |
|---|---|
| AI Gateway (logging, caching, fallback) | Recommended within week 1 — it is how fabrication gets audited |
| Analytics Engine counters | When log-based counting becomes awkward |
| Turnstile | Observed abuse in logs (§08.4) |
| D1 for **enquiries only** | First reported lost lead (§11.8) — the strongest deferred case |
| Vectorize / RAG | A §05.2 trigger fires (pack > 15k tokens, or per-project answers needed) |
| Hindi / Marathi | Analytics show real demand **and** a reviewer is available per language |
| Conversation storage | All three §07.7 preconditions met |

---

## Summary

| Phase | Effort |
|---|---|
| 0 — Foundations & content | 0.5 d |
| 1 — Worker API & eval gate | 2 d |
| 2 — Chat UI | 2.5 d |
| 3 — Enquiry capture | 1 d |
| 4 — Hardening | 1 d |
| 5 — Launch | 0.5 d |
| **Total** | **~7.5 days** |

## Dependencies and risks

| Risk | Impact | Handling |
|---|---|---|
| Llama 3.1 8B fails the eval gate | +0.5 d, provider cost rises | The §04.6 abstraction makes it a one-file change; this is the risk the design is explicitly built to absorb |
| Verified content too thin to be useful | Assistant refuses too often | Surfaced in Phase 0.6 as a company gap list, before UI work |
| Notification transport unresolved | Phase 3 partially blocked | Build to the `notify()` interface; stub until answered |
| Cost overrun | Financial | Rate limits + `max_tokens` + billing alert |
| Scope creep to multi-page content | Timeline | Only `/` is implemented; the assistant links to declared routes and does not depend on them existing |

## New dependencies introduced

| Dependency | Where | Justification |
|---|---|---|
| `vitest` + `@cloudflare/vitest-pool-workers` | devDependencies | First code where a silent regression has external consequences (§10.1) |
| — | — | **No runtime dependency is added to the frontend or the Worker** |

No animation library, no markdown renderer, no AI SDK, no router, no state
manager, no vector database, no ORM. The frontend's runtime dependency list is
unchanged.
