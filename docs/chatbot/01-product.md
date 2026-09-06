# 01 — Product Definition

## 1.1 What this is

A **grounded site assistant** for vedanjay-power.com. It answers questions about
Vedanjay Power using a fixed, verified knowledge pack, and hands the visitor to a
human when it cannot answer.

It is deliberately **not**:

| Not this | Why not |
|---|---|
| A general-purpose ChatGPT clone | Vedanjay gains nothing from answering "write me a poem". Every off-topic answer is cost and risk with no business return. |
| A sales bot that pushes a CTA every turn | The audience is technical/commercial buyers. Pressure reads as low credibility. |
| A generic floating widget bolted on | It must look and behave like part of this site, or it damages the premium positioning built in phases 6–7. |
| An AI capability demo | The company's AI story is the ENERCAST forecasting partnership, not a website widget. |

## 1.2 Who it serves

Derived from `docs/01-research/` personas and the capability set in
`frontend/src/data/capabilities.js`.

**P1 — Renewable generator / IPP (primary).** Has a solar/wind plant, needs a QCA
or is unhappy with the current one. Wants to know: do you cover my state, what
does QCA onboarding involve, how does forecasting accuracy work, who do I talk to.
*This persona is the commercial reason the chatbot exists.*

**P2 — C&I open-access buyer.** Evaluating open-access power procurement. Wants to
know scope, states covered, and whether Vedanjay handles the regulatory side.

**P3 — EPC / developer partner.** Looking for grid studies, ABT metering,
transmission infrastructure support. Wants scope confirmation and a contact.

**P4 — Job seeker / student.** Low commercial value, non-trivial traffic share.
Must be handled politely and routed to careers in one turn, not stonewalled.

## 1.3 Jobs to be done

Ranked. The plan optimises for 1–3; 4–5 are consequences, not goals.

1. **Explain a capability accurately.** "What does a QCA actually do for me?"
2. **Confirm coverage.** "Do you operate in Madhya Pradesh?" — a yes/no the site
   currently buries in prose.
3. **Convert a qualified visitor into an enquiry** with the right contact route
   (`projects@` vs `forecasting.india@`).
4. **Navigate.** "Where do I find your project list?" → link, not a paragraph.
5. **Deflect low-value questions** cheaply and gracefully.

## 1.4 Scope

### In scope (v1)

- Q&A grounded in the verified knowledge pack (§05)
- Capability, coverage, and company-background questions
- Routing to the correct contact channel
- Guided enquiry capture (name, email, message — nothing more)
- English only

### Out of scope (v1) — with reasons

| Excluded | Reason |
|---|---|
| Hindi / Marathi | Real demand is plausible but unmeasured. Adding a second language doubles the review burden on every fact. Revisit with analytics (§09). |
| Voice input | No evidence of need. Meaningful a11y and cost surface. |
| Live human handoff / ticketing | Vedanjay has no staffed chat rota. Promising a human who never arrives is worse than an email address. |
| Document upload / analysis | No use case in the IRD. Large security surface. |
| Authenticated customer data | No customer portal exists. |
| Pricing quotes | Commercially sensitive and always deal-specific. Hard-refused in the system prompt (§05). |

## 1.5 The accuracy contract

This is the product's central constraint, and it outranks helpfulness.

> The assistant may only state facts present in the knowledge pack. For anything
> else it must say it does not have that information and offer a human contact.

The IRD explicitly marks these as *to be confirmed*: client list, projects
completed, installed capacity, clients served, employee count, awards,
certifications, office hours. **None may be stated, estimated, or implied**, and
the assistant must not reason around the gap ("a company of this size typically…").

A confident wrong answer about grid compliance is a commercial liability for a
company whose product *is* compliance. An honest "I don't have that — contact
projects@vedanjay-power.com" costs nothing.

## 1.6 Success measures

Measured on aggregate, non-PII counters (§09).

| Metric | Target | Why |
|---|---|---|
| Grounded-answer rate | ≥ 95% of answerable questions answered without escalation | Core utility |
| Fabrication rate on the golden set | **0** | Non-negotiable; gates launch (§10) |
| Enquiries started from chat | Baseline in month 1, then trend | Commercial return |
| Median time to first token | < 1.2 s | Perceived responsiveness |
| Homepage bundle delta | **0 kB** before user interaction | §09 constraint |

## 1.7 Explicit non-goals

- Not a replacement for the contact page — an additional route to it.
- Not a system of record. It stores no transcripts by default (§07, §08).
- Not staffed. Every escalation ends at a published email address or phone
  number that already exists in `frontend/src/data/company.js`.
