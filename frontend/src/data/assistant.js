import { company } from './company.js';
import {
  capabilities, coreExpertise, technologies, strengths, journey,
} from './capabilities.js';
import { industries } from './industries.js';
import {
  PROJECT_TOTAL, voltageClasses, projectCategories, namedCapacities, repeatClients, countFor,
} from './projects.js';
import {
  PORTFOLIO_TOTAL_MW, PORTFOLIO_COUNT, portfolioByState, unallocated,
} from './portfolio.js';
import { awards, awardYears } from './awards.js';
import { leadership } from './team.js';
import { allResources, resourceGroups } from './downloads.js';
import { partners, partnerGroups } from './partners.js';
import {
  milestones, vision, mission, values, achievements,
} from './about.js';
import { shots } from './gallery.js';
import { proofPoints } from './stats.js';
import { ROUTES } from '../constants/routes.js';

/**
 * THE ASSISTANT'S ENTIRE KNOWLEDGE, and the reason it needs no server.
 *
 * Every answer below is COMPOSED FROM THE SAME DATA MODULES THE PAGES RENDER —
 * company.js, capabilities.js, portfolio.js and the rest. Nothing is retyped
 * here, so a fact cannot drift between what a page says and what the assistant
 * says: change the capability list and the assistant's answer changes with it.
 * Where a figure appears (5,509 MW, 52 works, 20 documents) it is interpolated
 * from the module that owns and asserts it, never written as a literal.
 *
 * THE RULE THIS FILE EXISTS TO ENFORCE: if the site does not say it, the
 * assistant does not say it. There is no topic here for turnover, headcount,
 * client names outside the published register, certifications, project values
 * or delivery timelines, because the source documents mark those "to be
 * confirmed" or omit them. A question about any of them falls through to the
 * fallback, which says the information is not published and hands over the
 * contact route. That is the correct answer, and it is a better one than a
 * plausible sentence.
 *
 * SHAPE OF A TOPIC
 *   id        stable identifier, also used for follow-up wiring
 *   label     what a quick-action or follow-up button says
 *   match     terms that select it; scoring is in utils/assistant.js
 *   answer()  built at call time from the data modules; receives the parsed
 *             query so a topic can answer about the thing that was named
 *   more()    optional second level, for "tell me more"
 *   link      { to, label } — an ACTUAL route from constants/routes.js
 *   next      ids of the follow-ups offered after the answer
 *   solo      conversational only: wins only when the query is essentially
 *             just this and nothing else (see utils/assistant.js)
 */

const list = (items) => (items.length < 2
  ? (items[0] ?? '')
  : `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`);

const mw = (n) => n.toLocaleString('en-IN', { maximumFractionDigits: 0 });
const mw2 = (n) => n.toLocaleString('en-IN', { maximumFractionDigits: 2 });
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

const stateNames = portfolioByState.map((s) => s.state);
const sldc = company.operatingAreas.filter((a) => a.basis.includes('SLDC')).map((a) => a.name);
const cap = (id) => capabilities.find((c) => c.id === id);

/** A capability answered in its own right: summary, then what it covers. */
const capAnswer = (id) => {
  const c = cap(id);
  return `${c.summary}\n\n${c.points.map((p) => `• ${p}`).join('\n')}`;
};

/**
 * Which office sits in which state, DERIVED rather than restated — the state is
 * already the last line of every published address.
 */
const officeIn = (state) => company.offices.find((o) => o.lines.join(' ').includes(state));

/**
 * States the assistant can speak about, with their aliases. The names come from
 * the portfolio rollup and the registered operating areas; only the short forms
 * people actually type are added.
 */
const STATE_ALIASES = {
  'madhya pradesh': ['mp', 'm p'],
  maharashtra: ['maha'],
  telangana: [],
  rajasthan: [],
  karnataka: [],
  'tamil nadu': ['tamilnadu', 'tn'],
  gujarat: [],
};

const KNOWN_STATES = [...new Set([...stateNames, ...company.operatingAreas.map((a) => a.name)])];

