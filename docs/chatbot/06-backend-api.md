# 06 — Backend API

Three endpoints, all inside the existing `vedanjaypower` Worker, all same-origin
under `/api/*`.

## 6.1 `POST /api/chat`

Streaming chat completion.

### Request

```http
POST /api/chat
Content-Type: application/json
```

```json
{
  "message": "Do you operate in Madhya Pradesh?",
  "history": [
    { "role": "user",      "content": "What does a QCA do?" },
    { "role": "assistant", "content": "A QCA is the entity..." }
  ]
}
```

| Field | Type | Rules |
|---|---|---|
| `message` | string | Required. 1–1000 chars after trim. |
| `history` | array | Optional. Max 12 entries (6 turns). Roles must be `user`\|`assistant` only. Each `content` clamped to 1000 chars. |

**Deliberately absent from the contract:** `system`, `model`, `temperature`,
`max_tokens`, `pack`. The client cannot influence the prompt or the model. If any
appear, validation strips them silently rather than erroring — a 400 tells a
prober that the field is recognised.

### Response — success

```http
200 OK
Content-Type: text/event-stream
Cache-Control: no-store
X-Content-Type-Options: nosniff
```

```
data: {"delta":"Vedanjay Power is registered"}

data: {"delta":" for SLDC operations in"}

data: {"done":true}
```

#### Event types

| Event | Payload | Meaning |
|---|---|---|
| `delta` | `string` | Append this text to the current message |
| `done` | `true` | Stream complete |
| `error` | error code | Terminal failure after the stream opened |

Three events, deliberately. **Links are not part of the wire protocol.** The
model emits a bare path (`/projects/`) as ordinary text, constrained by system
prompt rule 8, and the **client** linkifies it by exact match against
`frontend/src/constants/routes.js`. An unrecognised path renders as plain text.

That keeps the whitelist where the route table already lives, and — more
importantly — avoids the alternative: a Worker-side `route` event would require
buffering the model output to detect references, which defeats the streaming
this endpoint exists to provide.

#### Outcome classification, off the critical path

The §07.5 counters need an `outcome` (`answered` \| `refused` \| `escalated`)
without reading message content into a log. The Worker **tees** the stream:

```js
const [toClient, toMetrics] = stream.tee();
ctx.waitUntil(classify(toMetrics, ctx));   // accumulate, classify, discard
return new Response(toClient, { headers: SSE_HEADERS });
```

The client's branch flows immediately with zero added latency; the metrics branch
is consumed after the response is sent, classified by matching against the known
refusal and contact-route strings, counted, and discarded. The text is never
logged — only the resulting label.
Workers AI with `stream: true` returns a stream that is already SSE-shaped, so
the handler can return it directly:

```js
const stream = await env.AI.run(MODEL, { messages, stream: true, temperature: 0.1, max_tokens: 400 });
return new Response(stream, {
  headers: {
    'content-type': 'text/event-stream',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
  },
});
```

This is why SSE was chosen over WebSockets: there is no framing layer to write,
no connection lifecycle to manage, and it degrades cleanly through proxies.

### Response — errors

Errors are returned as **JSON, not SSE**, and are decided *before* the stream
opens. Once bytes are flushed the status code is fixed, so all validation and
rate limiting happens first.

| Status | Body `error` | Cause |
|---|---|---|
| 400 | `invalid_request` | Missing/empty `message`, malformed JSON, bad `role` value |
| 405 | `method_not_allowed` | Not POST |
| 413 | `payload_too_large` | Body > 16 kB |
| 429 | `rate_limited` | Rate limit binding returned `success: false` |
| 502 | `upstream_error` | Provider failed |
| 504 | `upstream_timeout` | Provider exceeded 20 s |

```json
{ "error": "rate_limited", "message": "Too many messages. Please wait a moment." }
```

Error bodies carry a user-safe `message` and **never** a provider message, stack,
or model name. Diagnostics go to Workers Logs, not to the client.

If the provider fails *mid-stream*, the handler emits a terminal SSE event and
closes; it cannot change the status code:

