import { projects } from './projects.generated.js';

/**
 * INDUSTRIES SERVED.
 *
 * Derived from the 52-row project register, not invented. Each entry names the
 * organisations that actually placed orders, and its project count is computed
 * from the register at runtime — so the page cannot claim a sector Vedanjay has
 * no recorded work in, and the numbers cannot drift from the record.
 *
 * The company document does not publish an industries list, so this is the only
 * evidence-backed way to answer "do you work with people like me?".
 */
const groups = [
  {
    id: 'utilities',
    name: 'Transmission utilities & DISCOMs',
    summary: 'EHV bay erection, substation works, capacitor banks and testing for state transmission and distribution companies.',
    match: /MPPTCL|MPPKVVCL/i,
    media: 'cap-infrastructure',
  },
  {
    id: 'wind',
    name: 'Wind OEMs & developers',
    summary: 'Metering yards, telemetry, AMR commissioning, SLDC liaisoning and transmission-line O&M for wind portfolios.',
    match: /Suzlon|Regen|Gamesa|Inox/i,
    media: 'tech-wind',
  },
  {
    id: 'solar',
    name: 'Solar EPCs & developers',
    summary: 'CEIG approval, line charging, net metering, telemetry and civil balance-of-plant for solar projects.',
    match: /Vikram|Tata Power|WAAREE|Refex|Ujaas/i,
    media: 'tech-solar',
  },
  {
    id: 'ipp',
    name: 'Independent power producers',
    summary: 'Operation and maintenance of transmission assets and generating plant, including contractual manpower.',
    /* Anchored: a bare /Renew/ also matches "Siemens Gamesa RENEWable Power",
       which put a wind OEM in the IPP bucket. */
    match: /ReNew Wind|ReNew Surya|Renew Wind|Renew Surya|PTC India/i,
    media: 'cap-forecasting',
  },
  {
    id: 'industrial',
    name: 'Industrial & manufacturing',
    summary: 'HT yard modification, captive power documentation, billing and net-metering approvals for industrial consumers.',
    match: /VE Commercial|IPCA|Kataria|SANY|Seamless|VIDEOCON|VISA Power/i,
    media: 'cap-metering',
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure & institutional',
    summary: 'Railway traction substations, metro, campus and commercial developments requiring statutory electrical approval.',
    match: /KEC|Metro|Radisson|GROWELS|AMU|CONSULTANCY|B\. S\. Ltd/i,
    media: 'cap-gridstudies',
  },
];

/**
 * Each project is assigned to the FIRST group it matches, so the counts
 * partition the register instead of overlapping. Overlapping matchers summed
 * to 74 across 52 rows, which read as a larger body of work than exists.
 */
const assigned = new Map();
for (const project of projects) {
  /* Matched on the ORDER-PLACING CLIENT only. Matching the work description too
     put every job that merely mentions MPPTCL into "utilities", which dragged
     wind and solar customers in with it — the sector is defined by who placed
     the order, not by which utility the work touched. */
  const hit = groups.find((g) => g.match.test(project.client));
  if (hit) assigned.set(project.id, hit.id);
}

/**
 * Reduces a register client string to the organisation name.
 *
 * The utility rows are written as the placing officer first — "SE( T&C), MPPTCL
 * Nagda Circle" — so a naive split on the comma yields "SE". The utility is
 * matched explicitly before any trimming.
 */
const CITY = /\s*[, ](Indore|Mumbai|Pune|Chennai|Bengaluru|Kolkata|Noida|New Delhi|Gurgaon|Ghaziabad|Hyderabad|Dewas|Ratlam|Jabalpur|Nagda|Bhopal|Tamil Nadu|Haryana|WB|M\.?P\.?)\b.*$/i;

const cleanClient = (raw) => {
  if (/MPPTCL/i.test(raw)) return 'MPPTCL';
  if (/MPPKVVCL/i.test(raw)) return 'MPPKVVCL';
  return raw
    .replace(/\s*[(].*?[)]\s*/g, ' ')
    .replace(/Ltd\.(?=[A-Z])/g, 'Ltd. ')
    .replace(CITY, '')
    .replace(/\s*[,].*$/, '')
    .replace(/\s*(Pvt\.?|Private)\s+(Ltd\.?|Limited)\s*$/i, ' Pvt. Ltd.')
    .replace(/\s+/g, ' ')
    .trim();
};

export const industries = groups.map((g) => {
  const rows = projects.filter((p) => assigned.get(p.id) === g.id);
  return {
    ...g,
    orders: rows.length,
    /* Named so a visitor can check the claim rather than trust a number. */
    clients: [...new Map(rows.map((r) => {
      const n = cleanClient(r.client);
      /* "Vikram Solar Limited" and "Vikram solar Pvt. Ltd." are one company. */
      const key = n.toLowerCase()
        .replace(/\b(pvt|ltd|limited|energies|energy)\b/g, '')
        .replace(/[^a-z0-9 ]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      return [key, n];
    })).values()].filter(Boolean).slice(0, 6),
  };
}).filter((g) => g.orders > 0);

/** Asserted by test: the groups must account for every row exactly once. */
export const industryAssignedTotal = assigned.size;
