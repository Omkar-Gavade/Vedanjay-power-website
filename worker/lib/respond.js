/** Response helpers. Every API response carries the same hardening headers. */
/* Straight from the website's own data module. This used to come from a
   generated knowledge pack; the pack existed for the model prompt and went with
   it, but the rule it enforced still holds — a contact address is never
   hardcoded here, so changing data/company.js changes this too. */
import { company } from '../../frontend/src/data/company.js';

const BASE_HEADERS = {
  'cache-control': 'no-store',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
};

export const SSE_HEADERS = {
  ...BASE_HEADERS,
  'content-type': 'text/event-stream; charset=utf-8',
  connection: 'keep-alive',
};

/** @param {unknown} body @param {number} [status] */
export function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...BASE_HEADERS, 'content-type': 'application/json; charset=utf-8' },
  });
}

/**
 * User-safe error. The `message` is shown to the visitor; the provider's own
 * error text, stack and model name never leave the Worker (§08).
 * Every message ends with a route to a human — a broken assistant must not be
 * a dead end for a genuine buyer.
 */
export function fail(code, status, message, fields) {
  return json({ error: code, message, ...(fields ? { fields } : {}) }, status);
}

// Every failure ends with a working human route — a broken endpoint must not be
// a dead end for a genuine buyer.
export const ERRORS = {
  invalid_request: [400, 'That request could not be read. Please try again.'],
  payload_too_large: [413, 'That message is too long. Please shorten it.'],
  method_not_allowed: [405, 'Unsupported request.'],
  rate_limited: [429, `Too many requests just now. You can reach the team any time at ${company.emails.general}.`],
  delivery_failed: [502, `Your enquiry could not be sent. Please email ${company.emails.general} directly.`],
  not_found: [404, 'Not found.'],
};

/** @param {keyof typeof ERRORS} code */
export function errorResponse(code) {
  const [status, message] = ERRORS[code];
  return fail(code, status, message);
}
