import { company } from './company.js';
import { capabilities } from './capabilities.js';
import { industries } from './industries.js';
import { PROJECT_TOTAL, voltageClasses } from './projects.js';
import { PORTFOLIO_TOTAL_MW, PORTFOLIO_COUNT, portfolioByState } from './portfolio.js';
import { awards, awardYears } from './awards.js';
import { leadership } from './team.js';
import { allResources } from './downloads.js';
import { partners } from './partners.js';
import { milestones } from './about.js';
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
 * WHY THIS REPLACED A LANGUAGE MODEL
 * The previous assistant called Workers AI with a Groq fallback, a generated
 * knowledge pack, an output guard, a golden-set evaluation and rate limiting —
 * roughly a thousand lines of infrastructure, an API key to rotate, a daily
 * neuron quota, and a 502 for the visitor whenever either provider was down.
 * For the job it actually does — "what do you do", "where are you", "show me
 * projects" — a matcher over known topics answers faster, cannot hallucinate,
 * cannot leak a key, costs nothing to run and works offline.
 *
 * SHAPE OF A TOPIC
 *   id        stable identifier, also used for follow-up wiring
 *   label     what a quick-action button says
 *   match     terms that select it; scoring is in lib/assistant.js
 *   answer()  built at call time from the data modules
 *   link      { to, label } — an ACTUAL route from constants/routes.js
 *   next      ids of the follow-ups offered after the answer
 */

const list = (items) => (items.length < 2
  ? (items[0] ?? '')
  : `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`);

const stateNames = portfolioByState.map((s) => s.state);
const sldc = company.operatingAreas.filter((a) => a.basis.includes('SLDC')).map((a) => a.name);
const mw = (n) => n.toLocaleString('en-IN', { maximumFractionDigits: 0 });

/** @typedef {{id:string,label:string,match:string[],answer:()=>string,
 *             link?:{to:string,label:string},next:string[]}} Topic */

