# 04 — Technical Architecture

## 4.1 The finding that drives this section

The existing architecture docs are **stale**. `docs/04-architecture/backend-architecture.md`
and `deployment-architecture.md` specify Express 4 on a Node container with Resend.
None of that exists.

What actually exists is `wrangler.toml` at the repo root:

```toml
name = "vedanjaypower"
compatibility_date = "2026-09-01"

[assets]
directory = "./frontend/dist"
```

The site is deployed as a **Cloudflare Worker serving static assets**. `backend/`
contains a README describing three unbuilt endpoints and nothing else.

**Consequence:** the chatbot API belongs in *this* Worker. That is not a
preference — it is the only option that avoids introducing a second hosting
platform, a second deploy pipeline, and CORS, for a feature that needs one
endpoint. §11 records the doc correction that must accompany this.

## 4.2 Shape

```
                     ┌──────────────────────────────────────┐
   Browser           │        Cloudflare Worker             │
 ┌──────────┐        │        (vedanjaypower)               │
 │ React 19 │        │                                      │
 │   SPA    │        │  run_worker_first = ["/api/*"]       │
 │          │        │                                      │
 │ Launcher │        │  ┌────────────────────────────────┐  │
 │  Panel   │──POST──┼─▶│ POST /api/chat                 │  │
 │          │  SSE   │  │  1. rate limit                 │  │
 │          │◀───────┼──│  2. validate + clamp           │  │
 │          │        │  │  3. build system prompt         │──┼──▶ env.AI
 │          │        │  │     (knowledge pack, inlined)   │  │   Workers AI
 │          │        │  │  4. stream tokens back          │◀─┼──  (or gateway)
 │          │        │  └────────────────────────────────┘  │
 │          │        │  ┌────────────────────────────────┐  │
 │          │──POST──┼─▶│ POST /api/enquiries  (shared)  │──┼──▶ Email
 │          │        │  └────────────────────────────────┘  │
 └──────────┘        │                                      │
      ▲              │  all other paths ──▶ [assets]        │
      └──────────────┼──── static, Worker not invoked       │
                     └──────────────────────────────────────┘
```

Everything is same-origin. There is no CORS configuration, no preflight, no
allow-list to maintain, and no second domain to certificate.

## 4.3 wrangler.toml change

The core diff. `§11.3` carries the canonical full file, including the second
rate-limit namespace and `[vars]`:

```toml
 name = "vedanjaypower"
 compatibility_date = "2026-09-01"
+main = "worker/index.js"

 [assets]
 directory = "./frontend/dist"
+binding = "ASSETS"
+run_worker_first = ["/api/*"]
+
+[ai]
+binding = "AI"
+
+[[ratelimits]]
+name = "CHAT_LIMIT"
+namespace_id = "1001"
+[ratelimits.simple]
+limit = 12
+period = 60
+
+[observability]
+enabled = true
+
+[vars]
+CHAT_MODEL = "@cf/meta/llama-3.1-8b-instruct-fast"
+CHAT_ENABLED = "true"
```

`run_worker_first = ["/api/*"]` is the load-bearing line. Without it, every
request for every image and JS chunk would invoke the Worker — billable
invocations and added latency for a site that is 99% static. With it, the Worker
runs **only** for `/api/*`; all other paths are served directly from the asset
store and the Worker is never woken.

Verified against the current static-assets config reference: `run_worker_first`
accepts a glob array, negative patterns are prefixed `!`, and the default is
`false` (assets served directly).

`binding = "ASSETS"` is included so the Worker *can* fall back to
`env.ASSETS.fetch(request)` for any unmatched path — defensive, and required if
`run_worker_first` is ever widened.

**Observation, not scope:** `not_found_handling` is unset, so it defaults to
`none`. When the routes in `frontend/src/constants/routes.js` beyond `/` are
actually built, this will need `"single-page-application"` or deep links will
404. Flagged here because it touches the same file; it is not a chatbot task.

## 4.4 Worker layout

```
worker/
├── index.js              # fetch handler, route table, asset fallback
├── routes/
│   ├── chat.js           # POST /api/chat  — streaming
│   ├── enquiries.js      # POST /api/enquiries — shared with contact form
│   └── health.js         # GET  /api/health
├── lib/
│   ├── provider.js       # single-function LLM interface (§04.6)
│   ├── prompt.js         # system prompt assembly
│   ├── validate.js       # input clamping, schema checks
│   ├── ratelimit.js      # binding wrapper + headers
│   └── respond.js        # JSON / SSE / error helpers
└── knowledge/
    ├── pack.generated.js # BUILD ARTEFACT — never hand-edited
    └── build-pack.mjs    # generator, run in CI (§05)
```

Plain JavaScript with JSDoc, matching the frontend. **No TypeScript**, because
the project has none and introducing a compile step for ~400 lines of Worker
code would be a net loss.

**No router library.** A `switch` on `new URL(request.url).pathname` over three
routes is clearer than a dependency:

