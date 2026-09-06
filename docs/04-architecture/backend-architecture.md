> **⚠️ CORRECTION — 3 September 2026**
>
> **This document does not describe the deployed system.** It specifies an
> Express/Node backend on a container, which was never built. The site actually
> deploys as a **Cloudflare Worker** serving `./frontend/dist` as static assets
> (`wrangler.toml`), and the API lives in `worker/` inside that same Worker.
>
> Current description: [`docs/chatbot/04-technical-architecture.md`](../chatbot/04-technical-architecture.md).
> Kept for history — the stack changed after it was written.

# Backend Architecture

**Stack:** Node.js 20 · Express 4 · JavaScript
**Principle from the brief:** *"Do not build an unnecessarily complex backend. Only include
architecture that is justified."*

---

## 1. What the backend is actually for

Working from the page specifications rather than from a template, the backend has exactly **three**
jobs at launch:

| # | Function | Justification | Endpoint |
|---|---|---|---|
| 1 | **Enquiry submission** | The single largest functional gap on the legacy site — **there is no contact form anywhere today.** Every lead currently requires the visitor to hand-compose an email. | `POST /api/enquiries` |
| 2 | **Gated profile download** | Journey 3 (utility/procurement) wants the company profile; capturing name, organisation and email converts an anonymous download into a lead. | `POST /api/downloads/profile` |
| 3 | **Health check** | Uptime monitoring and deploy verification. | `GET /api/health` |

**Everything else is deferred, with reasoning:**

