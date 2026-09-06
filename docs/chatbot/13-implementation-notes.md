# 13 — Implementation Notes (deviations from the plan)

Recorded as required by the documentation-sync rule. Each entry states what the
plan said, what the repository proved, and what was actually built.

---

## 13.1 The knowledge pack excludes `docs/06-content/` — CRITICAL

**Plan (§05.3):** source the pack from the data modules *and*
`docs/06-content/company-facts.md` + `project-register.md`.

**Reality:** `company-facts.md` is a **legacy-website audit**, not a current fact
register. Its own header says the legacy site is *"evidence of what the company
has claimed, not independent proof that the claim is current."*

| Fact | Legacy audit | IRD-derived `data/company.js` |
|---|---|---|
| General email | `services@vedanjay-power.com` | `projects@vedanjay-power.com` |
| Phone | `0731-4239605` | `7666901814` |
| Indore PIN | `452008` / `452001` (itself TO VERIFY) | `452010` |

**Built:** the pack is generated **only** from `frontend/src/data/*` and
`constants/routes.js`. `build-pack.mjs` fails the build if any legacy value
appears (`FORBIDDEN` list). Tests assert their absence.

Including that file would have had the assistant hand visitors a dead email
address — the worst possible failure for a lead-generation tool.

**Also dropped: enercast.** Not present in the IRD data modules, and item 7 of
the TO VERIFY register marks *"Is the enercast GmbH cooperation still active?"*
as blocking. Excluded until the company confirms it.

**Effect:** pack is **~1,980 tokens** (was estimated 3,500–4,000). Further under
the 15k RAG trigger, so §05.2's no-vector-database decision is strengthened.

---

## 13.2 The assistant links to no pages at all

**Plan (§02, §08.6):** emit a route reference; the client linkifies it against
`routes.js`.

**Reality:** `App.jsx` implements **only `/`**. Every other declared route
renders the interim "coming soon" page. Linking a qualified lead to a dead page
is worse than giving them an email address.

Worse, a generic path pattern was actively harmful in practice: it turned the
bare `/` in *"Forecasting & Scheduling / QCA"* into a link to the homepage. Found
during browser verification, now covered by a regression test.

**Built:** path linkification removed from `richText.jsx`. Only **verified
emails and the verified phone number** are linkified, by exact match against
`data/company.js`. The pack tells the model that other sections are in
preparation and to route people to the contacts instead.

When those pages ship, add them to a `LIVE_ROUTES` set and match each full path
**literally** — never with an open-ended pattern.

---

## 13.3 Enquiry persistence built now, not deferred

**Plan:** D1 for enquiries listed under Phase 6, behind Open Question 8.

**Reality:** the risk is real and was explicitly prioritised — a failed
notification silently loses a genuine lead, and nothing else records it.

**Built:** `worker/migrations/0001_enquiry.sql` and a `DB` binding, with this
ordering in `routes/enquiries.js`:

1. **persist to D1 first**, then notify;
2. persistence succeeded but notification failed → **200 to the visitor** (the
   lead is safe and recoverable, so do not alarm them);
3. **both** failed → 502 telling them to email directly.

If the `DB` binding is absent the route degrades to notification-only rather
than failing, so the code is safe to deploy before the database is provisioned.

**Still enquiry-only.** Chat conversations remain unstored (§07).

`d1_databases` is commented out in `wrangler.toml` with the one-time setup
commands, because creating the database is an account-level action for the owner
to run.

---

## 13.4 Notification transport is a webhook seam

Open Question 2 (destination inbox) is unresolved, so `lib/notify.js` posts to
`NOTIFY_WEBHOOK_URL`. That works with Resend, SendGrid, Zapier or Slack without
another code change. Until the secret is set, `notify()` reports
`not_configured` and D1 persistence carries the lead.

---

## 13.5 A local scroll hook instead of reusing `useScrollState`

**Plan (§02.6):** reuse `useScrollState` for the launcher's scroll behaviour.

