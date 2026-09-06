import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import worker from '../index.js';
import { notify } from '../lib/notify.js';

/**
 * The full enquiry failure matrix.
 *
 * The governing rule: a lead the visitor successfully submitted must never
 * silently disappear. D1 persistence happens BEFORE notification, so a failing
 * transport cannot lose it.
 */
const VALID = {
  name: 'A. Sharma',
  email: 'a.sharma@example.com',
  message: 'We have a 40 MW solar plant in MP and need a QCA.',
  source: 'chat',
};

const ctx = { waitUntil: (p) => p?.catch?.(() => {}) };

function makeDb({ insertFails = false } = {}) {
  const calls = [];
  return {
    calls,
    prepare: (sql) => ({
      bind: (...args) => ({
        run: async () => {
          calls.push({ sql: sql.replace(/\s+/g, ' ').trim(), args });
          if (insertFails && /INSERT/i.test(sql)) throw new Error('D1 unavailable');
          return { success: true };
        },
      }),
    }),
  };
}

const req = (body) => new Request('https://vedanjay-power.com/api/enquiries', {
  method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body),
});

const baseEnv = (over) => ({ RL_SALT: 's', ASSETS: { fetch: async () => new Response('') }, ...over });

afterEach(() => vi.restoreAllMocks());

const mockNotify = (ok) =>
  vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('', { status: ok ? 200 : 500 }));

describe('enquiry failure matrix', () => {
  it('DB works + notification works → 200, row marked notified', async () => {
    mockNotify(true);
    const db = makeDb();
    const res = await worker.fetch(req(VALID), baseEnv({ DB: db, NOTIFY_WEBHOOK_URL: 'https://h' }), ctx);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(db.calls.some((c) => /INSERT/i.test(c.sql))).toBe(true);
    // Regression: `notified` used to stay 0 forever, making the recovery index useless.
    expect(db.calls.some((c) => /UPDATE enquiry SET notified = 1/i.test(c.sql))).toBe(true);
  });

  it('DB works + notification FAILS → 200 (lead is safe), row left unnotified', async () => {
    mockNotify(false);
    const db = makeDb();
    const res = await worker.fetch(req(VALID), baseEnv({ DB: db, NOTIFY_WEBHOOK_URL: 'https://h' }), ctx);
    expect(res.status).toBe(200); // do not alarm the visitor — the lead is recoverable
    expect(db.calls.some((c) => /INSERT/i.test(c.sql))).toBe(true);
    expect(db.calls.some((c) => /UPDATE/i.test(c.sql))).toBe(false);
  });

  it('DB unavailable + notification works → 200', async () => {
    mockNotify(true);
    const res = await worker.fetch(req(VALID), baseEnv({ NOTIFY_WEBHOOK_URL: 'https://h' }), ctx);
    expect(res.status).toBe(200);
  });

  it('DB INSERT throws + notification works → 200, still not lost', async () => {
    mockNotify(true);
    const db = makeDb({ insertFails: true });
    const res = await worker.fetch(req(VALID), baseEnv({ DB: db, NOTIFY_WEBHOOK_URL: 'https://h' }), ctx);
    expect(res.status).toBe(200);
  });

  it('BOTH fail → 502 telling the visitor to email directly', async () => {
    mockNotify(false);
    const db = makeDb({ insertFails: true });
    const res = await worker.fetch(req(VALID), baseEnv({ DB: db, NOTIFY_WEBHOOK_URL: 'https://h' }), ctx);
    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body.message).toContain('projects@vedanjay-power.com');
    expect(JSON.stringify(body)).not.toMatch(/stack|D1 unavailable|https:\/\/h/);
  });

  it('persistence happens BEFORE notification', async () => {
    const order = [];
    vi.spyOn(globalThis, 'fetch').mockImplementation(async () => {
      order.push('notify');
      return new Response('', { status: 200 });
    });
    const db = {
      prepare: () => ({ bind: () => ({ run: async () => { order.push('persist'); return {}; } }) }),
    };
    await worker.fetch(req(VALID), baseEnv({ DB: db, NOTIFY_WEBHOOK_URL: 'https://h' }), ctx);
    expect(order[0]).toBe('persist');
    expect(order).toContain('notify');
  });

  it('never logs the enquiry content', async () => {
    mockNotify(true);
    const logged = [];
    const spy = vi.spyOn(console, 'log').mockImplementation((l) => logged.push(l));
    await worker.fetch(req(VALID), baseEnv({ DB: makeDb(), NOTIFY_WEBHOOK_URL: 'https://h' }), ctx);
    spy.mockRestore();
    const all = logged.join('\n');
    expect(all).not.toContain(VALID.email);
    expect(all).not.toContain(VALID.name);
    expect(all).not.toContain('40 MW');
  });
});

describe('notification payload', () => {
  const sent = [];
  const env = {
    NOTIFY_WEBHOOK_URL: 'https://hook.example/x',
  };

  beforeEach(() => {
    sent.length = 0;
    vi.stubGlobal('fetch', async (_url, init) => {
      sent.push(JSON.parse(init.body));
      return new Response('ok', { status: 200 });
    });
  });
  afterEach(() => vi.unstubAllGlobals());

  it('separates the header block from the message with a blank line', async () => {
    await notify({ name: 'A', email: 'a@b.co', message: 'Body text.', source: 'chat' }, env);
    expect(sent[0].text).toBe('Name:    A\nEmail:   a@b.co\nSource:  chat\n\nBody text.');
  });

  it('omits the phone line entirely when there is no phone', async () => {
    await notify({ name: 'A', email: 'a@b.co', message: 'Body.', source: 'chat' }, env);
    expect(sent[0].text).not.toContain('Phone:');
  });

  it('includes the phone line when there is one', async () => {
    await notify({ name: 'A', email: 'a@b.co', phone: '+91 1', message: 'Body.', source: 'chat' }, env);
    expect(sent[0].text).toContain('Phone:   +91 1');
    expect(sent[0].text.endsWith('\n\nBody.')).toBe(true);
  });

  /* Slack incoming webhooks render the top-level `text` and ignore the rest,
     so the chosen transport works with Slack without a code change. */
  it('carries a top-level text field, so a Slack webhook works unchanged', async () => {
    await notify({ name: 'A', email: 'a@b.co', message: 'Body.', source: 'chat' }, env);
    expect(typeof sent[0].text).toBe('string');
    expect(sent[0].text.length).toBeGreaterThan(0);
  });
});
