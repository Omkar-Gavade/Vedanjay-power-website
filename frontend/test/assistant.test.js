import { describe, it, expect } from 'vitest';
import {
  topics, topicById, OPENERS, fallback, FALLBACK_NEXT, stateIn,
} from '../src/data/assistant.js';
import { answer, score, normalise } from '../src/utils/assistant.js';
import { BUILT_ROUTES } from '../src/constants/routes.js';
import { company } from '../src/data/company.js';
import { capabilities } from '../src/data/capabilities.js';
import { PORTFOLIO_TOTAL_MW, portfolioByState } from '../src/data/portfolio.js';
import { PROJECT_TOTAL } from '../src/data/projects.js';
import { leadership } from '../src/data/team.js';

/**
 * The assistant answers from these topics and nothing else, so the topics are
 * where it can go wrong: a link to a page that does not exist, a fact typed in
 * by hand that later drifts from the page it came from, a question that
 * silently falls through to the fallback — or, worse, a question about
 * something the company has not published that gets a confident answer anyway.
 */

const CTX = { text: '', words: [], raw: '' };

describe('assistant knowledge', () => {
  it('every link points at a route that is actually built', () => {
    const bad = topics
      .filter((t) => t.link && !BUILT_ROUTES.includes(t.link.to))
      .map((t) => `${t.id} → ${t.link.to}`);
    expect(bad, 'the assistant must never offer a page that does not exist').toEqual([]);
  });

  it('every follow-up names a real topic', () => {
    const bad = topics.flatMap((t) => t.next
      .filter((id) => !topicById.has(id)).map((id) => `${t.id} → ${id}`));
    expect(bad).toEqual([]);
  });

  it('every opening quick action resolves', () => {
    expect(OPENERS.every((id) => topicById.has(id))).toBe(true);
    expect(OPENERS.length).toBeGreaterThanOrEqual(6);
  });

  it('the fallback follow-ups resolve', () => {
    expect(FALLBACK_NEXT.every((id) => topicById.has(id))).toBe(true);
  });

  it('ids are unique', () => {
    expect(new Set(topics.map((t) => t.id)).size).toBe(topics.length);
  });

  it('every topic produces a non-trivial answer without being handed a context', () => {
    /* Called bare on purpose: a topic that needs the parsed query to render at
       all would throw the moment anything called it defensively. */
    const thin = topics.filter((t) => t.answer().trim().length < 40).map((t) => t.id);
    expect(thin).toEqual([]);
  });

  it('every second level renders too', () => {
    const thin = topics.filter((t) => t.more && t.more(CTX).trim().length < 20).map((t) => t.id);
    expect(thin).toEqual([]);
  });

  /* The whole point of composing answers from the data modules is that a fact
     cannot drift. These check the composition actually happened rather than
     someone pasting a number in. */
  it('answers are composed from the site data, not retyped', () => {
    expect(topicById.get('contact').answer()).toContain(company.emails.general);
    expect(topicById.get('contact').answer()).toContain(company.phone.display);
    expect(topicById.get('services').answer()).toContain(capabilities[0].name);
    expect(topicById.get('team').answer()).toContain(leadership[0].name);
    expect(topicById.get('team').answer()).toContain(leadership[0].role);
    expect(topicById.get('register').answer()).toContain(String(PROJECT_TOTAL));
    expect(topicById.get('portfolio').answer())
      .toContain(PORTFOLIO_TOTAL_MW.toLocaleString('en-IN', { maximumFractionDigits: 2 }));
  });

  it('the fallback still hands over a human route', () => {
    expect(fallback()).toContain(company.emails.general);
    expect(fallback()).toContain(company.phone.display);
  });
});

describe('quick actions and follow-up chips', () => {
  /* Every button in the panel sends its own label back as the query. If a label
     does not resolve to its own topic, the button silently answers the wrong
     question — the one failure a visitor can trigger without typing anything. */
  it('every topic label resolves to that same topic', () => {
    const bad = topics
      .map((t) => ({ t, got: answer(t.label).topic?.id ?? 'FALLBACK' }))
      .filter(({ t, got }) => got !== t.id)
      .map(({ t, got }) => `"${t.label}" → ${got} (want ${t.id})`);
    expect(bad).toEqual([]);
  });
});

