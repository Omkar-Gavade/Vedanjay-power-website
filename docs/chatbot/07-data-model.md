# 07 — Data Model

## 7.1 The decision

**No database at launch. No conversation persistence. Nothing server-side.**

| Data | Where it lives | Retention |
|---|---|---|
| Conversation messages | Browser `sessionStorage` only | Until tab closes |
| Panel open/dismissed state | Browser `sessionStorage` | Until tab closes |
| Enquiry (name, email, message) | Transits the Worker, delivered by email, **not stored** | Held only in the recipient inbox |
| Aggregate counters | Workers Logs / Analytics Engine, non-PII | Platform default |
| Knowledge pack | Compiled into the Worker bundle | Versioned with the deploy |

The Worker is **stateless**. It receives a request, builds a prompt, streams a
response, and forgets.

## 7.2 Why no conversation storage

This is a genuine architectural choice, not laziness, and it is worth stating
plainly because "store every transcript" is the default in most chatbot builds.

1. **There is no legal basis established for it.** Vedanjay has not decided
   whether it may retain visitor conversations, has no published retention
   period, and has no privacy-policy language covering it. Storing first and
   asking later is the wrong order.

2. **Chat transcripts attract personal data.** Visitors paste plant addresses,
   names, phone numbers and commercial detail into chat boxes unprompted. A
   transcript store is a store of unstructured personal data with no schema to
   control it — the highest-risk, lowest-value asset in this design.

3. **Nothing at launch needs it.** The product's measurable goals (§01.6) are all
   satisfiable with aggregate counters. Not one requires reading an individual
   conversation.

4. **It is trivially reversible.** Adding D1 later is a binding, a migration and
   one insert. Deleting data that was collected without a basis is not
   trivially reversible.

The user's constraint was "do NOT collect unnecessary personal information". The
strongest available implementation of that is to collect none.

## 7.3 Client-side session shape

Held in React state, mirrored to `sessionStorage` under `vp-chat-session` so a
route change or accidental close does not lose the conversation.

```js
{
  v: 1,                       // schema version, so a format change can discard cleanly
  id: 'c_8f3a1b',             // random, client-generated, NOT sent to the server
  startedAt: 1756890000000,
  messages: [
    { id: 'm1', role: 'user',      content: '...', at: 1756890001000 },
    { id: 'm2', role: 'assistant', content: '...', at: 1756890003000 }
  ],
  dismissed: false,
  count: 4                    // against the 30-message cap (§03.7)
}
```

Notes:

- `sessionStorage`, **not** `localStorage`. A conversation should not outlive the
  visit; `localStorage` would leave a technical-enquiry transcript on a shared
  machine indefinitely.
- `id` exists only to key React lists and to let a future support flow reference
  a conversation *if* the user chooses to share it. It is never transmitted.
- Every read and write is wrapped in `try/catch`. Private-mode Safari and
  storage-blocked browsers throw on access, and the chat must work without
  persistence — degrading to in-memory only.
- Schema version `v` lets a deploy with a changed shape discard old sessions
  rather than crash on them.

## 7.4 Enquiry payload — in transit only

```js
{
  name: string,       // 2–100
  email: string,      // ≤254, RFC-shaped
  message: string,    // 10–2000
  phone?: string,     // ≤20, optional, never required
  source: 'chat' | 'contact-form',
}
```

Lifecycle: validated in the Worker → formatted into an email → handed to the
transport → discarded. No write, no queue, no log of the values.

The email body includes the three fields and the `source` marker. It does **not**
include the preceding conversation, even though that would be commercially
useful, because the visitor consented to sending an enquiry — not a transcript.
If Vedanjay wants transcript context attached, that requires an explicit,
separate opt-in checkbox and a privacy-policy line; it is listed as an open
question, not assumed.

## 7.5 Aggregate metrics — non-PII

Emitted as structured log lines (or Analytics Engine data points if §09's
optional step is taken). Cardinality is deliberately low so nothing can be
re-identified.

```js
{
  event: 'chat_message',
  ts: 1756890000000,
  route: '/api/chat',
  status: 200,
  duration_ms: 1180,
  tokens_in: 4412,
  tokens_out: 176,
  outcome: 'answered' | 'refused' | 'escalated' | 'error',
  rate_limited: false,
}
```

`outcome` is the one interesting field — it is how the grounded-answer rate and
refusal rate from §01.6 get measured. It is produced by the teed-stream
classifier in §06.1, which runs in `ctx.waitUntil` after the response is sent:
the text is matched against known refusal and contact-route strings, the label is
counted, and the text is discarded. **The label is logged; the content never is.**

**Not emitted:** message text, response text, IP, user agent, session id, email.

## 7.6 Rate-limit keying

The rate-limit binding needs a key. Options and the choice:

| Key | Verdict |
|---|---|
| Raw IP | Rejected — logging or persisting IP is personal data; unnecessary here |
| `CF-Connecting-IP` hashed with a per-deploy salt | **Chosen.** Sufficient to bucket a caller; not reversible to an address; never stored |
| Session id from the client | Rejected — client-controlled, so trivially bypassed by regenerating it |

```js
const key = await sha256(`${env.RL_SALT}:${request.headers.get('CF-Connecting-IP') ?? ''}`);
const { success } = await env.CHAT_LIMIT.limit({ key });
```

The salt is a Worker secret. The hash is computed per request and never written
anywhere.

**Known limitation, stated honestly:** the rate-limit binding is per-Cloudflare-
location and eventually consistent — the docs describe it as "permissive… not to
be used as an accurate accounting system". It is a spend guard against casual
abuse, not a strict quota. A determined distributed abuser needs the §08
escalation (Turnstile), and that is the correct place to solve it.

## 7.7 If storage is later approved

Recorded now so the migration is a known quantity rather than a redesign. D1
would be the choice — SQLite, in-platform, one binding.

```sql
CREATE TABLE conversation (
  id           TEXT PRIMARY KEY,
  started_at   INTEGER NOT NULL,
  ended_at     INTEGER,
  message_count INTEGER NOT NULL DEFAULT 0,
  outcome      TEXT,               -- answered | refused | escalated
  ip_hash      TEXT                -- salted, never raw
);

CREATE TABLE message (
  id              TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL REFERENCES conversation(id),
  role            TEXT NOT NULL CHECK (role IN ('user','assistant')),
  content         TEXT NOT NULL,
  at              INTEGER NOT NULL,
  tokens          INTEGER
);

CREATE INDEX idx_message_conversation ON message(conversation_id, at);
```

Preconditions before this ships — all three, not any:

1. A stated retention period, enforced by a scheduled purge (Cron Trigger).
2. Privacy-policy text covering chat retention, published at `/privacy/`.
3. A concrete question that requires transcripts and cannot be answered by the
   §07.5 counters.

Absent those, this table is a liability with no owner.
