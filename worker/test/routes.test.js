import { describe, it, expect, vi } from 'vitest';
import worker from '../index.js';

/** Minimal fake env. Bindings are objects, mirroring what the platform injects. */
function makeEnv(over = {}) {
  return {
    RL_SALT: 'salt',
    ENQUIRY_LIMIT: { limit: vi.fn(async () => ({ success: true })) },
    ASSETS: { fetch: vi.fn(async () => new Response('asset')) },
    ...over,
  };
}
const ctx = { waitUntil: (p) => p?.catch?.(() => {}) };

const get = (path) => new Request(`https://x${path}`);
const post = (path, body, headers = {}) => new Request(`https://x${path}`, {
  method: 'POST',
  headers: { 'content-type': 'application/json', ...headers },
  body: JSON.stringify(body),
});

describe('POST /api/enquiries', () => {
  const valid = { name: 'A. Sharma', email: 'a@example.com', message: 'We have a 40 MW solar plant.', source: 'chat' };

  it('accepts a valid enquiry and notifies', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('', { status: 200 }));
    const res = await worker.fetch(post('/api/enquiries', valid),
      makeEnv({ NOTIFY_WEBHOOK_URL: 'https://hook.example/x' }), ctx);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(fetchSpy).toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it('returns field errors on invalid input', async () => {
    const res = await worker.fetch(post('/api/enquiries', { ...valid, email: 'bad' }), makeEnv(), ctx);
    expect(res.status).toBe(400);
    expect((await res.json()).fields).toHaveProperty('email');
  });

  // --- lead-loss prevention ---

  it('SUCCEEDS when notification fails but the lead was persisted', async () => {
    const db = { prepare: () => ({ bind: () => ({ run: async () => ({}) }) }) };
    const res = await worker.fetch(post('/api/enquiries', valid), makeEnv({ DB: db }), ctx);
    expect(res.status).toBe(200); // the lead is safe in D1; do not alarm the visitor
  });

  it('FAILS only when both persistence and notification fail', async () => {
    const res = await worker.fetch(post('/api/enquiries', valid), makeEnv(), ctx);
    expect(res.status).toBe(502);
    expect((await res.json()).message).toContain('projects@vedanjay-power.com');
  });

  it('rate limits enquiries separately', async () => {
    const env = makeEnv({ ENQUIRY_LIMIT: { limit: vi.fn(async () => ({ success: false })) } });
    const res = await worker.fetch(post('/api/enquiries', valid), env, ctx);
    expect(res.status).toBe(429);
  });
});

describe('routing & origin', () => {
  it('GET /api/health is static and healthy', async () => {
    const res = await worker.fetch(get('/api/health'), makeEnv(), ctx);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({ ok: true });
    /* The kill switch went with the server-side assistant. If a `chat` flag
       ever reappears here, something has been added back that should not be. */
    expect(body).not.toHaveProperty('chat');
  });

  it('serves non-API paths straight from the asset store', async () => {
    const res = await worker.fetch(get('/'), makeEnv(), ctx);
    expect(await res.text()).toBe('asset');
  });

  it('404s an unknown /api path', async () => {
    const res = await worker.fetch(get('/api/nope'), makeEnv(), ctx);
    expect(res.status).toBe(404);
  });

  it('404s the retired /api/chat route', async () => {
    const res = await worker.fetch(post('/api/chat', { message: 'hi' }), makeEnv(), ctx);
    expect(res.status).toBe(404);
  });

  it('rejects a cross-site caller', async () => {
    const res = await worker.fetch(
      post('/api/enquiries', {}, { 'Sec-Fetch-Site': 'cross-site' }), makeEnv(), ctx);
    expect(res.status).toBe(404);
  });

  it('emits no CORS header — absence of the header is the control', async () => {
    const res = await worker.fetch(post('/api/enquiries', {}), makeEnv(), ctx);
    expect(res.headers.get('access-control-allow-origin')).toBeNull();
  });
});
