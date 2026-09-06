import { topics, topicById, fallback } from '../data/assistant.js';

/**
 * Intent matching for the website assistant. No model, no network.
 *
 * HOW IT SCORES
 * A query is normalised, then every topic is scored on the terms it declares.
 * A multi-word term ("open access", "get in touch") is worth more than a single
 * word because it is far less likely to appear by accident, and a term that
 * matches a WHOLE WORD scores above one that merely appears inside another —
 * without that, "operate" matches "opera" and a stray substring decides the
 * answer. A topic must clear a floor to win at all; below it the assistant says
 * what it does cover rather than guessing.
 *
 * FOLLOW-UPS ARE THE CONTEXT.
 * "What about Pune?" or "and the team?" carry almost no matchable text. Rather
 * than pretend to resolve pronouns, the previous answer's follow-up ids get a
 * bonus, so a short reply lands on something the visitor was just offered. It
 * is a small, honest amount of memory, and it covers the follow-ups a scripted
 * assistant actually meets.
 */

const STOP = new Set(['the', 'a', 'an', 'is', 'are', 'do', 'does', 'you', 'your', 'we',
  'i', 'me', 'my', 'to', 'of', 'for', 'in', 'on', 'at', 'and', 'or', 'what', 'whats',
  'how', 'can', 'could', 'would', 'please', 'tell', 'show', 'give', 'about', 'with',
  'have', 'has', 'any', 'some', 'it', 'this', 'that', 'there', 'be', 'am']);

/** Lowercase, strip punctuation, collapse space. */
export const normalise = (q) => String(q)
  .toLowerCase()
  .replace(/['’]/g, '')
  .replace(/[^a-z0-9\s]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const words = (text) => text.split(' ').filter((w) => w && !STOP.has(w));

/** Whole-word test that still tolerates a trailing plural. */
const hasWord = (qWords, term) => qWords.some(
  (w) => w === term || w === `${term}s` || `${w}s` === term,
);

export function score(query, topic) {
  const text = normalise(query);
  if (!text) return 0;
  const qWords = words(text);
  let total = 0;

  for (const raw of topic.match) {
    const term = normalise(raw);
    if (!term) continue;
    if (term.includes(' ')) {
      /* A phrase is strong evidence — it is why "open access" and "get in
         touch" resolve instead of dissolving into stopwords.

         MATCHED ON WORD BOUNDARIES, not as a raw substring. As a substring the
         phrase "who are you" fires inside "who are your partners", which sent
         a partners question to the about topic. */
      if (new RegExp(`(^|\\s)${term}(\\s|$)`).test(text)) total += 6;
      continue;
    }
    if (hasWord(qWords, term)) total += 3;
    else if (term.length > 4 && text.includes(term)) total += 1;
  }
  return total;
}

/** Below this, nothing is confident enough to answer. */
const FLOOR = 3;
/** What a follow-up the visitor was just offered is worth. */
const CONTEXT_BONUS = 2;

/**
 * @param {string} query
 * @param {string[]} [offered] follow-up ids shown with the previous answer
 */
export function answer(query, offered = []) {
  const ranked = topics
    .map((t) => ({ t, s: score(query, t) + (offered.includes(t.id) ? CONTEXT_BONUS : 0) }))
    .sort((a, b) => b.s - a.s);

  const best = ranked[0];
  if (!best || best.s < FLOOR) {
    return { topic: null, text: fallback(), next: ['services', 'projects', 'contact'] };
  }
  return { topic: best.t, text: best.t.answer(), next: best.t.next };
}

/** Resolve follow-up ids to topics, dropping anything unknown. */
export const resolve = (ids) => ids.map((id) => topicById.get(id)).filter(Boolean);
