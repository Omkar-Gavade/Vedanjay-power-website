/**
 * GET /api/health
 *
 * Static. Touches no bindings and makes no outbound call, so an uptime poll
 * costs nothing.
 *
 * It used to carry a `chat` flag mirroring CHAT_ENABLED, which the client read
 * to decide whether to render the assistant launcher. The assistant is now
 * entirely client-side, so there is no server state to report and no kill
 * switch to honour.
 */
import { json } from '../lib/respond.js';

export function health() {
  return json({ ok: true, ts: Date.now() });
}