**Reality:** it returns `{solid, hidden}` at a 28px threshold, tuned for the
header. The launcher needs a hero-height threshold and an is-scrolling flag.
Widening the shared hook would risk the header for a cosmetic gain.

**Built:** a small `useLauncherScroll` local to `ChatLauncher.jsx` — one extra
passive, rAF-throttled listener. `useScrollState` is untouched.

---

## 13.6 Plain Vitest, not `@cloudflare/vitest-pool-workers`

**Plan (§10.1):** use the workers pool so bindings behave as in production.

**Reality:** every handler already takes `env` as a parameter, so a plain object
exercises the same code paths — and lets tests assert things the pool cannot,
such as *"the provider was never called when rate-limited"*. The pool was
installed, found to add a heavy dependency for no additional coverage, and
removed.

**Built:** 83 tests in plain Vitest. Real `workerd` behaviour is still verified
by `wrangler dev --remote` before release (§11.5).

---

## 13.7 Dev-only Worker bridge

`frontend/dev-api.js` (`apply: 'serve'`) runs the **real** `worker/index.js`
inside the Vite dev server with a stubbed model, so the UI is developed against
genuine validation, genuine server-side prompt assembly and genuine SSE framing.
Workers AI has no local runtime and `wrangler dev --remote` needs credentials.
It is never part of a production build.

---

## 13.8 Launcher persists after close

An early implementation stored a session "dismissed" flag on close, which hid
the launcher for the rest of the visit — leaving no way back into the chat.
Removed. Closing returns to the launcher; focus is restored to it.

---

## 13.9 Status: the launch gate HAS now been run — see §14

> **Superseded 3 Sep 2026.** The evaluation was subsequently run against real
> Workers AI via `wrangler dev --remote`. Result: Class A/B/C 100%, **Class D
> 71% — GATE FAILED**. The audit also found four defects in the evaluation
> harness itself, which had been producing false verdicts. See
> [14-pre-production-audit.md](14-pre-production-audit.md).

The original note follows.

### Original note

`worker/knowledge/golden-set.json` (45 cases) and `run-eval.mjs` are complete and
verified working — run against the dev stub they correctly failed the gate and
reported each failure.

**The real evaluation requires a deployed preview with a live model, which needs
Cloudflare account credentials.** It has not been run.

Until `npm run eval -- --base <preview-url>` passes with **Class B and D at
100%**, the provider choice is unvalidated and the assistant is **not
production-ready**. See §12 Phase 1.10 and §11.5.


---

## 13.10 Output guard — the model is no longer a security boundary

**Added 3 Sep 2026** after the §14 audit found the model reproducing its own
system prompt and adopting an attacker persona in 3 of 3 real runs, despite an
explicit rule forbidding both.

The instruction was present and ignored, so the root cause is a model
instruction-following limit, not a prompt defect. `worker/lib/guard.js` now
inspects model output before it reaches the visitor:

- **Policy-leak detection** — 8-word shingle fingerprint of `PROTECTED_POLICY`.
  A comparison against known text, not a keyword blacklist.
- **Role-abandonment detection** — first-person declarations of operating
  without rules. Behavioural: the string "DAN" appears nowhere in it.

`prompt.js` was split into `PROTECTED_POLICY` (preamble + numbered rules) and
`GUIDANCE` (worked examples + routing). Only the former is fingerprinted — the
knowledge pack, the refusal script and the contact addresses must stay quotable,
or the guard would block correct answers.

Streaming is preserved: only the first 240 characters are withheld before the
first byte is released. Blocked replies carry no HMAC, so they cannot be replayed
as trusted history.

Full analysis: [15-adversarial-security-report.md](15-adversarial-security-report.md).

---

## 13.11 Provider errors are logged server-side

A quota exhaustion and a model outage were previously indistinguishable — both
surfaced as a silent 502. `chat.js` now logs the upstream error message to
Workers Logs (never to the client). That is how the `4006` neuron-allocation
cause was identified.
