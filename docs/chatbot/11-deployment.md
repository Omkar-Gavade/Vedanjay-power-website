# 11 — Deployment & Operations

## 11.1 Correcting the record first

Two existing documents must be corrected as part of this work, because they
describe infrastructure that does not exist and would mislead the next engineer:

| Document | Claims | Reality |
|---|---|---|
| `docs/04-architecture/backend-architecture.md` | Express 4 on Node | No Node server. `backend/` is a README. |
| `docs/04-architecture/deployment-architecture.md` | Container deploy + Resend | Cloudflare Worker via `wrangler.toml`, `[assets]` |

Action: add a dated correction notice at the top of each, pointing to
`docs/chatbot/04-technical-architecture.md` as the current description of the
runtime. **Do not silently rewrite them** — the decision log (`docs/05-decisions/`)
should record that the stack changed, since that history is useful.

This is listed first because shipping a chatbot onto an undocumented runtime,
while leaving two documents asserting a different one, would leave the repo worse
than before.

## 11.2 Environments

| Env | Purpose | URL |
|---|---|---|
| Local | Development | `wrangler dev --remote` |
| Preview | Eval + review | Worker preview / versioned URL |
| Production | Live | `vedanjaypower` Worker |

**`--remote` is required**, not optional. Workers AI models do not run locally;
`wrangler dev` without it will fail on the `AI` binding. This trips up everyone
once.

Local static-asset dev continues to be `npm run dev` in `frontend/` (Vite). To
exercise the API locally, run `wrangler dev --remote` against a built `dist` and
hit `/api/*`. Optionally `@cloudflare/vite-plugin` unifies these into one dev
server — worth doing if the split becomes annoying, but not required and not a
launch task.

## 11.3 Configuration

Complete `wrangler.toml` after this work:

```toml
name = "vedanjaypower"
compatibility_date = "2026-09-01"
main = "worker/index.js"

[assets]
directory = "./frontend/dist"
binding = "ASSETS"
run_worker_first = ["/api/*"]

[ai]
binding = "AI"

[[ratelimits]]
name = "CHAT_LIMIT"
namespace_id = "1001"
[ratelimits.simple]
limit = 12
period = 60

[[ratelimits]]
name = "ENQUIRY_LIMIT"
namespace_id = "1002"
[ratelimits.simple]
limit = 3
period = 60

[observability]
enabled = true

[vars]
CHAT_MODEL = "@cf/meta/llama-3.1-8b-instruct-fast"
CHAT_ENABLED = "true"
```

Notes:

- `period` accepts **only 10 or 60** seconds. The §06.2 enquiry limit of "3 per
  10 minutes" cannot be expressed directly; it is implemented as 3/60s at the
  binding plus the client-side single-submit guard. If a true 10-minute window is
  needed later it requires a Durable Object or KV counter — noted, not built,
  because 3/60s already stops the realistic abuse.
- `CHAT_MODEL` in `[vars]` means the §10.2 provider escalation is a config change
  plus a `provider.js` branch, not a code hunt.
- `CHAT_ENABLED` is the kill switch (§11.6).
- `[vars]` are public config, **never** secrets.

### Secrets

```bash
wrangler secret put RL_SALT              # rate-limit IP hashing
wrangler secret put NOTIFY_TOKEN         # email transport, once chosen
wrangler secret put PROVIDER_API_KEY     # ONLY if escalated off Workers AI
```

Never in `wrangler.toml` (committed), never in `frontend/.env` (Vite inlines
`VITE_*` into the client bundle).

## 11.4 Build order

```
1. node worker/knowledge/build-pack.mjs   → pack.generated.js
2. npm --prefix frontend ci
3. npm --prefix frontend run build        → frontend/dist
4. wrangler deploy                         → uploads Worker + assets together
```

Step 1 **must** precede step 4. Deploying a Worker whose pack was not regenerated
after a content change ships stale facts — the exact failure this design's CI
step 5 (§10.6) exists to catch.

