/**
 * Vedanjay Power — Cloudflare Worker.
 *
 * Serves the website's API. Static assets are served directly by the platform
 * and never reach this code: `run_worker_first = ["/api/*"]` in wrangler.toml
 * means the Worker is only woken for API paths, so the 99% of traffic that is
 * static costs no invocation and gains no latency.
 *
 * Two routes, so a `switch` is clearer than a router dependency.
 *
 * The assistant used to live here as /api/chat, backed by Workers AI with a
 * Groq fallback, a generated knowledge pack, an output guard and a rate limit.
 * It is now entirely client-side — see frontend/src/data/assistant.js — so all
 * of that is gone along with its key, its quota and its failure modes.
 */
import { enquiries } from './routes/enquiries.js';
import { health } from './routes/health.js';
import { errorResponse } from './lib/respond.js';

export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);

    if (pathname.startsWith('/api/')) {
      // Same-origin only. No CORS headers are emitted anywhere: the absence of
      // the header IS the control.
      // Checked where present; non-browser clients omit it, and the rate limit
      // is what actually bounds a scripted caller (§08.8).
      const site = request.headers.get('Sec-Fetch-Site');
      if (site && site !== 'same-origin' && site !== 'none') {
        return errorResponse('not_found');
      }

      switch (pathname) {
        case '/api/enquiries': return enquiries(request, env, ctx);
        case '/api/health': return health();
        default: return errorResponse('not_found');
      }
    }

    // Defensive: with run_worker_first scoped to /api/*, this is not normally
    // reached, but it keeps the Worker correct if that config is ever widened.
    return env.ASSETS.fetch(request);
  },
};