```js
export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/chat')      return chat(request, env, ctx);
    if (pathname === '/api/enquiries') return enquiries(request, env, ctx);
    if (pathname === '/api/health')    return health();
    if (pathname.startsWith('/api/')) return json({ error: 'not_found' }, 404);
    return env.ASSETS.fetch(request);
  },
};
```

## 4.5 Frontend layout

```
frontend/src/
├── components/chat/
│   ├── ChatLauncher.jsx    # eagerly loaded, ~1.5 kB — the ONLY always-on cost
│   ├── ChatPanel.jsx       # lazy chunk
│   ├── ChatMessage.jsx     # lazy
│   ├── ChatComposer.jsx    # lazy
│   └── EnquiryFlow.jsx     # lazy
├── hooks/
│   ├── useChat.js          # message state, SSE consumption, abort
│   └── useFocusTrap.js     # EXISTING — reused unchanged
└── styles/chat.css         # extends .vp-drawer, imported by the lazy chunk
```

`ChatLauncher` mounts in `RootLayout.jsx` alongside the existing header and
footer. The panel is `React.lazy` + `Suspense`, loaded on first click. §09 has
the budget arithmetic.

## 4.6 Provider abstraction

The one deliberate piece of indirection in this design, and it earns its place.

The model provider is the **single largest unresolved decision** (§ Open
Questions) and it depends on a company answer about cost and data residency.
Rather than block, the Worker defines one interface:

```js
/**
 * @param {{system: string, messages: Array<{role:string,content:string}>}} input
 * @returns {Promise<ReadableStream>} SSE-compatible token stream
 */
export async function generate(input, env) { /* ... */ }
```

Every provider-specific detail lives behind that function. Swapping providers
touches one file and zero components.

**Default: Workers AI, `@cf/meta/llama-3.1-8b-instruct-fast`.**

| Reason | Detail |
|---|---|
| Zero new credentials | `[ai]` binding, no API key to leak or rotate |
| Same network | No egress hop; data does not leave Cloudflare |
| Cost | $0.282/M input, $0.827/M output — see §04.8 |
| Streaming built in | `env.AI.run(model, {..., stream: true})` returns a stream that can be returned directly as `text/event-stream` |

**With an explicit escalation gate.** An 8B open model is materially weaker at
strict instruction-following than a frontier model, and strict
instruction-following *is* this product's core requirement (§01.5). So the
decision is settled by test, not by assertion: the golden-set evaluation in §10
must show **zero fabrications and 100% correct refusals**. If Llama 3.1 8B fails
that bar, `provider.js` switches to a frontier model behind a secret. The
abstraction exists precisely so that outcome is a one-file change rather than a
re-architecture.

## 4.7 AI Gateway

**Recommended, not a launch blocker.** Routing `provider.js` through AI Gateway
changes a base URL and adds:

- **Request logging** — the only practical way to audit real answers for
  fabrication after launch
- **Response caching** — repeated FAQs cost nothing and return instantly
- **Provider fallback** — de-risks the §04.6 escalation
- **Per-token analytics** — real cost visibility

It requires a dashboard setup step and no code beyond a URL. Sequenced in §12 as
a fast-follow, so launch is not gated on account configuration.

## 4.8 Cost model

Stated assumptions, because the number is meaningless without them.

| Input | Value |
|---|---|
| System prompt (pack + instructions) | ~3,800 tokens |
| History (6 turns, capped) | ~600 tokens |
| User message | ~30 tokens |
| **Input per message** | **~4,400 tokens** |
| Output per message | ~180 tokens |

At Llama 3.1 8B rates ($0.282/M in, $0.827/M out):

```
input   4,400 × 0.282/1e6 = $0.00124
output    180 × 0.827/1e6 = $0.00015
                            ─────────
per message                 ≈ $0.0014   (≈ 126 neurons)
```

Workers AI includes **10,000 neurons/day free** on both Free and Paid plans, then
$0.011 per 1,000 neurons. So roughly **79 messages/day are free**, and:

| Volume | Messages/mo | Est. cost/mo |
|---|---|---|
| 1,000 conversations × 5 messages | 5,000 | **≈ $3.60** |
| 3,000 conversations × 5 messages | 15,000 | ≈ $13 |

Free allocation is daily and does not roll over, so these are order-of-magnitude
figures. The conclusion holds regardless: at this site's realistic traffic the
model cost is trivial, which is *why* answer quality — not cost — should decide
the provider.

## 4.9 What is deliberately absent

| Not used | Why |
|---|---|
| Vector database (Vectorize) | Corpus is ~8.4k tokens raw. Full text fits in context. See §05. |
| D1 / any database | Nothing needs durable storage at launch. §07. |
| Durable Objects | No cross-request coordination; sessions are client-side. |
| Queues | Nothing is async. |
| Agents SDK | No tools, no multi-step planning. It would add a dependency and a Durable Object to send one prompt. |
| WebSockets | SSE over plain HTTP is sufficient for one-way token streaming and survives proxies better. |
| Auth / sessions | Public information, anonymous visitors. |
| Framework or router in the Worker | Three routes. |

Each of these is a real product that would be correct for a different problem.
Adding any of them here would be complexity without a corresponding requirement.
