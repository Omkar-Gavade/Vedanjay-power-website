/**
 * DEV-ONLY Vite middleware — never bundled, never deployed.
 *
 * Runs the REAL worker/index.js against the dev server so the UI is verified
 * against actual validation, real server-side prompt assembly and real SSE
 * framing. Only the model call is stubbed: Workers AI has no local runtime, and
 * `wrangler dev --remote` needs Cloudflare credentials.
 *
 * The canned replies below are written to exercise the behaviours that matter:
 * a grounded answer, a refusal, and a partial answer.
 */
const CANNED = [
  [/qca|forecast|schedul/i,
    'A QCA — Qualified Coordinating Agency — is the entity registered with the State Load Despatch Centre that aggregates renewable generators, submits their generation schedules and manages the resulting deviation settlement. Vedanjay Power operates as a registered QCA with a portfolio of over 5,000 MW.'],
  [/state|coverage|where|madhya|maharashtra|telangana/i,
    'Vedanjay Power is registered for SLDC operations in Maharashtra, Madhya Pradesh and Telangana, and is registered with WRLDC for the Western Region.'],
  [/how many client|client count|clients do you/i,
    "I don't have verified information on that. The Vedanjay team can confirm it — you can reach them at projects@vedanjay-power.com or +91 7666901814."],
  [/price|pricing|cost|charge|fee/i,
    "Pricing depends on portfolio size, states and scope, so it isn't published. The team will scope it with you — projects@vedanjay-power.com or +91 7666901814."],
  [/industr|sector|wind developer|solar epc|who do you work with/i,
    'Across the 52-work project register: 16 works for wind OEMs and developers, 14 for solar EPCs and developers, 7 for transmission utilities and DISCOMs, 6 for independent power producers, 5 industrial and 4 infrastructure. The full register is on /projects/.'],
  [/how many project|project record|works executed/i,
    'The register records 52 works executed — 17 electrical infrastructure, 15 liaisoning and regulatory, 8 operation and maintenance, 7 combined electrical and liaisoning, and 5 civil. You can filter them all on /projects/.'],
  [/capabilit|service|what do you do/i,
    'Vedanjay Power works across six areas:\n- Forecasting & Scheduling / QCA\n- Open-Access Power Sale & Purchase\n- ABT Metering & Telemetry\n- Electrical Infrastructure & Transmission\n- Grid Studies & Electrical Consultancy\n- Renewable Energy Project Support\n\nWhich of these is closest to what you need?'],
];

const reply = (text) => {
  for (const [re, answer] of CANNED) if (re.test(text)) return answer;
  return "I don't have verified information on that. The Vedanjay team can help — projects@vedanjay-power.com or +91 7666901814.";
};

/*
 * The failure the production worker actually hits. Workers AI's free tier is
 * 10,000 neurons per day; past that every call returns this, and the assistant
 * can answer nothing until UTC midnight. It reaches the visitor as a 503 with
 * no "try again" — so the path has to be exercisable locally, or the only way
 * to see it is to burn a real account's quota.
 *
 * Type /quota, /timeout or /boom into the assistant in dev to trigger each.
 */
const DEV_FAULTS = [
  [/^\/quota\b/i, () => { throw new Error("4006: you have used up your daily free allocation of 10,000 neurons, please upgrade to Cloudflare's Workers Paid plan if you would like to continue usage."); }],
  [/^\/timeout\b/i, () => { throw Object.assign(new Error('aborted'), { name: 'TimeoutError' }); }],
  [/^\/boom\b/i, () => { throw new Error('upstream exploded'); }],
];

function stubAi() {
  return {
    async run(_model, opts) {
      const last = opts.messages.at(-1)?.content ?? '';
      for (const [re, fault] of DEV_FAULTS) if (re.test(last.trim())) fault();
      const text = reply(last);
      const enc = new TextEncoder();
      return new ReadableStream({
        async start(c) {
          for (const word of text.split(/(\s+)/)) {
            c.enqueue(enc.encode(`data: ${JSON.stringify({ response: word })}\n\n`));
            await new Promise((r) => setTimeout(r, 18)); // visible streaming
          }
          c.enqueue(enc.encode('data: [DONE]\n\n'));
          c.close();
        },
      });
    },
  };
}

/** In-memory stand-in for the D1 binding so the enquiry success path — and the
 *  lead-loss-prevention ordering — can be exercised locally. */
function stubDb(store) {
  return {
    prepare: (sql) => ({
      bind: (...args) => ({
        run: async () => {
          store.push({ sql: sql.trim().split('\n')[0], args });
          console.log(`[dev] enquiry persisted (${store.length} total)`);
          return { success: true };
        },
      }),
    }),
  };
}

export function devApi() {
  return {
    name: 'vedanjay-dev-api',
    apply: 'serve',
    configureServer(server) {
      const enquiries = [];
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) return next();

        // A client that disconnects mid-SSE (curl | head, a closed tab) emits
        // ECONNRESET on the request socket. Unhandled, that becomes an uncaught
        // rejection and kills the dev server.
        req.on('error', () => {});
        res.on('error', () => {});

        const { default: worker } = await server.ssrLoadModule('/../worker/index.js');

        // Reading the request body rejects with ECONNRESET if the client
        // aborts. Unhandled, node turns that into an uncaught exception.
        let body;
        try {
          const chunks = [];
          for await (const c of req) chunks.push(c);
          body = chunks.length ? Buffer.concat(chunks) : undefined;
        } catch {
          return; // client gone; nothing to respond to
        }

        const request = new Request(`http://localhost${req.url}`, {
          method: req.method,
          headers: req.headers,
          body,
        });

        const env = {
          CHAT_ENABLED: 'true',
          CHAT_MODEL: '@cf/dev-stub',
          RL_SALT: 'dev',
          AI: stubAi(),
          DB: stubDb(enquiries),
          ASSETS: { fetch: () => new Response('', { status: 404 }) },
        };

        let response;
        try {
          response = await worker.fetch(request, env, { waitUntil: (p) => p?.catch?.(() => {}) });
        } catch (err) {
          res.statusCode = 500;
          res.setHeader('content-type', 'application/json');
          return res.end(JSON.stringify({ error: 'dev_bridge_error', message: String(err?.message ?? err) }));
        }

        res.statusCode = response.status;
        response.headers.forEach((v, k) => res.setHeader(k, v));
        if (!response.body) return res.end();

        const reader = response.body.getReader();
        try {
          for (;;) {
            const { done, value } = await reader.read();
            if (done || res.writableEnded || res.destroyed) break;
            res.write(Buffer.from(value));
          }
        } catch {
          // Client went away mid-stream — expected, not an error.
        } finally {
          reader.cancel().catch(() => {});
          if (!res.writableEnded) res.end();
        }
      });
    },
  };
}
