-- Enquiry persistence ONLY. Chat conversations are never stored (docs/chatbot/07-data-model.md).
--
-- Rationale: an email transport can fail silently, and a lost enquiry is a lost
-- lead for the business. This table is the durable record the team can recover
-- from. It holds only what the visitor deliberately submitted.

CREATE TABLE IF NOT EXISTS enquiry (
  id         TEXT PRIMARY KEY,
  name       TEXT    NOT NULL,
  email      TEXT    NOT NULL,
  phone      TEXT,
  message    TEXT    NOT NULL,
  source     TEXT    NOT NULL CHECK (source IN ('chat', 'contact-form')),
  created_at INTEGER NOT NULL,
  notified   INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_enquiry_created ON enquiry (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_enquiry_unnotified ON enquiry (notified) WHERE notified = 0;
