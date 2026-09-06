/**
 * Enquiry notification transport.
 *
 * The destination inbox and provider are an OPEN QUESTION (docs/chatbot README,
 * Q2), so this is a one-function seam rather than a hardcoded integration.
 * It posts a JSON payload to NOTIFY_WEBHOOK_URL, which works with whatever the
 * company chooses — Resend, SendGrid, a Zapier/Make hook, or a Slack webhook —
 * without another code change.
 *
 * Configure:  wrangler secret put NOTIFY_WEBHOOK_URL
 *             wrangler secret put NOTIFY_TOKEN        (optional bearer)
 */

const TIMEOUT_MS = 10_000;

/**
 * @returns {Promise<{ok: boolean, reason?: string}>} never throws
 */
export async function notify(enquiry, env) {
  if (!env.NOTIFY_WEBHOOK_URL) return { ok: false, reason: 'not_configured' };

  const body = {
    subject: `Website enquiry (${enquiry.source}) — ${enquiry.name}`,
    replyTo: enquiry.email,
    /* `filter(Boolean)` here also dropped the '' separator, so the enquiry text
       ran straight on from "Source:" with no blank line — the whole point of
       that entry. Only the absent phone line should be removed. */
    text: [
      `Name:    ${enquiry.name}`,
      `Email:   ${enquiry.email}`,
      enquiry.phone ? `Phone:   ${enquiry.phone}` : null,
      `Source:  ${enquiry.source}`,
      '',
      enquiry.message,
    ].filter((line) => line !== null).join('\n'),
    enquiry,
  };

  try {
    const res = await fetch(env.NOTIFY_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(env.NOTIFY_TOKEN ? { authorization: `Bearer ${env.NOTIFY_TOKEN}` } : {}),
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    return res.ok ? { ok: true } : { ok: false, reason: `http_${res.status}` };
  } catch (err) {
    return { ok: false, reason: err?.name ?? 'fetch_failed' };
  }
}
