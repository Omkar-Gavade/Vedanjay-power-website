/**
 * POST /api/enquiries
 *
 * Shared with the site's contact form (backend/README.md contract) plus a
 * `source` marker. One enquiry pipeline, one destination to change.
 *
 * LEAD-LOSS PREVENTION — the ordering here is deliberate:
 *   persist to D1 FIRST, then notify.
 * An email transport can fail silently; a genuine lead must not vanish with it.
 * If persistence succeeds but notification fails we still return success to the
 * visitor, because the enquiry IS safely recorded and the team can recover it.
 * Only when BOTH fail does the visitor get an error telling them to email
 * directly — the one case where their message really did not get through.
 *
 * This is enquiry-only persistence. Chat conversations remain stateless (§07).
 */
import { validateEnquiry } from '../lib/validate.js';
import { allow } from '../lib/ratelimit.js';
import { notify } from '../lib/notify.js';
import { log } from '../lib/metrics.js';
import { json, errorResponse, fail } from '../lib/respond.js';

/** @returns {Promise<string|null>} the row id, or null if not persisted */
async function persist(enquiry, env) {
  if (!env.DB) return null; // binding not provisioned yet — degrade, don't break
  const id = crypto.randomUUID();
  try {
    await env.DB.prepare(
      `INSERT INTO enquiry (id, name, email, phone, message, source, created_at, notified)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
    ).bind(
      id, enquiry.name, enquiry.email,
      enquiry.phone, enquiry.message, enquiry.source, Date.now(),
    ).run();
    return id;
  } catch (err) {
    log({ route: 'enquiries', event: 'persist_failed', error: err?.name ?? 'unknown' });
    return null;
  }
}

/**
 * Mark a row as delivered.
 *
 * Without this every row stays notified=0, the `idx_enquiry_unnotified` partial
 * index is useless, and any recovery process would see every lead as undelivered
 * — which is exactly the state that makes a lead-recovery report untrustworthy.
 * Runs after the response is sent, so it adds no latency.
 */
async function markNotified(id, env) {
  if (!env.DB || !id) return;
  try {
    await env.DB.prepare('UPDATE enquiry SET notified = 1 WHERE id = ?').bind(id).run();
  } catch (err) {
    // The lead is safe either way; the flag is only for recovery reporting.
    log({ route: 'enquiries', event: 'mark_notified_failed', error: err?.name ?? 'unknown' });
  }
}

export async function enquiries(request, env, ctx) {
  if (request.method !== 'POST') return errorResponse('method_not_allowed');

  let raw;
  try {
    const text = await request.text();
    if (text.length > 16 * 1024) return errorResponse('payload_too_large');
    raw = JSON.parse(text);
  } catch {
    return errorResponse('invalid_request');
  }

  const parsed = validateEnquiry(raw);
  if (!parsed.ok) {
    return fail('invalid_request', 400, 'Please check the highlighted fields.', parsed.fields);
  }

  if (!(await allow(request, env.ENQUIRY_LIMIT, env.RL_SALT))) {
    return errorResponse('rate_limited');
  }

  const id = await persist(parsed.data, env);
  const sent = await notify(parsed.data, env);
  const stored = id !== null;

  if (stored && sent.ok) ctx.waitUntil(markNotified(id, env));

  log({
    route: 'enquiries',
    status: stored || sent.ok ? 200 : 502,
    source: parsed.data.source,
    stored,
    notified: sent.ok,
    notify_reason: sent.ok ? undefined : sent.reason,
  });

  // Neither path worked — this is the only case the visitor must know about.
  if (!stored && !sent.ok) return errorResponse('delivery_failed');

  return json({ ok: true });
}
