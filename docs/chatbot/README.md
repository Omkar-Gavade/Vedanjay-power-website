# Vedanjay AI Assistant — Implementation Plan

> ## ⚠️ SUPERSEDED — 6 September 2026
>
> **These sixteen documents describe an architecture that no longer exists.**
> They are kept as the design record of it, not as a guide to the code.
>
> The assistant was a Cloudflare Worker at `POST /api/chat`, running Workers AI
> over a generated knowledge pack, with a Groq fallback, SSE streaming, a prompt
> guard, signed transcripts and a 45-case eval harness. It was replaced by a
> **client-side assistant with no backend at all**, because the thing it was
> built to do — answer questions about a small, fixed, entirely known body of
> company facts — never needed a model. Class D accuracy sat at 71%, the Workers
> AI daily allocation ran out, and a fallback provider key had to be rotated
> after exposure. A matcher over the same facts is right 100% of the time,
> costs nothing, cannot leak a key, cannot hallucinate, and answers instantly.
>
> **What runs now** (~7.5 kB gzipped, entirely in the browser):
>
> | File | Role |
> |---|---|
> | `frontend/src/data/assistant.js` | 12 topics, each composed from the existing verified data modules, so a fact cannot drift from the page it came from |
> | `frontend/src/utils/assistant.js` | Keyword/phrase matcher with a score floor and a follow-up context bonus |
> | `frontend/src/components/chat/ChatPanel.jsx` | Panel, quick actions, typing animation, follow-up chips |
> | `frontend/src/components/chat/ChatLauncher.jsx` | Floating launcher |
> | `frontend/test/assistant.test.js` | Intent resolution, fallback, and every link checked against `BUILT_ROUTES` |
>
> **Removed:** `worker/knowledge/` (pack generator, golden set, eval harness),
> `worker/routes/chat.js`, `worker/lib/{provider,guard,prompt,sign}.js`, the
> `[ai]` binding, `CHAT_*` vars and the `CHAT_LIMIT` rate limit in
> `wrangler.toml`, and the `pack`/`eval`/`provider:test` npm scripts.
> `CHAT_FALLBACK_KEY` is no longer read by anything and should be deleted from
> the account with `wrangler secret delete CHAT_FALLBACK_KEY`.
>
> Everything below this line is historical.

---

**Status: RETIRED — replaced by the client-side assistant described above.**
Last live measurement before retirement: Class A/B/C 100%, **Class D 71%**.
**Date:** 3 September 2026
**Scope:** A grounded site assistant for vedanjay-power.com.

---

## Contents

| # | Document | Covers |
|---|---|---|
| 01 | [Product Definition](01-product.md) | Purpose, personas, scope, the accuracy contract |
| 02 | [UI / UX Design](02-ui-ux.md) | Launcher, panel, states, motion, theme, copy |
| 03 | [Conversation Design](03-conversation-design.md) | Answer shape, intents, refusals, enquiry flow |
| 04 | [Technical Architecture](04-technical-architecture.md) | Worker runtime, file layout, provider seam, cost |
| 05 | [Knowledge & Grounding](05-ai-rag.md) | Corpus measurement, why no vector DB, system prompt |
| 06 | [Backend API](06-backend-api.md) | Three endpoints, SSE, validation, errors |
| 07 | [Data Model](07-data-model.md) | Why no database, session shape, PII posture |
| 08 | [Security](08-security.md) | Threat model, secrets, injection, XSS, abuse |
| 09 | [Performance & Accessibility](09-performance-accessibility.md) | Bundle budgets, streaming, WCAG 2.2 AA |
| 10 | [Testing & Evaluation](10-testing.md) | Golden set, the launch gate, CI |
| 11 | [Deployment & Operations](11-deployment.md) | Config, release, kill switch, runbook |
| 12 | [Implementation Plan](12-implementation-plan.md) | Six phases, ~7.5 days |
| 13 | [Implementation Notes](13-implementation-notes.md) | Deviations found while building |
| 14 | [Pre-Production Audit](14-pre-production-audit.md) | Audit findings, real-model evaluation, launch status |
| 15 | [Adversarial Security Hardening](15-adversarial-security-report.md) | **Output guard, attack testing, current status — read this first** |

---

## What was audited first

The plan is built on the repository as it is, not as the older documents
describe it.

