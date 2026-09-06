import {
  topics, topicById, fallback, FALLBACK_NEXT,
} from '../data/assistant.js';

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
 * the information is not published rather than guessing.
 *
 * SPECIFICITY BREAKS TIES.
 * With ~38 topics, terms are inevitably shared: "profile" could be the company
 * or a social account, "capacity" the portfolio or a plant. Each term carries a
 * small bonus of 1/(topics declaring it), so a term unique to one topic edges
 * out the same term shared by three. It is deliberately a tie-breaker and not a
 * divisor: scores stay predictable, and a shared term still clears the floor on
 * its own.
 *
 * TYPOS. "serivces", "maharastra", "forcasting" are what people actually type.
 * A word of five characters or more that is one edit away from a declared term
 * scores just below an exact match. Short words are excluded because at three
 * or four characters a single edit is a different word, not a typo.
 *
 * CONVERSATIONAL TOPICS ARE SOLO.
 * "Hi" should be met with a hello; "hi, what services do you offer" is a
 * services question with a hello on the front. So greetings, thanks and the
 * like win only when nothing substantive matched — not by out-scoring the
 * content topics, but by being considered only after them.
 *
 * FOLLOW-UPS ARE THE CONTEXT.
 * "What about Pune?" or "and the team?" carry almost no matchable text. Rather
 * than pretend to resolve pronouns, the previous answer's follow-up ids get a
 * bonus, and "tell me more" reopens the last topic at its second level. It is a
 * small, honest amount of memory, and it covers the follow-ups a scripted
 * assistant actually meets.
 */

const STOP = new Set(['the', 'a', 'an', 'is', 'are', 'do', 'does', 'did', 'you', 'your',
  'we', 'us', 'our', 'i', 'me', 'my', 'to', 'of', 'for', 'in', 'on', 'at', 'and', 'or',
  'what', 'whats', 'how', 'can', 'could', 'would', 'will', 'please', 'tell', 'show',
  'give', 'about', 'with', 'have', 'has', 'had', 'any', 'some', 'it', 'this', 'that',
  'there', 'be', 'am', 'was', 'were', 'been', 'if', 'from', 'by', 'as', 'so']);

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

/**
 * One edit apart — insertion, deletion, substitution or a transposition of two
 * adjacent characters, which is the single most common typing slip. Bails as
 * soon as a second difference appears, so it never walks the whole string.
 */
function withinOneEdit(a, b) {
  if (a === b) return true;
  const [s, l] = a.length <= b.length ? [a, b] : [b, a];
  if (l.length - s.length > 1) return false;

  let i = 0;
  let j = 0;
  let slips = 0;
  while (i < s.length && j < l.length) {
    if (s[i] === l[j]) { i += 1; j += 1; continue; }
    slips += 1;
    if (slips > 1) return false;
    if (s.length === l.length) {
      /* transposition: "maharastra" vs "maharashtra" style swaps */
      if (s[i + 1] === l[j] && s[i] === l[j + 1]) { i += 2; j += 2; continue; }
      i += 1; j += 1;
    } else {
      j += 1;                       // consume the extra character in the longer word
    }
  }
  return slips + (l.length - j) + (s.length - i) <= 1;
}

/* Six, not five. At five characters one edit is usually a DIFFERENT WORD rather
   than a typo: "prime" is one substitution from "prize", which sent "who is the
   prime minister" to the awards topic. Every real typo worth catching
   ("serivces", "maharastra", "forcasting", "contct", "portfolo") is longer. */
const MIN_FUZZY = 6;

/**
 * Crude stem, used ONLY as an identity key — never for matching, which is
 * hasWord's job and already tolerates a plural.
 *
 * It exists because a topic that declares both "project" and "projects" was
 * scoring BOTH against the single word "project", quietly earning double credit
 * for one match. That is how "Project support" resolved to the projects
 * register: the broad topic's duplicate pair out-scored the specific topic's
 * exact phrase. Collapsing the pair to one term fixes it everywhere at once —
 * "photo"/"photos", "award"/"awards", "document"/"documents" and the rest.
 */
const stem = (w) => (w.length > 3 && w.endsWith('s') ? w.slice(0, -1) : w);
const key = (term) => term.split(' ').map(stem).join(' ');

/**
 * How many topics declare each term. Computed once, at module load, from the
 * topics themselves — so adding a topic re-weights the terms automatically and
 * nothing has to be hand-tuned.
 */
