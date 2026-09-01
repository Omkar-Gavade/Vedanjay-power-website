/**
 * Client roster — VERIFIED as published (41 distinct logos counted on both
 * legacy index.html and clients.html).
 *
 * Rendered as NAMES, not logo images: logo usage permission is unverified
 * (TO VERIFY #8), and re-publishing third-party marks without written consent
 * is a legal exposure. Names as published on the client's own site are
 * statements of fact about who they have worked for.
 */
export const clientSegments = [
  {
    id: 'renewable',
    label: 'Renewable generators & OEMs',
    clients: [
      'Siemens Gamesa Renewable Power', 'Suzlon', 'ReNew', 'Vikram Solar',
      'Tata Power Solar', 'Waaree Energies', 'Gamesa Wind Turbines',
      'Inox Wind Infrastructure Services', 'Regen Powertech', 'Ujaas Energy',
      'Refex Energy', 'Wind World', 'VISA Power Tech',
    ],
  },
  {
    id: 'industrial',
    label: 'Industrial',
    clients: [
      'Tata Steel', 'Tata International', 'Mahindra Two Wheelers', 'Kirloskar',
      'Jain Irrigation', 'JK Files', 'Birla Cable', 'IPCA Laboratories',
      'SANY Heavy Industry India', 'Gajra Gears', 'Garware Bestretch',
      'PTC India', 'Kataria Wires', 'Agarwal Group', 'Oasis Group', 'Saro Group',
    ],
  },
  {
    id: 'utilities',
    label: 'Utilities',
    clients: ['MPPTCL', 'MPPMCL', 'KEC International'],
  },
  {
    id: 'commercial',
    label: 'Commercial',
    clients: ['Radisson Blu Indore', 'VE Commercial Vehicles', 'DB City'],
  },
];

/**
 * Repeat business — the differentiator no competitor publishes.
 * Counts verified by parsing all 52 rows of the legacy project register and
 * grouping by parent organisation. See docs/06-content/project-register.md.
 */
export const repeatBusiness = [
  { client: 'MPPTCL', orders: 7, note: 'Madhya Pradesh Power Transmission' },
  { client: 'Suzlon', orders: 7, note: 'Wind Park, Energy O&M, Global Services' },
  { client: 'ReNew', orders: 5, note: 'Wind Energy and Surya Prakash' },
  { client: 'Regen Powertech', orders: 4, note: 'Line and substation renovation' },
  { client: 'Vikram Solar', orders: 4, note: 'Civil infrastructure' },
  { client: 'Tata Power Solar', orders: 4, note: 'CEIG and net metering' },
];
