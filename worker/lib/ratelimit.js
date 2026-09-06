/**
 * Rate limiting.
 *
 * Keyed on a SALTED HASH of the caller IP, never the raw address — the hash is
 * computed per request and never stored (§07.6). A client-supplied session id
 * would be trivially bypassable by regenerating it.
 *
 * Known limitation, stated honestly: the binding is per-Cloudflare-location and
 * eventually consistent. It is a spend guard against casual abuse, not a strict
 * quota. Distributed abuse needs Turnstile (§08.4).
 */

/** @param {string} value */
async function sha256(value) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * @param {Request} request
 * @param {any} limiter binding, may be undefined in local dev
 * @param {string} salt
 * @returns {Promise<boolean>} true when the request is allowed
 */
export async function allow(request, limiter, salt) {
  if (!limiter) return true; // binding absent (e.g. `vite` dev) — fail open, never break the site
  const ip = request.headers.get('CF-Connecting-IP') ?? '';
  const key = await sha256(`${salt ?? 'vp'}:${ip}`);
  try {
    const { success } = await limiter.limit({ key });
    return success;
  } catch {
    return true; // a limiter outage must not take the assistant down
  }
}