| Finding | Consequence |
|---|---|
| `wrangler.toml` deploys a **Cloudflare Worker** serving `./frontend/dist` as static assets | The chatbot API belongs in this Worker. No new hosting, no CORS. |
| `backend/` is a **README only** — Express/container/Resend were never built | Two architecture docs are stale and must be corrected (§11.1) |
| Verified corpus is **~8,412 tokens raw**; a curated pack is ~3.5–4k | A vector database would be over-engineering (§05) |
| React 19.2.8, Vite 8.2.2, Bootstrap 5.3.8 grid/utilities only, **no TypeScript** | Worker written in plain JS with JSDoc |
| `App.jsx:1,8,15` already uses `lazy` + `Suspense` | The panel follows an existing pattern |
| `useFocusTrap(ref, active, onClose)` already does trap + scroll lock + Escape + focus restore | Reused unchanged; no second focus trap |
| `tokens.css` defines the full colour/motion/z-index system per theme | One new token (`--vp-z-chat`); no new colours |
| Build baseline: `index.js` **84,961 B gz**, `index.css` **23,850 B gz** | Concrete budget to protect (§09) |
| **No test framework, no CI** | Vitest added, Worker-scoped only (§10.1) |
| The IRD marks client list, project count, capacity, headcount, awards, certifications, office hours as *to be confirmed* | These are excluded from the knowledge pack entirely (§05.3) |
| **Phase 0:** `docs/06-content/company-facts.md` is a **legacy-site audit**, not a current fact register — its email, phone and PIN contradict the IRD-derived `data/company.js` | Excluded as a pack source. Pack is built **only** from `frontend/src/data/` (§05.3 correction). enercast dropped with it. |

---

## Final Architecture Summary

A **single-endpoint, stateless, full-context assistant** inside the Worker that
already serves the website.

```
Browser (React 19 SPA)                Cloudflare Worker "vedanjaypower"
┌──────────────────────┐              ┌────────────────────────────────────┐
│ ChatLauncher  ~1.5kB │              │ run_worker_first = ["/api/*"]     │
│   eager              │              │                                    │
│ ChatPanel   ~10kB    │──POST───────▶│ POST /api/chat                    │
│   lazy, on click     │   SSE        │  method→size→JSON→validate         │
│                      │◀─────────────│  →ratelimit→prompt→stream          │──▶ env.AI
│ useFocusTrap (reused)│              │                                    │◀── Workers AI
│ sessionStorage only  │──POST───────▶│ POST /api/enquiries (shared)      │──▶ email
└──────────────────────┘              │ GET  /api/health                  │
        ▲                             │ all other paths ──▶ [assets]       │
        └─────────────────────────────┴────────────────────────────────────┘
                     same origin · no CORS · no database
```

**The five decisions that define it:**

1. **The Worker is the backend.** It already exists and already serves the site.
   `run_worker_first = ["/api/*"]` means the Worker runs *only* for the API, so
   static traffic costs nothing and gains no latency.

2. **The whole knowledge base goes in the prompt.** At ~3.5–4k tokens it fits
   many times over. This is not a shortcut — it is *more* accurate than
   retrieval, because the model sees every fact and every caveat on every turn,
   and it removes a whole class of wrong-chunk failures.

3. **Unverified facts are never compiled in.** The strongest anti-fabrication
   control is absence of data, not prompt instructions. A model cannot recite a
   certification it was never given, no matter how it is prompted.

4. **Nothing is stored.** Stateless Worker, `sessionStorage` on the client, no
   transcripts, no database. Enquiries transit to email and are discarded.

5. **The model is decided by test, not assertion.** Workers AI
   `@cf/meta/llama-3.1-8b-instruct-fast` is the default behind a one-function
   provider seam; the golden-set gate (§10.2) decides whether it ships.

**Cost:** ~$3.60/month at 1,000 conversations. **No new infrastructure.**

---

## Key Decisions

| # | Decision | Reason | Alternative rejected |
|---|---|---|---|
| 1 | Cloudflare Worker in the existing `wrangler.toml` | Already deployed, same origin, no CORS, no new pipeline | Express/container — described in stale docs, never built |
| 2 | Full-context knowledge pack, no vector DB | Corpus is ~8.4k tokens raw; retrieval adds cost, latency and a wrong-chunk failure mode to solve a problem that doesn't exist | Vectorize + embeddings |
| 3 | Exclude every unverified fact from the pack | Layer that holds even if prompt rules are defeated | Prompt-only guardrails |
| 4 | Workers AI default, behind a provider seam | No credential to leak, in-network, cheap — but the eval gate, not the price, decides | Hardcoding either Workers AI or a frontier model |
| 5 | Golden-set eval as a **launch gate** at 100% on refusal/adversarial | Makes §01.5 testable instead of aspirational | Shipping on judgement |
| 6 | No database | No legal basis for transcripts; nothing at launch needs one; trivially added later, not trivially undone | D1 from day one |
| 7 | Reuse `POST /api/enquiries` | One enquiry pipeline, one destination to change | A chat-only lead path |
| 8 | Lazy panel; `chat.css` in the lazy chunk | Protects an 84,961 B gz budget for the 97% who never open it | Eager panel, global stylesheet |
| 9 | Reuse `useFocusTrap` | Already provides trap + scroll lock + Escape + focus restore, and already debugged | A new focus trap |
| 10 | `--vp-z-chat: 1045`, below `--vp-z-drawer` | The nav drawer must cover the chat panel, not fight it | Arbitrary high z-index |
| 11 | SSE, not WebSockets | One-way token stream; Workers AI returns a stream that can be returned directly; survives proxies | WebSocket + Durable Object |
| 12 | Links rendered from the route table, never from model output | Removes phishing-via-assistant-link entirely | Trusting model URLs |
| 13 | No Turnstile at launch | Friction for every user to solve a problem that may not occur; trigger is observed abuse | Turnstile on day one |
| 14 | Vitest scoped to Worker + pack only | First code where a silent regression reaches a customer; component tests across 19 components is a separate project | Full suite, or no tests |
| 15 | Three enquiry fields only | Every extra field lowers completion and raises data burden for what the team asks on the first call anyway | Qualification form |

