/**
 * Four market segments. The legacy homepage segments Industry / Commercial /
 * Utilities / RE and never builds pages behind it — the site's best unexploited
 * instinct (docs gap-analysis).
 *
 * Each opens on the READER'S PROBLEM, not the service name (pattern E1) —
 * the gap no competitor site fills.
 */
export const industries = [
  {
    slug: 'industrial',
    name: 'Industry',
    problem: 'You run an HT connection and your tariff keeps rising.',
    body: 'Open access sourcing, rooftop solar and electrical infrastructure for manufacturing plants buying power at high tension.',
    services: ['open-access', 'rooftop-solar', 'electrical-infrastructure'],
    verified: true,
  },
  {
    slug: 'commercial',
    name: 'Commercial',
    problem: 'High daytime load, and roof area doing nothing.',
    body: 'Rooftop feasibility, net metering approvals and O&M for malls, hotels, hospitals and campuses.',
    services: ['rooftop-solar', 'open-access', 'operations-maintenance'],
    verified: true,
  },
  {
    slug: 'utilities',
    name: 'Utilities & DISCOMs',
    problem: 'Bay, substation and line works, to specification and to schedule.',
    body: 'EHV feeder bays, capacitor banks, substation civil and erection work, and contracted O&M manpower for distribution networks.',
    services: ['electrical-infrastructure', 'operations-maintenance', 'liaisoning'],
    verified: true,
  },
  {
    slug: 'renewable-generators',
    name: 'RE Generators & IPPs',
    problem: 'Your plant is built. It is not earning yet.',
    body: 'Commissioning liaison through CEIG, DISCOM and SLDC, telemetry and AMR metering, forecasting and scheduling, and long-term O&M.',
    services: ['liaisoning', 'forecasting-scheduling', 'operations-maintenance'],
    verified: true,
  },
];