describe('assistant matching', () => {
  /* Phrased the way visitors actually type, not the way the keywords read. */
  const cases = [
    // the brief's own examples
    ['Hi', 'greeting'],
    ['Hello', 'greeting'],
    ['Hey', 'greeting'],
    ['good morning', 'greeting'],
    ['Who are you?', 'identity'],
    ['are you a bot', 'identity'],
    ['What does Vedanjay do?', 'about'],
    ['What services do you provide?', 'services'],
    ['Where do you operate?', 'states'],
    ['Tell me about your projects', 'projects'],
    ['Who is the leadership team?', 'team'],
    ['How can I contact you?', 'contact'],
    ['Do you have openings?', 'careers'],
    // and the rest of the surface
    ['where are you based', 'locations'],
    ['office address', 'locations'],
    ['who runs the company', 'team'],
    ['who is the founder', 'team'],
    ['what is your vision', 'vision'],
    ['your mission', 'mission'],
    ['what are your values', 'values'],
    ['why should we choose you', 'strengths'],
    ['what makes you different', 'strengths'],
    ['what is QCA', 'qca'],
    ['do you do forecasting', 'qca'],
    ['DSM penalties', 'qca'],
    ['open access power sale', 'openaccess'],
    ['abt meter installation', 'metering'],
    ['do you build substations', 'infrastructure'],
    ['grid connectivity study', 'gridstudies'],
    ['do you handle solar and wind', 'technologies'],
    ['do you work with wind developers', 'industries'],
    ['how many MW do you manage', 'portfolio'],
    ['how many projects have you done', 'register'],
    ['who do you work with', 'clients'],
    ['who are your partners', 'partners'],
    ['tell me about enercast', 'partners'],
    ['have you won any awards', 'awards'],
    ['can I download the regulations', 'downloads'],
    ['MERC regulations', 'downloads'],
    ['show me photos of your work', 'gallery'],
    ['are you on linkedin', 'social'],
    ['do you work 24x7', 'support'],
    ['are you hiring', 'careers'],
    ['thanks', 'thanks'],
    ['thank you very much', 'thanks'],
    ['bye', 'bye'],
    ['what can you do', 'help'],
    ['email address', 'contact'],
    ['whats your phone number', 'contact'],
  ];

  for (const [q, expected] of cases) {
    it(`"${q}" → ${expected}`, () => {
      expect(answer(q).topic?.id).toBe(expected);
    });
  }

  /* Typing slips are what people actually send. Each of these is one edit from
     a declared term. */
  const typos = [
    ['what serivces do you offer', 'services'],
    ['tell me about maharastra', 'states'],
    ['forcasting and scheduling', 'qca'],
    ['contct details', 'contact'],
    ['portfolo', 'portfolio'],
  ];
  for (const [q, expected] of typos) {
    it(`typo "${q}" → ${expected}`, () => {
      expect(answer(q).topic?.id).toBe(expected);
    });
  }

  it('a near-miss on a short word is not treated as a typo', () => {
    /* "prime" is one substitution from "prize", which sent "who is the prime
       minister" to the awards topic. Below six characters an edit is usually a
       different word, not a slip. */
    expect(answer('who is the prime minister').topic).toBeNull();
  });
});