One `wrangler deploy` publishes the Worker and the static assets atomically, so
there is no window where a new frontend talks to an old API.

## 11.5 Release procedure

1. CI green (§10.6)
2. Deploy to preview
3. `npm run eval` — **Class B and D at 100%**, or stop
4. Manual checklist (§10.5)
5. Lighthouse delta on `/` — no regression
6. Deploy to production
7. Watch logs for 30 minutes: error rate, p50 first-token, rate-limit hits
8. Verify the billing alert is armed

### Rollout

Ship with `CHAT_ENABLED = "false"`, verify the site is untouched, then flip to
`"true"`. This separates "did the deploy break the site" from "does the chatbot
work" — two questions that are much easier to answer one at a time.

### Rollback

- **Instant, no deploy:** set `CHAT_ENABLED = "false"` — the launcher does not
  render, `/api/chat` returns 503. The site is unaffected because the chatbot
  shares no code path with it.
- **Full:** `wrangler rollback` to the previous version.

The kill switch is the primary mechanism. It is faster than a rollback and does
not risk reverting unrelated site changes shipped in the same deploy.

## 11.6 Kill switch

```js
if (env.CHAT_ENABLED !== 'true') return json({ error: 'disabled' }, 503);
```

The client reads a small flag from `/api/health` (or a build-time var) and
suppresses the launcher, so a disabled assistant is invisible rather than broken.

Reasons this exists: a fabrication is discovered in production; the model
provider degrades; cost spikes unexpectedly; a company request to pull it. Each
of those needs a response measured in seconds, not in a deploy cycle.

## 11.7 Monitoring

| Signal | Source | Alert |
|---|---|---|
| Error rate | Workers Logs | > 5% over 15 min |
| p50 time to first token | Worker duration log | > 3 s |
| Rate-limit hits | Worker log counter | sustained spike → possible abuse |
| Neuron spend | Cloudflare billing alert | **hard threshold, configured before launch** |
| Refusal rate | `outcome` counter (§07.5) | sudden drop = possible grounding failure |

That last row is subtle and worth keeping: a **falling** refusal rate is a
warning sign, not an improvement. It can mean the assistant has started
answering things it should refuse.

The billing alert is the one non-optional item. It converts unbounded financial
exposure into a bounded, noticed event.

## 11.8 Operational runbook

**Assistant states something false**
1. `CHAT_ENABLED = "false"` immediately.
2. Find the claim's source: is it in the pack (content bug) or invented
   (grounding failure)?
3. Content bug → fix the source data, regenerate the pack, re-eval, redeploy.
4. Grounding failure → add the case to the golden set as a Class B/D question,
   tighten the prompt or escalate the model, re-eval, redeploy.

Adding the failure to the golden set is the step that matters; a fix without a
regression test will recur.

**Cost spike**
1. Check rate-limit hits and request volume for a single hashed key.
2. If distributed abuse → enable Turnstile on `/api/chat` (§08.4).
3. If organic → raise the budget or lower `max_tokens`/history depth.

**Provider outage** — 502s surface the §03.8 error copy, which always includes a
working contact. Enable AI Gateway fallback if configured, otherwise use the kill
switch so visitors get the contact page instead of an error.

**Enquiries not arriving** — check the transport response in logs; the handler
returns 502 `delivery_failed` on transport error, so this is visible rather than
silent. Note that no enquiry is stored, so a failed delivery is a **lost lead** —
which is the strongest argument for adding D1 persistence to the enquiry path
specifically (see §07.7 and Open Questions).

## 11.9 Cost summary

| Item | Cost |
|---|---|
| Workers requests | Existing plan; `run_worker_first` keeps static traffic off the Worker |
| Workers AI | ~$3.60/mo at 1,000 conversations (§04.8) |
| Rate limiting binding | Free |
| AI Gateway | Free tier sufficient |
| Storage | None |
| **New infrastructure** | **None** |

The chatbot adds no hosting, no database, and no third-party subscription. That
is the direct result of building it into the deployment that already exists.
