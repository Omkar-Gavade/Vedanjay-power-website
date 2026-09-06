/**
 * ABOUT — vision, mission, values and milestones.
 *
 * SOURCE: the Website Information Requirement Document (IRD), §3 "Vision,
 * Mission & Values", §5 "Company Journey" and §6 "Major Milestones". Wording
 * follows the document; nothing is added to it and nothing is embellished.
 *
 * WHY THIS FILE EXISTS
 * These sections were supplied by the company but had no home on the site — the
 * About page carried only the overview, coverage and strengths. They are the
 * part of an About page a reader actually comes for, so they are now first-class
 * data rather than prose typed into a component.
 *
 * ON THE MILESTONES
 * The IRD dates only the first one. The rest are ordered as the document orders
 * them — a sequence of capability, not a timeline — and the page presents them
 * that way rather than inventing years. Any milestone that acquires a confirmed
 * date can simply gain a `year`.
 */

/** IRD §3. One statement, verbatim. */
export const vision =
  'To become a trusted and leading power-sector solutions partner in India by '
  + 'enabling efficient, reliable, and sustainable energy management through '
  + 'technology, expertise, and innovative power solutions.';

/** IRD §3. Six commitments, verbatim. */
export const mission = [
  'To deliver reliable and accurate Forecasting & Scheduling (F&S/QCA) solutions for renewable-energy projects.',
  'To help clients optimise power generation, reduce DSM exposure, and improve commercial performance.',
  'To provide comprehensive open-access power, metering, telemetry, transmission, and electrical infrastructure solutions.',
  'To deliver technically sound grid studies, consultancy, and project support for power-sector developments.',
  'To simplify complex regulatory, technical, and operational requirements through efficient end-to-end services.',
  'To build long-term partnerships through transparency, responsiveness, and consistent service quality.',
];

/** IRD §3. Seven values, each with the document's own gloss. */
export const values = [
  { name: 'Integrity', body: 'Transparency, honesty, and professional ethics in every engagement.' },
  { name: 'Reliability', body: 'Accurate forecasting, dependable execution, and timely service delivery.' },
  { name: 'Technical Excellence', body: 'Continuous improvement in technical expertise and service quality.' },
  { name: 'Customer Focus', body: 'Understanding client requirements and delivering practical, value-driven solutions.' },
  { name: 'Innovation', body: 'Using technology, data, and innovative approaches to improve power management.' },
  { name: 'Compliance & Responsibility', body: 'Maintaining strong standards of regulatory compliance, safety, quality, and responsible business practices.' },
  { name: 'Sustainability', body: 'Supporting renewable energy and contributing to a cleaner, more efficient power ecosystem.' },
];

/**
 * IRD §6. Only the first carries a year in the source, so only the first
 * carries one here.
 */
export const milestones = [
  { year: '2011', name: 'Company established', body: 'Vedanjay Power Pvt. Ltd. established to support India’s growing renewable-energy and power sector.' },
  { year: null, name: 'Renewable-energy services', body: 'Developed expertise in supporting solar and wind power projects.' },
  { year: null, name: 'Forecasting & Scheduling', body: 'Expanded into renewable-energy forecasting, scheduling, QCA services and DSM management.' },
  { year: null, name: 'Multi-state operations', body: 'Established QCA/SLDC operations across Maharashtra, Madhya Pradesh and Telangana.' },
  { year: null, name: 'WRLDC registration', body: 'Expanded regional grid coordination capabilities through WRLDC registration.' },
  { year: null, name: 'Open-access services', body: 'Expanded into renewable power sale, purchase, open-access coordination and related consultancy.' },
  { year: null, name: 'Metering & telemetry', body: 'Added ABT metering and telemetry supply, installation, testing, commissioning and support.' },
  { year: null, name: 'Electrical infrastructure', body: 'Expanded into transmission, grid connectivity, high-voltage electrical infrastructure and commissioning.' },
  { year: null, name: 'Grid studies & consultancy', body: 'Developed technical consultancy and grid-study capabilities for power and renewable-energy projects.' },
  { year: null, name: '5,000+ MW portfolio', body: 'Built a renewable-energy F&S/QCA portfolio exceeding 5,000 MW.' },
];

/**
 * IRD §7, the QCA and renewable-energy achievements.
 *
 * The ENERCAST entry is why the FORBIDDEN list in the knowledge-pack generator
 * lost its `enercast` token: the name previously appeared only as unverified
 * test data and was blocked for that reason. The IRD states the partnership
 * outright, so it is now published like any other verified fact.
 */
export const achievements = [
  { name: 'Multi-SLDC registration', body: 'Registered QCA operations across Maharashtra, Madhya Pradesh and Telangana.' },
  { name: 'WRLDC registration', body: 'Registered QCA operations with the Western Regional Load Despatch Centre.' },
  { name: '5,000+ MW portfolio', body: 'Managing a renewable-energy portfolio of more than 5,000 MW through QCA/F&S operations.' },
  { name: 'Solar, wind & hybrid expertise', body: 'Forecasting and scheduling capabilities across multiple renewable-energy technologies.' },
  { name: 'DSM optimisation', body: 'Operational focus on deviation monitoring, schedule optimisation and DSM management.' },
  { name: 'Advanced forecasting', body: 'AI/ML-enabled forecasting capabilities through partnership with ENERCAST GmbH, Germany.' },
  { name: '24×7 operations', body: 'Continuous monitoring and operational support for renewable-energy forecasting and scheduling.' },
  { name: 'Regulatory coordination', body: 'Experience coordinating with SLDCs and RLDCs and supporting renewable generators with regulatory and scheduling requirements.' },
];
