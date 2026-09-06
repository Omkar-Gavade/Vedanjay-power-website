/**
 * Core capabilities. SOURCE: IRD §9 (Business Verticals) and §10 (Services).
 * Wording follows the document; nothing is added to it.
 *
 * `services` (5 Sep 2026) is the named service breakdown from the company's
 * "Forecasting for Renewable Energies" deck of 19 Aug 2026. It is nested INSIDE
 * a capability rather than added alongside the six, because the six are stated
 * as exhaustive — "exactly six — there are no others" — and these three are how
 * capability 01 is delivered, not a seventh line of business.
 */
export const capabilities = [
  {
    id: 'qca',
    index: '01',
    name: 'Forecasting & Scheduling / QCA',
    summary:
      'Qualified Coordinating Agency services for solar, wind and hybrid projects — generation forecasting, day-ahead and intraday scheduling, schedule revisions, SLDC/RLDC coordination, generation monitoring, deviation analysis and DSM optimisation.',
    points: [
      'Day-ahead forecasting and intraday scheduling',
      'Schedule revisions and SLDC/RLDC coordination',
      'DSM and deviation monitoring',
      'Regulatory compliance support',
    ],
    /* Verbatim from the deck's "Our Services" slide. */
    services: [
      {
        name: 'Precise Forecasting & Scheduling',
        body: 'AI-driven forecasting for solar, wind and hybrid energy to minimise deviation penalties.',
      },
      {
        name: 'Regulatory Compliance',
        body: 'Ensuring MERC and SLDC compliance by managing all reporting and submissions.',
      },
      {
        name: 'Deviation Settlement Management',
        body: 'Handling DSM calculations and optimising energy dispatch.',
      },
    ],
    media: 'cap-forecasting',
  },
  {
    id: 'open-access',
    index: '02',
    name: 'Open-Access Power Sale & Purchase',
    summary:
      'Open-access power sale and purchase for renewable generators and eligible consumers, covering generator–consumer coordination, documentation, utility and DISCOM liaisoning, and transaction coordination.',
    points: [
      'Renewable power sale and purchase support',
      'Generator–consumer coordination',
      'DISCOM and utility liaisoning',
      'Transaction and scheduling coordination',
    ],
    media: 'cap-openaccess',
  },
  {
    id: 'metering',
    index: '03',
    name: 'ABT Metering & Telemetry',
    summary:
      'Supply, installation, testing, commissioning and support for ABT metering and telemetry systems used in renewable-energy and open-access power projects.',
    points: [
      'ABT meter supply and installation',
      'Testing and commissioning',
      'Telemetry and data communication',
      'Energy accounting support',
    ],
    media: 'cap-metering',
  },
  {
    id: 'infrastructure',
    index: '04',
    name: 'Electrical Infrastructure & Transmission',
    summary:
      'Technical execution and consultancy for electrical infrastructure and transmission projects — high-voltage installations, EHV feeder bays, substation works, transmission lines, metering yards, testing and commissioning.',
    points: [
      'High-voltage electrical works',
      'EHV feeder bay and substation works',
      'Transmission line installation and stringing',
      'Testing, commissioning and utility liaisoning',
    ],
    media: 'cap-infrastructure',
  },
  {
    id: 'grid-studies',
    index: '05',
    name: 'Grid Studies & Electrical Consultancy',
    summary:
      'Technical consultancy and grid studies covering grid connectivity, electrical system assessment, technical reports, transmission planning support and grid integration.',
    points: [
      'Grid connectivity studies',
      'Electrical system assessment',
      'Transmission planning support',
      'Technical reports and coordination',
    ],
    media: 'cap-gridstudies',
  },
  {
    id: 'project-support',
    index: '06',
    name: 'Renewable Energy Project Support',
    summary:
      'Integrated support across solar, wind and hybrid projects, combining forecasting and scheduling, open access, metering and telemetry, electrical infrastructure and grid studies within a single engagement.',
    points: [
      'Solar, wind and hybrid projects',
      'End-to-end technical and commercial support',
      'Regulatory and operational coordination',
      'Project-specific consultancy',
    ],
    media: 'cap-projects',
  },
];

/** IRD §9 — Core Expertise. Used as a compact technical index, not as cards. */
export const coreExpertise = [
  'Forecasting & Scheduling',
  'DSM Optimization',
  'SLDC/RLDC Coordination',
  'Renewable-Energy Forecasting',
  'Open-Access Power',
  'Electrical Infrastructure',
  'ABT Metering & Telemetry',
  'Grid Studies',
];

/** IRD §9 — Core renewable-energy areas. */
export const technologies = [
  { name: 'Solar', body: 'QCA and forecasting services for solar power plants.' },
  { name: 'Wind', body: 'QCA and forecasting services for wind power plants.' },
  { name: 'Hybrid', body: 'QCA services for hybrid renewable-energy projects.' },
];

/** IRD §2 — Company USP / Key Strengths. */
export const strengths = [
  { name: 'End-to-End Power Solutions', body: 'Integrated services covering QCA/F&S, open access, power sale and purchase, ABT metering, telemetry, transmission, grid studies and electrical infrastructure.' },
  { name: 'Renewable Energy Expertise', body: 'Experience across solar, wind and hybrid renewable-energy projects.' },
  { name: 'Multi-State QCA Operations', body: 'QCA/SLDC operations across Maharashtra, Madhya Pradesh and Telangana, with WRLDC registration.' },
  { name: 'DSM Optimization', body: 'Forecasting, scheduling, monitoring and deviation analysis aimed at reducing DSM exposure.' },
  { name: 'Regulatory & Grid Coordination', body: 'Experience in SLDC/RLDC coordination and applicable power-sector regulatory requirements.' },
  { name: 'Open-Access Expertise', body: 'Support for renewable power procurement, sale, transaction coordination, documentation and utility liaisoning.' },
  { name: 'Metering & Telemetry Capability', body: 'Supply, installation, testing, commissioning and operational support for ABT metering and telemetry systems.' },
  { name: 'Electrical Infrastructure Expertise', body: 'High-voltage electrical infrastructure, transmission-related works, grid connectivity, testing and commissioning.' },
  { name: 'Technical Consultancy', body: 'Grid studies, electrical assessments, technical reports and infrastructure consultancy.' },
  { name: '24×7 Operational Support', body: 'Continuous monitoring and operational support for critical forecasting and scheduling requirements.' },
  { name: 'Client-Centric Approach', body: 'Customised technical and commercial solutions based on individual project requirements.' },
];

/** IRD §5 — Our Story. */
export const journey = [
  'Established in 2011, Vedanjay Power Pvt. Ltd. began with the objective of supporting the growth and development of India’s renewable-energy sector through reliable, technically sound and practical power-sector solutions.',
  'Over the years, Vedanjay Power has evolved into a diversified power-sector solutions company. Our capabilities have expanded across Forecasting & Scheduling, QCA services, DSM management, open-access power, ABT metering, telemetry, transmission, electrical infrastructure, grid studies and renewable-energy consultancy.',
  'Today, Vedanjay Power focuses on delivering integrated solutions that improve operational efficiency, support regulatory compliance, optimise power transactions and enable reliable integration of renewable energy into the grid.',
];
