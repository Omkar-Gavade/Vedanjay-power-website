/**
 * Featured engagement for the homepage.
 * Drawn verbatim in substance from the legacy project register (rows 12-16).
 * Contract dates and values are not published anywhere and remain TO VERIFY #14.
 */
export const featuredEngagement = {
  slug: 'suzlon-29-4mw-telemetry-sldc-sync',
  client: 'Suzlon Gujarat Wind Park Limited',
  title: 'Telemetry, AMR metering and SLDC synchronisation for a 29.4 MW wind project',
  facts: [
    { label: 'Capacity', value: '29.4 MW' },
    { label: 'Technology', value: 'Wind' },
    { label: 'Voltage', value: '33 kV' },
    { label: 'Authority', value: 'SLDC Jabalpur / MPPKVVCL' },
  ],
  brief:
    'A 29.4 MW wind project in Madhya Pradesh was mechanically complete but could not export to the grid until its metering and telemetry were installed, tested and accepted by the state load despatch centre.',
  work: [
    'Installed and commissioned the telemetering system to MPPTCL/MPPKVVCL specification.',
    'Erected, tested and commissioned the 33 kV TVM metering system in the DP yard.',
    'Completed AMR metering installation and testing with SLDC Jabalpur and MPPKVVCL.',
    'Carried the liaison through to commissioning, AMR acceptance, grid and synchronisation code from SLDC MPPTCL Jabalpur.',
  ],
  outcome:
    'Five separate mandates across the engagement — metering, telemetry, AMR and grid synchronisation — taking the project from mechanical completion to accepted, metered grid export.',
  verified: true,
};

/**
 * Distribution across the 52-row register, by category as published.
 * Counts are derived by parsing docs/06-content/project-register.md and MUST
 * sum to 52 — the section renders the sum as the headline figure, so a wrong
 * count here publishes a wrong number.
 */
export const registerBreakdown = [
  { category: 'Electrical infrastructure', count: 17 },
  { category: 'Regulatory liaisoning', count: 15 },
  { category: 'Operations & maintenance', count: 8 },
  { category: 'Infrastructure & liaisoning', count: 7 },
  { category: 'Civil infrastructure', count: 5 },
];

export const voltageClasses = ['220 kV', '132 kV', '33 kV', '33/11 kV', '132/25 kV'];

/** The register as captured in docs/06-content/project-register.md. */
export const REGISTER_TOTAL = 52;

/* The homepage prints the sum of registerBreakdown as its headline figure, so a
   miscount here publishes a wrong number. Fail loudly in development. */
if (import.meta.env.DEV) {
  const sum = registerBreakdown.reduce((n, r) => n + r.count, 0);
  if (sum !== REGISTER_TOTAL) {
    console.error(
      `[data/projects] registerBreakdown sums to ${sum} but the register holds ` +
      `${REGISTER_TOTAL} rows. Fix the counts before shipping.`,
    );
  }
}