| Considered | Decision | Reasoning |
|---|---|---|
| Newsletter subscription | **Deferred** | No newsletter exists and no editorial owner is assigned (`TO VERIFY` #17). Shipping a subscribe box that collects addresses nobody will ever mail is worse than not shipping it. |
| Career applications + CV upload | **Deferred to Phase 2** | Gated on whether live vacancies exist. File upload brings virus scanning, storage, retention policy and PII handling — real cost, currently zero benefit. |
| Admin panel / CMS | **Not built** | Content is stable and lives in versioned `data/` modules. An admin panel is a login, a session store, a permissions model and an attack surface, to edit content that changes a few times a year. Revisit only if the client demonstrates a real editing cadence. |
| Database | **Not required at launch** — see §4 | Enquiries are notifications, not records, in v1. |
| User accounts / auth | **Not built** | No page requires a logged-in user. |
| Project register API | **Not built** | 52 rows are static content, served from the frontend bundle. An API would add a network round-trip and a failure mode to data that never changes between deploys. |
| Search API | **Not built** | 19 pages. |

**This is the justified minimum.** Four files of route logic, not a framework.

---

## 2. Directory structure

```text
backend/
├── src/
│   ├── server.js                 # entry: bootstrap, graceful shutdown
│   ├── app.js                    # express app: middleware chain, routes, error handler
│   │
│   ├── config/
│   │   ├── index.js              # env loading + fail-fast validation
│   │   └── recipients.js         # intent → inbox routing map
│   │
│   ├── routes/
│   │   ├── index.js              # router mounting
│   │   ├── enquiries.routes.js
│   │   ├── downloads.routes.js
│   │   └── health.routes.js
│   │
│   ├── controllers/              # HTTP in / HTTP out only. No business logic.
│   │   ├── enquiries.controller.js
│   │   └── downloads.controller.js
│   │
│   ├── services/                 # business logic. No knowledge of req/res.
│   │   ├── enquiry.service.js    # orchestrates: validate → spam-check → notify → log
│   │   ├── email.service.js      # provider adapter
│   │   └── turnstile.service.js  # captcha verification
│   │
│   ├── validators/
│   │   ├── enquiry.validator.js  # zod schemas
│   │   └── download.validator.js
│   │
│   ├── middleware/
│   │   ├── rateLimit.js  ·  cors.js  ·  security.js   # helmet
│   │   ├── validate.js           # schema → 422 with field errors
│   │   ├── errorHandler.js       # the ONLY place errors become responses
│   │   ├── notFound.js  ·  requestId.js  ·  logger.js
│   │
│   ├── templates/emails/         # notification + acknowledgement (HTML + text)
│   │
│   └── utils/
│       ├── ApiError.js  ·  asyncHandler.js  ·  sanitize.js  ·  reference.js
│
├── tests/
├── .env.example  ·  .eslintrc.cjs  ·  package.json  ·  Dockerfile
```

**Layer rule:** `routes → controllers → services → (email/captcha providers)`.
Controllers never contain business logic; services never touch `req`/`res`. This is what makes the
service layer testable without HTTP and swappable behind a queue later.

---

## 3. The enquiry flow

```
Browser
  │  POST /api/enquiries  { name, organisation, email, phone, intent,
  │                         service?, state?, capacity?, message,
  │                         consent, website (honeypot), turnstileToken }
  ▼
CORS (allowlist) → Helmet → JSON body limit (10 KB) → requestId → rate limit
  ▼
Validate (zod)  ──✗──→ 422 { errors: { field: message } }
  ▼
Honeypot check  ──✗──→ 200 (fake success — never tell a bot it failed)
  ▼
Turnstile verify ─✗──→ 400
  ▼
enquiry.service:
   1. sanitize   (strip HTML/control chars; enforce lengths)
   2. reference  (VP-2026-XXXXX)
   3. route      (intent → recipient inbox)
   4. notify     (email to Vedanjay, Reply-To = enquirer)
   5. acknowledge(auto-reply to enquirer with the reference)
   6. log        (structured, PII-redacted)
  ▼
201 { reference: 'VP-2026-00417', message: '…' }
```

**Intent routing** (`config/recipients.js`) — the enquiry-routing requirement from
`user-journeys.md`, implemented server-side so inbox changes never require a frontend deploy:

| Intent | Routed to |
|---|---|
| `general` | general enquiries |
| `service` | service enquiries (subject carries the service name) |
| `assessment` | sales / open-access team |
| `partnership` | director |
| `vendor` | procurement / tenders |

Addresses come from environment variables, not from source. The legacy site publishes three personal
mobile numbers and two individual emails in plain text; the new design routes everything through
role addresses.

**Why an acknowledgement email matters.** It confirms receipt, gives the enquirer a reference, and
puts Vedanjay's address in their inbox — so a reply thread already exists. It is three lines of code
and materially improves the conversion experience.

---

## 4. Persistence

**Not required at launch.** Email notification satisfies the actual requirement: a human at Vedanjay
must learn about an enquiry and reply to it.

A database would add a managed instance, connection pooling, migrations, backups and a data-retention
obligation under India's DPDP Act — to store records nobody has a workflow to read.

**However**, the service layer is written so persistence is an addition, not a refactor:

```js
// enquiry.service.js
export async function submitEnquiry(input) {
  const enquiry = { ...sanitize(input), reference: generateReference(), receivedAt: new Date() };
  await notifyTeam(enquiry);
  await acknowledgeEnquirer(enquiry);
  // await enquiryRepository.save(enquiry);   ← the only line persistence adds
  return { reference: enquiry.reference };
}
```

**Trigger to add it:** the client asks "how many enquiries did we get last month?" or wants a CRM.
At that point: PostgreSQL + Prisma, one `enquiries` table, one repository module.
Recorded in the decision log.

---

## 5. Security

| Concern | Control |
|---|---|
| Spam bots | Honeypot field + Cloudflare Turnstile (privacy-preserving, no puzzle for the user) |
| Abuse / flooding | `express-rate-limit` — 5 submissions per IP per 15 min on enquiries; 100 req/15 min globally |
| Injection | Zod validation with strict schemas; `sanitize()` strips HTML and control characters |
| **Email header injection** | Newlines stripped from every field that reaches a header. A `name` containing `\nBcc:` must never become a header — this is the classic contact-form vulnerability |
| XSS in notification emails | Values HTML-escaped in templates; a plain-text alternative always sent |
| CORS | Explicit origin allowlist — production domain only. No wildcard |
| Headers | Helmet: HSTS, `X-Content-Type-Options`, `Referrer-Policy`, frame denial |
| Payload size | 10 KB JSON limit |
| Secrets | Environment variables only, validated fail-fast at boot. Never in source |
| Error leakage | `errorHandler` returns generic messages in production; stack traces only in logs |
| PII in logs | Email and phone redacted; only the reference and intent are logged |
| Dependencies | `npm audit` in CI; minimal dependency count |

---

## 6. Email provider

An adapter (`email.service.js`) behind a two-function interface — `sendNotification()`,
`sendAcknowledgement()` — so the provider is a configuration choice, not an architectural one.

**Recommended: Resend** — simple API, good deliverability, generous free tier at this volume.
Alternatives: AWS SES (cheapest at scale, more setup), Postmark (best transactional deliverability).

**Deliverability is a launch requirement, not an afterthought.** SPF, DKIM and DMARC must be
configured on `vedanjay-power.com`, and the sender must be a domain address
(`noreply@vedanjay-power.com`) — not a free-mail address. Notifications that land in spam are
indistinguishable from a broken form.

Failure handling: 3 retries with exponential backoff. If all fail, the endpoint returns 502 and the
frontend surfaces the phone number as a fallback — a lost lead is worse than an ugly error.

---

## 7. API contract

### `POST /api/enquiries`
**201** → `{ "reference": "VP-2026-00417", "message": "Enquiry received…" }`
**422** → `{ "message": "Validation failed", "errors": { "email": "Enter a valid email address" } }`
**429** → `{ "message": "Too many requests. Please try again shortly, or call +91 …" }`
**502** → `{ "message": "We could not send your enquiry. Please call +91 …" }`

### `POST /api/downloads/profile`
**200** → `{ "url": "<signed URL>", "expiresIn": 300 }` — short-lived signed URL, not a public path.

### `GET /api/health`
**200** → `{ "status": "ok", "uptime": 12345, "version": "1.0.0" }`

**Conventions:** JSON only · consistent error shape · `X-Request-Id` echoed on every response ·
versionless at launch (`/api/…`), with `/api/v2/` available if a breaking change is ever needed.

---

## 8. Configuration

```
NODE_ENV  ·  PORT  ·  CORS_ORIGIN
EMAIL_PROVIDER  ·  EMAIL_API_KEY  ·  EMAIL_FROM
RECIPIENT_GENERAL  ·  RECIPIENT_SERVICE  ·  RECIPIENT_ASSESSMENT
RECIPIENT_PARTNERSHIP  ·  RECIPIENT_VENDOR
TURNSTILE_SECRET_KEY
RATE_LIMIT_WINDOW_MS  ·  RATE_LIMIT_MAX
PROFILE_PDF_URL
```

`config/index.js` validates all of these **at boot and exits if any are missing**. A server that
starts with a missing email key and silently drops enquiries is the worst possible failure mode for
this application.

---

## 9. Testing

- **Unit:** validators (valid, invalid, boundary), `sanitize()`, **header-injection cases**,
  reference generation, intent routing.
- **Integration:** each endpoint via supertest with a mocked email provider — success, validation
  failure, honeypot trip, rate limit, provider failure.
- **Contract:** response shapes asserted against §7, so the frontend's error mapping cannot silently break.

---

## 10. Separation from the frontend

Per the brief, the two applications stay independent:

- Separate `package.json`, dependencies, build, deploy and version.
- Communication is **HTTP + JSON only**. No shared runtime, no shared build step.
- No shared code. The API contract (§7) is the interface; a small duplication of validation rules
  between client and server is deliberate — client validation is for user experience, server
  validation is for correctness, and coupling them would break the independence the brief requires.
- The frontend deploys as static files to a CDN; the backend runs as a container. Either can be
  replaced without touching the other.

---

## Related

- [Frontend architecture](frontend-architecture.md) · [Data flow](data-flow.md) · [Deployment](deployment-architecture.md)
- [User journeys](../02-information-architecture/user-journeys.md) — enquiry routing requirement
