/**
 * Sends ONE sample enquiry through the real notification transport.
 *
 *   npm run notify:test -- https://hooks.slack.com/services/...
 *   npm run notify:test -- https://your.endpoint --token <bearer>
 *
 * Point it at the URL you are about to store as NOTIFY_WEBHOOK_URL and check
 * that the message actually arrives. This imports worker/lib/notify.js itself,
 * so what your endpoint receives here is byte-for-byte what it will receive in
 * production — a webhook that works here cannot fail for payload reasons later.
 *
 * Nothing is written to the site and no secret is read: the URL is passed on
 * the command line, so this never touches your configured secrets.
 */
import { notify } from '../worker/lib/notify.js';

const args = process.argv.slice(2);
const url = args.find((a) => a.startsWith('http'));
const tokenIndex = args.indexOf('--token');
const token = tokenIndex > -1 ? args[tokenIndex + 1] : undefined;

if (!url) {
  console.error('\nUsage: npm run notify:test -- <webhook-url> [--token <bearer>]\n');
  process.exit(2);
}

const sample = {
  name: 'Sample Enquiry (test)',
  email: 'test@example.com',
  message: 'This is a test enquiry sent by scripts/notify-test.mjs. If you can read this, '
    + 'the Vedanjay assistant can deliver leads to this endpoint.',
  source: 'notify-test',
};

console.log(`\nPosting a sample enquiry to ${new URL(url).origin}…\n`);
const result = await notify(sample, { NOTIFY_WEBHOOK_URL: url, NOTIFY_TOKEN: token });

if (result.ok) {
  console.log('✓ Delivered. Check the destination, then store it:\n');
  console.log('    wrangler secret put NOTIFY_WEBHOOK_URL');
  if (token) console.log('    wrangler secret put NOTIFY_TOKEN');
  console.log('');
} else {
  console.error(`✗ NOT delivered — ${result.reason}\n`);
  console.error('  http_401/http_403  the endpoint wants auth; pass --token <bearer>');
  console.error('  http_404           wrong URL, or a Slack webhook that has been revoked');
  console.error('  TimeoutError       the endpoint did not respond within 10s');
  console.error('');
  process.exit(1);
}