```
data: {"error":"upstream_error"}
```

### Handler order

Order is load-bearing:

```
1. method check                     → 405
2. content-length / body size       → 413
3. JSON parse                       → 400
4. schema validate + clamp + strip  → 400
5. rate limit                       → 429
6. build system prompt (server)
7. call provider (stream)
8. return stream
```

Rate limiting sits at step 5, **after** cheap rejections and **before** the
expensive model call — the only position where it protects spend.

## 6.2 `POST /api/enquiries`

**Reuses the endpoint already specified in `backend/README.md`.** The chatbot is
a second client of the site's one enquiry pipeline, not a parallel lead path.
This means one validation path, one notification path, one place to change the
destination address.

### Request

```json
{
  "name": "A. Sharma",
  "email": "a.sharma@example.com",
  "message": "We have a 40 MW solar plant in MP and need a QCA.",
  "source": "chat"
}
```

`source` is the only addition to the existing contract: `"contact-form"` |
`"chat"`. It exists so the team can see which channel produces enquiries, and it
is set server-side-verifiable only in the loose sense — it is a hint for
reporting, never a trust boundary.

| Field | Rules |
|---|---|
| `name` | Required, 2–100 chars |
| `email` | Required, RFC-shaped, ≤ 254 chars |
| `message` | Required, 10–2000 chars |
| `source` | Enum, defaults `"contact-form"` |
| `phone` | Optional, ≤ 20 chars — never required (§03.6) |

No other field is accepted. Unknown fields are dropped.

### Response

```json
{ "ok": true }
```

| Status | `error` |
|---|---|
| 400 | `invalid_request` — with a `fields` map for form display |
| 429 | `rate_limited` — separate, tighter namespace than chat |
| 502 | `delivery_failed` |

### Delivery

The notification transport is an **open question** (§ Open Questions) — the stale
docs name Resend, which was never built, and the destination inbox is unconfirmed.
The handler is written against a one-function interface:

```js
await notify({ subject, body, replyTo }, env);
```

Cloudflare Email Service is the natural fit given the platform, but this is a
company decision about which inbox receives leads. Until it is answered, the
interface is defined and `notify()` is the single implementation point.

**Rate limit:** 3 per 60 s per hashed IP (`ENQUIRY_LIMIT`). Enquiries are a human
action; anything faster is abuse.

The rate-limit binding accepts a `period` of **only 10 or 60 seconds**, so a
longer window cannot be expressed at the binding. 3/60s plus the client-side
single-submit guard stops the realistic case; a true multi-minute window would
need a Durable Object or KV counter and is not justified (§11.3).

## 6.3 `GET /api/health`

```json
{ "ok": true, "ts": 1756890000000, "chat": true }
```

`chat` mirrors the `CHAT_ENABLED` var and is what the client reads to decide
whether to render the launcher at all (§11.6). This is what makes the kill switch
take effect without a frontend deploy: a disabled assistant is **invisible**
rather than a button that errors.

No bindings are touched and no provider call is made. It answers "is the Worker
deployed and is chat on" — not "is the model up". A health check that called the
model would cost neurons on every uptime poll.

## 6.4 Cross-cutting

### Headers on every API response

```
Cache-Control: no-store
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

### No CORS

All requests are same-origin, so no `Access-Control-Allow-Origin` is emitted.
This is a security property, not an omission: no header means no cross-origin
caller, so nobody else's page can drive Vedanjay's model budget.

Requests are additionally checked for a same-origin `Origin`/`Sec-Fetch-Site`
where present, and rejected otherwise (§08).

### Timeouts

Provider calls are wrapped in `AbortSignal.timeout(20_000)`. Without it a hung
upstream holds the request until the platform kills it, and the user sees a
spinner with no error.

### Logging

`[observability]` is enabled in `wrangler.toml`. Logged per request: timestamp,
route, status, duration, token counts, rate-limit outcome, error class.

**Never logged:** message content, assistant output, email address, name, or raw
IP. See §07 and §08 — the privacy posture only holds if the logs honour it too.