/**
 * States we do NOT have a published record for, listed only so that naming one
 * gets an honest "not in the record" rather than a generic coverage answer.
 * Detection only — nothing here is ever claimed as coverage.
 */
const OTHER_STATES = ['Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Jammu and Kashmir', 'Kerala', 'Ladakh',
  'Odisha', 'Orissa', 'Punjab', 'Sikkim', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];

/** Find the state a query names, if any. `text` is already normalised. */
export function stateIn(text) {
  for (const name of [...KNOWN_STATES, ...OTHER_STATES]) {
    const key = name.toLowerCase();
    const forms = [key, ...(STATE_ALIASES[key] ?? [])];
    if (forms.some((f) => new RegExp(`(^|\\s)${f}(\\s|$)`).test(text))) return name;
  }
  return null;
}

/** @typedef {{text:string, words:string[], raw:string}} QueryCtx */

/** @typedef {{id:string, label:string, match:string[], answer:(ctx:QueryCtx)=>string,
 *             more?:(ctx:QueryCtx)=>string, link?:{to:string,label:string},
 *             next:string[], solo?:boolean}} Topic */

/** @type {Topic[]} */
export const topics = [
  /* ---------------------------------------------------------------- greeting
     Conversational topics are `solo`: "hi" opens the conversation, but
     "hi, what services do you offer" is a services question with a hello on the
     front, and must not be answered with a hello. */
  {
    id: 'greeting',
    label: 'Say hello',
    solo: true,
    match: ['hi', 'hello', 'hey', 'hiya', 'yo', 'good morning', 'good afternoon',
      'good evening', 'namaste', 'greetings', 'hi there', 'hello there'],
    answer: () => `Hello — I'm the ${company.name} assistant.\n\n`
      + `Ask me about our services, projects, offices, team or awards, and I'll `
      + `answer from what's published here and point you to the right page.`,
    next: ['services', 'projects', 'contact'],
  },
  {
    id: 'identity',
    label: 'Who you are',
    solo: true,
    match: ['who are you', 'who you are', 'what are you', 'who is this', 'are you a bot',
      'are you human', 'are you real', 'are you ai', 'bot', 'assistant',
      'who am i talking to', 'your name'],
    answer: () => `I'm the ${company.name} website assistant — not a person, and `
      + `not an AI model. I answer from the information published on this site, so `
      + `everything I say can be checked on a page.\n\n`
      + `${company.legalName} is a power-sector solutions company, established `
      + `${company.established}.`,
    link: { to: ROUTES.about, label: 'About the company' },
    next: ['about', 'services', 'contact'],
  },
  {
    id: 'help',
    label: 'What I can answer',
    solo: true,
    match: ['help', 'what can you do', 'what i can answer', 'what can you help with', 'options',
      'topics', 'menu', 'what do you know', 'how does this work'],
    answer: () => `I can answer on:\n\n`
      + `• The company — overview, story, vision, mission and values\n`
      + `• Services — all ${capabilities.length} lines, including QCA forecasting and scheduling\n`
      + `• Projects — the ${mw(PORTFOLIO_TOTAL_MW)} MW QCA portfolio and the ${PROJECT_TOTAL}-work register\n`
      + `• Where we operate, our offices, team, awards and partners\n`
      + `• Careers, downloads and how to reach us\n\n`
      + `If something isn't published here, I'll say so rather than guess.`,
    next: ['services', 'projects', 'contact'],
  },
  {
    id: 'thanks',
    label: 'Thanks',
    solo: true,
    match: ['thanks', 'thank you', 'thankyou', 'thx', 'cheers', 'appreciate it',
      'great', 'nice', 'ok thanks', 'perfect'],
    answer: () => `Glad to help. Anything else you'd like to know?`,
    next: ['services', 'projects', 'contact'],
  },
  {
    id: 'bye',
    label: 'Goodbye',
    solo: true,
    match: ['bye', 'goodbye', 'see you', 'good bye', 'thats all', 'that is all',
      'no thanks', 'nothing else'],
    answer: () => `Thanks for stopping by. If you'd like to talk to the team, `
      + `we're on ${company.emails.general} and ${company.phone.display}.`,
    link: { to: ROUTES.contact, label: 'Contact us' },
    next: ['contact', 'services'],
  },

  /* ------------------------------------------------------------------ company */
  {
    id: 'about',
    label: 'About Vedanjay',
    match: ['about', 'about vedanjay', 'about the company', 'company', 'overview',
      'company overview', 'background', 'what does vedanjay do',
      'what do you do', 'what is vedanjay', 'tell me about the company',
      'introduce', 'introduction'],
    answer: () => `${company.overview}\n\n`
      + `Established ${company.established} — ${proofPoints.find((p) => p.id === 'experience').value} `
      + `years in the power sector, with a QCA portfolio above ${mw(PORTFOLIO_TOTAL_MW)} MW.`,
    more: () => journey[1],
    link: { to: ROUTES.about, label: 'Company overview' },
    next: ['services', 'strengths', 'locations'],
  },
  {
    id: 'journey',
    label: 'Our story',
    match: ['story', 'journey', 'history', 'milestone', 'milestones', 'timeline',
      'founded', 'established', 'when did you start', 'how old', 'since when',
      'evolution', 'growth'],
    answer: () => `Established in ${company.established}, and now a diversified `
      + `power-sector solutions company.\n\n`
      + `${milestones.length} milestones are published, from the first renewable-energy `
      + `work to multi-state QCA operations and a portfolio above ${mw(PORTFOLIO_TOTAL_MW)} MW.`,
    more: () => milestones.map((m) => `• ${m.year ? `${m.year} — ` : ''}${m.name}`).join('\n'),
    link: { to: ROUTES.about, label: 'The full journey' },
    next: ['about', 'achievements', 'awards'],
  },
  {
    id: 'vision',
    label: 'Vision',
    match: ['vision', 'vision statement', 'aim', 'goal', 'ambition', 'purpose'],
    answer: () => vision,
    link: { to: ROUTES.about, label: 'Vision, mission & values' },
    next: ['mission', 'values', 'about'],
  },
  {
    id: 'mission',
    label: 'Mission',
    match: ['mission', 'mission statement', 'commitments', 'what you stand for'],
    answer: () => `Our mission, in ${mission.length} commitments:\n\n`
      + mission.map((m) => `• ${m}`).join('\n'),
    link: { to: ROUTES.about, label: 'Vision, mission & values' },
    next: ['vision', 'values', 'services'],
  },
  {
    id: 'values',
    label: 'Values',
    match: ['values', 'value', 'ethics', 'principles', 'culture', 'integrity'],
    answer: () => `${values.length} values guide the work:\n\n`
      + values.map((v) => `• ${v.name}`).join('\n'),
    more: () => values.map((v) => `• ${v.name} — ${v.body}`).join('\n'),
    link: { to: ROUTES.about, label: 'Vision, mission & values' },
    next: ['vision', 'mission', 'about'],
  },
  {
    id: 'strengths',
    label: 'Why Vedanjay',
    match: ['why vedanjay', 'why you', 'why choose', 'choose', 'should we choose',
      'strength', 'strengths', 'usp',
      'advantage', 'advantages', 'differentiator', 'what makes you different',
      'benefit', 'benefits', 'edge'],
    answer: () => `${strengths.length} strengths are published. The first five:\n\n`
      + strengths.slice(0, 5).map((s) => `• ${s.name}`).join('\n')
      + `\n\n${strengths[0].body}`,
    more: () => strengths.slice(5).map((s) => `• ${s.name}`).join('\n')
      + `\n\nThe page carries the detail behind each one.`,
    link: { to: ROUTES.about, label: 'Key strengths' },
    next: ['services', 'achievements', 'contact'],
  },
  {
    id: 'achievements',
    label: 'Achievements',
    match: ['achievement', 'achievements', 'accomplishment', 'accomplishments',
      'track record', 'highlights', 'major achievements'],
    answer: () => achievements.slice(0, 5).map((a) => `• ${a.name} — ${a.body}`).join('\n'),
    more: () => achievements.slice(5).map((a) => `• ${a.name} — ${a.body}`).join('\n'),
    link: { to: ROUTES.about, label: 'Achievements' },
    next: ['awards', 'portfolio', 'strengths'],
  },
  {
    id: 'support',
    label: '24×7 support',
    match: ['24x7', '24 7', 'round the clock', 'support hours', 'availability',
      'office hours', 'working hours', 'monitoring', 'always available',
      'operational support'],
    answer: () => {
      const s = strengths.find((x) => x.name.includes('24'));
      return `${s.body}\n\nForecasting and scheduling is a live obligation — schedules, `
        + `revisions and deviation monitoring run against the load despatch centres' clock, `
        + `not office hours.`;
    },
    link: { to: ROUTES.contact, label: 'Contact us' },
    next: ['qca', 'contact', 'services'],
  },

  /* ----------------------------------------------------------------- services */
  {
    id: 'services',
    label: 'Our Services',
    match: ['service', 'services', 'what services', 'what do you offer', 'offer',
      'offerings', 'solutions', 'capability', 'capabilities', 'lines of work',
      'what work do you do', 'provide'],
    answer: () => `We work across ${capabilities.length} service lines:\n\n`
      + capabilities.map((c) => `• ${c.name}`).join('\n')
      + `\n\nForecasting & Scheduling (QCA) is the core — registered with the state load `
      + `despatch centres of ${list(sldc)}, and with WRLDC for the Western Region.`,
    /* The full summaries run to 1,400 characters — a wall of text in a chat
       bubble. One defining line each says as much at a third of the length,
       and the page itself carries the rest. */
    more: () => capabilities.map((c) => `• ${c.name} — ${c.points[0]}`).join('\n'),
    link: { to: ROUTES.services, label: 'All services' },
    next: ['qca', 'industries', 'contact'],
  },
  {
    id: 'qca',
    label: 'Forecasting & QCA',
    match: ['qca', 'forecasting', 'forecast', 'scheduling', 'schedule', 'f&s', 'fs',
      'qualified coordinating agency', 'dsm', 'deviation', 'deviation settlement',
      'sldc', 'rldc', 'wrldc', 'day ahead', 'intraday', 'penalties', 'penalty'],
    answer: () => capAnswer('qca'),
    more: () => cap('qca').services.map((s) => `• ${s.name} — ${s.body}`).join('\n')
      + `\n\nRegistered SLDC operations: ${list(sldc)}, plus WRLDC for the Western Region.`,
    link: { to: ROUTES.services, label: 'Forecasting & Scheduling' },
    next: ['portfolio', 'technologies', 'contact'],
  },
  {
    id: 'openaccess',
    label: 'Open access',
    match: ['open access', 'openaccess', 'power sale', 'power purchase', 'ppa',
      'buy power', 'sell power', 'discom', 'liaisoning', 'procurement',
      'power trading', 'consumer'],
    answer: () => capAnswer('open-access'),
    link: { to: ROUTES.services, label: 'Open-access power' },
    next: ['services', 'downloads', 'contact'],
  },
  {
    id: 'metering',
    label: 'Metering & telemetry',
    match: ['metering', 'meter', 'meters', 'abt', 'abt meter', 'telemetry',
      'energy accounting', 'net metering', 'data communication', 'scada'],
    answer: () => capAnswer('metering'),
    link: { to: ROUTES.services, label: 'ABT metering & telemetry' },
    next: ['services', 'register', 'contact'],
  },
  {
    id: 'infrastructure',
    label: 'Electrical infrastructure',
    match: ['infrastructure', 'electrical infrastructure', 'transmission', 'substation',
      'feeder bay', 'ehv', 'high voltage', 'hv', 'line', 'lines', 'stringing',
      'commissioning', 'switchyard', 'bay'],
    answer: () => `${capAnswer('infrastructure')}\n\n`
      + `Voltage classes evidenced across the register: ${list(voltageClasses)}.`,
    link: { to: ROUTES.services, label: 'Electrical infrastructure' },
    next: ['register', 'gallery', 'contact'],
  },
  {
    id: 'gridstudies',
    label: 'Grid studies',
    match: ['grid study', 'grid studies', 'consultancy', 'consulting', 'consultant',
      'connectivity', 'grid connectivity', 'system study', 'technical report',
      'assessment', 'grid integration', 'planning'],
    answer: () => capAnswer('grid-studies'),
    link: { to: ROUTES.services, label: 'Grid studies & consultancy' },
    next: ['services', 'projects', 'contact'],
  },
  {
    id: 'projectsupport',
    label: 'Project support',
    match: ['project support', 'end to end', 'integrated', 'single engagement',
      'full service', 'turnkey', 'complete solution'],
    answer: () => capAnswer('project-support'),
    link: { to: ROUTES.services, label: 'Renewable project support' },
    next: ['services', 'technologies', 'contact'],
  },
  {
    id: 'technologies',
    label: 'Solar, wind & hybrid',
    match: ['solar', 'wind', 'hybrid', 'renewable', 'renewables', 'technology',
      'technologies', 'green energy', 'clean energy', 'which technologies',
      'rooftop', 'pv'],
    answer: () => `We work across ${technologies.length} renewable technologies:\n\n`
      + technologies.map((t) => `• ${t.name} — ${t.body}`).join('\n')
      + `\n\nThe QCA portfolio spans ${PORTFOLIO_COUNT} projects and ${mw(PORTFOLIO_TOTAL_MW)} MW.`,
    link: { to: ROUTES.services, label: 'Our services' },
    next: ['qca', 'portfolio', 'contact'],
  },
  {
    id: 'expertise',
    label: 'Core expertise',
    match: ['expertise', 'core expertise', 'specialisation', 'specialization',
      'specialist', 'skills', 'technical expertise', 'domain'],
    answer: () => `Core expertise:\n\n${coreExpertise.map((e) => `• ${e}`).join('\n')}`,
    link: { to: ROUTES.services, label: 'All services' },
    next: ['services', 'strengths', 'contact'],
  },

  /* ----------------------------------------------------------------- evidence */
  {
    id: 'projects',
    label: 'Our Projects',
    match: ['project', 'projects', 'work done', 'experience', 'case study',
      'case studies', 'past work', 'executed', 'delivered', 'references',
      'tell me about your projects'],
    answer: () => `Two records, both published in full.\n\n`
      + `• A QCA forecasting and scheduling portfolio of ${mw(PORTFOLIO_TOTAL_MW)} MW `
      + `across ${PORTFOLIO_COUNT} renewable projects in ${portfolioByState.length} states.\n`
      + `• An execution register of ${PROJECT_TOTAL} works — EHV feeder bays, substation `
      + `works, metering and telemetry, O&M and civil, up to ${voltageClasses[0]}.`,
    link: { to: ROUTES.projects, label: 'View the register' },
    next: ['portfolio', 'register', 'clients'],
  },
  {
    id: 'portfolio',
    label: 'QCA portfolio',
    match: ['portfolio', 'qca portfolio', 'mw', 'megawatt', 'megawatts', 'capacity under management',
      'how much capacity', 'how many mw', 'total capacity', 'gw', '5000',
      'under management', 'managed capacity'],
    answer: () => `${mw2(PORTFOLIO_TOTAL_MW)} MW under QCA forecasting and scheduling, `
      + `across ${PORTFOLIO_COUNT} renewable projects in ${portfolioByState.length} states.\n\n`
      + portfolioByState.slice(0, 4)
        .map((s) => `• ${s.state} — ${mw2(s.mw)} MW (${plural(s.count, 'project')})`).join('\n')
      + `\n\nAsk about any state for its figure.`,
    more: () => portfolioByState
      .map((s) => `• ${s.state} — ${mw2(s.mw)} MW (${plural(s.count, 'project')})`).join('\n')
      + (unallocated ? `\n\n${unallocated.name}'s ${mw2(unallocated.mw)} MW is listed across `
        + `three states and is not apportioned between them.` : ''),
    link: { to: ROUTES.projects, label: 'Portfolio map' },
    next: ['states', 'qca', 'clients'],
  },
  {
    id: 'states',
    label: 'Coverage by state',
    match: ['state', 'states', 'which states', 'coverage', 'operate', 'operating',
      'operations', 'region', 'regions', 'presence', 'geography', 'across india',
      'where do you operate', ...Object.keys(STATE_ALIASES),
      ...Object.values(STATE_ALIASES).flat(),
      /* Naming a state we have no record for must still reach this topic — it
         answers "nothing on record for it", which is the honest answer and a
         far better one than a generic coverage blurb. */
      ...OTHER_STATES.map((n) => n.toLowerCase())],
    answer: ({ text = '' } = {}) => {
      const named = stateIn(text);
      if (named) {
        const row = portfolioByState.find((s) => s.state === named);
        const area = company.operatingAreas.find((a) => a.name === named);
        const office = officeIn(named);
        const lines = [];
        if (row) {
          lines.push(`${named} — ${mw2(row.mw)} MW under QCA across ${plural(row.count, 'project')}.`);
        }
        if (area) lines.push(`${area.basis}.`);
        if (office) lines.push(`Our ${office.role.toLowerCase()} is in ${office.city}.`);
        if (!row && !area) {
          lines.push(`${named} isn't in the published QCA portfolio or the registered `
            + `operating areas, so I have nothing on record for it.\n\n`
            + `Registered operations are ${list(company.operatingAreas.map((a) => a.name))}. `
            + `The team can tell you what's possible elsewhere — ${company.emails.general}.`);
        }
        return lines.join('\n\n');
      }
      return `Registered operations: ${company.operatingAreas
        .map((a) => `${a.name} (${a.basis.replace('Registered ', '').replace(' operations', '')})`)
        .join(', ')}.\n\n`
        + `The QCA portfolio itself spans ${portfolioByState.length} states — `
        + `${list(stateNames)}.`;
    },
    link: { to: ROUTES.projects, label: 'Portfolio map' },
    next: ['portfolio', 'locations', 'contact'],
  },
  {
    id: 'register',
    label: 'Execution register',
    match: ['register', 'execution', 'how many projects', 'number of projects',
      '52', 'order', 'orders', 'work order', 'civil', 'o&m', 'om', 'maintenance',
      'amc', 'erection'],
    answer: () => `${PROJECT_TOTAL} works are published, each with the order-placing `
      + `organisation and scope:\n\n`
      + projectCategories.filter((c) => c.id !== 'all')
        .map((c) => `• ${c.label} — ${countFor(c.id)}`).join('\n')
      + `\n\nVoltage classes: ${list(voltageClasses)}.`,
    more: () => `Plant capacities named in the register:\n\n`
      + namedCapacities.map((c) => `• ${c.capacity} ${c.tech} — ${c.client}`).join('\n'),
    link: { to: ROUTES.projects, label: 'Project register' },
    next: ['clients', 'capacities', 'gallery'],
  },
  {
    id: 'capacities',
    label: 'Plant capacities',
    match: ['plant capacity', 'plant capacities', 'mwp', 'kwp', 'kw', 'plant size',
      'biggest project', 'largest project', 'how big'],
    answer: () => `Capacities named in the execution register:\n\n`
      + namedCapacities.map((c) => `• ${c.capacity} ${c.tech} — ${c.client}`).join('\n')
      + `\n\nThe register doesn't state a total, so none is claimed.`,
    link: { to: ROUTES.projects, label: 'Project register' },
    next: ['register', 'portfolio', 'contact'],
  },
  {
    id: 'clients',
    label: 'Clients',
    match: ['client', 'clients', 'customer', 'customers', 'who do you work with',
      'repeat client', 'references', 'worked for'],
    answer: () => `Organisations with more than one order in the published register:\n\n`
      + repeatClients.filter((c) => c.orders > 1)
        .map((c) => `• ${c.name} — ${c.orders} orders`).join('\n')
      + `\n\nEvery engagement is named in the register with its scope.`,
    link: { to: ROUTES.projects, label: 'Project register' },
    next: ['industries', 'partners', 'projects'],
  },
  {
    id: 'industries',
    label: 'Industries served',
    match: ['industry', 'industries', 'sector', 'sectors', 'segments',
      'who are your customers', 'ipp', 'ipps', 'developer', 'developers',
      'wind developers', 'solar developers', 'wind oem', 'solar epc',
      'utility', 'utilities', 'oem', 'epc', 'manufacturing'],
    answer: () => `We work with ${industries.length} kinds of organisation:\n\n`
      + industries.map((i) => `• ${i.name} — ${i.orders} orders`).join('\n'),
    more: () => industries.map((i) => `• ${i.name} — ${i.clients.length
      ? `including ${i.clients.slice(0, 2).join(', ')}`
      : `${i.orders} orders`}`).join('\n'),
    link: { to: ROUTES.industries, label: 'Industries served' },
    next: ['clients', 'partners', 'projects'],
  },
  {
    id: 'partners',
    label: 'Partners',
    match: ['partner', 'partners', 'enercast', 'alliance', 'alliances',
      'association', 'associations', 'tie up', 'collaboration'],
    answer: () => `${partners.length} organisations are named on our published partner `
      + `listing, across ${partnerGroups.length} groups — `
      + `${list(partnerGroups.map((g) => g.group.toLowerCase()))}.\n\n`
      + `AI/ML-enabled forecasting is delivered through a technology partnership with `
      + `ENERCAST GmbH, Germany.`,
    link: { to: ROUTES.partners, label: 'View partners' },
    next: ['industries', 'qca', 'contact'],
  },
  {
    id: 'awards',
    label: 'Awards',
    match: ['award', 'awards', 'recognition', 'recognitions', 'recognised',
      'recognized', 'certificate', 'certificates', 'accolade', 'prize', 'won',
      'winner', 'solarquarter'],
    answer: () => `${awards.length} recognitions between ${awardYears.at(-1)} and `
      + `${awardYears[0]}, each shown with its certificate:\n\n`
      + awards.slice(0, 4).map((a) => `• ${a.year} — ${a.title} (${a.organisation})`).join('\n'),
    more: () => awards.slice(4).map((a) => `• ${a.year} — ${a.title} (${a.organisation})`).join('\n'),
    link: { to: ROUTES.awards, label: 'Awards & recognition' },
    next: ['achievements', 'team', 'about'],
  },
  {
    id: 'gallery',
    label: 'Site photography',
    match: ['photo', 'photos', 'photograph', 'photographs', 'photography', 'gallery', 'image',
      'images', 'picture', 'pictures', 'see your work', 'site photos'],
    answer: () => `${shots.length} photographs taken on our own sites — switchyard `
      + `structures, work at height, foundations, module mounting, metering and earthing.`,
    link: { to: ROUTES.gallery, label: 'Image gallery' },
    next: ['projects', 'infrastructure', 'contact'],
  },

  /* -------------------------------------------------------------- the company */
  {
    id: 'locations',
    label: 'Our Locations',
    match: ['location', 'locations', 'office', 'offices', 'where are you',
      'where are you based', 'address', 'addresses', 'based', 'indore', 'pune',
      'headquarters', 'head office', 'branch', 'visit', 'directions'],
    answer: () => company.offices
      .map((o) => `${o.city} — ${o.role}\n${o.lines.join(', ')}`)
      .join('\n\n')
      + `\n\nRegistered QCA operations: ${list(sldc)}, plus WRLDC for the Western Region.`,
    link: { to: ROUTES.contact, label: 'Locations & maps' },
    next: ['contact', 'states', 'about'],
  },
  {
    id: 'team',
    label: 'Our Team',
    match: ['team', 'leadership', 'who leads', 'who runs', 'runs', 'leads', 'heads',
      'founder', 'founders', 'ceo', 'director', 'directors', 'management',
      'people', 'leadership team', 'management team'],
    answer: () => `The company is led by:\n\n`
      + leadership.map((l) => `• ${l.name} — ${l.role}`).join('\n'),
    more: () => leadership.filter((l) => l.focus)
      .map((l) => `• ${l.name} — ${l.focus}`).join('\n\n'),
    link: { to: ROUTES.team, label: 'Meet the team' },
    next: ['awards', 'about', 'careers'],
  },
  {
    id: 'careers',
    label: 'Careers',
    match: ['career', 'careers', 'job', 'jobs', 'vacancy', 'vacancies', 'hiring',
      'apply', 'application', 'recruitment', 'opening', 'openings', 'internship',
      'intern', 'work with you', 'join', 'join you', 'cv', 'resume', 'position'],
    answer: () => `There's no fixed vacancy list — applications are read as they arrive `
      + `and kept on file against the work that comes in.\n\n`
      + `Send a CV and a short note saying which side of the work interests you: `
      + `forecasting and scheduling, open access, metering and telemetry, or electrical `
      + `infrastructure.\n\n${company.emails.general}`,
    link: { to: ROUTES.careers, label: 'Careers' },
    next: ['services', 'about', 'contact'],
  },
  {
    id: 'downloads',
    label: 'Downloads',
    match: ['download', 'downloads', 'document', 'documents', 'regulation',
      'regulations', 'pdf', 'pdfs', 'merc', 'cerc', 'mseb', 'msldc', 'resource',
      'resources', 'policy', 'policies', 'circular', 'gazette', 'compliance'],
    answer: () => `${allResources.length} regulatory documents, readable in the page `
      + `without downloading, in ${resourceGroups.length} groups:\n\n`
      + resourceGroups.map((g) => `• ${g.title} — ${g.items.length}`).join('\n'),
    link: { to: ROUTES.downloads, label: 'Open downloads' },
    next: ['qca', 'openaccess', 'contact'],
  },
  {
    id: 'contact',
    label: 'Contact Us',
    match: ['contact', 'contact you', 'email', 'e mail', 'email address', 'phone',
      'phone number', 'contact number', 'call', 'reach',
      'reach you', 'talk', 'speak', 'enquiry', 'enquire', 'inquiry', 'quote',
      'quotation', 'get in touch', 'whatsapp', 'mobile', 'proposal'],
    answer: () => `General enquiries — ${company.emails.general}\n`
      + `Operations & support — ${company.emails.operations}\n`
      + `Phone / WhatsApp — ${company.phone.display}\n\n`
      + `Or send the enquiry form on the contact page and the right desk picks it up.`,
    link: { to: ROUTES.contact, label: 'Contact us' },
    next: ['locations', 'services', 'careers'],
  },
  {
    id: 'social',
    label: 'Social profiles',
    match: ['linkedin', 'facebook', 'twitter', 'social', 'social media', 'follow',
      'follow you', 'profile', 'profiles', 'handle'],
    answer: () => `We're on ${list(company.social.map((s) => s.label))}. The links are `
      + `in the footer of every page.`,
    link: { to: ROUTES.contact, label: 'Contact us' },
    next: ['contact', 'about', 'team'],
  },
];

export const topicById = new Map(topics.map((t) => [t.id, t]));

/** The opening quick actions, in the order the brief asks for. */
export const OPENERS = ['about', 'services', 'projects', 'states', 'team', 'awards', 'contact'];

/**
 * Shown when nothing matches.
 *
 * It states plainly that the information is not published rather than
 * apologising or improvising, names what IS covered, and always offers the
 * human route — the failure mode of a scripted assistant is a dead end, and
 * this is the exit from it.
 */
export const fallback = () => `I don't have that in what's published on this site, `
  + `and I'd rather say so than guess.\n\n`
  + `I can help with the company and its story, our ${capabilities.length} service lines, `
  + `projects and the QCA portfolio, where we operate, the team, awards, partners, `
  + `downloads and careers.\n\n`
  + `For anything else the team answers directly — ${company.emails.general} or `
  + `${company.phone.display}.`;

/** Offered alongside the fallback, so a dead end still has three ways out. */
export const FALLBACK_NEXT = ['help', 'services', 'contact'];
