import { describe, it, expect } from 'vitest';
import { topics, topicById, OPENERS, fallback } from '../src/data/assistant.js';
import { answer, score, normalise } from '../src/utils/assistant.js';
import { BUILT_ROUTES } from '../src/constants/routes.js';
import { company } from '../src/data/company.js';
import { capabilities } from '../src/data/capabilities.js';
import { PORTFOLIO_TOTAL_MW } from '../src/data/portfolio.js';

/**
 * The assistant answers from these topics and nothing else, so the topics are
 * where it can go wrong: a link to a page that does not exist, a fact typed in
 * by hand that later drifts from the page it came from, or a question that
 * silently falls through to the fallback.
 */

describe('assistant knowledge', () => {
  it('every link points at a route that is actually built', () => {
    const bad = topics
      .filter((t) => t.link && !BUILT_ROUTES.includes(t.link.to))
      .map((t) => `${t.id} → ${t.link.to}`);
    expect(bad, 'the assistant must never offer a page that does not exist').toEqual([]);
  });

  it('every follow-up names a real topic', () => {
    const bad = topics.flatMap((t) => t.next.filter((id) => !topicById.has(id)).map((id) => `${t.id} → ${id}`));
    expect(bad).toEqual([]);
  });

  it('every opening quick action resolves', () => {
    expect(OPENERS.every((id) => topicById.has(id))).toBe(true);
    expect(OPENERS.length).toBeGreaterThanOrEqual(6);
  });

  it('every topic produces a non-trivial answer', () => {
    const thin = topics.filter((t) => t.answer().trim().length < 40).map((t) => t.id);
    expect(thin).toEqual([]);
  });

  /* The whole point of composing answers from the data modules is that a fact
     cannot drift. These check the composition actually happened rather than
     someone pasting a number in. */
  it('answers are composed from the site data, not retyped', () => {
    expect(topicById.get('contact').answer()).toContain(company.emails.general);
    expect(topicById.get('contact').answer()).toContain(company.phone.display);
    expect(topicById.get('services').answer()).toContain(capabilities[0].name);
    expect(topicById.get('projects').answer())
      .toContain(PORTFOLIO_TOTAL_MW.toLocaleString('en-IN', { maximumFractionDigits: 0 }));
  });

  it('the fallback still hands over a human route', () => {
    expect(fallback()).toContain(company.emails.general);
  });
});

describe('assistant matching', () => {
  /* Phrased the way visitors actually type, not the way the keywords read. */
  const cases = [
    ['what do you do', 'services'],
    ['tell me about your company', 'about'],
    ['where are your offices', 'locations'],
    ['show me your projects', 'projects'],
    ['how can I contact you', 'contact'],
    ['who runs the company', 'team'],
    ['have you won any awards', 'awards'],
    ['are you hiring', 'careers'],
    ['can I download the regulations', 'downloads'],
    ['do you work with wind developers', 'industries'],
    ['who are your partners', 'partners'],
    ['open access power sale', 'services'],
  ];

  for (const [q, expected] of cases) {
    it(`"${q}" → ${expected}`, () => {
      expect(answer(q).topic?.id).toBe(expected);
    });
  }

  it('falls back rather than guessing when nothing is close', () => {
    for (const q of ['what is the weather', 'tell me a joke', 'zzzzz']) {
      expect(answer(q).topic).toBeNull();
    }
  });

  it('an empty or whitespace query cannot score', () => {
    expect(score('', topics[0])).toBe(0);
    expect(score('   ', topics[0])).toBe(0);
  });

  /* A follow-up carries almost no matchable text, so the previous answer's
     offered ids break the tie. */
  it('uses the offered follow-ups as context', () => {
    const cold = answer('what about that');
    expect(cold.topic).toBeNull();
    const warm = answer('what about downloads', ['downloads', 'contact', 'about']);
    expect(warm.topic?.id).toBe('downloads');
  });

  it('always returns something to say and somewhere to go next', () => {
    for (const q of ['services', 'nonsense query here', 'contact']) {
      const a = answer(q);
      expect(a.text.length).toBeGreaterThan(20);
      expect(a.next.length).toBeGreaterThan(0);
    }
  });

  it('normalises punctuation and case', () => {
    expect(normalise("What's YOUR  address?")).toBe('whats your address');
  });
});
