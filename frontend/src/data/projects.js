import { projects as rows, PROJECT_TOTAL, projectCounts } from './projects.generated.js';

export { PROJECT_TOTAL, projectCounts };

/**
 * The voltage class a register row names for its own work.
 *
 * Derived, never asserted. Row 2 reads "132KV EHV Feeder Bay Erection Work at
 * Existing 220KV S/s" — two classes, and they mean different things: the bay
 * built is 132 kV, the substation it sits in is 220 kV. The FIRST match is the
 * work's own class in every row of this register, so taking the highest number
 * would overstate 10 of the 25 rows that name a voltage at all.
 *
 * 25 of 52 rows name one. The rest get no badge rather than a guessed one.
 * A test asserts every extracted value is a member of `voltageClasses`.
 */
const VOLTAGE = /(\d{2,3}(?:\/\d{1,3})?)\s*KV\b/i;

const voltageOf = (row) => {
  const m = VOLTAGE.exec(`${row.particulars} ${row.scope ?? ''}`);
  return m ? `${m[1]} kV` : null;
};

/**
 * Register rows, enriched for display.
 *
 * `search` is precomputed rather than assembled per keystroke: the register is
 * filtered on every character typed, and rebuilding 52 concatenations each time
 * is work that never changes.
 */
export const projects = rows.map((row) => ({
  ...row,
  voltage: voltageOf(row),
  search: `${row.particulars} ${row.scope ?? ''} ${row.client}`.toLowerCase(),
}));

/**
 * Category metadata for the 52-row register.
 *
 * The source publishes six category strings, but two of them are the same
 * category spelled differently ("Operation and Maintanace" / "…Maintanance").
 * The generator merges them, which is why O&M shows 8 rather than 4.
 */
export const projectCategories = [
  { id: 'all', label: 'All work', blurb: null },
  {
    id: 'electrical', label: 'Electrical infrastructure',
    blurb: 'EHV feeder bays, substation works, transmission lines, capacitor banks and metering yards.',
  },
  {
    id: 'regulatory', label: 'Liaisoning & regulatory',
    blurb: 'CEIG approvals, SLDC coordination, net metering, telemetry commissioning and open-access documentation.',
  },
  {
    id: 'electrical-regulatory', label: 'Electrical & liaisoning',
    blurb: 'Metering and telemetry installations taken through to utility acceptance.',
  },
  { id: 'om', label: 'Operation & maintenance', blurb: 'Transmission line and plant O&M, AMC and manpower deployment.' },
  { id: 'civil', label: 'Civil infrastructure', blurb: 'Foundations, water tanks, entrance structures and site civil works.' },
];

/** Voltage classes evidenced across the register. */
export const voltageClasses = ['220 kV', '132 kV', '132/25 kV', '33 kV', '33/11 kV', 'LT'];

/** Plant capacities named in the register. Nothing is aggregated into a total —
 *  the source does not support one, and summing part of a register would be a
 *  fabricated statistic. */
export const namedCapacities = [
  { capacity: '29.4 MW', tech: 'Wind', client: 'Suzlon Gujarat Wind Park' },
  { capacity: '10 MW', tech: 'Solar', client: 'Refex Energy' },
  { capacity: '800 kW', tech: 'Wind', client: 'Kataria Wires' },
  { capacity: '405 kWp', tech: 'Solar', client: 'ReNew Surya Prakash' },
  { capacity: '182 kWp', tech: 'Solar', client: 'Tata Power Solar / Gabriel Dewas' },
  { capacity: '52 km + 18 km', tech: '33 kV line O&M', client: 'ReNew Wind Energy' },
  { capacity: '3 km', tech: '33 kV line', client: 'Ujaas Energy (AMU Aligarh)' },
];

/** Repeat clients, grouped by parent organisation across named entities and
 *  circles. Counts are derived from the register at build time, not typed. */
export const repeatClients = [
  { name: 'MPPTCL', match: /MPPTCL|MPPKVVCL/i },
  { name: 'Suzlon', match: /Suzlon/i },
  /* Anchored: a bare /Renew/ also matches "Siemens Gamesa RENEWable Power",
     which inflated ReNew from the register's 5 orders to 7. */
  { name: 'ReNew', match: /ReNew (Wind|Surya)|Renew (Wind|Surya)/i },
  { name: 'Regen Powertech', match: /Regen/i },
  { name: 'Vikram Solar', match: /Vikram/i },
  { name: 'Tata Power Solar', match: /Tata Power/i },
  { name: 'Waaree Energies', match: /WAAREE/i },
  { name: 'Gamesa / Siemens Gamesa', match: /Gamesa/i },
].map((c) => ({ ...c, orders: projects.filter((p) => c.match.test(p.client)).length }))
  .sort((a, b) => b.orders - a.orders);

export const countFor = (id) => (id === 'all' ? PROJECT_TOTAL : (projectCounts[id] ?? 0));

/**
 * Filters the register by category and free text together.
 *
 * Kept next to the data rather than in the page so the matching rule is tested
 * once, in one place, against the real 52 rows.
 */
export function filterProjects(category, query) {
  const q = query.trim().toLowerCase();
  return projects.filter((p) => (
    (category === 'all' || p.category === category)
    && (q === '' || p.search.includes(q))
  ));
}
