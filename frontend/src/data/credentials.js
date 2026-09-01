import { company } from './company.js';

/**
 * Credentials. Regulator-granted status outranks self-description — which is
 * exactly why unverified credentials must not be published.
 *
 * The QCA registration and 'A' class licence are the company's two strongest
 * differentiators AND are both unverified (TO VERIFY #5, #6). They are wired up
 * and ready; flipping `verified` publishes them.
 */
export const credentials = [
  {
    id: 'incorporation',
    label: 'Incorporated 2011',
    detail: 'Private limited company, Madhya Pradesh',
    source: 'MCA registry',
    verified: true,
  },
  {
    id: 'register',
    label: '52 works executed',
    detail: 'Utilities, IPPs, OEMs and industry',
    source: 'Project register',
    verified: true,
  },
  {
    id: 'voltage',
    label: 'Up to 220 kV',
    detail: 'EHV bays, substations, lines',
    source: 'Project register',
    verified: true,
  },
  {
    id: 'markets',
    label: 'Madhya Pradesh & Maharashtra',
    detail: 'Core markets, with reach across India',
    source: 'Company statement',
    verified: true,
  },

  /* ---- Blocked. The two strongest claims the company can make. ---------- */
  {
    id: 'qca',
    label: 'QCA registered in three states',
    detail: 'Maharashtra · Telangana · Madhya Pradesh',
    source: null,
    verified: false,
    blockedBy: 'TO VERIFY #5 — registration certificates and numbers not held',
  },
  {
    id: 'electrical-licence',
    label: "'A' class Electrical Contractor licence",
    detail: 'Required to tender for utility electrical works',
    source: null,
    verified: false,
    blockedBy: 'TO VERIFY #6 — licence number and issuing authority not stated',
  },
  {
    id: 'iso',
    label: 'ISO certifications',
    detail: 'ISO 9001 / 14001 / 45001',
    source: null,
    verified: false,
    blockedBy: 'TO VERIFY #11 — no certifications published on the legacy site',
  },
];

/**
 * Cooperation partner. Blocked on TO VERIFY #7 — the legacy partners page is
 * undated and the site copyright reads 2017, so currency cannot be assumed.
 */
export const partner = {
  name: 'enercast GmbH',
  location: 'Kassel, Germany',
  scope: 'Wind and solar power forecasting',
  detail:
    'Renewable energy forecasting technology, applied to Indian wind and solar plants through the Forecasting & Scheduling service line.',
  verified: false,
  blockedBy: 'TO VERIFY #7 — cooperation currency unconfirmed',
};
