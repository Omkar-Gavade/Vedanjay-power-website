# Backend — pending scaffold

Node + Express.

**Not yet scaffolded.** The architecture is fully specified in
[`docs/04-architecture/backend-architecture.md`](../docs/04-architecture/backend-architecture.md).

Scope is deliberately minimal — three endpoints, no database:

| Endpoint | Purpose |
|---|---|
| `POST /api/enquiries` | Enquiry submission with intent routing to five inboxes |
| `POST /api/downloads/profile` | Gated company-profile download |
| `GET /api/health` | Health check |

Newsletter, career applications and an admin panel are deferred with reasoning recorded in
[`docs/05-decisions/decision-log.md`](../docs/05-decisions/decision-log.md) (D-017).
