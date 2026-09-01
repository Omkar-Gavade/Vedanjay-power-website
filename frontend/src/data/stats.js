import { company, yearsEstablished } from './company.js';

/**
 * Homepage "Vedanjay in numbers".
 *
 * The legacy site publishes contradictory figures — 100 MW vs 110 MW open access,
 * 700 MW commissioned vs +30 MW O&M, "50+ clients" against 41 logos. None can be
 * sourced. All are blocked on TO VERIFY #1-#4.
 *
 * Every figure below is instead DERIVED FROM DATA WE HOLD and can be recounted
 * from docs/06-content/project-register.md at any time. Four defensible numbers
 * beat eight contradictory ones.
 *
 * `asOf` is required on every stat — the component will not render without it.
 */
export const stats = [
  {
    id: 'works',
    value: 52,
    suffix: '',
    label: 'Works executed',
    detail: 'Named contracts for utilities, IPPs and industrial clients',
    asOf: 'Register as published',
    verified: true,
  },
  {
    id: 'clients',
    value: 41,
    suffix: '',
    label: 'Named clients',
    detail: 'Across utilities, RE generators, industry and commercial',
    asOf: 'Register as published',
    verified: true,
  },
  {
    id: 'voltage',
    value: 220,
    suffix: ' kV',
    label: 'Highest voltage class',
    detail: 'Executed at 220, 132, 33 and 33/11 kV, plus 132/25 kV traction',
    asOf: 'Register as published',
    verified: true,
  },
  {
    id: 'established',
    value: yearsEstablished(),
    suffix: '',
    label: `Years established`,
    detail: `Incorporated ${company.incorporated} · CIN ${company.cin}`,
    asOf: 'MCA registry',
    verified: true,
  },

  /* ---- Blocked on TO VERIFY #1-#4. Not rendered. ---------------------- */
  {
    id: 'commissioned-mw',
    value: 700, suffix: '+ MW',
    label: 'Commissioned',
    detail: 'Wind and solar grid-connect projects',
    asOf: null,
    verified: false,
    blockedBy: 'TO VERIFY #3 — conflicts with the +30 MW O&M figure',
  },
  {
    id: 'forecasting-mw',
    value: 2000, suffix: ' MW',
    label: 'Under forecasting',
    detail: 'Wind and solar forecasting portfolio',
    asOf: null,
    verified: false,
    blockedBy: 'TO VERIFY #2 — largest claim on the legacy site, no evidence held',
  },
  {
    id: 'open-access-mw',
    value: 110, suffix: ' MW',
    label: 'Open access power sold',
    detail: 'Across Madhya Pradesh and Maharashtra',
    asOf: null,
    verified: false,
    blockedBy: 'TO VERIFY #1 — legacy site states both 100 MW and 110 MW',
  },
];