/** @type {Topic[]} */
export const topics = [
  {
    id: 'about',
    label: 'About Vedanjay',
    match: ['about', 'company', 'who are you', 'overview', 'background', 'history',
      'established', 'founded', 'when did you start', 'story'],
    answer: () => `${company.overview}\n\nEstablished ${company.established}, with `
      + `${milestones.length} milestones on the record — from the first renewable-energy `
      + `work to a QCA portfolio above ${mw(PORTFOLIO_TOTAL_MW)} MW.`,
    link: { to: ROUTES.about, label: 'Company overview' },
    next: ['services', 'locations', 'team'],
  },
  {
    id: 'services',
    label: 'Our Services',
    match: ['service', 'services', 'what do you do', 'capabilities', 'offer', 'qca',
      'forecasting', 'scheduling', 'open access', 'metering', 'telemetry', 'abt',
      'transmission', 'grid study', 'grid studies', 'consultancy', 'dsm'],
    answer: () => `We work across ${capabilities.length} service lines:\n\n`
      + capabilities.map((c) => `• ${c.name}`).join('\n')
      + `\n\nForecasting & Scheduling (QCA) is the core: registered with the state load `
      + `despatch centres of ${list(sldc)}, and with WRLDC for the Western Region.`,
    link: { to: ROUTES.services, label: 'All services' },
    next: ['projects', 'industries', 'contact'],
  },
  {
    id: 'projects',
    label: 'Our Projects',
    match: ['project', 'projects', 'work', 'register', 'portfolio', 'experience',
      'track record', 'case study', 'done', 'executed', 'mw', 'capacity'],
    answer: () => `Two records, both published in full.\n\n`
      + `• A QCA forecasting and scheduling portfolio of ${mw(PORTFOLIO_TOTAL_MW)} MW `
      + `across ${PORTFOLIO_COUNT} renewable projects in ${portfolioByState.length} states — `
      + `largest in ${stateNames[0]} and ${stateNames[1]}.\n`
      + `• An execution register of ${PROJECT_TOTAL} works: EHV feeder bays, substation `
      + `works, metering and telemetry, O&M and civil, up to ${voltageClasses[0]}.`,
    link: { to: ROUTES.projects, label: 'View the register' },
    next: ['industries', 'gallery', 'contact'],
  },
  {
    id: 'industries',
    label: 'Industries served',
    match: ['industry', 'industries', 'sector', 'sectors', 'clients', 'client',
      'who do you work with', 'customers', 'wind', 'solar', 'developer', 'ipp',
      'discom', 'utility', 'utilities'],
    answer: () => `We work with ${industries.length} kinds of organisation:\n\n`
      + industries.map((i) => `• ${i.name}`).join('\n')
      + `\n\n${partners.length} organisations are named on our published partner listing.`,
    link: { to: ROUTES.industries, label: 'Industries served' },
    next: ['partners', 'projects', 'contact'],
  },
  {
    id: 'locations',
    label: 'Our Locations',
    match: ['location', 'locations', 'office', 'offices', 'where', 'address',
      'based', 'indore', 'pune', 'states', 'coverage', 'operate', 'area'],
    answer: () => company.offices
      .map((o) => `${o.city} — ${o.role}\n${o.lines.join(', ')}`)
      .join('\n\n')
      + `\n\nRegistered QCA operations: ${list(sldc)}, plus WRLDC for the Western Region.`,
    link: { to: ROUTES.contact, label: 'Locations & maps' },
    next: ['contact', 'about', 'services'],
  },
  {
    id: 'team',
    label: 'Our Team',
    match: ['team', 'leadership', 'who leads', 'who runs', 'runs', 'leads', 'heads',
      'founder', 'ceo', 'director', 'management', 'people', 'staff'],
    answer: () => `The company is led by:\n\n`
      + leadership.map((l) => `• ${l.name} — ${l.role}`).join('\n'),
    link: { to: ROUTES.team, label: 'Meet the team' },
    next: ['about', 'awards', 'careers'],
  },
  {
    id: 'awards',
    label: 'Awards',
    match: ['award', 'awards', 'recognition', 'recognised', 'certificate',
      'accolade', 'prize', 'won'],
    answer: () => `${awards.length} recognitions between ${awardYears.at(-1)} and `
      + `${awardYears[0]}, each shown with its certificate — including `
      + `${awards[0].title} (${awards[0].organisation}).`,
    link: { to: ROUTES.awards, label: 'Awards & recognition' },
    next: ['about', 'team', 'projects'],
  },
  {
    id: 'partners',
    label: 'Partners',
    match: ['partner', 'partners', 'enercast', 'associations', 'alliance'],
    answer: () => `${partners.length} organisations are named on our partner listing — `
      + `renewable developers and IPPs, utilities and energy majors, and engineering `
      + `institutions. AI/ML-enabled forecasting is delivered through a partnership with `
      + `ENERCAST GmbH, Germany.`,
    link: { to: ROUTES.partners, label: 'View partners' },
    next: ['services', 'projects', 'contact'],
  },
  {
    id: 'downloads',
    label: 'Downloads',
    match: ['download', 'downloads', 'document', 'documents', 'regulation',
      'regulations', 'pdf', 'merc', 'cerc', 'resource', 'resources', 'policy'],
    answer: () => `${allResources.length} regulatory documents, served from this site and `
      + `readable in the page without downloading — forecasting and scheduling, open `
      + `access, and rooftop solar and net metering.`,
    link: { to: ROUTES.downloads, label: 'Open downloads' },
    next: ['services', 'contact', 'about'],
  },
  {
    id: 'careers',
    label: 'Careers',
    match: ['career', 'careers', 'job', 'jobs', 'vacancy', 'vacancies', 'hiring',
      'apply', 'recruitment', 'work with you', 'internship'],
    answer: () => `Applications are read as they arrive and kept on file against the work `
      + `that comes in. Send a CV and a short note saying which side of the work interests `
      + `you — forecasting and scheduling, open access, metering and telemetry, or `
      + `electrical infrastructure.\n\n${company.emails.general}`,
    link: { to: ROUTES.careers, label: 'Careers' },
    next: ['services', 'about', 'contact'],
  },
  {
    id: 'gallery',
    label: 'Site photography',
    match: ['photo', 'photos', 'photograph', 'gallery', 'images', 'pictures', 'site'],
    answer: () => `Photographs taken on our own sites — switchyard structures, work at `
      + `height, foundations, module mounting, metering and earthing.`,
    link: { to: ROUTES.gallery, label: 'Image gallery' },
    next: ['projects', 'services', 'contact'],
  },
  {
    id: 'contact',
    label: 'Contact Us',
    match: ['contact', 'email', 'phone', 'call', 'reach', 'talk', 'speak',
      'enquiry', 'enquire', 'quote', 'get in touch', 'whatsapp', 'number'],
    answer: () => `General enquiries — ${company.emails.general}\n`
      + `Operations & support — ${company.emails.operations}\n`
      + `Phone / WhatsApp — ${company.phone.display}\n\n`
      + `Or send the enquiry form on the contact page and the right desk will pick it up.`,
    link: { to: ROUTES.contact, label: 'Contact us' },
    next: ['services', 'locations', 'projects'],
  },
];

export const topicById = new Map(topics.map((t) => [t.id, t]));

/** The opening quick actions, in the order the brief asks for. */
export const OPENERS = ['about', 'services', 'projects', 'locations', 'team', 'awards', 'contact'];

/**
 * Shown when nothing matches. It names what the assistant DOES cover rather
 * than apologising, and always offers the human route — the failure mode of a
 * scripted assistant is a dead end, and this is the exit from it.
 */
export const fallback = () => `I can help with our services, projects, industries, `
  + `locations, team, awards, downloads and careers.\n\n`
  + `For anything else, the team answers directly at ${company.emails.general}.`;