const df = (() => {
  const counts = new Map();
  for (const t of topics) {
    for (const k of new Set(t.match.map((m) => key(normalise(m))))) {
      if (k) counts.set(k, (counts.get(k) ?? 0) + 1);
    }
  }
  return counts;
})();

const PHRASE = 6;
const WORD = 3;
/* Equal to an exact word but WITHOUT the specificity bonus, so an exact match
   always outranks a near one. It has to reach the floor: at 2 no typo could
   ever resolve on its own, which made the whole fuzzy path dead code. */
const FUZZY = 3;
const SUBSTRING = 1;

/** Small bonus that favours a term unique to one topic over a shared one. */
const specificity = (term) => 1 / (df.get(key(term)) ?? 1);

export function score(query, topic) {
  const text = normalise(query);
  if (!text) return 0;
  const qWords = words(text);
  let total = 0;
  /* One credit per distinct term, so a declared singular and its plural cannot
     both score against the same query word. */
  const credited = new Set();

  for (const raw of topic.match) {
    const term = normalise(raw);
    if (!term || credited.has(key(term))) continue;

    if (term.includes(' ')) {
      /* A phrase is strong evidence — it is why "open access" and "get in
         touch" resolve instead of dissolving into stopwords.

         MATCHED ON WORD BOUNDARIES, not as a raw substring. As a substring the
         phrase "who are you" fires inside "who are your partners", which sent
         a partners question to the about topic. */
      if (new RegExp(`(^|\\s)${term}(\\s|$)`).test(text)) {
        total += PHRASE + specificity(term);
        credited.add(key(term));
      }
      continue;
    }

    if (hasWord(qWords, term)) {
      total += WORD + specificity(term);
      credited.add(key(term));
    } else if (term.length >= MIN_FUZZY
      && qWords.some((w) => w.length >= MIN_FUZZY && withinOneEdit(w, term))) {
      total += FUZZY;
      credited.add(key(term));
    } else if (term.length > 4 && text.includes(term)) {
      total += SUBSTRING;
    }
  }
  return total;
}

/** Below this, nothing is confident enough to answer. */
const FLOOR = 3;
/** What a follow-up the visitor was just offered is worth. */
const CONTEXT_BONUS = 2;

/** "Tell me more" and its cousins — only consulted when nothing else matched. */
const MORE = /^(tell me more|more|more details|more detail|details|detail|explain|expand|elaborate|go on|continue|and|what else|anything else|go deeper|deeper)$/;

const ctxFor = (query) => {
  const text = normalise(query);
  return { text, words: words(text), raw: String(query) };
};

const reply = (topic, ctx, text) => ({
  topic,
  text: text ?? topic.answer(ctx),
  link: topic.link ?? null,
  next: topic.next,
});

/**
 * @param {string} query
 * @param {{offered?:string[], last?:string|null}|string[]} [context]
 *        `offered` — follow-up ids shown with the previous answer.
 *        `last`    — id of the topic last answered, for "tell me more".
 *        An array is accepted as shorthand for `offered`.
 */
export function answer(query, context = {}) {
  const { offered = [], last = null } = Array.isArray(context) ? { offered: context } : context;
  const ctx = ctxFor(query);

  const ranked = topics
    .map((t) => ({ t, s: score(query, t) + (offered.includes(t.id) ? CONTEXT_BONUS : 0) }))
    .sort((a, b) => b.s - a.s);

  /* Content first. A conversational topic never competes with a real question —
     it is only reached when no content topic cleared the floor. */
  const best = ranked.find((r) => !r.t.solo && r.s >= FLOOR);
  if (best) return reply(best.t, ctx);

  /* "Tell me more" reopens the last topic at its second level. */
  if (MORE.test(ctx.text) && last) {
    const t = topicById.get(last);
    if (t?.more) return reply(t, ctx, t.more(ctx));
    if (t) {
      return reply(t, ctx, `That's what's published on ${t.label.toLowerCase()}. `
        + `The page has the detail behind it.`);
    }
  }

  const chat = ranked.find((r) => r.t.solo && r.s >= FLOOR);
  if (chat) return reply(chat.t, ctx);

  return { topic: null, text: fallback(), link: null, next: FALLBACK_NEXT };
}

/** Resolve follow-up ids to topics, dropping anything unknown. */
export const resolve = (ids) => ids.map((id) => topicById.get(id)).filter(Boolean);