describe('refusing to invent', () => {
  /* Every one of these is marked "to be confirmed" or simply absent in the
     source documents. A confident answer here would be a fabricated fact, so
     the only correct behaviour is the fallback. */
  const notPublished = [
    'how many employees do you have',
    'what is your annual turnover',
    'what is your GST number',
    'what is your registration number',
    'how much does it cost',
    'what is the weather today',
    'tell me a joke',
    'who is the prime minister',
  ];

  for (const q of notPublished) {
    it(`"${q}" falls back rather than guessing`, () => {
      const a = answer(q);
      expect(a.topic).toBeNull();
      expect(a.text).toBe(fallback());
    });
  }

  it('the fallback says the information is not published and offers a way out', () => {
    const a = answer('what is your turnover');
    expect(a.text.toLowerCase()).toContain('published');
    expect(a.next.length).toBeGreaterThan(0);
    expect(a.link).toBeNull();
  });

  it('a state with no published record says so instead of deflecting', () => {
    const a = answer('do you work in kerala');
    expect(a.topic?.id).toBe('states');
    expect(a.text).toContain('Kerala');
    expect(a.text.toLowerCase()).toContain('nothing on record');
    expect(a.text).toContain(company.emails.general);
  });

  it('a state we do publish reports its own figure', () => {
    const mh = portfolioByState.find((s) => s.state === 'Maharashtra');
    const a = answer('what about Maharashtra?');
    expect(a.topic?.id).toBe('states');
    expect(a.text).toContain('Maharashtra');
    expect(a.text).toContain(mh.mw.toLocaleString('en-IN', { maximumFractionDigits: 2 }));
  });

  it('stateIn finds a state only on a word boundary', () => {
    expect(stateIn('what about maharashtra')).toBe('Maharashtra');
    expect(stateIn('mp portfolio')).toBe('Madhya Pradesh');
    expect(stateIn('what do you do')).toBeNull();
  });
});

describe('conversation context', () => {
  it('a greeting alone is met with a greeting', () => {
    expect(answer('hi').topic?.id).toBe('greeting');
  });

  it('a greeting in front of a real question does not swallow it', () => {
    /* This is the whole reason conversational topics are considered last. */
    expect(answer('hi, what services do you offer').topic?.id).toBe('services');
    expect(answer('hello, where are your offices').topic?.id).toBe('locations');
  });

  it('"tell me more" opens the second level of the last topic', () => {
    const first = answer('our services');
    const second = answer('tell me more', { last: first.topic.id });
    expect(second.topic.id).toBe('services');
    expect(second.text).not.toBe(first.text);
    expect(second.text).toContain(capabilities[0].points[0]);
  });

  it('"tell me more" with nothing to expand still says something useful', () => {
    const a = answer('tell me more', { last: 'vision' });
    expect(a.topic.id).toBe('vision');
    expect(a.text.length).toBeGreaterThan(20);
  });

  it('"tell me more" with no history falls back rather than inventing a subject', () => {
    expect(answer('tell me more').topic).toBeNull();
  });

  it('a named subject beats the "more" shortcut', () => {
    expect(answer('tell me more about your projects', { last: 'services' }).topic.id)
      .toBe('projects');
  });

  it('uses the offered follow-ups to break a tie', () => {
    const warm = answer('what about downloads', { offered: ['downloads', 'contact'] });
    expect(warm.topic?.id).toBe('downloads');
  });

  it('accepts a bare array as shorthand for the offered ids', () => {
    expect(answer('what about downloads', ['downloads']).topic?.id).toBe('downloads');
  });

  it('always returns something to say and somewhere to go next', () => {
    for (const q of ['services', 'nonsense query here', 'contact', 'hi']) {
      const a = answer(q);
      expect(a.text.length).toBeGreaterThan(20);
      expect(a.next.length).toBeGreaterThan(0);
    }
  });
});

describe('scoring', () => {
  it('an empty or whitespace query cannot score', () => {
    expect(score('', topics[0])).toBe(0);
    expect(score('   ', topics[0])).toBe(0);
  });

  it('normalises punctuation and case', () => {
    expect(normalise("What's YOUR  address?")).toBe('whats your address');
  });

  it('a declared singular and plural are one term, not two', () => {
    /* Scoring both against the single word "project" earned double credit for
       one match, which let the broad projects topic out-score the specific
       "Project support" phrase. */
    const projects = topicById.get('projects');
    expect(score('project', projects)).toBeLessThan(6);
    expect(answer('project support').topic?.id).toBe('projectsupport');
  });

  it('a phrase matches on word boundaries, not as a substring', () => {
    /* "who are you" fires inside "who are your partners" as a raw substring. */
    expect(answer('who are your partners').topic?.id).toBe('partners');
    expect(answer('who are you').topic?.id).toBe('identity');
  });
});
