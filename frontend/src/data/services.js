/**
 * Six service lines — VERIFIED as published on legacy services.html.
 * Descriptors and summaries are edited for clarity; the technical vocabulary is
 * preserved deliberately (docs pattern E2 — the terminology IS the credential).
 */
export const services = [
  {
    slug: 'open-access',
    index: '01',
    name: 'Open Access Power',
    descriptor: 'Cheaper power under intra-state open access',
    summary:
      'Sourcing and liaison for HT consumers buying renewable or conventional power under open access — covering DISCOM approvals, generation, transmission, and sale or purchase of power. Includes REC issuance in Madhya Pradesh.',
    keywords: ['LTOA', 'MTOA', 'STOA', 'REC issuance', 'DISCOM liaison'],
    verified: true,
  },
  {
    slug: 'forecasting-scheduling',
    index: '02',
    name: 'Forecasting & Scheduling',
    descriptor: 'Hour-precise wind and solar forecasts, up to 72 hours',
    summary:
      'Forecasting and scheduling for wind, solar and hybrid plants — reducing deviation settlement exposure through precise, frequently updated generation forecasts and feed-in extrapolation.',
    keywords: ['DSM', 'Deviation settlement', 'SLDC scheduling', '72-hour forecast'],
    verified: true,
  },
  {
    slug: 'liaisoning',
    index: '03',
    name: 'Regulatory Liaisoning',
    descriptor: 'CEIG, DISCOM, grid connectivity and SLDC synchronisation',
    summary:
      'Getting a built plant to a revenue-earning one: CEIG approvals, DISCOM approvals, grid connectivity permissions, SLDC synchronisation under grid code, and telemetry and RTU commissioning.',
    keywords: ['CEIG approval', 'Grid code', 'SLDC sync', 'Telemetry & RTU', 'Net metering'],
    verified: true,
  },
  {
    slug: 'electrical-infrastructure',
    index: '04',
    name: 'Electrical Infrastructure',
    descriptor: 'Turnkey works at 33, 132 and 220 kV',
    summary:
      'Construction, erection, testing and commissioning of DP yards, substations, EHV feeder bays and transmission lines — plus ABT, telemetry and AMR compliance work for SLDC on a turnkey basis.',
    keywords: ['EHV feeder bays', 'Substations', 'ABT / AMR', 'Capacitor banks'],
    verified: true,
  },
  {
    slug: 'rooftop-solar',
    index: '05',
    name: 'Rooftop Solar',
    descriptor: 'Turnkey rooftop systems on CAPEX or RESCO terms',
    summary:
      'Feasibility, engineering, procurement, installation and commissioning of grid-tie, off-grid and hybrid rooftop systems — on self-funded CAPEX or third-party RESCO/OPEX models, including BOOT and BOT.',
    keywords: ['CAPEX', 'RESCO / OPEX', 'BOOT / BOT', 'Net metering'],
    verified: true,
  },
  {
    slug: 'operations-maintenance',
    index: '06',
    name: 'Operations & Maintenance',
    descriptor: 'Preventive, corrective and predictive maintenance',
    summary:
      'O&M for solar and wind assets — SCADA monitoring on site and remote, module cleaning, IV curve testing, sensor calibration, vegetation management, failure analysis and vendor warranty coordination.',
    keywords: ['SCADA monitoring', 'IV curve testing', 'PR guarantees', 'Transmission line O&M'],
    verified: true,
  },
];
