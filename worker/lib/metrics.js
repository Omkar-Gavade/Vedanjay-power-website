/**
 * Aggregate, non-PII telemetry.
 *
 * Message content, responses, emails, names and raw IPs are NEVER logged. Only
 * a classification label and counts (§07.5).
 */

/**
 * Consume the metrics branch of a teed stream, classify the outcome, discard
 * the text. Runs in ctx.waitUntil AFTER the response is sent, so it adds no
 * latency to the visitor's stream.
 *
 * @param {ReadableStream<Uint8Array>} stream
 * @param {(o: {outcome: string, chars: number}) => void} report
 */
export async function classify(stream, report) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let text = '';
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      text += decoder.decode(value, { stream: true });
    }
  } catch {
    // A broken metrics branch must never surface to the visitor.
  } finally {
    reader.releaseLock();
  }

  const lower = text.toLowerCase();
  const refused = lower.includes("don't have verified") || lower.includes('do not have verified');
  const escalated = lower.includes('@vedanjay-power.com') || lower.includes('7666901814');

  report({
    outcome: refused ? 'refused' : escalated ? 'escalated' : 'answered',
    chars: text.length,
  });
}

/** Structured log line. Deliberately low cardinality. */
export function log(fields) {
  console.log(JSON.stringify({ ts: Date.now(), ...fields }));
}