---

## Open Questions

Each needs a **company** answer. None blocks starting Phase 0.

| # | Question | Blocks | Recommendation |
|---|---|---|---|
| 1 | **Model provider** — is Workers AI acceptable, or is a frontier provider preferred for answer quality? Any data-residency constraint? | Phase 1 exit | Start on Workers AI; let the §10.2 gate decide. Escalation is a one-file change. |
| 2 | **Enquiry destination and transport** — which inbox receives chat leads? Cloudflare Email Service, or something existing? | Phase 3 | Reuse whatever the contact form will use — they must not diverge |
| 3 | **May conversations be stored at all?** | Phase 6 only | No at launch. Revisit only against the three §07.7 preconditions. |
| 4 | **Privacy-policy wording** for the assistant | Phase 5.2 | Needs sign-off; one paragraph at `/privacy/` |
| 5 | **Content gaps** — the IRD's "to be confirmed" list is what the assistant will refuse most. Which can be confirmed? | Nothing; improves quality | Phase 0.6 produces the concrete gap list to answer |
| 6 | **Hindi / Marathi** — is there known demand? | Phase 6 | Defer until analytics show it *and* a per-language reviewer exists |
| 7 | **Attach conversation context to enquiry emails?** Commercially useful, but the visitor consented to an enquiry, not a transcript. | Phase 3 | Only with an explicit opt-in checkbox and a privacy line |
| 8 | **Is a lost enquiry acceptable** if email delivery fails, given nothing is stored? | Phase 6 | If not, add D1 for the enquiry path only — the strongest deferred storage case |

---

## Implementation Order

```
Phase 0  Foundations & content truth            0.5 d
         ├── correct the two stale arch docs
         ├── build-pack.mjs → pack.generated.js
         ├── assert no unverified fact present
         └── GATE: pack ≤ 4k tokens, gap list written
              ↓
Phase 1  Worker API & eval gate                 2.0 d
         ├── wrangler.toml: main, run_worker_first, [ai], ratelimits
         ├── validate → prompt → provider → chat (SSE) → health
         ├── vitest: unit + integration in workerd
         └── ★ GATE: golden set — refusal & adversarial 100%
                     (fail ⇒ escalate provider, re-run, do not proceed)
              ↓
Phase 2  Chat UI                                2.5 d
         ├── --vp-z-chat token, launcher, lazy panel
         ├── reuse useFocusTrap; aria-live + aria-busy
         ├── all six states; sessionStorage; reduced motion
         └── GATE: keyboard journey; JS +≤2 kB, CSS +0 B
              ↓
Phase 3  Enquiry capture                        1.0 d
         ├── shared /api/enquiries + source:"chat"
         ├── notify() seam; 3-field guided flow
         └── GATE: end-to-end; no extra PII collected
              ↓
Phase 4  Hardening                              1.0 d
         ├── CI: build, size checks, secret grep, pack diff, vitest
         ├── manual + a11y + Lighthouse checklists
         └── GATE: kill switch tested; billing alert armed
              ↓
Phase 5  Launch                                 0.5 d
         ├── re-eval on preview; /privacy/ signed off
         ├── ship CHAT_ENABLED=false → verify site → flip true
         └── watch logs 30 min
              ↓
Phase 6  Deferred, each behind a trigger
         AI Gateway (week 1) · Analytics Engine · Turnstile
         D1 for enquiries · Vectorize/RAG · Hindi/Marathi
                                          ────────
                                   Total  ~7.5 days
```

**Why this order:** Phases 0 and 1 front-load the two things that can invalidate
everything after them — whether the verified content can support a useful
assistant, and whether the model can hold the accuracy line. Both are cheap to
test and expensive to discover late. The UI is built only once the assistant is
known to be correct.

---

## The one rule

> The assistant may only state facts present in the verified knowledge pack.
> For anything else it says so plainly and hands the visitor to a human.

Vedanjay Power sells grid compliance. A confident wrong answer is a commercial
liability; an honest "I don't have verified information — contact
projects@vedanjay-power.com" costs nothing and reads as rigour. Every decision
above resolves in favour of that rule.
